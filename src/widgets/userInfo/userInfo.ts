import { Component } from '@angular/core';
import { Authorization } from '../../models/models'
import { AppDataService } from '../../services/appDataService';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { AuthorizationPage } from '../../pages/authorization/authorization';
import { EditDataPage } from '../../pages/editData/editData';

@Component({
  selector: 'user-info',
  templateUrl: 'userInfo.html'
})
export class UserInfo {
  constructor(
    public appDataService: AppDataService,
    public navCtrl: NavController,
  ) { }

  public get authorization() {
    return this.appDataService.authorization;
  }

  public onLogout(event: MouseEvent) {
    event.stopPropagation();
    this.appDataService.logout().then(() => {
      this.navCtrl.push(AuthorizationPage);
    });
  }

  public editUserInfo() {
    this.navCtrl.push(EditDataPage);
  }
}
