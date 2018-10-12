import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppDataService } from '../../services/appDataService';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { AuthorizationPage } from '../authorization/authorization';
import { ActivitiesWidget } from '../../widgets/activities/activities';
import { PeopleWidget } from '../../widgets/people/people';
import { Person, Activity, Place } from '../../models/models';
import { MakingCallPage } from '../makingCall/makingCall';

@Component({
  selector: 'page-main',
  templateUrl: 'main.html'
})
export class MainPage {
  public person: Person;
  public activity: Activity;
  public place: Place;

  constructor(
    public navCtrl: NavController,
    public appDataService: AppDataService,
    public navParams: NavParams,
  ) { }

  public ionViewDidEnter() {
    if (!this.appDataService.currentUser) {
      this.navCtrl.push(AuthorizationPage);
    }
  }

  public onMakeCall() {
    this.navCtrl.push(MakingCallPage, {
      personId: this.person.id,
      activityId: this.activity.id,
      placeId: this.place.id,
    })
  }

  public onPersonChanged(person: Person) {
    this.person = person;
  }

  public onActivityChanged(activity: Activity) {
    this.activity = activity;
  }

  public onPlaceChanged(place: Place) {
    this.place = place;
  }
}
