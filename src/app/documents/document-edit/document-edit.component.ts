import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'app-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {

  // @ViewChild('f', { static: false}) form: NgForm;
  id: string;
  originalDocument: Document;
  document: Document;
  editMode: boolean = false;
  constructor(private documentService: DocumentService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params.id;
        if (this.id == null) {
          this.editMode = false;
          return;
        }
        this.originalDocument = this.documentService.getDocument(this.id);
        if (this.originalDocument == null) {
          return;
        }
        this.editMode = true;
        this.document = JSON.parse(JSON.stringify(this.originalDocument));

      }
    )
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    console.log(value.name);
    const newDocument = new Document(
      '',
      value.name,
      value.description,
      value.url);
    if (this.editMode == true) {
      this.documentService.updateDocument(this.originalDocument, newDocument);
    }
    else {
      this.editMode = false;
      this.documentService.addDocument(newDocument);
      form.reset();
    }
    this.onCancel();
  }

  onCancel() {
    this.router.navigate(["../"]);
  }
}
