import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Person, Activity, Rect, Vector } from '../../models/models';
import { AppDataService, EMPTY_ACTIVITY } from '../../services/appDataService';
import { PeoplePage } from '../people/people';
import { PlacesPage } from '../places/places';
import { MakingCallPage } from '../makingCall/makingCall';
import {
  Positions,
  Circle,
  moveCircles,
  getBoundingRectangle,
  getCircleFromRef,
  activityToCircle,
  FRAME_RATE,
  START_FROM_CYCLE,
  CIRCLE_MARGINE,
  MAX_SPEED,
  onDragStart,
  hitTest,
} from '../../utils/utils';
import { AuthorizationPage } from '../authorization/authorization';

@Component({
  selector: 'page-activities',
  templateUrl: 'activities.html'
})
export class ActivitiesPage {
  @ViewChild('activeZone') activeZone: ElementRef;
  @ViewChild('obstacle') obstacle: ElementRef;
  public dragZoneIsActive: boolean = false;
  public positions: Positions;
  public activities: Circle<Activity>[];
  public person: Person;
  public selectedActivity: Activity;

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
      this.getPerson(),
      this.appDataService.getActivities(),
    ]).then(([person, activities]) => {
      const circles = activityToCircle(activities);
      this.setInitialState(circles);
      this.activities = circles;
      this.person = person;
      this.startAnimation();
    }).catch(this.showError);
  }

  public ionViewWillLeave() {
    this.stopAnimation();
  }

  private getPerson(): Promise<Person> {
    const personId = this.navParams.get('personId');
    if (personId) {
      return this.appDataService.getPersonById(personId);
    } else {
      return undefined;
    }
  }

  public changePerson() {
    this.navCtrl.push(PeoplePage, {});
  }

  public onActivityClick(event: (MouseEvent | TouchEvent), activity: Activity | undefined) {
    this.selectedActivity = activity;
    event.stopPropagation();
  }

  public onSkip() {
    this.onSelectActivity(EMPTY_ACTIVITY);
  }

  public onSelectActivity(activity: Activity) {
    const placeId = this.navParams.get('placeId');
    if (!this.person) {
      this.navCtrl.push(PeoplePage, {
        activityId: activity.id,
        placeId: placeId,
      });
    } else if (!placeId && activity.id !== EMPTY_ACTIVITY.id) {
      this.navCtrl.push(PlacesPage, {
        personId: this.person.id,
        activityId: activity.id,
      });
    } else {
      this.navCtrl.push(MakingCallPage, {
        personId: this.person.id,
        activityId: activity.id,
        placeId: placeId,
      });
    }
  }

  public onCircleMouseDown(event: MouseEvent, circle: Circle) {
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
        this.onSelectActivity(circle.ref);
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
      for (const circle of this.activities) {
        const nativeCircle = this.activeZone.nativeElement.querySelector('#' + circle.id);
        circle.radius = nativeCircle.clientWidth / 2 + CIRCLE_MARGINE;
      }

      moveCircles({
        circles: this.activities,
        animationBounds: this.animationBounds,
        obstacleCircle: this.obstacleCircle,
        slowMove: Boolean(this.selectedActivity),
      });

      const newPositions = {};
      for (const circle of this.activities) {
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
    };
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
