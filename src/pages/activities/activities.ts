import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Person, Activity, Rect } from '../../models/models';
import { AppDataService } from '../../services/appDataService';
import { PeoplePage } from '../people/people';
import { PlacesPage } from '../places/places';
import { MakingCallPage } from '../makingCall/makingCall';
import {
  Positions,
  Circle,
  moveCircles,
  getBoundingRectangle,
  getObstacleCircle,
  activityToCircle,
  FRAME_RATE,
} from '../../utils/utils';

@Component({
  selector: 'page-activities',
  templateUrl: 'activities.html'
})
export class ActivitiesPage {
  @ViewChild('activeZone') activeZone: ElementRef;
  @ViewChild('obstacle') obstacle: ElementRef;
  
  public positions: Positions;
  public activities: Circle<Activity>[];
  public person: Person;

  private obstacleCircle: Circle;
  private animationBounds: Rect;
  private animationCycle: any;

  constructor(
    public navCtrl: NavController,
    public appDataService: AppDataService,
    public navParams: NavParams,
  ) { }

  public ionViewWillEnter() {
    Promise.all([
      this.getPerson(),
      this.appDataService.getActivities(),
    ]).then(([person, activities]) => {
      this.activities = activityToCircle(activities);
      this.person = person;
      this.setInititialState();
    }).catch(this.showError);
  }

  public ionViewDidEnter() {
    this.startAnimation();
  }

  public ionViewWillLeave() {
    this.stopAnimation();
  }

  private getPerson(): Person {
    const personId = this.navParams.get('personId');
    return this.appDataService.getPersonById(personId);
  }

  public changePerson() {
    this.navCtrl.push(PeoplePage, {});
  }

  public onSelectActivity(activity: Activity) {
    const placeId = this.navParams.get('placeId');
    if (!this.person) {
      this.navCtrl.push(PeoplePage, {
        activityId: activity.id,
        placeId: placeId,
      });
    } else if (!placeId) {
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
      this.positions = moveCircles({
        circles: this.activities.concat(this.obstacleCircle),
        boundingRectangle: this.animationBounds,
        curPositions: this.positions,
      });
    });
  }

  private setInititialState() {
    const positions = {};
    const animationBounds = getBoundingRectangle(this.activeZone);
    const obstacleCircle = getObstacleCircle(this.obstacle);

    positions[obstacleCircle.id] = {
      x: obstacleCircle.ref.x + obstacleCircle.ref.width / 2,
      y: obstacleCircle.ref.y + obstacleCircle.ref.height / 2,
    }
    for (const circle of this.activities) {
      positions[circle.id] = {
        x: Math.random() * animationBounds.width,
        y: Math.random() * animationBounds.height,
      }
    }

    this.positions = positions;
    this.obstacleCircle = obstacleCircle;
    this.animationBounds = animationBounds;
  }

  // ===========================================

  private showError(error) {
    console.log(error)
  }
}
