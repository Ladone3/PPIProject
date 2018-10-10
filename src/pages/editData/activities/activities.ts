import { Component, ViewChild, ElementRef, Input, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppDataService } from '../../../services/appDataService';
import { Activity } from '../../../models/models';

@Component({
  selector: 'widget-edit-activities',
  templateUrl: 'activities.html'
})
export class EditActivities implements OnInit {
  public activities: Activity[];
  public newFriendEmail: string;
  public collapsed = true;

  constructor(
    public navCtrl: NavController,
    public appDataService: AppDataService,
  ) { }

  public ngOnInit() {
    if (this.appDataService.authorization) {
      this.activities = this.appDataService.authorization.preferredActivities;
    }
  }

  public onRemoveActivity = (activity: Activity) => {
    this.activities = this.activities.filter(a => a !== activity);
  }

  public onUpdateActivity (activity: Activity) {
    // ...
  }

  public onAddActivity (activity: Activity) {
    this.activities.push({
      name: '',
      image: '',
      preferredPlaces: [],
    });
  }
}
