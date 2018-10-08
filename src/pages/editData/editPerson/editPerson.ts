import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppDataService } from '../../../services/appDataService';
import { Person } from '../../../models/models';

let idCounter = 0;

@Component({
  selector: 'page-edit-person',
  templateUrl: 'editPerson.html'
})
export class EditPersonPage {
  @Input() personId: string;
  @Input() newEntity?: boolean;
  public person: Person;

  constructor(
    public navCtrl: NavController,
    public appDataService: AppDataService,
  ) { }

  public ngOnChanges() {
    if (this.newEntity) {
      this.person = {
        id: 'TemporalId' + idCounter,
        name: '',
        fullName: '',
        foreignId: 'TemporalForeignId' + (idCounter++),
        email: '',
        surname: '',
        image: '',
        preferredActivities: [],
      }
    } else {
      this.appDataService.getPersonById(this.personId).then((person) => {
        this.person = person;
      });
    }
  }

  public onChangeName() {
    this.person.fullName = this.person.name + ' ' + this.person.surname;
  }

  public onSaveEntity() {
    // ...
  }
}
