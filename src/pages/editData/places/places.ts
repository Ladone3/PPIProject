import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppDataService } from '../../../services/appDataService';
import { Place } from '../../../models/models';

@Component({
  selector: 'widget-edit-places',
  templateUrl: 'places.html'
})
export class EditPlaces {
  @Input() activityId: string;
  @Input() places: Place[];
  public newFriendEmail: string;
  public collapsed = true;

  constructor(
    public navCtrl: NavController,
    public appDataService: AppDataService,
  ) {
    
  }

  public onRemovePlace = (place: Place) => {
    this.places = this.places.filter(p => p !== place);
    this.appDataService.activity.removePlace(this.activityId, place.id);
  }

  public onSavePlace = (place: Place) => {
    if (place.id) { // update not implemented
      // ...
    } else {
      this.appDataService.activity.addPlace(this.activityId, place).then(newPlace => {
        place.id = newPlace.id;
      });
    }
  }

  public onAddPlace (place: Place) {
    this.places.push({
      name: '',
      image: '',
    })
  }
}
