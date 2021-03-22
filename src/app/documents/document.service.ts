import { EventEmitter, Injectable, Output } from '@angular/core';
import {Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  @Output() documentChangedEvent = new EventEmitter<Document[]>();
  documents: Document[] = [];
  @Output() documentSelectedEvent = new EventEmitter<Document>();

  constructor() {
    this.documents = MOCKDOCUMENTS;
  }

  getDocuments() {
    return this.documents.slice();
  }

  getDocument(id: string) {
    var value = null;
    this.documents.forEach(function(document) {
      if(document.id === id) {
        value = document;
      }
    });
    return value;
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const pos = this.documents.indexOf(document);
      if (pos < 0) {
        return;
      }
      this.documents.splice(pos, 1);
      this.documentChangedEvent.emit(this.documents.slice());
  }
}
