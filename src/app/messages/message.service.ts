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
      .get<Message[]>('http://localhost:3000/contacts')
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

  addMessage(msg: Message) {
    if (!msg) {
      return;
    }

    // make sure id of the new MessageDocument is empty
    msg.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // add to database
    this.http
      .post<{ message: string; msg: Message }>(
        'http://localhost:3000/messages',
        msg,
        { headers: headers }
      )
      .subscribe((responseData) => {
        // add new document to documents
        this.messages.push(responseData.msg);
        this.sortAndSend();
      });
  }

  deleteMessage(message: Message) {
    if (!message) {
      return;
    }

    const pos = this.messages.findIndex((d) => d.id === message.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http
      .delete('http://localhost:3000/contacts/' + message.id)
      .subscribe((response: Response) => {
        this.messages.splice(pos, 1);
        this.sortAndSend();
      });
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

  sortAndSend() {
    this.maxMessageId = this.getMaxId();
    this.messages.sort((a, b) => {
      if (a.sender < b.sender) {
        return -1;
      }
      if (a.sender > b.sender) {
        return 1;
      }
      return 0;
    });
    this.messageChangedEvent.next(this.messages.slice());
  }
}
