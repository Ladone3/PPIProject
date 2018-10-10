import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AuthorizationPage } from '../pages/authorization/authorization';
import { MainPage } from '../pages/main/main';
import { ActivitiesPage } from '../pages/activities/activities';
import { PeoplePage } from '../pages/people/people';
import { PlacesPage } from '../pages/places/places';
import { MakingCallPage } from '../pages/makingCall/makingCall';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppDataService } from '../services/appDataService';
import { RegistrationPage } from '../pages/registration/registration';
import { UserInfo } from '../widgets/userInfo/userInfo';
import { EditDataPage } from '../pages/editData/editData';
import { EditPersonWidget } from '../pages/editData/editPerson/editPerson';
import { EditFriends } from '../pages/editData/friends/friends';
import { EditActivities } from '../pages/editData/activities/activities';
import { EditActivityWidget } from '../pages/editData/editActivity/editActivity';
import { EditPlaces } from '../pages/editData/places/places';
import { EditPlaceWidget } from '../pages/editData/editPlace/editPlace';

@NgModule({
  declarations: [
    UserInfo,
    EditDataPage,
    EditPersonWidget,
    EditFriends,
    EditActivities,
    EditActivityWidget,
    EditPlaces,
    EditPlaceWidget,
    AuthorizationPage,
    RegistrationPage,
    MainPage,
    ActivitiesPage,
    PeoplePage,
    PlacesPage,
    MakingCallPage,
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AuthorizationPage,
    EditPersonWidget,
    EditDataPage,
    EditFriends,
    EditActivities,
    EditActivityWidget,
    EditPlaces,
    EditPlaceWidget,
    RegistrationPage,
    MainPage,
    ActivitiesPage,
    PeoplePage,
    PlacesPage,
    MakingCallPage,
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AppDataService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
