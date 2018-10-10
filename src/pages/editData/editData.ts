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
    if (!this.appDataService.authorization) {
      this.navCtrl.push(AuthorizationPage);
    }
    this.user = this.appDataService.authorization;
  }

  public onSaveUserData(userData: Person) {
    this.appDataService.updatePerson(userData);
  }
}
