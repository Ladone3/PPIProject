import { Injectable } from '@angular/core';
import { Person, Activity, Place } from '../models/models';
import { PEOPLE, ACTIVITIES, PLACES, ACTIVITY_PLACE } from './mockData';

@Injectable()
export class AppDataService {
    private people: Person[] = PEOPLE;
    private activities: Activity[] = ACTIVITIES
    private places: Place[] = PLACES;
    private activityPlace: { [activityId: string]: Place[] } = ACTIVITY_PLACE;

    constructor() { }

    public getPlaceForActivityAndPerson (
        activityId: string, personId: string
    ): Place[] {
        const activityPlaces = this.activityPlace[activityId] || [];
        return activityPlaces;
    }

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

    public getPlaceById (id: string): Place | undefined {
        for (const place of this.places) {
            if (place.id === id) {
                return place;
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

    public getPlaces(): Promise<Place[]> {
        return Promise.resolve(this.places);
    }
}


