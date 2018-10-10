import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppDataService } from '../../../services/appDataService';
import { Person } from '../../../models/models';

@Component({
  selector: 'widget-edit-person',
  templateUrl: 'editPerson.html'
})
export class EditPersonWidget {
  @Input() targetPerson?: Person;
  @Input() onSubmit?: (person: Person) => void;
  @Input() onRemove?: (person: Person) => void;
  person: Person;

  constructor(
    public navCtrl: NavController,
    public appDataService: AppDataService,
  ) { }

  public ngOnChanges() {
    if (!this.targetPerson) {
      this.person = {
        name: '',
        fullName: '',
        email: '',
        surname: '',
        image: '',
        preferredActivities: [],
      }
    } else {
      this.person = {...this.targetPerson};
    }
  }

  public onChangeName() {
    this.person.fullName = this.person.name + ' ' + this.person.surname;
  }

  public onSaveEntity() {
    if (!this.onSubmit) { return }
    this.onSubmit(this.person);
  }
}
