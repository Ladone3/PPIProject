import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppDataService } from '../../../services/appDataService';
import { Place } from '../../../models/models';

@Component({
  selector: 'widget-edit-place',
  templateUrl: 'editPlace.html'
})
export class EditPlaceWidget {
  @Input() targetPlace: Place;
  @Input() onSubmit?: (place: Place) => void;
  @Input() onRemove?: (place: Place) => void;
  public place: Place;

  constructor(
    public navCtrl: NavController,
    public appDataService: AppDataService,
  ) { }

  public ngOnChanges() {
    this.place = {...this.targetPlace}
  }

  public onSaveEntity() {
    if (!this.onSubmit) { return }
    this.onSubmit(this.place);
  }
}
