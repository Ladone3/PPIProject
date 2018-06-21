import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Person, Activity, Place, CHAT_MODE } from '../../models/models';
import { AppDataService } from '../../services/appDataService';
import { PeoplePage } from '../people/people';
import { ActivitiesPage } from '../activities/activities';
import { PlacesPage } from '../places/places';
import { ChatPage } from '../audioVideoChat/audioVideoChat';

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
    this.navCtrl.push(ChatPage, {
      activityId: this.activity.id,
      personId: this.person.id,
      placeId: this.place.id,
      chatMode: CHAT_MODE.AUDIO,
    });
  }

  public makeVideoCall() {
    this.navCtrl.push(ChatPage, {
      activityId: this.activity.id,
      personId: this.person.id,
      placeId: this.place.id,
      chatMode: CHAT_MODE.VIDEO,
    });
  }

  public sendTextMessage() {
    this.navCtrl.push(ChatPage, {
      activityId: this.activity.id,
      personId: this.person.id,
      placeId: this.place.id,
      chatMode: CHAT_MODE.TEXT,
    });
  }

  private showError(error) {
    console.log(error)
  }
}
