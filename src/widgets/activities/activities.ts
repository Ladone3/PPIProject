import { Component, ViewChild, ElementRef, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Person, Activity, Rect, Vector } from '../../models/models';
import { AppDataService, EMPTY_ACTIVITY } from '../../services/appDataService';
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
import { AuthorizationPage } from '../../pages/authorization/authorization';
import { MakingCallPage } from '../../pages/makingCall/makingCall';
@Component({
  selector: 'widget-activities',
  templateUrl: 'activities.html'
})
export class ActivitiesWidget implements OnInit, OnDestroy, OnChanges {
  @ViewChild('activeZone') activeZone: ElementRef;
  @ViewChild('obstacle') obstacle: ElementRef;
  @Input() person?: Person;
  @Output() activity = new EventEmitter<Activity>();

  public dragZoneIsActive: boolean = false;
  public positions: Positions;
  public activities: Circle<Activity>[];
  public selectedActivity: Activity;

  private obstacleCircle: Circle;
  private animationBounds: Rect;
  private animationCycle: any;

  constructor(
    public navCtrl: NavController,
    public appDataService: AppDataService,
    public navParams: NavParams,
  ) { }

  public ngOnInit() {
    this.getActivities().then(activities => {
      const circles = activityToCircle(activities);
      this.setInitialState(circles);
      this.activities = circles;
      // this.startAnimation();
    }).catch(this.showError);
  }

  public ngOnChanges() {
    if (this.person && this.selectedActivity) {
      const activityIsAnavailable = this.person.preferredActivities.map(a => a.id)
        .indexOf(this.selectedActivity.id) === -1;
        if (activityIsAnavailable) {
          setTimeout(() => { // I know It's ugly, but now time to fix it.
            this.selectedActivity = undefined;
            this.activity.emit(undefined);
          }, 200);
        }
    }
  }

  private async getActivities(): Promise<Activity[]> {
    const friends = await this.appDataService.person.getFriends();
    let activities: Activity[] = [];
    for (const person of friends) {
      activities = activities.concat(person.preferredActivities);
    }
    return activities;
  }

  public isActivityBlured(activity: Activity): boolean {
    const bluredByPerson = this.person && 
      this.person.preferredActivities.map(a => a.id).indexOf(activity.id) === -1;
    const bluredBySelection = this.selectedActivity && this.selectedActivity.id !== activity.id;
    return bluredByPerson || bluredBySelection;
  }

  public ngOnDestroy() {
    this.stopAnimation();
  }

  public onActivityClick(event: (MouseEvent | TouchEvent), activity: Activity | undefined) {
    this.selectedActivity = activity;
    this.activity.emit(activity);
    event.stopPropagation();
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
        // this.onSelectActivity(circle.ref);
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
      try {
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
      } catch (error) {
        this.stopAnimation();
      }
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
