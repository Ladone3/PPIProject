import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { MainPage } from '../pages/main/main';
import { ActivitiesPage } from '../pages/activities/activities';
import { PeoplePage } from '../pages/people/people';

import { AboutPage } from '../pages/about/about';
import { CustomPage } from '../pages/customPage/customPage';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppDataService } from '../services/appDataService';

@NgModule({
  declarations: [
    MainPage,
    ActivitiesPage,
    PeoplePage,
    
    MyApp,
    AboutPage,
    ContactPage,
    CustomPage,
    HomePage,
    TabsPage
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

    MyApp,
    AboutPage,
    ContactPage,
    CustomPage,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AppDataService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
