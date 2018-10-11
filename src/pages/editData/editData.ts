import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppDataService } from '../../services/appDataService';
import { Person } from '../../models/models';
import { AuthorizationPage } from '../authorization/authorization';

@Component({
  selector: 'page-edit-data',
  templateUrl: 'editData.html'
})
export class EditDataPage {
  public user: Person;
  constructor(
    public navCtrl: NavController,
    public appDataService: AppDataService,
  ) { }

  public ionViewDidEnter() {
    const currentUser = this.appDataService.currentUser;
    if (!currentUser) {
      this.navCtrl.push(AuthorizationPage);
    }
    this.user = currentUser;
  }

  public onSaveUserData(userData: Person) {
    this.appDataService.person.update(userData);
    this.appDataService.currentUser = userData;
  }
}
