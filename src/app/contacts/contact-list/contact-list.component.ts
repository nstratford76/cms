import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {Contact} from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit, OnDestroy {
  term: string = "";
  private subsciption: Subscription;
  contacts: Contact[];


  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
    this.subsciption = this.contactService.contactListChangedEvent.subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts;
      }
    )
    this.contactService.getContacts();

  }

  onSelected(contact: Contact) {
    this.contactService.selectedContactEvent.emit(contact);
  }

  ngOnDestroy(): void {
    this.subsciption.unsubscribe();
  }

  search(value: string) {
    this.term = value;
    console.log(this.term);
  }

}
