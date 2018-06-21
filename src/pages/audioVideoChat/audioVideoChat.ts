import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Person, Activity, Place, CHAT_MODE } from '../../models/models';
import { AppDataService } from '../../services/appDataService';
// import { PeoplePage } from '../people/people';
// import { ActivitiesPage } from '../activities/activities';
// import { PlacesPage } from '../places/places';

interface ChatMessage {
  senderId: string;
  senderName: string;
  text: string;
};

@Component({
  selector: 'page-chat',
  templateUrl: 'audioVideoChat.html'
})
export class ChatPage { 
  public place: Place;
  public activity: Activity;
  public person: Person;
  public chatMode: CHAT_MODE;
  public messages: ChatMessage[] = [
    { senderId: 'Person', senderName: 'Person', text: 'Hello! How are you doing?' },
    { senderId: 'You', senderName: 'You', text: 'I\'m fine! Hello! And How are you doing?' },
    { senderId: 'Person', senderName: 'Person', text: 'Let\'s connect?' },
    { senderId: 'You', senderName: 'You', text: 'Let\'s connect!' },
  ];

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
      this.chatMode = this.navParams.get('chatMode');
    }).catch(this.showError);
  }

  public get isVideoChat () { return this.chatMode === CHAT_MODE.VIDEO }
  public get isAudioChat () { return this.chatMode === CHAT_MODE.AUDIO }
  public get isTextChat () { return this.chatMode === CHAT_MODE.TEXT }

  private getPerson(): Person {
    const personId = this.navParams.get('personId');
    return this.appDataService.getPersonById(personId);
  }

  private getActivity(): Activity {
    const activityId = this.navParams.get('activityId');
    return this.appDataService.getActivityById(activityId);
  }

  private getPlace(): Place {
    const placeId = this.navParams.get('placeId');
    return this.appDataService.getPlaceById(placeId);
  }

  // public changeActivity() {
  //   this.navCtrl.push(ActivitiesPage, {
  //     personId: this.person.id,
  //     placeId: this.place.id,
  //   });
  // }

  // public changePlace() {
  //   this.navCtrl.push(PlacesPage, {
  //     personId: this.person.id,
  //     activityId: this.activity.id,
  //   });
  // }

  // public changePerson() {
  //   this.navCtrl.push(PeoplePage, {
  //     activityId: this.activity.id,
  //     placeId: this.place.id,
  //   });
  // }

  private showError(error) {
    console.log(error)
  }
}
