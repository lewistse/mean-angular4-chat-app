import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild, Input } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as io from 'socket.io-client';
import * as $ from 'jquery';
import { Buffer } from 'buffer';
//import { Configs } from '../configurations';
import { Configs } from '../../environments/environment';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
 
  url = '';
  getUrl = '';
  chats: any =[];
  joinned: boolean = false;


  newUser = { nickname: '', room: '' ,socket_id: '', db_id:'', request_status:''};
  msgData = { phone_number: '', socket_id: '', room: '', nickname: '', message: '' };
  // imgData = { phone_number: '', socket_id: '', room: '', nickname: '', message: '', filename:'', image: { data:Buffer, contentType:'' }};
  // imgData = { phone_number: '', socket_id: '', room: '', nickname: '', message: '', filename:'', image: '' };
  // CusImgData = { phone_number: '', socket_id: '', room: '', nickname: '', message: '', file_path:'', image: '' };
  CusMsgData = { phone_number: '', socket_id: '', room: '', nickname: '', message: '' };
  // socket = io('http://localhost:4000');
  // socket = io('https://airpoint.com.hk:3637',{secure: true});
  //socket = io('https://192.168.0.102:3637',{secure: true});
  // socket = io(this.configs.socketIoServerAddr+":"+sessionStorage.getItem("socketioport"),{secure: true});
  // socket = io(this.configs.socketIoServerAddr,{secure: true});

  constructor(private chatService: ChatService, private route: ActivatedRoute, private configs: Configs) {
    // console.log("inside chat constructor" +this.route.snapshot.params);
  }

  ngOnInit() {

  }

  ngOnDestroy(){

  }

  getAllChatByRoom(room) {
     console.log("getAllChatbyRoom:" +room);
    this.chatService.getAllChatHistory(room).then((res) => {  //from chatService
      this.chats = res;
    }, (err) => {
      console.log(err);
    });
  }

  joinRoom() {
    console.log('joinRoom to view chst history: ');
    this.getAllChatByRoom(this.newUser.room);
    this.msgData = {phone_number:this.newUser.room, socket_id: this.newUser.socket_id, 
      room: this.newUser.room, nickname: this.newUser.nickname, message: '' };
    this.joinned = true;

  }

  logout() {
    console.log("Exit the room");
    this.joinned = false;
  }
}
