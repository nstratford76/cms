import { EventEmitter, Injectable, Output } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  @Output() selectedContactEvent = new EventEmitter<Contact>();
  contactChangedEvent = new EventEmitter<Contact[]>();
  contacts: Contact[] = [];
  constructor() {
    this.contacts = MOCKCONTACTS;
   }

  getContacts() {
    return this.contacts.slice();
  }

  getContact(id: string) {
    var value = null;
    this.contacts.forEach(function(contact) {
      if(contact.id === id) {
        value = contact;
      }
    });
    return value;
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }
    const pos = this.contacts.indexOf(contact);
      if (pos < 0) {
        return;
      }
      this.contacts.splice(pos, 1);
      this.contactChangedEvent.emit(this.contacts.slice());
  }
}
