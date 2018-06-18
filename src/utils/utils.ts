import { ElementRef } from '@angular/core';
import { Person, Activity, Vector, Rect } from '../models/models';

let idCounter = 0;

export const MAX_SPEED = 1;
export const FRAME_RATE = 50;
export const START_FROM_CYCLE = FRAME_RATE * 3;
export const CIRCLE_MARGINE = 10;

export type Positions = { [id: string]: Vector }; 

export interface Circle<Type = any> {
  id: string;
  isDragged?: boolean;
  title: string;
  image: string
  ref: Type;
  radius: number;
  direction: Vector;
}

export interface Parameters {
  curPositions: Positions;
  circles: Circle[];
  obstacleCircle: Circle<Rect>;
  animationBounds: Rect;
}

export function moveCircles (parameters: Parameters) {
  const oldPositions = parameters.curPositions;
  const newPositions: Positions = {};
  const bounds = parameters.animationBounds;
  const circles = parameters.circles.concat(parameters.obstacleCircle);
  const minPoint: Vector = { x: 0, y: 0 };
  const maxPoint: Vector = { x: bounds.width, y: bounds.height };

  // =======================================================

  for (let i = 0; i < circles.length; i++) {
    const circle = circles[i];
    const pos = oldPositions[circle.id];
    if (circle.isDragged) continue;
    
    // Check the walls
    if (pos.x > maxPoint.x - circle.radius) circle.direction.x = -Math.abs(circle.direction.x);
    if (pos.x < minPoint.x + circle.radius) circle.direction.x = Math.abs(circle.direction.x);
    if (pos.y > maxPoint.y - circle.radius) circle.direction.y = -Math.abs(circle.direction.y);
    if (pos.y < minPoint.y + circle.radius) circle.direction.y = Math.abs(circle.direction.y);

    // Hit test with other circles
    for (let j = i + 1; j < circles.length; j++) {
      const c = circles[j];
      if (circle != c && (!circle.isDragged) && hitTest({
        x: oldPositions[circle.id].x,
        y: oldPositions[circle.id].y,
        radius: circle.radius,
      },{
        x: oldPositions[c.id].x,
        y: oldPositions[c.id].y,
        radius: c.radius,
      })) {
        circle.direction = calcReflectionAngle(circle, c);
        c.direction = calcReflectionAngle(c, circle);
      }
    }
  }

  // =======================================================

  // move circles
  circles.forEach(circle => {
    if (!circle.isDragged) {
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
    } else {
      newPositions[circle.id] = oldPositions[circle.id];
    }
  });

  return newPositions;

  // =============================================================
  // =============================================================

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
    x: element.nativeElement.offsetLeft,
    y: element.nativeElement.offsetTop,
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

export function onMousedown (
  event: MouseEvent,
  callback: (vector: Vector) => void,
  endCallback?: () => void,
) {
  let startX = 0;
  let startY = 0;

  if (event.pageX) startX = event.pageX;
  else if (event.clientX) startX = event.clientX;

  if (event.pageY) startY = event.pageY;
  else if (event.clientY) startY = event.clientY;

  window.getSelection().removeAllRanges();

  document.body.addEventListener('mousemove', _onchange);
  document.body.addEventListener('mouseup', _onmouseup);

  function _onchange (event) {
      let endX = 0;
      if (event.pageX) endX = event.pageX;
      else if (event.clientX) endX = event.clientX;

      const diffX = endX - startX;
      startX = endX;

      let endY = 0;
      if (event.pageY) endY = event.pageY;
      else if (event.clientY) endY = event.clientY;

      const diffY = endY - startY;
      startY = endY;

      callback({ x: diffX, y: diffY, });
  }

  function _onmouseup (event) {
      document.body.onmousemove = document.body.onmouseup = null;
      document.body.removeEventListener('mousemove', _onchange);
      document.body.removeEventListener('mouseup', _onmouseup);
      endCallback();
  }
}

export function hitTest(
  circle1: { x: number, y: number, radius: number },
  circle2: { x: number, y: number, radius: number },
) {
  const dist = Math.sqrt(
    Math.pow(circle1.x - circle2.x, 2) + Math.pow(circle1.y - circle2.y, 2)
  );

  return dist < (circle1.radius +  circle2.radius);
}