import { Component, ViewChild, ElementRef, Input, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppDataService } from '../../../services/appDataService';
import { Person } from '../../../models/models';

let idCounter = 0;

@Component({
  selector: 'widget-edit-friends',
  templateUrl: 'friends.html'
})
export class EditFriends implements OnInit {
  public friends: Person[];
  public newFriendEmail: string;

  constructor(
    public navCtrl: NavController,
    public appDataService: AppDataService,
  ) { }

  public ngOnInit() {
    this.appDataService.getPeople().then(people => {
      this.friends = people;
    });
  }

  public onRemoveFriend = (person: Person) => {
    this.friends = this.friends.filter(p => p !== person);
  }

  public onAddFriend () {

  }
}
