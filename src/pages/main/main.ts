import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ActivitiesPage } from '../activities/activities';
import { PeoplePage } from '../people/people';

@Component({
  selector: 'page-main',
  templateUrl: 'main.html'
})
export class MainPage {
  constructor(public navCtrl: NavController) {
  }

  public moveToActivities () {
    this.navCtrl.push(ActivitiesPage);  
  }

  public moveToPeople () {
    this.navCtrl.push(PeoplePage);
  }
}
