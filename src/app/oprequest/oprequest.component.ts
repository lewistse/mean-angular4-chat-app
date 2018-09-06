import { Component, OnInit, OnDestroy, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';
import { Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/interval'
import * as io from 'socket.io-client';
import * as $ from 'jquery';
//import { Configs } from '../configurations';
import { Configs } from '../../environments/environment';

@Component({
  selector: 'app-oprequest',
  templateUrl: './oprequest.component.html',
  styleUrls: ['./oprequest.component.css']
})

export class OprequestComponent implements OnInit, AfterViewChecked {

  private unsubscribe: Subject<any> = new Subject();
  // private subscription: Subscription = new Subscription();

  // @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @ViewChild('scrollTable') private myScrollTableContainer: ElementRef;  

  chats: any;
  requests: any;  //new request
  interval: any;
  timer: any;
  joinned: boolean = false;
  newUser = { nickname: '', room: '' };
  newRequest = { phone_number: '', socket_id: '', room:'', message: '', request_status:'' };
  // newRequest = { room:'', phone_number: '', message: '', socket_id:'',updated_at:'' };
  // chatRequest = { room: '', admin_name:'', phone_number: '', message: '', updated_at:'' };
  // socket = io('http://localhost:4000');
  // socket = io('https://192.168.0.102:3637');
  // socket = io('https://192.168.0.102:3637',{secure: true});
  // socket = io('https://airpoint.com.hk:3637',{secure: true});
  // socket = io(this.configs.socketIoServerAddr+":"+sessionStorage.getItem("socketioport"),{secure: true});
  socket = io(this.configs.socketIoServerAddr,{secure: true});
  
  constructor(private chatService: ChatService, private configs: Configs) {}

  ngOnInit() {

    this.getOperatorRequest();
    this.scrollTableToBottom();

    
  this.timer = setInterval(() => {
    this.getOperatorRequest();
    console.log("operator refresh requests");
  }, 3000);

  }  //ngOnInit

  ngOnDestroy(){
        
    this.unsubscribe.next();
    this.unsubscribe.complete();
        //socket.emit('forceDisconnect');
    this.socket.disconnect();
    if (this.timer){
      clearInterval(this.timer);
      console.log('stop refreshing');
    }

  }

    
  ngAfterViewChecked() {
    this.scrollTableToBottom();
  }


  scrollTableToBottom(): void {
    try {
      this.myScrollTableContainer.nativeElement.scrollTop = this.myScrollTableContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  // getChatByRoom(room) {
  //   this.chatService.getChatByRoom(room).then((res) => {  //from chatService
  //     this.chats = res;
  //   }, (err) => {
  //     console.log(err);
  //   });
  // }

  // getHumanRequest() {
  //   var customer_service = "human";
  //   this.chatService.getHumanRequest(customer_service).then((res) => {  //from chatService, 
  //     this.requests = res;
  //   }, (err) => {
  //     console.log(err);
  //   });
  // }

  getOperatorRequest(){
  	var operator_request = "true";
    this.chatService.getOperatorRequest().then((res) => {  //from chatService, 
      this.requests = res;
    }, (err) => {
      console.log(err);
    });

  }

  // getRequestByRoom(room) {
  //   this.chatService.getRequestByRoom(room).then((res) => {  //from chatService, here room=phone number
  //     this.requests = res;
  //   }, (err) => {
  //     console.log(err);
  //   });
  // }

  // getSingleRequest(id) {
  //   this.chatService.showRequest(id).then((res) => {  //from chatService, here room=phone number
  //     this.requests = res;
  //   }, (err) => {
  //     console.log(err);
  //   });
  // }

  // getSocketID(id) {
  //   this.chatService.showRequestSocket(id).then((res) => {  //from chatService, here room=phone number
  //     this.requests = res;
  //   }, (err) => {
  //     console.log(err);
  //   });
  // }

}

