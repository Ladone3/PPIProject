import { Injectable } from '@angular/core';
import { Person, Activity, Place, Authorization, Authorities } from '../models/models';
import { PEOPLE, ACTIVITIES, PLACES, ACTIVITY_PLACE } from './mockData';

export const AUTHORIZATION: Authorization = {
    username: 'user',
    token: '123456',
};

export const AUTHORITIES: Authorities = {
    username: 'user',
    password: 'user',
};

@Injectable()
export class AppDataService {
    private people: Person[] = PEOPLE;
    private activities: Activity[] = ACTIVITIES
    private places: Place[] = PLACES;
    private activityPlace: { [activityId: string]: Place[] } = ACTIVITY_PLACE;
    private authorization: Authorization;

    constructor() { }

    public getAuthorization (): Promise<Authorization> {
        if (this.authorization) {
            return Promise.resolve(this.authorization);
        } else {
            return Promise.resolve(AUTHORIZATION);
            // return Promise.reject('User is not authorized!');
        }
    }

    public authorize (authorities: Authorities): Promise<Authorization> {
        if (
            authorities.username === AUTHORITIES.username &&
            authorities.password === AUTHORITIES.password
        ) {
            this.authorization = AUTHORIZATION
            return Promise.resolve(this.authorization);
        } else {
            return Promise.reject(`User ${authorities.username} is not authorized!`);
        }
    }

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


