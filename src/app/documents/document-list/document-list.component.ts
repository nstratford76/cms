import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit, OnDestroy {

  documents: Document[] = [];
  private subscription: Subscription
  constructor(private documentService: DocumentService) { }

  ngOnInit(): void {
    this.subscription = this.documentService.documentListChangedEvent.subscribe(
      (docs: Document[]) => {
        this.documents = docs;
      }
    )
    this.documents = this.documentService.getDocuments();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
