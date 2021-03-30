import { EventEmitter, Injectable, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  maxDocumentId: number;
  documentListChangedEvent = new Subject<Document[]>();
  documents: Document[] = [];
  newDocs: string = "";
  @Output() documentSelectedEvent = new EventEmitter<Document>();

  constructor(private http: HttpClient) {
    this.getDocuments();
    this.maxDocumentId = this.getMaxId();
  }

  getDocuments() {
    this.http
      .get<Document[]>('https://nrs-cms-9da61-default-rtdb.firebaseio.com/documents.json')
      .subscribe(
        (documents: Document[]) => {
        this.documents = documents;
        this.maxDocumentId = this.getMaxId();
        this.documents.sort((a, b) =>
          a.name > b.name ? 1: b.name > a.name ? -1 : 0
        );
         this.documentListChangedEvent.next(this.documents.slice());
      },
       (error: any) => {
        console.log(error);
      });
  }

  getDocument(id: string) {
    console.log(id);
    var value = null;
    this.documents.forEach(function (document) {
      if (document.id === id) {
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
    this.storeDocuments();
  }

  getMaxId(): number {
    let maxId: number = 0;
    this.documents.forEach(function (document) {
      parseInt(document.id);
      if (document.id > maxId) {
        maxId = document.id;
      }
    });
    return maxId;
  }

  addDocument(newDocument: Document) {
    if (newDocument == null) {
      return;
    }
    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    this.storeDocuments();
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (originalDocument == null || newDocument == null) {
      return;
    }
    var pos: number = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }
    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    this.storeDocuments();
  }

  storeDocuments() {
    let documents = JSON.parse(JSON.stringify(this.documents));
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.put('https://nrs-cms-9da61-default-rtdb.firebaseio.com/documents.json', documents, { headers: headers })
    .subscribe(
      () => {
        this.documentListChangedEvent.next(this.documents.slice());
      }
    )
  }
}
