import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Authorization, Authorities } from '../../models/models'
import { MainPage } from '../main/main';
import { AppDataService } from '../../services/appDataService';

export enum AUTHORIZATION_STATUS {
  AUTHORIZED,
  NOT_AUTHORIZED,
  AUTHORIZATION_ERROR,
};

@Component({
  selector: 'page-authorization',
  templateUrl: 'authorization.html'
})
export class AuthorizationPage {
  public username: '';
  public password: '';
  public status: AUTHORIZATION_STATUS = AUTHORIZATION_STATUS.NOT_AUTHORIZED; 

  constructor(
    public navCtrl: NavController,
    public appDataService: AppDataService,
  ) {

  }

  public ionViewDidEnter() {
    this.appDataService.getAuthorization()
      .then(this.onAuthorizationCompleted)
      .catch(() => console.log(`No authorization!`));
  }

  public onPressLogin () {
    const authorities = {
      username: this.username,
      password: this.password,
    };
    this.appDataService.authorize(authorities)
      .then(this.onAuthorizationCompleted)
      .catch(this.onAuthorizationError);
  }

  private onAuthorizationCompleted = (authorization: Authorization) => {
    this.status = AUTHORIZATION_STATUS.AUTHORIZED;
    this.navCtrl.push(MainPage);
  };

  private onAuthorizationError = (error) => {
    console.error(error);
    this.status = AUTHORIZATION_STATUS.AUTHORIZATION_ERROR;
  };
}
