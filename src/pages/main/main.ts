import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Person, Activity, Point, Rect } from '../../models/models';

export const ROUNDS_NUMBER = 5;
export const MAX_SPEED = 1;
export const DEFAULT_RADIUS = 50;

export interface Circle<Type = any> {
  title: string;
  image: string
  ref: Type;
  position: Point;
  direction: Direction;
}

export interface Direction {
  dx: number;
  dy: number;
} 

@Component({
  selector: 'page-main',
  templateUrl: 'main.html'
})
export class MainPage {
  @ViewChild('peopleZone') peopleZone: ElementRef;
  @ViewChild('activitiesZone') activitiesZone: ElementRef;

  people: Circle<Person>[];
  activities: Circle<Activity>[];
  animation: boolean = false;

  constructor(public navCtrl: NavController) {
    Promise.all([
      this.getPeople(),
      this.getActivities(),
    ]).then(([people, activities]) => {
      this.people = peopleToCircle(people);
      this.activities = activityToCircle(activities);
      this.startAnimation();
    }).catch(this.showError);
  }

  public redraw () {

  }

  // Animation
  // ===========================================
  public startAnimation () {
    this.animation = true;
    this.animationStep();
  }

  public stopAnimation () {
    this.animation = false;
  }

  private animationStep () {
    this.calcPhysics();
    this.animate();

    // continue recursive animation
    if (this.animation) {
      requestAnimationFrame(() => {
        this.animationStep();
      });
    }
  }

  private calcPhysics() {
    const someCircle = this.peopleZone.nativeElement.querySelector('.ppi-circle');

    const circleRadius = someCircle ? someCircle.clientWidth / 2 : DEFAULT_RADIUS;
    processCircles(this.people, getRectangle(this.peopleZone));
    processCircles(this.activities, getRectangle(this.activitiesZone));

    function processCircles (circles: Circle[], bounds: Rect) {
      for (let i = 0; i < circles.length; i++) {
        const circle = circles[i];
        const pos = circle.position;

        var minPoint: Point = {
          x: bounds.x + circleRadius,
          y: bounds.y + circleRadius,
        };
        var maxPoint: Point = {
          x: bounds.x + bounds.width - circleRadius,
          y: bounds.y + bounds.height - circleRadius,
        };

        // Check the walls
        if (pos.x > maxPoint.x) circle.direction.dx = -Math.abs(circle.direction.dx);
        if (pos.x < minPoint.x) circle.direction.dx = Math.abs(circle.direction.dx);
        if (pos.y > maxPoint.y) circle.direction.dy = -Math.abs(circle.direction.dy);
        if (pos.y < minPoint.y) circle.direction.dy = Math.abs(circle.direction.dy);

        // Hit test with other circles
        for (let j = i + 1; j < circles.length; j++) {
          const c = circles[j];
          if (circle != c && hitTest(circle, c, circleRadius)) {
            const myDirection = circle.direction;
            const oponentDirection = c.direction;
            circle.direction = oponentDirection;
            c.direction = myDirection;
            pushOutCircles(circle, c);
          }
        }
      }
    }

    function pushOutCircles (circle1: Circle, circle2: Circle) {
      const pos1 = circle1.position;
      const pos2 = circle2.position;
      const dx = pos1.x - pos2.x;
      const dy = pos1.y - pos2.y;
      const dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
      const appropriateDist = circleRadius * 2;
      const offset = (appropriateDist - dist);
      const xRatio = dist === 0 ? 1 : dist / dx;
      const yRatio = dist === 0 ? 1 : dist / dy;
      circle1.position = {
        x: pos1.x + xRatio * offset,
        y: pos1.y + yRatio * offset,
      }
    }
  }

  private animate () {
    this.people.forEach(person => moveCircle(person));
    this.activities.forEach(person => moveCircle(person));
    this.redraw();

    function moveCircle (circle: Circle) {
      circle.position = {
          x: circle.position.x + circle.direction.dx,
          y: circle.position.y + circle.direction.dy,
      };
    }
  }

  // ===========================================

  // Data retrieving
  // ===========================================
  private getPeople(): Promise<Person[]> {
    return Promise.resolve([
      {
        name: 'John',
        image: 'assets/imgs/image1.png',
      },
      {
        name: 'Willy',
        image: 'assets/imgs/image1.png',
      },
      {
        name: 'Sam',
        image: 'assets/imgs/image1.png',
      }
    ]);
  }

  private getActivities(): Promise<Activity[]> {
    return Promise.resolve([
      {
        name: 'Sport',
        image: 'assets/imgs/image2.png',
      },
      {
        name: 'Drinking',
        image: 'assets/imgs/image2.png',
      },
      {
        name: 'Chilling',
        image: 'assets/imgs/image2.png',
      }
    ]);
  }

  private showError(error) {
    console.log(error)
  }
  // ===========================================
}

// Utils
// ===========================================
export function getRectangle(element: ElementRef): Rect {
  return {
    x: 0,
    y: 0,
    width: element.nativeElement.clientWidth,
    height: element.nativeElement.clientHeight,
  }
}

export function peopleToCircle (people: Person[]): Circle<Person>[] {
  return people.map(person => ({
    title: person.name,
    image: person.image,
    position: { x: 0, y: 0 },
    direction: getRandomDirection(),
    ref: person,
  }));
}

export function activityToCircle (people: Activity[]): Circle<Activity>[] {
  return people.map(activity => ({
    title: activity.name,
    image: activity.image,
    position: { x: 0, y: 0 },
    direction: getRandomDirection(),
    ref: activity,
  }));
}

export function hitTest (circle1: Circle, circle2: Circle, radius) {
    const pos1 = circle1.position;
    const pos2 = circle2.position;
    const dist = Math.sqrt(
      Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2)
    );
    
    return dist < (radius * 2);
}

function getRandomDirection (): Direction {
    return {
      dx: MAX_SPEED - Math.random() * MAX_SPEED * 2,
      dy: MAX_SPEED - Math.random() * MAX_SPEED * 2,
    }
}
