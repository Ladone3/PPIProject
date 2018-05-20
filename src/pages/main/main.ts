import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Person, Activity, Point, Rect } from '../../models/models';

export const MAX_SPEED = 1;
export const DEFAULT_RADIUS = 50;

export interface Circle<Type = any> {
  title: string;
  image: string
  ref: Type;
  position: Point;
  direction: Vector;
}

export interface Vector {
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

        // on initialization stage minPoint === maxPoint
        const correctBounds = bounds.width !== 0 && bounds.height !== 0;
        if (correctBounds) {
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

    function calcReflectionAngle (circle1: Circle, circle2: Circle) {
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
       dx: (pos1.x - pos2.x) || Math.random(),
       dy: (pos1.y - pos2.y) || Math.random(),
      };
      let l;
      if (stickTogether) {
        const nLength = Math.sqrt(Math.pow(n.dx,2) + Math.pow(n.dy,2));
        const lLength = Math.sqrt(Math.pow(circle1.direction.dx,2) + Math.pow(circle1.direction.dy,2));
        l = scale(n, -lLength/nLength);
      } else {
        l = circle1.direction;
      }

      const l_m_n = multiplication(l, n);
      const n_m_n = multiplication(n, n);
      const rightPart = scale(n, 2 * (l_m_n / n_m_n));
      const reflectionAngle = deduction(l, rightPart);

      return reflectionAngle;

      function sum (v1: Vector, v2: Vector): Vector {
        return {
          dx: v1.dx + v2.dx,
          dy: v1.dy + v2.dy,
        };
      }

      function deduction (v1: Vector, v2: Vector): Vector {
        return sum(v1, scale(v2, - 1));
      }

      function scale (v1: Vector, scale: number): Vector {
        return {
          dx: v1.dx * scale,
          dy: v1.dy * scale,
        };
      }

      function multiplication (v1: Vector, v2: Vector): number {
        return v1.dx * v2.dx + v1.dy * v2.dy;
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
      },
      {
        name: 'Sam',
        image: 'assets/imgs/image1.png',
      },
      {
        name: 'Sam',
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
      // {
      //   name: 'Chilling',
      //   image: 'assets/imgs/image2.png',
      // }
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

export function activityToCircle (activities: Activity[]): Circle<Activity>[] {
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

export function hitTest (circle1: Circle, circle2: Circle, radius) {
    const pos1 = circle1.position;
    const pos2 = circle2.position;
    const dist = Math.sqrt(
      Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2)
    );
    
    return dist < (radius * 2);
}

function getRandomDirection (): Vector {
    return {
      dx: MAX_SPEED - Math.random() * MAX_SPEED * 2,
      dy: MAX_SPEED - Math.random() * MAX_SPEED * 2,
    }
}
