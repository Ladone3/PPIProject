import { Injectable } from '@angular/core';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { Person, Activity } from '../models/models';

@Injectable()
export class AppDataService {

    constructor() { }

    public getPeople(): Promise<Person[]> {
        return Promise.resolve([
            {
                name: 'Armagan',
                image: 'assets/imgs/people/Armagan.jpg',
            },
            {
                name: 'Guillermo Benito Ruiz',
                image: 'assets/imgs/people/Guillermo_Benito_Ruiz.jpg',
            },
            {
                name: 'Unnamed One',
                image: 'assets/imgs/people/image1.jpg',
            },
            {
                name: 'Unnamed Two',
                image: 'assets/imgs/people/image2.jpg',
            },
            {
                name: 'Unnamed Three',
                image: 'assets/imgs/people/image3.jpg',
            },
            {
                name: 'Unnamed Four',
                image: 'assets/imgs/people/image4.jpg',
            },
        ]);
    }

    public getContacts(): Promise<Person[]>{
      let persons : Person[];
      function process(contacts) {
        for (let i = 0; i < contacts.length; i++) {
          const contact = contacts[i];
          persons.push(
            {
              name: contact.fieldType.displayName,
              image: contact.fieldType.photos[0],
            }
          );
        }
        return Promise.resolve(persons);
      }
      let fields       = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name, navigator.contacts.fieldType.photos];
      return process(navigator.contacts.find(fields, null, null, null));
    }

    public getActivities(): Promise<Activity[]> {
        return Promise.resolve([
            {
                name: 'Cycling',
                image: 'assets/imgs/activities/cycling.png',
            },
            {
                name: 'Horse riding',
                image: 'assets/imgs/activities/horse_riding.png',
            },
            {
                name: 'Running',
                image: 'assets/imgs/activities/running.png',
            }, {
                name: 'Surfing',
                image: 'assets/imgs/activities/surfing.png',
            },
            {
                name: 'Swimming',
                image: 'assets/imgs/activities/swimming.png',
            },
            {
                name: 'Walking dog',
                image: 'assets/imgs/activities/walking_dog.png',
            }, {
                name: 'Walking',
                image: 'assets/imgs/activities/walking.png',
            },
        ]);
    }
}
