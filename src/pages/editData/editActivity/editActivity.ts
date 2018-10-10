import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppDataService } from '../../../services/appDataService';
import { Activity } from '../../../models/models';

@Component({
  selector: 'widget-edit-activity',
  templateUrl: 'editActivity.html'
})
export class EditActivityWidget {
  @Input() targetActivity: Activity;
  @Input() onSubmit?: (activity: Activity) => void;
  @Input() onRemove?: (activity: Activity) => void;
  public activity: Activity;

  constructor(
    public navCtrl: NavController,
    public appDataService: AppDataService,
  ) { }

  public ngOnChanges() {
    this.activity = {...this.targetActivity}
  }

  public onSaveEntity() {
    if (!this.onSubmit) { return }
    this.onSubmit(this.activity);
  }
}
