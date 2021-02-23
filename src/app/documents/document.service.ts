import { EventEmitter, Injectable, Output } from '@angular/core';
import {Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documents: Document[] = [];
  @Output() documentSelectedEvent = new EventEmitter<Document>();

  constructor() {
    this.documents = MOCKDOCUMENTS;
  }

  getDocuments() {
    return this.documents.slice();
  }

  getDocument(id: string) {
    this.documents.forEach(function(document) {
      if(document.id === id) {
        return document;
      }
    });
    return null;
  }
}
