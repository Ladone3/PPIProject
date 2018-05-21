import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Person, Activity, Vector, Rect } from '../../models/models';
import { AppDataService } from '../../services/appDataService';

export const MAX_SPEED = 1;
export const DEFAULT_RADIUS = 50;

export interface Circle<Type = any> {
  title: string;
  image: string
  ref: Type;
  position: Vector;
  direction: Vector;
}

@Component({
  selector: 'page-main',
  templateUrl: 'main.html'
})
export class MainPage {
  @ViewChild('peopleZone') peopleZone: ElementRef;
  @ViewChild('activitiesZone') activitiesZone: ElementRef;

  private people: Circle<Person>[];
  private activities: Circle<Activity>[];
  private animation: boolean = false;

  constructor(
    public navCtrl: NavController,
    private appDataService: AppDataService,
  ) {
    Promise.all([
      appDataService.getContacts(),
      appDataService.getActivities(),
    ]).then(([people, activities]) => {
      this.people = peopleToCircle(people);
      this.activities = activityToCircle(activities);
      this.startAnimation();
    }).catch(this.showError);
  }

  public redraw() {

  }

  // Animation
  // ===========================================
  public getPeople() {
    return this.people;
  }

  public getActivities() {
    return this.activities;
  }

  public startAnimation() {
    this.animation = true;
    this.animationStep();
  }

  public stopAnimation() {
    this.animation = false;
  }

  private animationStep() {
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

    function processCircles(circles: Circle[], bounds: Rect) {
      for (let i = 0; i < circles.length; i++) {
        const circle = circles[i];
        const pos = circle.position;

        // on initialization stage minPoint === maxPoint
        const correctBounds = bounds.width !== 0 && bounds.height !== 0;
        if (correctBounds) {
          var minPoint: Vector = {
            x: bounds.x + circleRadius,
            y: bounds.y + circleRadius,
          };
          var maxPoint: Vector = {
            x: bounds.x + bounds.width - circleRadius,
            y: bounds.y + bounds.height - circleRadius,
          };

          // Check the walls
          if (pos.x > maxPoint.x) circle.direction.x = -Math.abs(circle.direction.x);
          if (pos.x < minPoint.x) circle.direction.x = Math.abs(circle.direction.x);
          if (pos.y > maxPoint.y) circle.direction.y = -Math.abs(circle.direction.y);
          if (pos.y < minPoint.y) circle.direction.y = Math.abs(circle.direction.y);
          pos.x = Math.min(Math.max(pos.x, minPoint.x), maxPoint.x);
          pos.y = Math.min(Math.max(pos.y, minPoint.y), maxPoint.y);
        }

        // Hit test with other circles
        for (let j = i + 1; j < circles.length; j++) {
          const c = circles[j];
          if (circle != c && hitTest(circle, c, circleRadius)) {
            circle.direction = calcReflectionAngle(circle, c);
            c.direction = calcReflectionAngle(c, circle);
          }
        }
      }
    }

    function calcReflectionAngle(circle1: Circle, circle2: Circle) {
      const pos1 = circle1.position;
      const pos2 = circle2.position;
      const dx = pos1.x - pos2.x;
      const dy = pos1.y - pos2.y;
      const dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
      const appropriateDist = circleRadius * 2;
      const stickTogether = appropriateDist > dist;
      /*
        (r->) = (l->) - 2(n->)((l->)*(n->)/(n->)*(n->))
      */
      const n: Vector = {
        x: (pos1.x - pos2.x) || Math.random(),
        y: (pos1.y - pos2.y) || Math.random(),
      };
      let l;
      if (stickTogether) {
        const nLength = Math.sqrt(Math.pow(n.x, 2) + Math.pow(n.y, 2));
        const lLength = Math.sqrt(Math.pow(circle1.direction.x, 2) + Math.pow(circle1.direction.y, 2));
        l = scale(n, -lLength / nLength);
      } else {
        l = circle1.direction;
      }

      const l_m_n = multiplication(l, n);
      const n_m_n = multiplication(n, n);
      const rightPart = scale(n, 2 * (l_m_n / n_m_n));
      const reflectionAngle = deduction(l, rightPart);

      return reflectionAngle;

      function sum(v1: Vector, v2: Vector): Vector {
        return {
          x: v1.x + v2.x,
          y: v1.y + v2.y,
        };
      }

      function deduction(v1: Vector, v2: Vector): Vector {
        return sum(v1, scale(v2, - 1));
      }

      function scale(v1: Vector, scale: number): Vector {
        return {
          x: v1.x * scale,
          y: v1.y * scale,
        };
      }

      function multiplication(v1: Vector, v2: Vector): number {
        return v1.x * v2.x + v1.y * v2.y;
      }
    }
  }


  private animate() {
    this.people.forEach(person => moveCircle(person));
    this.activities.forEach(person => moveCircle(person));
    this.redraw();

    function moveCircle(circle: Circle) {
      circle.position = {
        x: circle.position.x + circle.direction.x,
        y: circle.position.y + circle.direction.y,
      };
    }
  }

  // ===========================================

  private showError(error) {
    console.log(error)
  }
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

export function peopleToCircle(people: Person[]): Circle<Person>[] {
  // we don't know the size of active zone in that point of a time
  // so we use document.body
  return people.map(person => ({
    title: person.name,
    image: person.image,
    position: {
      x: Math.random() * document.body.clientWidth / 2,
      y: Math.random() * document.body.clientHeight,
    },
    direction: getRandomDirection(),
    ref: person,
  }));
}

export function activityToCircle(activities: Activity[]): Circle<Activity>[] {
  // we don't know the size of active zone in that point of a time
  // so we use document.body
  return activities.map(activity => ({
    title: activity.name,
    image: activity.image,
    position: {
      x: (document.body.clientWidth / 2) +
        Math.random() * (document.body.clientWidth / 2),
      y: Math.random() * document.body.clientHeight,
    },
    direction: getRandomDirection(),
    ref: activity,
  }));
}

export function hitTest(circle1: Circle, circle2: Circle, radius) {
  const pos1 = circle1.position;
  const pos2 = circle2.position;
  const dist = Math.sqrt(
    Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2)
  );

  return dist < (radius * 2);
}

function getRandomDirection(): Vector {
  return {
    x: MAX_SPEED - Math.random() * MAX_SPEED * 2,
    y: MAX_SPEED - Math.random() * MAX_SPEED * 2,
  }
}
