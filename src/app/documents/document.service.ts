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
  newDocs: string = '';
  @Output() documentSelectedEvent = new EventEmitter<Document>();

  constructor(private http: HttpClient) {
    this.getDocuments();
    this.maxDocumentId = this.getMaxId();
  }

  getDocuments() {
    this.http.get<Document[]>('http://localhost:3000/documents').subscribe(
      (documents: Document[]) => {
        this.documents = documents;
        this.maxDocumentId = this.getMaxId();
        this.documents.sort((a, b) =>
          a.name > b.name ? 1 : b.name > a.name ? -1 : 0
        );
        this.documentListChangedEvent.next(this.documents.slice());
      },
      (error: any) => {
        console.log(error);
      }
    );
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

    const pos = this.documents.findIndex((d) => d.id === document.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http
      .delete('http://localhost:3000/documents/' + document.id)
      .subscribe((response: Response) => {
        this.documents.splice(pos, 1);
        this.sortAndSend();
      });
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

  addDocument(document: Document) {
    if (!document) {
      return;
    }

    // make sure id of the new Document is empty
    document.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // add to database
    this.http
      .post<{ message: string; document: Document }>(
        'http://localhost:3000/documents',
        document,
        { headers: headers }
      )
      .subscribe((responseData) => {
        // add new document to documents
        this.documents.push(responseData.document);
        this.sortAndSend();
      });
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.findIndex((d) => d.id === originalDocument.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new Document to the id of the old Document
    newDocument.id = originalDocument.id;
    //newDocument._id = originalDocument._id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // update database
    this.http
      .put(
        'http://localhost:3000/documents/' + originalDocument.id,
        newDocument,
        { headers: headers }
      )
      .subscribe((response: Response) => {
        this.documents[pos] = newDocument;
        this.sortAndSend();
      });
  }

  storeDocuments() {
    let documents = JSON.parse(JSON.stringify(this.documents));
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http
      .put(
        'https://nrs-cms-9da61-default-rtdb.firebaseio.com/documents.json',
        documents,
        { headers: headers }
      )
      .subscribe(() => {
        this.documentListChangedEvent.next(this.documents.slice());
      });
  }

  sortAndSend() {
    this.maxDocumentId = this.getMaxId();
    this.documents.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    this.documentListChangedEvent.next(this.documents.slice());
  }
}
