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
    foreignId: string;
    email: string;
    surname: string;
    image: any;
    preferredActivities: Activity[];
}

export type Authorization = Person;

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
    description: string;
    preferredPlaces: Place[];
}

export interface Authorities {
    username: string;
    password: string;
    social?: 'google' | 'facebook';
};

  