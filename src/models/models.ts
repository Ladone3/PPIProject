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

export interface Authorities {
    username: string;
    password: string;
};

export interface Authorization {
    username: string;
    token: string;
};
  