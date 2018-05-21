import { ElementRef } from '@angular/core';
import { Person, Activity, Vector, Rect } from '../models/models';

let idCounter = 0;

export const MAX_SPEED = 1;
export const FRAME_RATE = 50;

export type Positions = { [id: string]: Vector }; 

export interface Circle<Type = any> {
  id: string;
  title: string;
  image: string
  ref: Type;
  radius: number;
  direction: Vector;
}

export interface Parameters {
  curPositions: Positions;
  circles: Circle[];
  boundingRectangle: Rect;
}

export function moveCircles (parameters: Parameters) {
  const oldPositions = parameters.curPositions;
  const newPositions: Positions = {};

  const bounds = parameters.boundingRectangle;
  const circles = parameters.circles;

  // on initialization stage minPoint === maxPoint
  const boundsIsCorrect = bounds.width !== 0 && bounds.height !== 0;
  const minPoint: Vector = {
    x: bounds.x,
    y: bounds.y,
  };
  const maxPoint: Vector = {
    x: bounds.x + bounds.width,
    y: bounds.y + bounds.height,
  };

  for (let i = 0; i < circles.length; i++) {
    const circle = circles[i];
    const pos = oldPositions[circle.id];

    
    if (boundsIsCorrect) {
      // Check the walls
      if (pos.x > maxPoint.x - circle.radius) circle.direction.x = -Math.abs(circle.direction.x);
      if (pos.x < minPoint.x + circle.radius) circle.direction.x = Math.abs(circle.direction.x);
      if (pos.y > maxPoint.y - circle.radius) circle.direction.y = -Math.abs(circle.direction.y);
      if (pos.y < minPoint.y + circle.radius) circle.direction.y = Math.abs(circle.direction.y);
    }

    // Hit test with other circles
    for (let j = i + 1; j < circles.length; j++) {
      const c = circles[j];
      if (circle != c && hitTest(circle, c)) {
        circle.direction = calcReflectionAngle(circle, c);
        c.direction = calcReflectionAngle(c, circle);
      }
    }
  }

  // move circles
  circles.forEach(circle => {
    const oldPos = oldPositions[circle.id];

    const newPos = {
      x: oldPos.x + circle.direction.x,
      y: oldPos.y + circle.direction.y,
    };

    // newPos.x = Math.min(
    //   Math.max(newPos.x, minPoint.x + circle.radius),
    //   maxPoint.x - circle.radius,
    // );
    // newPos.y = Math.min(
    //   Math.max(newPos.y, minPoint.y + circle.radius),
    //   maxPoint.y - circle.radius,
    // );

    newPositions[circle.id] = newPos;
  });

  return newPositions;

  // =============================================================
  // =============================================================

  function hitTest(circle1: Circle, circle2: Circle) {
    const pos1 = oldPositions[circle1.id];
    const pos2 = oldPositions[circle2.id];
    const dist = Math.sqrt(
      Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2)
    );
  
    return dist < (circle1.radius +  circle2.radius);
  }

  function calcReflectionAngle(circle1: Circle, circle2: Circle) {
    const pos1 = oldPositions[circle1.id];
    const pos2 = oldPositions[circle2.id];
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    const dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    const appropriateDist = circle1.radius +  circle2.radius;
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

export function getBoundingRectangle(element: ElementRef): Rect {
  return {
    x: 0,
    y: 0,
    width: element.nativeElement.clientWidth,
    height: element.nativeElement.clientHeight,
  }
}

export function getObstacleCircle(element: ElementRef): Circle<Rect> {
  const bounds = getBoundingRectangle(element);
  return {
    id: 'Obstacle',
    title: undefined,
    image: undefined,
    direction: { x: 0, y: 0 },
    radius: bounds.width / 2,
    ref: bounds,
  };
}

export function peopleToCircle(people: Person[]): Circle<Person>[] {
  // we don't know the size of active zone in that point of a time
  // so we use document.body
  return people.map(person => ({
    id: 'Person-' + idCounter++,
    title: person.name,
    image: person.image,
    direction: getRandomDirection(),
    radius: 50,
    ref: person,
  }));
}

export function activityToCircle(activities: Activity[]): Circle<Activity>[] {
  // we don't know the size of active zone in that point of a time
  // so we use document.body
  return activities.map(activity => ({
    id: 'Activivty-' + idCounter++,
    title: activity.name,
    image: activity.image,
    direction: getRandomDirection(),
    radius: 50,
    ref: activity,
  }));
}

function getRandomDirection(): Vector {
  return {
    x: MAX_SPEED - Math.random() * MAX_SPEED * 2,
    y: MAX_SPEED - Math.random() * MAX_SPEED * 2,
  }
}