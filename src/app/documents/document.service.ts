import { EventEmitter, Injectable, Output } from '@angular/core';
import { Subject } from 'rxjs';
import {Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  maxDocumentId: number;
  documentListChangedEvent = new Subject<Document[]>();
  documents: Document[] = [];
  @Output() documentSelectedEvent = new EventEmitter<Document>();

  constructor() {
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
  }

  getDocuments() {
    return this.documents.slice();
  }

  getDocument(id: string) {
    console.log(id);
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
      this.documentListChangedEvent.next(this.documents.slice());
  }

  getMaxId(): number {
    let maxId: number = 0;
    this.documents.forEach(function(document) {
      parseInt(document.id);
      if (document.id > maxId) {
        maxId = document.id
      }
    })
    return maxId;
  }

  addDocument(newDocument: Document) {
    if (newDocument == null) {
      return;
    }
    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    this.documentListChangedEvent.next(this.documents.slice())
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (originalDocument == null || newDocument == null) {
      return;
    }
    var pos: number = this.documents.indexOf(originalDocument)
    if (pos < 0) {
      return;
    }
    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    this.documentListChangedEvent.next(this.documents.slice());
  }
}
