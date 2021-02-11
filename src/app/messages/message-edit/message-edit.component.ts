import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'app-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  currentSender = 'Nathan';
  @Output() addMessageEvent = new EventEmitter<Message>();
  @ViewChild('subject', {static: false}) subjectRef: ElementRef;
  @ViewChild('msgText', {static: false}) msgTextRef: ElementRef;
  constructor() { }

  ngOnInit(): void {
  }

  onSendMessage() {
    const ingSubject = this.subjectRef.nativeElement.value;
    const ingMessage = this.msgTextRef.nativeElement.value;
    const ingSender = this.currentSender;

    const newMessage = new Message(1, ingSender, ingSubject, ingMessage);
    this.addMessageEvent.emit(newMessage);
  }

  onClear() {
    this.subjectRef.nativeElement.value = '';
    this.msgTextRef.nativeElement.value = '';
  }

}
