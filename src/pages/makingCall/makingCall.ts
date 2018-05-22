import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Person, Activity, Place } from '../../models/models';
import { AppDataService } from '../../services/appDataService';
import { PeoplePage } from '../people/people';
import { ActivitiesPage } from '../activities/activities';
import { PlacesPage } from '../places/places';

@Component({
  selector: 'page-making-call',
  templateUrl: 'makingCall.html'
})
export class MakingCallPage { 
  public place: Place;
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
      this.getPlace(),
    ]).then(([activity, person, place]) => {
      this.person = person;
      this.activity = activity;
      this.place = place;
    }).catch(this.showError);
  }

  private getPerson(): Person {
    const personId = this.navParams.get('personId');
    return this.appDataService.getPersonById(personId);
  }

  public changePerson() {
    this.navCtrl.push(PeoplePage, {
      activityId: this.activity.id,
      placeId: this.place.id,
    });
  }

  private getActivity(): Activity {
    const activityId = this.navParams.get('activityId');
    return this.appDataService.getActivityById(activityId);
  }

  public changeActivity() {
    this.navCtrl.push(ActivitiesPage, {
      personId: this.person.id,
      placeId: this.place.id,
    });
  }

  private getPlace(): Place {
    const placeId = this.navParams.get('placeId');
    return this.appDataService.getPlaceById(placeId);
  }

  public changePlace() {
    this.navCtrl.push(PlacesPage, {
      personId: this.person.id,
      activityId: this.activity.id,
    });
  }

  public makeSimpleCall() {
    alert('Phone call: function not implemented yet!');
  }

  public makeVideoCall() {
    alert('Video call: function not implemented yet!');
  }

  public sendTextMessage() {
    alert('Video call: function not implemented yet!');
  }

  private showError(error) {
    console.log(error)
  }
}
