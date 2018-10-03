import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ActivitiesPage } from '../activities/activities';
import { PeoplePage } from '../people/people';
import { AppDataService } from '../../services/appDataService';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { AuthorizationPage } from '../authorization/authorization';

@Component({
  selector: 'page-main',
  templateUrl: 'main.html'
})
export class MainPage {
  constructor(
    public navCtrl: NavController,
    public appDataService: AppDataService,
    public navParams: NavParams,
  ) { }

  public ionViewDidEnter() {
    const authorization = this.appDataService.getAuthorization().then(authorization => {
      if (!authorization) {
        this.navCtrl.push(AuthorizationPage);
      }
    });
  }

  public moveToActivities () {
    this.navCtrl.push(ActivitiesPage);  
  }

  public moveToPeople () {
    this.navCtrl.push(PeoplePage);
  }
}
