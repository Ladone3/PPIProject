import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Person, Activity, Rect, Vector } from '../../models/models';
import { AppDataService } from '../../services/appDataService';
import { ActivitiesPage } from '../activities/activities';
import { PlacesPage } from '../places/places';
import { MakingCallPage } from '../makingCall/makingCall';
import {
  Positions,
  Circle,
  moveCircles,
  getBoundingRectangle,
  peopleToCircle,
  getObstacleCircle,
  FRAME_RATE,
  START_FROM_CYCLE,
  CIRCLE_MARGINE,
  MAX_SPEED,
  onMousedown,
  hitTest,
} from '../../utils/utils';

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

  private obstacleCircle: Circle;
  private animationBounds: Rect;
  private animationCycle: any;

  constructor(
    public navCtrl: NavController,
    public appDataService: AppDataService,
    public navParams: NavParams,
  ) { }

  public ionViewDidEnter() {
    Promise.all([
      this.getActivity(),
      this.appDataService.getPeople(),
    ]).then(([activity, people]) => {
      this.people = peopleToCircle(people);
      this.activity = activity;
      this.setInitialState();
    }).catch(this.showError);
    this.startAnimation();
  }

  public ionViewWillLeave() {
    this.stopAnimation();
  }

  private getActivity(): Activity {
    const activityId = this.navParams.get('activityId');
    return this.appDataService.getActivityById(activityId);
  }

  public changeActivity() {
    this.navCtrl.push(ActivitiesPage, {});
  }

  public onSelectPerson(person: Person) {
    const placeId = this.navParams.get('placeId');
    if (!this.activity) {
      this.navCtrl.push(ActivitiesPage, {
        personId: person.id,
        placeId: placeId,
      });
    } else if (!placeId) {
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

  public onCircleMouseDown(event: MouseEvent, circle: Circle) {
    circle.isDragged = true;

    const selectTest = () => {
      const curCircle = {
        x: this.positions[circle.id].x,
        y: this.positions[circle.id].y,
        radius: circle.radius,
      };
      const dragPlace = {
        x: this.obstacleCircle.ref.x + this.obstacleCircle.ref.width / 2,
        y: this.obstacleCircle.ref.y + this.obstacleCircle.ref.height / 2,
        radius: this.obstacleCircle.radius,
      }

      return hitTest(curCircle, dragPlace);
    }

    onMousedown(event, (diff: Vector) => {
      const newPos = {
        x: this.positions[circle.id].x + diff.x,
        y: this.positions[circle.id].y + diff.y,
      }
      this.positions[circle.id] = newPos;
      circle.direction = {
        x: Math.max(-MAX_SPEED, Math.min(MAX_SPEED, diff.x)),
        y: Math.max(-MAX_SPEED, Math.min(MAX_SPEED, diff.y)),
      };

      if (selectTest()) {
        this.dragZoneIsActive = true;
      } else {
        this.dragZoneIsActive = false;
      }
    }, () => {
      circle.isDragged = false;
      if (selectTest()) {
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
        curPositions: this.positions,
        animationBounds: this.animationBounds,
        obstacleCircle: this.obstacleCircle,
      });
    });
  }

  private setInitialState() {
    const positions = {};
    const animationBounds = getBoundingRectangle(this.activeZone);
    const obstacleCircle = getObstacleCircle(this.obstacle);

    positions[obstacleCircle.id] = {
      x: obstacleCircle.ref.x + obstacleCircle.ref.width / 2,
      y: obstacleCircle.ref.y + obstacleCircle.ref.height / 2,
    }
    for (const circle of this.people) {
      positions[circle.id] = {
        x: Math.random() * animationBounds.width,
        y: Math.random() * animationBounds.height,
      }
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
