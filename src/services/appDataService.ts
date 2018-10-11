import { Injectable } from '@angular/core';
import { Person, Activity, Place, Authorization, Authorities } from '../models/models';
import { dbActivityToActivity, dbPersonToPerson, dbPlaceToPlace, personToPersonDb, activityToActivityDb, placeToPlaceDb } from '../utils/dataUtils';

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
    public currentUser: Authorization;

    constructor() { }

    // Authorization
    // ==========================================================

    public autorization = {
        registerUser: async (authorities: Authorities): Promise<Authorization> => {
            try {
                this.currentUser = await executePost<Authorization>({
                    url: 'user',
                    body: JSON.stringify({
                        email: authorities.username,
                        password: authorities.password,
                    }),
                });
                this.currentUser = await executePut<any>({
                    url: 'user/pass',
                    body: JSON.stringify({
                        oldPassword: '',
                        newPassword: authorities.password,
                    }),
                });
                return this.currentUser;
            } catch (error) {
                console.warn(error);
                return undefined;
            };
        },
        logout: (): Promise<void> => {
            if (!this.currentUser) {
                return;
            }
            this.currentUser = undefined;
            try {
                return executeGet<void>({ url: 'auth/logout' });
            } catch (error) {
                console.warn(error);
            }
        },
        getAuthorization: async (): Promise<Authorization> => {
            if (this.currentUser) {
                return this.currentUser;
            }
            try {
                const currentUser = await executeGet<Authorization>({
                    url: 'user',
                });
                this.currentUser = dbPersonToPerson(currentUser);
                return this.currentUser;
            } catch (error) {
                console.warn(error);
                return undefined;
            }
        },
        authorize: async (authorities: Authorities): Promise<Authorization> => {
            try {
                let currentUser;
                if (authorities.social) {
                    currentUser = await executeGet<Authorization>({
                        url: 'auth/login/facebook',
                    });
                } else {
                    currentUser = await executePost<Authorization>({
                        url: 'auth/login/',
                        body: JSON.stringify({
                            email: authorities.username,
                            password: authorities.password,
                        }),
                    });
                }
                this.currentUser = dbPersonToPerson(currentUser);
                return this.currentUser;
            } catch (error) {
                console.warn(error);
                return Promise.reject(`User ${authorities.username} is not authorized!`);
            }
        },
    };
    
    // Data
    // ==========================================================
    public activity = {
        getPlaces: async (activityId: string): Promise<Place[]> => {
            try {
                const dbActivity = await executeGet<Activity>({
                    url: `activity/${activityId}`,
                });
                if (dbActivity) {
                    const activity = dbActivityToActivity(dbActivity);
                    return activity.preferredPlaces;
                } else {
                    return [];
                }
            } catch (error) {
                console.warn(error);
                return [];
            }
        },
        getById: async (id: string): Promise<Activity> => {
            try {
                const activity = await executeGet<Activity>({
                    url: `activity/${id}`,
                })
    
                if (activity) {
                    return dbActivityToActivity(activity);
                }
                return undefined;
            } catch (error) {
                console.warn(error);
                return undefined
            }
        },
        addPlace: async (activityId: string, place: Place): Promise<Place> => {
            try {
                const updatedPlace = placeToPlaceDb(place);
                const dbPlace = await executePost<Place>({
                    url: `activity/${activityId}/place`,
                    body: JSON.stringify(updatedPlace),
                });
                await executePut<any>({
                    url: `place/${dbPlace.id}/image`,
                    body: updatedPlace.image,
                });
                updatedPlace.id = dbPlace.id;
                return dbPlaceToPlace(updatedPlace);
            } catch (error) {
                console.warn(error);
            }
        },
        removePlace: async (activityId: string, placeId: string): Promise<void> => {
            try {
                await executeDelete<Person>({
                    url: `activity/${activityId}/place/${placeId}`
                });
            } catch (error) {
                console.warn(error);
            }
        },
    };

    public person = {    
        getById: async (id: string): Promise<Person> => {
            try {
                const person = await executeGet<Person>({
                    url: `user/${id}`,
                });
                if (person) {
                    return dbPersonToPerson(person);
                }
                return person;
            } catch (error) {
                console.warn(error);
                return undefined
            }
        },
        addActivity: async (activity: Activity): Promise<Activity> => {
            try {
                const updatedActivity = activityToActivityDb(activity);
                const dbActivity = await executePost<Activity>({
                    url: `user/activities`,
                    body: JSON.stringify(updatedActivity),
                });
                await executePut<Authorization>({
                    url: `activity/${dbActivity.id}/image`,
                    body: updatedActivity.image,
                });
                updatedActivity.id = dbActivity.id;
                return dbActivityToActivity(updatedActivity);
            } catch (error) {
                console.warn(error);
            }
        },
        removeActivity: async (activityId: string): Promise<void> => {
            try {
                await executeDelete<Person>({
                    url: `user/activities/${activityId}`,
                });
            } catch (error) {
                console.warn(error);
            }
        },
        update: async (person: Person): Promise<Person> => {
            try {
                const updatedPerson = personToPersonDb(person); 
                const dbPerson = await executePut<Authorization>({
                    url: 'user',
                    body: JSON.stringify(updatedPerson),
                });
                await executePut<Authorization>({
                    url: 'user/image',
                    body: updatedPerson.image,
                });
                return dbPersonToPerson(updatedPerson);
            } catch (error) {
                console.warn(error);
                return undefined;
            };
        },
        addFriend: async (personEmail: string): Promise<Person> => {
            try {
                const userByEmail = await executePost<Person>({
                    url: `user/email`,
                    body: personEmail
                });
                const newFriend = await executePut<Person>({
                    url: `user/friends/${userByEmail.id}`,
                });
                if (newFriend) {
                    return dbPersonToPerson(userByEmail);
                }
                return newFriend;
            } catch (error) {
                console.warn(error);
                return undefined
            }
            
        },
        removeFriend: async (friendId: string): Promise<any> => {
            try {
                await executeDelete<Person>({
                    url: `user/friends/${friendId}`,
                });
            } catch (error) {
                console.warn(error);
            }
        },
        getFriends: async (): Promise<Person[]> => {
            try {
                const people = await executeGet<Person[]>({
                    url: `user/friends`,
                })
                return people.map(p => dbPersonToPerson(p));
            } catch (error) {
                console.warn(error);
                return undefined
            }
        },
        getActivities: async (): Promise<Activity[]> => {
            try {
                const activities = await executeGet<Activity[]>({
                    url: `user/activities`,
                })
                return activities.map(a => dbActivityToActivity(a));
            } catch (error) {
                console.warn(error);
                return undefined
            }
        },
    };

    public place = {
        getById: async (id: string): Promise<Place> => {
            try {
                const place = await executeGet<Place>({
                    url: `place/${id}`,
                });
                if (place) {
                    return dbPlaceToPlace(place);
                }
                return place;
            } catch (error) {
                console.warn(error);
                return undefined
            }
        },
    };
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

export async function executePut<Type>(params: {
    url: string;
    body?: any;
}): Promise<Type> {
    const response = await fetch(`/data-server/${params.url}`, {
        method: 'PUT',
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

export async function executeDelete<Type>(params: {
    url: string;
}): Promise<Type> {
    const response = await fetch(`/data-server/${params.url}`, {
        method: 'DELETE',
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