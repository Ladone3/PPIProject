import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Person, Activity, Rect } from '../../models/models';
import { AppDataService } from '../../services/appDataService';
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
  ) {
    Promise.all([
      this.getPerson(),
      appDataService.getActivities(),
    ]).then(([person, activities]) => {
      this.activities = activityToCircle(activities);
      this.person = person;
    }).catch(this.showError);
  }

  public ionViewDidLoad() {
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

    this.startAnimation();
  }

  private getPerson() {
    return this.appDataService.getPersonById('someId');
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

  // ===========================================

  private showError(error) {
    console.log(error)
  }
}
