import { Activity, Place, Person } from "../models/models";

export function getImageBase64(bytes?: string): string {
  if (!bytes) {
    return undefined;
  }
  return `data:image/png;base64,${bytes}`;
}

export function compileActivity(activity: Activity): void {
  activity.image = getImageBase64(activity.image);
  for (const place of activity.preferredPlaces) {
      compilePlace(place);
  }
}

export function compilePlace(place: Place): void {
  place.image = getImageBase64(place.image);
}

export function compilePerson(person: Person): void {
  person.image = getImageBase64(person.image);
  person.preferredActivities
  person.fullName = person.name + ' ' + person.surname;
  for (const activity of person.preferredActivities) {
    compileActivity(activity);
  }
}