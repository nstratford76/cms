import { EventEmitter, Injectable, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  maxContactId: number;
  @Output() selectedContactEvent = new EventEmitter<Contact>();
  contactListChangedEvent = new Subject<Contact[]>();
  contacts: Contact[] = [];
  constructor() {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
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
      this.contactListChangedEvent.next(this.contacts.slice());
  }

  getMaxId(): number {
    let maxId: number = 0;
    this.contacts.forEach(function(contact) {
      parseInt(contact.id);
      if (contact.id > maxId) {
        maxId = contact.id
      }
    })
    return maxId;
  }

  addContact(newContact: Contact) {
    if (newContact == null) {
      return;
    }
    this.maxContactId++;
    newContact.id = this.maxContactId;
    this.contacts.push(newContact);
    this.contactListChangedEvent.next(this.contacts.slice())
  }
  updateContact(originalContact: Contact, newContact: Contact) {
    if (originalContact == null || newContact == null) {
      return;
    }
    var pos: number = this.contacts.indexOf(originalContact)
    if (pos > 0) {
      return;
    }
    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    this.contactListChangedEvent.next(this.contacts.slice());
  }
}
