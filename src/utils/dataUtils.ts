import { Activity, Place, Person } from "../models/models";

const PREFIX = 'data:image/png;base64,';

export function getImageBase64(bytes?: string): string {
  if (!bytes) {
    return undefined;
  }
  return `${PREFIX}${bytes}`;
}


export function dbActivityToActivity(dbActivity: Activity): Activity {
  return {
    ...dbActivity,
    image: getImageBase64(dbActivity.image),
    preferredPlaces: dbActivity.preferredPlaces.map(dbPlace => dbPlaceToPlace(dbPlace)),
  };
}

export function dbPlaceToPlace(dbPlace: Place): Place {
  return {
    ...dbPlace,
    image: getImageBase64(dbPlace.image),
  }
}

export function dbPersonToPerson(dbPerson: Person): Person {
  return {
    ...dbPerson,
    fullName: `${dbPerson.name} ${dbPerson.surname}`, 
    image: getImageBase64(dbPerson.image),
    preferredActivities: dbPerson.preferredActivities.map(dbActivity => dbActivityToActivity(dbActivity)),
  };
}

export function getImageBytes(imageBase64?: string): Blob {
  if (!imageBase64) {
    return undefined;
  }
  return dataURLToBlob(imageBase64);
}

export function placeToPlaceDb(place: Place): Place {
  return {
    ...place,
    image: getImageBytes(place.image),
  }
}

export function activityToActivityDb(activity: Activity): Activity {
  return {
    ...activity,
    image: getImageBytes(activity.image),
    preferredPlaces: activity.preferredPlaces.map(place => placeToPlaceDb(place)),
  };
}

export function personToPersonDb(person: Person): Person {
  return {
    ...person,
    image: getImageBytes(person.image),
    preferredActivities: person.preferredActivities.map(person => activityToActivityDb(person)),
  };
}


export function dataURLToBlob(dataURL: string): Blob {
  const BASE64_MARKER = ';base64,';
  let blob;
  if (dataURL.indexOf(BASE64_MARKER) === -1) {
      const parts = dataURL.split(',');
      const contentType = parts[0].split(':')[1];
      const raw = decodeURIComponent(parts[1]);

      blob = new Blob([raw], {type: contentType});
  } else {
      const parts = dataURL.split(BASE64_MARKER);
      const contentType = parts[0].split(':')[1];
      const raw = window.atob(parts[1]);
      const rawLength = raw.length;

      const uInt8Array = new Uint8Array(rawLength);

      for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
      }

      blob = new Blob([uInt8Array], {type: contentType});
  }
  blob.toJSON = function () {
    return '';
  }
  return blob;
}