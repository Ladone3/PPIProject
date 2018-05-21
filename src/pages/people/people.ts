import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Person, Activity, Rect } from '../../models/models';
import { AppDataService } from '../../services/appDataService';
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
  ) {
    Promise.all([
      this.getActivity(),
      appDataService.getPeople(),
    ]).then(([activity, people]) => {
      this.people = peopleToCircle(people);
      this.activity = activity;
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
    for (const circle of this.people) {
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

  private getActivity() {
    return this.appDataService.getActivityById('someId');
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

  // ===========================================

  private showError(error) {
    console.log(error)
  }
}
