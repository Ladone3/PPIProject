export interface Vector {
    x: number;
    y: number;
}

export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Person {
    id: string;
    name: string;
    image: string;
  }
  
export type Place = Person;
export type Activity = Person;
// export interface Activity extends Person {
//     places: Place[];
// }
