import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [
    new Message(2, 'Wazzup', 'How have you been?', 'Your Mother'),
    new Message(3, 'Regarding your Tax Return', 'You are not getting any money back', 'IRS'),
    new Message(4, 'When are you getting home', 'Im Hungry', 'Family Phone')

  ]
  constructor() { }

  ngOnInit(): void {
  }

  onAddMessage(message: Message) {
    this.messages.push(message);
  }

}
