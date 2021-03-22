import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {

  documents: Document[] = [];
  constructor(private documentService: DocumentService) { }

  ngOnInit(): void {
    this.documentService.documentChangedEvent.subscribe(
      (docs: Document[]) => {
        this.documents = docs;
      }
    )
    this.documents = this.documentService.getDocuments();
  }

}
