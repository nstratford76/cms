import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {
   originalContact: Contact;
   contact: Contact;
   groupContacts: Contact[] = [];
   editMode: boolean = false;
   id: string;

   constructor(
        private contactService: ContactService,
        private router: Router,
        private route: ActivatedRoute) {
        }
  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params.id;
        if (params.id == null) {
          this.editMode = false;
          return;
        }
        this.originalContact = this.contactService.getContact(this.id);
        if (this.originalContact = null) {
          return;
        }
        this.editMode = true;
        this.contact = JSON.parse(JSON.stringify(this.originalContact));

        if (this.contact.group != null) {
          this.groupContacts = JSON.parse(JSON.stringify(this.contact.group));
        }
      }
    )
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    console.log(value.name);
    const newContact = new Contact(
      this.contact?.id || '',
      value.name,
      value.email,
      value.phone,
      value.imageUrl,
      this.groupContacts);
    if (this.editMode == true) {
      this.contactService.updateContact(this.originalContact, newContact);
    }
    else {
      this.editMode = false;
      this.contactService.addContact(newContact);
      form.reset();
    }
    this.onCancel();
  }

  isInvalidContact(newContact: Contact) {
    if (!newContact) {// newContact has no value
      return true;
    }
    if (this.contact && newContact.id === this.contact.id) {
       return true;
    }
    for (let i = 0; i < this.groupContacts.length; i++){
       if (newContact.id === this.groupContacts[i].id) {
         return true;
      }
    }
    return false;
 }

  onCancel() {
    this.router.navigate(['../'])
  }

  addToGroup($event: any) {
    const selectedContact: Contact = $event.dragData;
    const invalidGroupContact = this.isInvalidContact(selectedContact);
    if (invalidGroupContact) {
      return;
    }
    this.groupContacts.push(selectedContact);
  }

  onremoveItem(index: number) {
    if (index < 0 || index >= this.groupContacts.length) {
      return;
    }
    this.groupContacts.splice(index, 1);
  }

}
