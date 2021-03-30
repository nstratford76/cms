import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable} from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  maxMessageId: number;
  messageChangedEvent = new Subject<Message[]>();
  messages: Message[] = [];

  constructor(private http: HttpClient) {
    this.getMessages();
   }

   getMessages() {
    this.http
      .get<Message[]>('https://nrs-cms-9da61-default-rtdb.firebaseio.com/messages.json')
      .subscribe(
        (messages: Message[]) => {
        this.messages = messages;
        this.maxMessageId = this.getMaxId();
        this.messages.sort((a, b) =>
          a.subject > b.subject ? 1: b.subject > a.subject ? -1 : 0
        );
         this.messageChangedEvent.next(this.messages.slice());
      },
       (error: any) => {
        console.log(error);
      });
  }

  getMessage(id: string) {
    var value = null;
    this.messages.forEach(function(message) {
      if(message.id === id) {
        value = message;
      }
    });
    return value;
  }

  addMessage(message: Message) {
    this.messages.push(message);
    this.storeMessages();
  }

  getMaxId(): number {
    let maxId: number = 0;
    this.messages.forEach(function (message) {
      parseInt(message.id);
      if (message.id > maxId) {
        maxId = message.id;
      }
    });
    return maxId;
  }

  storeMessages() {
    let messages = JSON.parse(JSON.stringify(this.messages));
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.put('https://nrs-cms-9da61-default-rtdb.firebaseio.com/messages.json', messages, { headers: headers })
    .subscribe(
      () => {
        this.messageChangedEvent.next(this.messages.slice());
      }
    )
  }
}
