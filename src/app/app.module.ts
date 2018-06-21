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
import { ChatPage } from '../pages/audioVideoChat/audioVideoChat';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppDataService } from '../services/appDataService';

@NgModule({
  declarations: [
    AuthorizationPage,
    MainPage,
    ActivitiesPage,
    PeoplePage,
    PlacesPage,
    MakingCallPage,
    ChatPage,
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AuthorizationPage,
    MainPage,
    ActivitiesPage,
    PeoplePage,
    PlacesPage,
    MakingCallPage,
    ChatPage,
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
