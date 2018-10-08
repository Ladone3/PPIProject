import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Person, Activity, Place, Vector } from '../../models/models';
import { AppDataService, EMPTY_ACTIVITY } from '../../services/appDataService';
import { MakingCallPage } from '../makingCall/makingCall';
import { ActivitiesPage } from '../activities/activities';
import { PeoplePage } from '../people/people';
import { Circle, placeToCircle, onDragStart, getCircleFromRef, hitTest } from '../../utils/utils';
import { AuthorizationPage } from '../authorization/authorization';

@Component({
  selector: 'page-places',
  templateUrl: 'places.html'
})
export class PlacesPage {
  @ViewChild('placesList') placesListHTML: ElementRef;
  @ViewChild('dropZone') dropZoneHTML: ElementRef;

  public dropZoneIsActive: boolean = false;

  public places: Circle<Place>[];
  public activity: Activity;
  public person: Person;
  public selectedPlace: Place;

  constructor(
    public navCtrl: NavController,
    public appDataService: AppDataService,
    public navParams: NavParams,
  ) { }

  public ionViewWillEnter() {
    if (!this.appDataService.authorization) {
      this.navCtrl.push(AuthorizationPage);
    }
    
    Promise.all([
      this.getActivity(),
      this.getPerson(),
      this.getPlaces(),
    ]).then(([activity, person, places]) => {
      this.person = person;
      this.activity = activity;
      this.places = placeToCircle(places);
    }).catch(this.showError);
  }

  private getPerson(): Promise<Person> {
    const personId = this.navParams.get('personId');
    return this.appDataService.getPersonById(personId);
  }

  public changePerson() {
    this.navCtrl.push(PeoplePage, {
      activityId: this.activity.id,
    });
  }

  private async getActivity(): Promise<Activity> {
    const activityId = this.navParams.get('activityId');
    if (activityId === EMPTY_ACTIVITY.id) {
      return EMPTY_ACTIVITY;
    }
    return this.appDataService.getActivityById(activityId);
  }

  public changeActivity() {
    this.navCtrl.push(ActivitiesPage, {
      personId: this.person.id,
    });
  }

  private getPlaces(): Promise<Place[]> {
    const personId = this.navParams.get('personId');
    const activityId = this.navParams.get('activityId');
    
    return this.appDataService
      .getPlaceForActivityAndPerson(activityId, personId);
  }

  public onPlaceClick(event: (MouseEvent | TouchEvent), place: Place | undefined) {
    this.selectedPlace = place;
    event.stopPropagation();
  }

  public onSelectPlace(place: Place) {
    this.navCtrl.push(MakingCallPage, {
      activityId: this.activity.id,
      personId: this.person.id,
      placeId: place.id,
    });
  }

  public onPlaceMouseDown(event: (MouseEvent | TouchEvent), circle: Circle<Place>) {
    const defaultOffset = this.placesListHTML.nativeElement.offsetLeft;
    const dropZoneCircle = getCircleFromRef(this.dropZoneHTML);
    const pointProvider = event instanceof MouseEvent ? event : event.touches[0];

    let startX;
    circle.radius = (event.target as HTMLElement).clientWidth / 2;
    if (pointProvider.pageX) startX = pointProvider.pageX - defaultOffset - circle.radius;
    else if (pointProvider.clientX) startX = pointProvider.clientX - defaultOffset - circle.radius;

    circle.isDragged = true;
    circle.position = {
      x: startX,
      y: 0,
    }
    

    onDragStart(event, (diff: Vector) => {
      circle.position = {
        x: circle.position.x + diff.x,
        y: 0,
      }
      if (hitTest(circle, dropZoneCircle)) {
        this.dropZoneIsActive = true;
      } else {
        this.dropZoneIsActive = false;
      }
    }, () => {
      circle.isDragged = false;
      if (hitTest(circle, dropZoneCircle)) {
        this.onSelectPlace(circle.ref);
        this.dropZoneIsActive = false;
      }
    });
  }

  private showError(error) {
    console.log(error)
  }
}
