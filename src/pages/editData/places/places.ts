import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppDataService } from '../../../services/appDataService';
import { Place } from '../../../models/models';

@Component({
  selector: 'widget-edit-places',
  templateUrl: 'places.html'
})
export class EditPlaces {
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
  }

  public onUpdatePlace (place: Place) {
    // ...
  }

  public onAddPlace (place: Place) {
    this.places.push({
      name: '',
      image: '',
    })
  }
}
