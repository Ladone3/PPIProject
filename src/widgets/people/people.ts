import { Component, ViewChild, ElementRef, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Person, Activity, Rect, Vector } from '../../models/models';
import { AppDataService, EMPTY_ACTIVITY } from '../../services/appDataService';

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
import { AuthorizationPage } from '../../pages/authorization/authorization';
import { MakingCallPage } from '../../pages/makingCall/makingCall';

@Component({
  selector: 'widget-people',
  templateUrl: 'people.html'
})
export class PeopleWidget implements OnInit, OnDestroy, OnChanges {
  @ViewChild('activeZone') activeZone: ElementRef;
  @ViewChild('obstacle') obstacle: ElementRef;
  @Input() activity?: Activity;
  @Output() person = new EventEmitter<Person>();

  public dragZoneIsActive: boolean = false;
  public positions: Positions;
  public people: Circle<Person>[];
  public selectedPerson: Person;

  private obstacleCircle: Circle;
  private animationBounds: Rect;
  private animationCycle: any;

  constructor(
    public navCtrl: NavController,
    public appDataService: AppDataService,
    public navParams: NavParams,
  ) { }

  public ngOnInit() {
    this.appDataService.person.getFriends().then(people => {
      const circles = peopleToCircle(people);
      this.setInitialState(circles);
      this.people = circles;
      // this.startAnimation();
    }).catch(this.showError);
  }

  public ngOnChanges() {
    if (this.activity && this.selectedPerson) {
      const personIsAnavailable = this.selectedPerson.preferredActivities.map(a => a.id)
        .indexOf(this.activity.id) === -1;
        if (personIsAnavailable) {
          setTimeout(() => { // I know It's ugly, but now time to fix it.
            this.selectedPerson = undefined;
            this.person.emit(undefined);
          }, 200);
        }
    }
  }

  public isPersonBlured(person: Person): boolean {
    const bluredByActivity = this.activity && person.preferredActivities.map(a => a.id).indexOf(this.activity.id) === -1;
    const bluredBySelection = this.selectedPerson && this.selectedPerson.id !== person.id;
    return bluredByActivity || bluredBySelection;
  }

  public ngOnDestroy() {
    this.stopAnimation();
  }

  public onPersonClick(event: (MouseEvent | TouchEvent), person: Person | undefined) {
    this.selectedPerson = person;
    this.person.emit(person);
    event.stopPropagation();
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
        // this.onSelectPerson(circle.ref);
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
