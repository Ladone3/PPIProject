import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Person, Activity, Place } from '../../models/models';
import { AppDataService } from '../../services/appDataService';
import { MakingCallPage } from '../makingCall/makingCall';
import { ActivitiesPage } from '../activities/activities';
import { PeoplePage } from '../people/people';

@Component({
  selector: 'page-places',
  templateUrl: 'places.html'
})
export class PlacesPage { 
  public places: Place[];
  public activity: Activity;
  public person: Person;

  constructor(
    public navCtrl: NavController,
    public appDataService: AppDataService,
    public navParams: NavParams,
  ) { }

  public ionViewWillEnter() {
    Promise.all([
      this.getActivity(),
      this.getPerson(),
      this.getPlaces(),
    ]).then(([activity, person, places]) => {
      this.person = person;
      this.activity = activity;
      this.places = places;
    }).catch(this.showError);
  }

  private getPerson(): Person {
    const personId = this.navParams.get('personId');
    return this.appDataService.getPersonById(personId);
  }

  public changePerson() {
    this.navCtrl.push(PeoplePage, {
      activityId: this.activity.id,
    });
  }

  private getActivity(): Activity {
    const activityId = this.navParams.get('activityId');
    return this.appDataService.getActivityById(activityId);
  }

  public changeActivity() {
    this.navCtrl.push(ActivitiesPage, {
      personId: this.person.id,
    });
  }

  private getPlaces(): Place[] {
    const personId = this.navParams.get('personId');
    const activityId = this.navParams.get('activityId');
    
    return this.appDataService
      .getPlaceForActivityAndPerson(activityId, personId);
  }

  public onSelectPlace(place: Place) {
    this.navCtrl.push(MakingCallPage, {
      activityId: this.activity.id,
      personId: this.person.id,
      placeId: place.id,
    });
  }

  private showError(error) {
    console.log(error)
  }
}
