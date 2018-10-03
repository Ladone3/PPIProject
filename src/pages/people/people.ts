import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Person, Activity, Rect, Vector } from '../../models/models';
import { AppDataService, EMPTY_ACTIVITY } from '../../services/appDataService';
import { ActivitiesPage } from '../activities/activities';
import { PlacesPage } from '../places/places';
import { MakingCallPage } from '../makingCall/makingCall';
import {
  Positions,
  Circle,
  moveCircles,
  getBoundingRectangle,
  peopleToCircle,
  getCircleFromRef,
  FRAME_RATE,
  START_FROM_CYCLE,
  CIRCLE_MARGINE,
  MAX_SPEED,
  onDragStart,
  hitTest,
} from '../../utils/utils';
import { AuthorizationPage } from '../authorization/authorization';

@Component({
  selector: 'page-people',
  templateUrl: 'people.html'
})
export class PeoplePage {
  @ViewChild('activeZone') activeZone: ElementRef;
  @ViewChild('obstacle') obstacle: ElementRef;
  public dragZoneIsActive: boolean = false;
  public positions: Positions;
  public people: Circle<Person>[];
  public activity: Activity;
  public selectedPerson: Person;

  private obstacleCircle: Circle;
  private animationBounds: Rect;
  private animationCycle: any;

  constructor(
    public navCtrl: NavController,
    public appDataService: AppDataService,
    public navParams: NavParams,
  ) { }

  public ionViewDidEnter() {
    const authorization = this.appDataService.getAuthorization().then(authorization => {
      if (!authorization) {
        this.navCtrl.push(AuthorizationPage);
      }
    });
    Promise.all([
      this.getActivity(),
      this.appDataService.getPeople(),
    ]).then(([activity, people]) => {
      const circles = peopleToCircle(people);
      this.setInitialState(circles);
      this.people = circles;
      this.activity = activity;
      this.startAnimation();
    }).catch(this.showError);
  }

  public ionViewWillLeave() {
    this.stopAnimation();
  }

  private async getActivity(): Promise<Activity> {
    const activityId = this.navParams.get('activityId');
    if (activityId === EMPTY_ACTIVITY.id) {
      return EMPTY_ACTIVITY;
    }
    if (activityId) {
      return this.appDataService.getActivityById(activityId);
    } else {
      return undefined;
    }
  }

  public changeActivity() {
    this.navCtrl.push(ActivitiesPage, {});
  }

  public onPersonClick(event: (MouseEvent | TouchEvent), person: Person | undefined) {
    this.selectedPerson = person;
    event.stopPropagation();
  }

  public onSelectPerson(person: Person) {
    const placeId = this.navParams.get('placeId');
    if (!this.activity) {
      this.navCtrl.push(ActivitiesPage, {
        personId: person.id,
        placeId: placeId,
      });
    } else if (!placeId && this.activity.id !== EMPTY_ACTIVITY.id) {
      this.navCtrl.push(PlacesPage, {
        personId: person.id,
        activityId: this.activity.id,
      });
    } else {
      this.navCtrl.push(MakingCallPage, {
        personId: person.id,
        activityId: this.activity.id,
        placeId: placeId,
      });
    }
  }

  public onCircleMouseDown(event: (MouseEvent | TouchEvent), circle: Circle) {
    circle.isDragged = true;

    onDragStart(event, (diff: Vector) => {
      circle.position = {
        x: this.positions[circle.id].x + diff.x,
        y: this.positions[circle.id].y + diff.y,
      }
      this.positions[circle.id] = circle.position;
      circle.direction = {
        x: Math.max(-MAX_SPEED, Math.min(MAX_SPEED, diff.x)),
        y: Math.max(-MAX_SPEED, Math.min(MAX_SPEED, diff.y)),
      };

      if (hitTest(circle, this.obstacleCircle)) {
        this.dragZoneIsActive = true;
      } else {
        this.dragZoneIsActive = false;
      }
    }, () => {
      circle.isDragged = false;
      if (hitTest(circle, this.obstacleCircle)) {
        this.onSelectPerson(circle.ref);
        this.dragZoneIsActive = false;
      }
    });
  }


  // Animation
  // ===========================================

  public startAnimation() {
    this.animationCycle = setInterval(() => {
      this.animationStep();
    }, FRAME_RATE);
  }

  public stopAnimation() {
    clearInterval(this.animationCycle);
  }

  private animationStep() {
    requestAnimationFrame(() => {
      // update circle sizes
      for (const circle of this.people) {
        const nativeCircle = this.activeZone.nativeElement.querySelector('#' + circle.id);
        circle.radius = nativeCircle.clientWidth / 2 + CIRCLE_MARGINE;
      }

      this.positions = moveCircles({
        circles: this.people,
        animationBounds: this.animationBounds,
        obstacleCircle: this.obstacleCircle,
        slowMove: Boolean(this.selectedPerson),
      });

      const newPositions = {};
      for (const circle of this.people) {
        newPositions[circle.id] = circle.position;
      }
      this.positions = newPositions;
    });
  }

  private setInitialState(circles: Circle[]) {
    const positions = {};
    const animationBounds = getBoundingRectangle(this.activeZone);
    const obstacleCircle = getCircleFromRef(this.obstacle);

    obstacleCircle.position = {
      x: obstacleCircle.ref.x + obstacleCircle.ref.width / 2,
      y: obstacleCircle.ref.y + obstacleCircle.ref.height / 2,
    }
    positions[obstacleCircle.id] = obstacleCircle.position;
    for (const circle of circles) {
      circle.position = {
        x: Math.random() * animationBounds.width,
        y: Math.random() * animationBounds.height,
      };
      positions[circle.id] = circle.position;
    }

    this.positions = positions;
    this.obstacleCircle = obstacleCircle;
    this.animationBounds = animationBounds;

    for (let i = 0; i < START_FROM_CYCLE; i++) this.animationStep();
  }

  // ===========================================

  private showError(error) {
    console.log(error)
  }
}
