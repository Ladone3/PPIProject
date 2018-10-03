import { Injectable } from '@angular/core';
import { Person, Activity, Place, Authorization, Authorities } from '../models/models';
import { compileActivity, compilePerson, compilePlace } from '../utils/dataUtils';

export const EMPTY_PLACE: Place = {
    id: 'internet',
    name: 'Internet',
    image: 'assets/imgs/person.png',
    description: 'Internet',
}

export const EMPTY_ACTIVITY: Activity = {
    id: 'skipped',
    name: 'Skipped',
    image: 'assets/imgs/call-answer.png',
    description: 'Simple call',
    preferredPlaces: [EMPTY_PLACE],
}

@Injectable()
export class AppDataService {
    public authorization: Authorization;

    constructor() { }

    // Authorization
    // ==========================================================

    public registerUser (authorities: Authorities): Promise<Authorization> {
            return Promise.reject(`User ${authorities.username} is not authorized!`);
    }

    public logout (): Promise<void> {
        if (!this.authorization) {
            return;
        }
        this.authorization = undefined;
        try {
            return executeGet<void>({ url: 'auth/logout' });
        } catch (error) {
            console.warn(error);
        }
    }

    public async getAuthorization (): Promise<Authorization> {
        if (this.authorization) {
            return this.authorization;
        }
        try {
            this.authorization = await executeGet<Authorization>({
                url: 'user',
            });
            compilePerson(this.authorization);
            return this.authorization;
        } catch (error) {
            console.warn(error);
            return undefined;
        }
    }

    public async authorize (authorities: Authorities): Promise<Authorization> {
        try {
            if (authorities.social) {
                this.authorization = await executeGet<Authorization>({
                    url: 'auth/login/facebook',
                });
            } else {
                this.authorization = await executePost<Authorization>({
                    url: 'auth/login/',
                    body: JSON.stringify({
                        email: authorities.username,
                        password: authorities.password,
                    }),
                });
            }
            compilePerson(this.authorization);
            return this.authorization;
        } catch (error) {
            console.warn(error);
            return Promise.reject(`User ${authorities.username} is not authorized!`);
        }
    }

    // Data
    // ==========================================================

    public async getPlaceForActivityAndPerson (
        activityId: string, personId?: string
    ): Promise<Place[]> {
        try {
            const activity = await executeGet<Activity>({
                url: `activity/${activityId}`,
            });
            if (activity) {
                compileActivity(activity);
                return activity.preferredPlaces;
            } else {
                return [];
            }
        } catch (error) {
            console.warn(error);
            return [];
        }
    }

    public async getPersonById (id: string): Promise<Person> {
        try {
            const person = await executeGet<Person>({
                url: `user/${id}`,
            });
            if (person) {
                compilePerson(person);
            }
            return person;
        } catch (error) {
            console.warn(error);
            return undefined
        }
    }

    public async getActivityById (id: string): Promise<Activity> {
        try {
            const activity = await executeGet<Activity>({
                url: `activity/${id}`,
            })

            if (activity) {
                compileActivity(activity);
            }
            return activity;
        } catch (error) {
            console.warn(error);
            return undefined
        }
    }

    public async getPlaceById (id: string): Promise<Place> {
        try {
            const place = await executeGet<Place>({
                url: `place/${id}`,
            });
            if (place) {
                compilePlace(place);
            }
            return place;
        } catch (error) {
            console.warn(error);
            return undefined
        }
    }

    public async getPeople(): Promise<Person[]> {
        try {
            const people = await executeGet<Person[]>({
                url: `user/friends`,
            })
            for (const person of people) {
                compilePerson(person);
            }
            return people;
        } catch (error) {
            console.warn(error);
            return undefined
        }
    }

    public async getActivities(): Promise<Activity[]> {
        try {
            const activities = await executeGet<Activity[]>({
                url: `user/activities`,
            })
            for (const activity of activities) {
                compileActivity(activity);
            }
            return activities;

        } catch (error) {
            console.warn(error);
            return undefined
        }
    }
}

export async function executePost<Type>(params: {
    url: string;
    body: any;
}): Promise<Type> {
    const response = await fetch(`/data-server/${params.url}`, {
        method: 'POST',
        body: params.body,
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (response.ok) {
        return response.json();
    } else {
        const error = new Error(response.statusText);
        (error as any).response = response;
        throw error;
    }
}

export async function executeGet<Type>(params: {
    url: string;
}): Promise<Type> {
    try {
        const response = await fetch(`/data-server/${params.url}`, {
            method: 'GET',
            credentials: 'same-origin',
        });
        if (response.ok) {
            return response.json();
        } else {
            const error = new Error(response.statusText);
            (error as any).response = response;
            throw error;
        }
    } catch (error) {
        console.error(error);
    }
} 