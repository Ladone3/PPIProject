import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Person, Activity, Rect } from '../../models/models';
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
} from '../../utils/utils';

@Component({
  selector: 'page-people',
  templateUrl: 'people.html'
})
export class PeoplePage {
  @ViewChild('activeZone') activeZone: ElementRef;
  @ViewChild('obstacle') obstacle: ElementRef;
  
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

  public ionViewWillEnter() {
    Promise.all([
      this.getActivity(),
      this.appDataService.getPeople(),
    ]).then(([activity, people]) => {
      this.people = peopleToCircle(people);
      this.activity = activity;
      this.setInitialState();
    }).catch(this.showError);
  }

  public ionViewDidEnter() {
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
        circles: this.people.concat(this.obstacleCircle),
        boundingRectangle: this.animationBounds,
        curPositions: this.positions,
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
  }

  // ===========================================

  private showError(error) {
    console.log(error)
  }
}
