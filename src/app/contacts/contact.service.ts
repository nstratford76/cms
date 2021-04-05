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
      .get<Contact[]>('http://localhost:3000/messages')
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

    const pos = this.contacts.findIndex((d) => d.id === contact.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http
      .delete('http://localhost:3000/contacts/' + contact.id)
      .subscribe((response: Response) => {
        this.contacts.splice(pos, 1);
        this.sortAndSend();
      });
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

  addContact(contact: Contact) {
    if (!contact) {
      return;
    }

    // make sure id of the new contact is empty
    contact.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // add to database
    this.http
      .post<{ message: string; contact: Contact }>(
        'http://localhost:3000/contacts',
        contact,
        { headers: headers }
      )
      .subscribe((responseData) => {
        // add new contact to contacts
        this.contacts.push(responseData.contact);
        this.sortAndSend();
      });
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }

    const pos = this.contacts.findIndex((d) => d.id === originalContact.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new Contact to the id of the old Contact
    newContact.id = originalContact.id;
    //newContact._id = originalContact._id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // update database
    this.http
      .put(
        'http://localhost:3000/contacts/' + originalContact.id,
        newContact,
        { headers: headers }
      )
      .subscribe((response: Response) => {
        this.contacts[pos] = newContact;
        this.sortAndSend();
      });
  }
  // updateContact(originalContact: Contact, newContact: Contact) {
  //   if (originalContact == null || newContact == null) {
  //     return;
  //   }
  //   var pos: number = this.contacts.indexOf(originalContact)
  //   if (pos > 0) {
  //     return;
  //   }
  //   newContact.id = originalContact.id;
  //   this.contacts[pos] = newContact;
  //   this.storeContacts();
  // }

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

  sortAndSend() {
    this.maxContactId = this.getMaxId();
    this.contacts.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    this.contactListChangedEvent.next(this.contacts.slice());
  }
}
