import { Component, OnInit, OnDestroy, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';
import { Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/interval'
import * as io from 'socket.io-client';
import * as $ from 'jquery';
import { Configs } from '../configurations';
import { AuthserviceService } from '../authservice.service';
import { HttpClient } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
    //  'Content-Type':'application/x-www-form-urlencoded'
    //'Authorization': 'my-auth-token'
  })
};

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})


export class RequestComponent implements OnInit, AfterViewChecked {

  private unsubscribe: Subject<any> = new Subject();
  // private subscription: Subscription = new Subscription();

  // @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @ViewChild('scrollTable') private myScrollTableContainer: ElementRef;  

  chats: any;
  requests: any;  //new request
  interval: any;
  timer: any;
  curSid:string = "0"; 
  joinned: boolean = false;
  newUser = { nickname: '', room: '' };
  newRequest = { phone_number: '', socket_id: '', room:'', message: '', request_status:'' };
  // newRequest = { room:'', phone_number: '', message: '', socket_id:'',updated_at:'' };
  // chatRequest = { room: '', admin_name:'', phone_number: '', message: '', updated_at:'' };
  // socket = io('http://localhost:4000');
  // socket = io('https://192.168.0.102:3637');
  // socket = io('https://192.168.0.102:3637',{secure: true});
  // socket = io('https://airpoint.com.hk:3637',{secure: true});
  socket = io(this.configs.socketIoServerAddr+":"+sessionStorage.getItem("socketioport"),{secure: true});
  
  constructor(public http: HttpClient, private authService: AuthserviceService, private chatService: ChatService, private configs: Configs) {}

  ngOnInit() {
    // var user = JSON.parse(localStorage.getItem("user"));
    // var request = JSON.parse(localStorage.getItem("request"));

    this.getHumanRequest();
    this.scrollTableToBottom();
      
    this.socket.emit('user','admin');

    // this.socket.on('users', function(data){
    this.socket.on('users', (userid, socket_id) => {
      // this.socket.on('logRequest', (userid, socket_id) => {
    // this.socket.on('users', function(userid, socket_id){
      var date = new Date();
      // var oldSid :string = "0";
      // var curSid :string = "0";
      // console.log("inside users socket.on");
      console.log("print userid:" +userid);
      console.log("print socket.id:" +socket_id);
  
  if (userid !== 'admin'){
  	 	console.log("print userid before saveChat: " +userid);
   		console.log("print socket_id before saveChat: " +socket_id);
   // use status field to classify the new and old request
   this.newRequest = {phone_number: userid, socket_id: socket_id, room: userid, message: 'Customer service request', request_status:'New' };
   // this.newRequest = { room: this.newRequest.room, phone_number: this.newRequest.phone_number, socket_id: this.newRequest.socket_id, message: 'Join this room', updated_at:date };
   // this.newRequest = Object.assign({ room: userid, phone_number: userid, socket_id: socket_id, message: 'Join this room', updated_at:date }, this.newRequest);
   	// console.log(this.newRequest.room);
   	console.log(this.newRequest.phone_number);
   	console.log(this.newRequest.socket_id);
   	console.log(this.newRequest.message);
   	console.log(this.newRequest.request_status);
 	// console.log(this.newRequest.updated_at);

    if (this.newRequest.socket_id!=undefined){
    //check if this socket id exist
      // console.log("oldSid: " +this.oldSid);
      console.log("curSid: " +this.curSid);
      if (this.newRequest.socket_id!=this.curSid){
      // this.chatService.showRequestSocket(this.newRequest.socket_id).then((result) => {
      //   if (result == 0){
      //     console.log( result +" entry found. Updating DB..." );

          this.curSid = this.newRequest.socket_id;
          console.log("curSid: " +this.curSid);
          console.log("socket_id: " +this.newRequest.socket_id);

          this.chatService.saveRequest(this.newRequest).then((result) => {
            this.socket.emit('save-message', result);
            console.log( "Updated DB" );
          }, (err) => {
          console.log(err);
          });
      //   } else{
      //     console.log("duplicated entry, will not update DB");
      //   }

      // }, (err) => {
      //   console.log(err);
      // });

   //  setTimeout(()=> {
	  // this.chatService.saveRequest(this.newRequest).then((result) => {
   //    this.socket.emit('save-message', result);
	  //   }, (err) => {
	  //     console.log(err);
	  //   });
   //  },2000);
  
      }  else {  //this.newRequest.socket_id!=this.curSid
        console.log("duplicated entry, will not update DB");
      }
    }  // (this.newRequest.socket_id!=undefined)
  }	  //if (userid !== 'admin')

  });

//      var tPort:string ;
//      var sID :string;
//      tPort =sessionStorage.getItem("tinkerport");
//      sID =localStorage.getItem('res.data.sessionID');
      
//      console.log("tinkerport got is "+tPort);
//      console.log("res.data.sessionID got is "+sID);
      
      this.http.post (this.configs.tinkerboardAddr+":"+sessionStorage.getItem("tinkerport")+'/api/csp/register?action=register&sessionID='+localStorage.getItem('res.data.sessionID'), 
      //action: 'register',
      {}
    , httpOptions)
            .pipe(
      catchError(this.handleErrorObservable)
    ).subscribe(
        res => {
//            console.log(sID2);
//          console.log(res);
  
    
    // this.refreshData();
    this.getHumanRequest();
            
        });
      
// data refresh
  // this.refreshData();
  
  // if(this.interval){
  //   clearInterval(this.interval);
  // }
    
this.timer = setInterval(() => {
    // this.refreshData();
    this.getHumanRequest();
    console.log("refresh requests");
  }, 3000);

  // this.chatService.data$.takeUntil(this.unsubscribe)
  //   .subscribe(data => {
  //     this.data = data;
  //     console.log("subscribe data");
  //   });    

  }  //ngOnInit

  ngOnDestroy(){
        
      var tPort:string ;
      var sID :string;
      tPort =sessionStorage.getItem("tinkerport");
      sID =localStorage.getItem('res.data.sessionID');
      
      console.log("tinkerport got is "+tPort);
      console.log("res.data.sessionID got is "+sID);
        //socket.emit('forceDisconnect');
      
      if (tPort!=null){
      this.http.post (this.configs.tinkerboardAddr+":"+sessionStorage.getItem("tinkerport")+'/api/csp/unregister?action=unregister&sessionID='+localStorage.getItem('res.data.sessionID'), 
    {}, httpOptions)
    .pipe(
      catchError(this.handleErrorObservable)
    ).subscribe(
        res => {
                
    this.unsubscribe.next();
    this.unsubscribe.complete();
//            console.log(sID2);
//          console.log(res);
            this.socket.disconnect();
                if (this.timer){
                    clearInterval(this.timer);
                    console.log('stop admin request refresh');
                    }
      //return true;
        });
          
    } //end if tPort !=null
    else  {
            this.unsubscribe.next();
            this.unsubscribe.complete();
            this.socket.disconnect();
                if (this.timer){
                    clearInterval(this.timer);
                    console.log('stop admin request refresh');
                }
            }

  }

  // refreshData(){
  //   this.chatService.updateData()
  //     .takeUntil(this.unsubscribe)
  //     .subscribe();
  //     console.log("Data refreshed");
  // }

  // doAction(){
  //   this.subscription.add(
  //     this.chatService.doAction()
  //       .subscribe(result => {
  //         if(result === true){
  //           this.refreshData();
  //         }
  //       })
  //   );
  // }
    
  ngAfterViewChecked() {
    this.scrollTableToBottom();
  }

  // scrollToBottom(): void {
  //   try {
  //     this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
  //   } catch(err) { }
  // }

    
      private handleErrorObservable (error: Response | any) {
	//console.error(error.message || error);
	//return Observable.throw(error.message || error);
          return "0";
    }
    
  scrollTableToBottom(): void {
    try {
      this.myScrollTableContainer.nativeElement.scrollTop = this.myScrollTableContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  getChatByRoom(room) {
    this.chatService.getChatByRoom(room).then((res) => {  //from chatService
      this.chats = res;
    }, (err) => {
      console.log(err);
    });
  }

  getHumanRequest() {
    var customer_service = "human";
    this.chatService.getHumanRequest(customer_service).then((res) => {  //from chatService, 
      this.requests = res;
    }, (err) => {
        //this.authService.logout(this.authService.userProfile[this.configs.angularAddr+"/tinkerport"]);
        this.authService.logout(sessionStorage.getItem("tinkerport"));
      console.log(err);
    });
  }

  getRequestByRoom(room) {
    this.chatService.getRequestByRoom(room).then((res) => {  //from chatService, here room=phone number
      this.requests = res;
    }, (err) => {
      console.log(err);
    });
  }

  getSingleRequest(id) {
    this.chatService.showRequest(id).then((res) => {  //from chatService, here room=phone number
      this.requests = res;
    }, (err) => {
      console.log(err);
    });
  }

  getSocketID(id) {
    this.chatService.showRequestSocket(id).then((res) => {  //from chatService, here room=phone number
      this.requests = res;
    }, (err) => {
      console.log(err);
    });
  }

}

