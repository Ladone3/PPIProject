import { Injectable } from '@angular/core';
import { Person, Activity } from '../models/models';

@Injectable()
export class AppDataService {
    private people: Person[] = [
        {
            id: 'person-1',
            name: 'Armagan',
            image: 'assets/imgs/people/Armagan.jpg',
        },
        {
            id: 'person-2',
            name: 'Guillermo Benito Ruiz',
            image: 'assets/imgs/people/Guillermo_Benito_Ruiz.jpg',
        },
        {
            id: 'person-3',
            name: 'Unnamed One',
            image: 'assets/imgs/people/image1.jpg',
        },
        {
            id: 'person-4',
            name: 'Unnamed Two',
            image: 'assets/imgs/people/image2.jpg',
        },
        {
            id: 'person-5',
            name: 'Unnamed Three',
            image: 'assets/imgs/people/image3.jpg',
        },
        {
            id: 'person-6',
            name: 'Unnamed Four',
            image: 'assets/imgs/people/image4.jpg',
        },
    ];

    private activities: Activity[] = [
        {
            id: 'activity-1',
            name: 'Cycling',
            image: 'assets/imgs/activities/cycling.png',
        },
        {
            id: 'activity-2',
            name: 'Horse riding',
            image: 'assets/imgs/activities/horse_riding.png',
        },
        {
            id: 'activity-3',
            name: 'Running',
            image: 'assets/imgs/activities/running.png',
        },
        {
            id: 'activity-4',
            name: 'Surfing',
            image: 'assets/imgs/activities/surfing.png',
        },
        {
            id: 'activity-5',
            name: 'Swimming',
            image: 'assets/imgs/activities/swimming.png',
        },
        {
            id: 'activity-6',
            name: 'Walking dog',
            image: 'assets/imgs/activities/walking_dog.png',
        },
        {
            id: 'activity-7',
            name: 'Walking',
            image: 'assets/imgs/activities/walking.png',
        },
    ]

    constructor() { }

    public getPersonById (id: string): Person | undefined {
        for (const person of this.people) {
            if (person.id === id) {
                return person;
            }
        }
        return undefined
    }

    public getActivityById (id: string): Activity | undefined {
        for (const activity of this.activities) {
            if (activity.id === id) {
                return activity;
            }
        }
        return undefined
    }

    public getPeople(): Promise<Person[]> {
        return Promise.resolve(this.people);
    }

    public getActivities(): Promise<Activity[]> {
        return Promise.resolve(this.activities);
    }
}