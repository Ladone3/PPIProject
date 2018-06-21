import { Person, Activity, Place } from '../models/models';

export const PEOPLE: Person[] = [
    {
        id: 'person-1',
        name: 'Armagan',
        image: 'assets/imgs/people/Armagan.jpg',
        fullName: 'Armagan',
        description: 'Description Text Description Text Description Text Description Text'
    },
    {
        id: 'person-2',
        name: 'Guillermo Benito Ruiz',
        image: 'assets/imgs/people/Guillermo_Benito_Ruiz.jpg',
        fullName: 'Guillermo Benito Ruiz',
        description: 'Description Text Description Text Description Text Description Text'
    },
    {
        id: 'person-3',
        name: 'Unnamed One',
        image: 'assets/imgs/people/image1.jpg',
        fullName: 'Unnamed One',
        description: 'Description Text Description Text Description Text Description Text'
    },
    {
        id: 'person-4',
        name: 'Unnamed Two',
        image: 'assets/imgs/people/image2.jpg',
        fullName: 'Unnamed Two',
        description: 'Description Text Description Text Description Text Description Text'
    },
    {
        id: 'person-5',
        name: 'Unnamed Three',
        image: 'assets/imgs/people/image3.jpg',
        fullName: 'Unnamed Three',
        description: 'Description Text Description Text Description Text Description Text'
    },
    {
        id: 'person-6',
        name: 'Unnamed Four',
        image: 'assets/imgs/people/image4.jpg',
        fullName: 'Unnamed Four',
        description: 'Description Text Description Text Description Text Description Text'
    },
];

export const PLACES: Place[] = [
    {
        id: 'place-1',
        name: 'Deers Castle',
        image: 'assets/imgs/places/deersCastle.jpg',
        description: 'Description Text Description Text Description Text Description Text'

    },
    {
        id: 'place-2',
        name: 'Сats care',
        image: 'assets/imgs/places/catsCare.jpg',
        description: 'Description Text Description Text Description Text Description Text'

    },
    {
        id: 'place-3',
        name: 'Cockglode-wood',
        image: 'assets/imgs/places/cockglode-wood.jpg',
        description: 'Description Text Description Text Description Text Description Text'

    },
    {
        id: 'place-4',
        name: 'Charity place',
        image: 'assets/imgs/places/image.jpg',
        description: 'Description Text Description Text Description Text Description Text'

    },
    {
        id: 'place-5',
        name: 'Nottingham canal Red Cow',
        image: 'assets/imgs/places/nottingham_canal.jpg',
        description: 'Description Text Description Text Description Text Description Text'

    },
    {
        id: 'place-6',
        name: 'Charity place two',
        image: 'assets/imgs/places/image2.jpg',
        description: 'Description Text Description Text Description Text Description Text'
    },
];

export const ACTIVITIES: Activity[] = [
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

export const ACTIVITY_PLACE: { [activityId: string]: Place[] } = {
    'activity-1': [
        PLACES[0],
        PLACES[2],
        PLACES[4],
    ],
    'activity-2': [
        PLACES[0],
        PLACES[2],
    ],
    'activity-3': [
        PLACES[0],
        PLACES[2],
        PLACES[4],
    ],
    'activity-4': [
        PLACES[0],        
        PLACES[4],
    ],
    'activity-5': [
        PLACES[0],        
        PLACES[4],
    ],
    'activity-6':  [
        PLACES[0],
        PLACES[2],
        PLACES[4],
    ],
    'activity-7': PLACES,
};

export const PERSON_PLACE: { [personId: string]: Place[] } = {
    'person-1': [
        PLACES[0],        
        PLACES[5],
        PLACES[2],
        PLACES[4],
    ],
    'person-2': [
        PLACES[0],
        PLACES[2],
    ],
    'person-3': [
        PLACES[0],
        PLACES[2],
        PLACES[1],
    ],
    'person-4': [
        PLACES[4],
        PLACES[0],
    ],
    'person-5': [
        PLACES[0],        
        PLACES[1],
        PLACES[5],
        PLACES[3],
    ],
    'person-6':  [
        PLACES[0],
        PLACES[2],
    ],
};

