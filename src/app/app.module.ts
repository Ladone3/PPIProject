import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { MainPage } from '../pages/main/main';
import { ActivitiesPage } from '../pages/activities/activities';
import { PeoplePage } from '../pages/people/people';
import { PlacesPage } from '../pages/places/places';
import { MakingCallPage } from '../pages/makingCall/makingCall';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppDataService } from '../services/appDataService';

@NgModule({
  declarations: [
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
