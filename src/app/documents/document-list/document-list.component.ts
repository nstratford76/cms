import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {

  @Output() selectedDocumentEvent = new EventEmitter<Document>();
  documents: Document[] = [
    new Document(0, "Report", "Important", "doc.com"),
    new Document(1, "OtherReport", "Very Important", "doc2.com"),
    new Document(2, "More Report", "Mildly Important", "shouldwecare.com"),
    new Document(3, "Tax Form", "Do this I guess", "giveusyourmoney.com"),

  ]
  constructor() { }

  ngOnInit(): void {
  }

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }

}
