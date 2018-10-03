import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppDataService } from '../../services/appDataService';

@Component({
  selector: 'page-edit-data',
  templateUrl: 'editData.html'
})
export class EditDataPage {
  constructor(
    public navCtrl: NavController,
    public appDataService: AppDataService,
  ) { }

  public ionViewDidEnter() {

  }
}
