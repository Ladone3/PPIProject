import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Authorities } from '../../models/models'
import { MainPage } from '../main/main';
import { AppDataService } from '../../services/appDataService';
import { RegistrationPage } from '../registration/registration';

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
  public username: string = 'user1@mail.com'; // 'ladone3@gmail.com'
  public password: string = 'q12345678';
  public status: AUTHORIZATION_STATUS = AUTHORIZATION_STATUS.NOT_AUTHORIZED; 

  constructor(
    public navCtrl: NavController,
    public appDataService: AppDataService,
  ) {

  }

  public ionViewDidEnter() {
    this.appDataService.autorization.getAuthorization().then(authorization => {
      if (authorization) {
        this.onAuthorizationCompleted();
      } else {
        console.log(`No authorization!`);
      }
    });
  }

  public onPressSignIn (social?: 'google' | 'facebook') {
    const authorities: Authorities = {
      username: this.username,
      password: this.password,
      social,
    };
    this.appDataService.autorization.authorize(authorities)
      .then(this.onAuthorizationCompleted)
      .catch(this.onAuthorizationError);
  }

  public onPressSignUp () {
    const curInput = {
      username: this.username,
      password: this.password,
    };
    this.navCtrl.push(RegistrationPage, curInput);
  }

  private onAuthorizationCompleted = () => {
    this.status = AUTHORIZATION_STATUS.AUTHORIZED;
    const previous = this.navCtrl.getPrevious();
    if (previous) {
      this.navCtrl.pop();
    } else {
      this.navCtrl.push(MainPage);
    }
  };

  private onAuthorizationError = (error) => {
    console.error(error);
    this.status = AUTHORIZATION_STATUS.AUTHORIZATION_ERROR;
  };
}
