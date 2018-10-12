import { Component, ViewChild, ElementRef, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Person, Activity, Place, Vector } from '../../models/models';
import { AppDataService, EMPTY_ACTIVITY } from '../../services/appDataService';
import { Circle, placeToCircle, onDragStart, getCircleFromRef, hitTest } from '../../utils/utils';
import { MakingCallPage } from '../../pages/makingCall/makingCall';

@Component({
  selector: 'widget-places',
  templateUrl: 'places.html'
})
export class PlacesWidget implements OnChanges {
  @Input() activity: Activity;
  @Input() person: Person;
  @Output() place = new EventEmitter<Place>();

  public places: Circle<Place>[];
  public selectedPlace: Place;

  constructor(
    public navCtrl: NavController,
    public appDataService: AppDataService,
    public navParams: NavParams,
  ) { }

  public ngOnChanges() {    
    this.getPlaces().then(places => {
      this.places = places ? placeToCircle(places) : undefined;
    }).catch(this.showError);
  }

  private getPlaces(): Promise<Place[]> {
    if (this.activity) {
      return Promise.resolve(this.activity.preferredPlaces); 
      //return this.appDataService.activity.getPlaces(this.activity.id);
    } else {
      return Promise.resolve(undefined); 
    }
  }

  public onPlaceClick(event: (MouseEvent | TouchEvent), place: Place | undefined) {
    this.selectedPlace = place;
    this.place.emit(place);
    event.stopPropagation();
  }

  private showError(error) {
    console.log(error)
  }
}
