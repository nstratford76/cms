import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  constructor(private http: HttpClient) {
    this.contactListChangedEvent.subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts
      }
    );
    this.getContacts();
    this.maxContactId = this.getMaxId();
   }

   getContacts() {
    this.http
      .get<Contact[]>('https://nrs-cms-9da61-default-rtdb.firebaseio.com/contacts.json')
      .subscribe(
        (contacts: Contact[]) => {
        this.contacts = contacts;
        this.maxContactId = this.getMaxId();
        this.contacts.sort((a, b) =>
          a.name > b.name ? 1: b.name > a.name ? -1 : 0
        );
         this.contactListChangedEvent.next(this.contacts.slice());
      },
       (error: any) => {
        console.log(error);
      });
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
      this.storeContacts();
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
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    this.storeContacts();
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
    this.storeContacts();
  }

  storeContacts() {
    let contacts = JSON.parse(JSON.stringify(this.contacts));
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.put('https://nrs-cms-9da61-default-rtdb.firebaseio.com/contacts.json', contacts, { headers: headers })
    .subscribe(
      () => {
        this.contactListChangedEvent.next(this.contacts.slice());
      }
    )
  }
}
