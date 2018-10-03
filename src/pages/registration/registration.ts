import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Authorization } from '../../models/models'
import { MainPage } from '../main/main';
import { AppDataService } from '../../services/appDataService';
import { NavParams } from 'ionic-angular/navigation/nav-params';

export enum AUTHORIZATION_STATUS {
  REGISTERED,
  NOT_REGISTERED,
  REGISTRATION_ERROR,
};

@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html'
})
export class RegistrationPage {
  public username: string = '';
  public password: string = '';
  public approvePassword: '';
  public status: AUTHORIZATION_STATUS = AUTHORIZATION_STATUS.NOT_REGISTERED; 

  constructor(
    public navCtrl: NavController,
    public appDataService: AppDataService,
    public navParams: NavParams,
  ) { }

  public ionViewDidEnter() {
    this.username = this.navParams.get('username');
    this.password = this.navParams.get('password');
  }

  public onPressSignUp () {
    if (this.passwordsNotEqual()) {
      return;
    }
    const authorities = {
      username: this.username,
      password: this.password,
    };
    this.appDataService.registerUser(authorities)
      .then(this.onRegistrationCompleted)
      .catch(this.onRegistrationError);
  }

  public passwordsNotEqual () {
    return this.password !== this.approvePassword;
  }

  private onRegistrationCompleted = (authorization: Authorization) => {
  this.status = AUTHORIZATION_STATUS.REGISTERED;
    this.navCtrl.push(MainPage);
  };

  private onRegistrationError = (error) => {
    console.error(error);
    this.status = AUTHORIZATION_STATUS.REGISTRATION_ERROR;
  };
}
