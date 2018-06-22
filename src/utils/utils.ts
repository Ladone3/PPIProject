import { ElementRef } from '@angular/core';
import { Person, Activity, Vector, Rect, Place } from '../models/models';

let idCounter = 0;

export const MAX_SPEED = 1;
export const FRAME_RATE = 50;
export const START_FROM_CYCLE = FRAME_RATE * 3;
export const CIRCLE_MARGINE = 10;
export const SLOW_MOVE_RATE = 10;

export type Positions = { [id: string]: Vector }; 

export interface Circle<Type = any> {
  id: string;
  isDragged?: boolean;
  title: string;
  image: string
  ref: Type;
  radius: number;
  direction: Vector;
  position: Vector;
}

export interface Parameters {
  circles: Circle[];
  obstacleCircle: Circle<Rect>;
  animationBounds: Rect;
  slowMove?: boolean;
}

export function moveCircles (parameters: Parameters) {
  const newPositions: Positions = {};
  const bounds = parameters.animationBounds;
  const circles = parameters.circles.concat(parameters.obstacleCircle);
  const minPoint: Vector = { x: 0, y: 0 };
  const maxPoint: Vector = { x: bounds.width, y: bounds.height };

  // =======================================================

  for (let i = 0; i < circles.length; i++) {
    const circle = circles[i];
    const pos = circle.position;
    if (circle.isDragged) continue;
    
    // Check the walls
    if (pos.x > maxPoint.x - circle.radius) circle.direction.x = -Math.abs(circle.direction.x);
    if (pos.x < minPoint.x + circle.radius) circle.direction.x = Math.abs(circle.direction.x);
    if (pos.y > maxPoint.y - circle.radius) circle.direction.y = -Math.abs(circle.direction.y);
    if (pos.y < minPoint.y + circle.radius) circle.direction.y = Math.abs(circle.direction.y);

    // Hit test with other circles
    for (let j = i + 1; j < circles.length; j++) {
      const c = circles[j];
      if (circle != c && (!circle.isDragged) && hitTest(circle, c)) {
        circle.direction = calcReflectionAngle(circle, c);
        c.direction = calcReflectionAngle(c, circle);
      }
    }
  }

  // =======================================================

  // move circles
  circles.forEach(circle => {
    if (!circle.isDragged) {
      const newPos = {
        x: circle.position.x + circle.direction.x / (parameters.slowMove ? SLOW_MOVE_RATE : 1),
        y: circle.position.y + circle.direction.y / (parameters.slowMove ? SLOW_MOVE_RATE : 1),
      };
      circle.position = newPos;
    }
  });

  return newPositions;

  // =============================================================
  // =============================================================

  function calcReflectionAngle(circle1: Circle, circle2: Circle) {
    const pos1 = circle1.position;
    const pos2 = circle2.position;
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

export function getCircleFromRef(element: ElementRef): Circle<Rect> {
  const bounds = getBoundingRectangle(element);
  return {
    id: 'Obstacle',
    title: undefined,
    image: undefined,
    direction: { x: 0, y: 0 },
    radius: bounds.width / 2,
    ref: bounds,
    position: {
      x: bounds.x,
      y: bounds.y,
    },
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
    position: { x: 0, y: 0 },
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
    position: { x: 0, y: 0 },
  }));
}

export function placeToCircle(activities: Place[]): Circle<Place>[] {
  // we don't know the size of active zone in that point of a time
  // so we use document.body
  return activities.map(activity => ({
    id: 'Place-' + idCounter++,
    title: activity.name,
    image: activity.image,
    direction: getRandomDirection(),
    radius: 50,
    ref: activity,
    position: { x: 0, y: 0 },
  }));
}

function getRandomDirection(): Vector {
  return {
    x: MAX_SPEED - Math.random() * MAX_SPEED * 2,
    y: MAX_SPEED - Math.random() * MAX_SPEED * 2,
  }
}

export function onDragStart (
  event: (MouseEvent | TouchEvent),
  callback: (vector: Vector) => void,
  endCallback?: () => void,
) {
  let startX = 0;
  let startY = 0;

  const pointProvider = event instanceof MouseEvent ? event : event.touches[0];

  if (pointProvider.pageX) startX = pointProvider.pageX;
  else if (pointProvider.clientX) startX = pointProvider.clientX;

  if (pointProvider.pageY) startY = pointProvider.pageY;
  else if (pointProvider.clientY) startY = pointProvider.clientY;

  window.getSelection().removeAllRanges();

  document.body.addEventListener('mousemove', _onchange);
  document.body.addEventListener('mouseup', _onend);
  document.body.addEventListener('touchmove', _onchange);
  document.body.addEventListener('touchend', _onend)

  function _onchange (event) {
    const pointProvider = event instanceof MouseEvent ? event : event.touches[0];

      let endX = 0;
      if (pointProvider.pageX) endX = pointProvider.pageX;
      else if (pointProvider.clientX) endX = pointProvider.clientX;

      const diffX = endX - startX;
      startX = endX;

      let endY = 0;
      if (pointProvider.pageY) endY = pointProvider.pageY;
      else if (pointProvider.clientY) endY = pointProvider.clientY;

      const diffY = endY - startY;
      startY = endY;

      callback({ x: diffX, y: diffY, });
  }

  function _onend (event) {
      document.body.onmousemove = document.body.onmouseup = null;
      document.body.removeEventListener('mousemove', _onchange);
      document.body.removeEventListener('mouseup', _onend);
      document.body.removeEventListener('touchmove', _onchange);
      document.body.removeEventListener('touchend', _onend)
      endCallback();
  }
}

export function hitTest(circle1: Circle, circle2: Circle) {
  const dist = Math.sqrt(
    Math.pow(circle1.position.x - circle2.position.x, 2) + Math.pow(circle1.position.y - circle2.position.y, 2)
  );

  return dist < (circle1.radius +  circle2.radius);
}