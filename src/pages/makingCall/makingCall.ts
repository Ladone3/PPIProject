import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Person, Activity, Place } from '../../models/models';
import { AppDataService } from '../../services/appDataService';
import SimpleWebRTC from 'simplewebrtc';
import { ActivitiesPage } from '../activities/activities';
import { PlacesPage } from '../places/places';
import { PeoplePage } from '../people/people';

@Component({
  selector: 'page-making-call',
  templateUrl: 'makingCall.html'
})
export class MakingCallPage {
  @ViewChild('incomingVideo') incomingVideoEl: ElementRef;
  @ViewChild('outgoingVideo') outgoingVideoEl: ElementRef;
  
  public place: Place;
  public activity: Activity;
  public person: Person;
  public textMessage: string = '';
  private webrtc: SimpleWebRTC;

  public isCallActive: boolean = false; 
  public isVideo: boolean = true; 

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

  private getActivity(): Activity {
    const activityId = this.navParams.get('activityId');
    return this.appDataService.getActivityById(activityId);
  }

  private getPlace(): Place {
    const placeId = this.navParams.get('placeId');
    return this.appDataService.getPlaceById(placeId);
  }

  public ionViewDidEnter() {
    requestAnimationFrame(() => {
      this.webrtc = new SimpleWebRTC({
        localVideoEl: this.outgoingVideoEl.nativeElement,
        remoteVideosEl: this.incomingVideoEl.nativeElement,
        autoRequestMedia: true
      });
    });
  }

  public joinCall() {
    const roomId = getRoomId(this.person.id);

    this.isCallActive = !this.isCallActive;
    if (this.isCallActive) {
      this.webrtc.joinRoom(roomId);
    } else {
      this.webrtc.leaveRoom();
    }
  }

  public switchVideo() {
    if (this.isVideo) {
      this.isVideo = false;
      this.webrtc.pauseVideo();
    } else {
      this.isVideo = true;
      this.webrtc.resumeVideo()
    }
  }

  public changeActivity() {
    this.navCtrl.push(ActivitiesPage, {
      personId: this.person.id,
      placeId: this.place.id,
    });
  }

  public changePlace() {
    this.navCtrl.push(PlacesPage, {
      personId: this.person.id,
      activityId: this.activity.id,
    });
  }

  public changePerson() {
    this.navCtrl.push(PeoplePage, {
      activityId: this.activity.id,
      placeId: this.place.id,
    });
  }

  private showError(error) {
    console.log(error)
  }
}

export function getRoomId(userId: string): string {
  return `${userId}~#~roomId`;
}