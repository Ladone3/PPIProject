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
    id?: string;
    name: string;
    fullName: string;
    description?: string;
    foreignId?: string;
    email: string;
    surname: string;
    image?: any;
    preferredActivities: Activity[];
}

export interface Authorization extends Person {
    password?: string;
};

export interface Place {
    id?: string;
    name: string;
    description?: string;
    image?: any;
}

export interface Activity {
    id?: string;
    name: string;
    image?: any;
    description?: string;
    preferredPlaces: Place[];
}

export interface Authorities {
    username: string;
    password: string;
    social?: 'google' | 'facebook';
};

  