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
    fullName: string;
    description: string;
    image: string;
}

export interface Place {
    id: string;
    name: string;
    description: string;
    image: string;
}

export interface Activity {
    id: string;
    name: string;
    image: string;
}
  
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

export enum CHAT_MODE {
    VIDEO, AUDIO, TEXT,
};
  