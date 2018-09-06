import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild, Input } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as io from 'socket.io-client';
import * as $ from 'jquery';
import { Buffer } from 'buffer';
//import { Configs } from '../configurations';
import { Configs } from '../../environments/environment';

@Component({
  selector: 'app-opchat',
  templateUrl: './opchat.component.html',
  styleUrls: ['./opchat.component.css']
})
export class OpchatComponent implements OnInit, AfterViewChecked {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  // @ViewChild('image') private myInputImage: any;
  // @ViewChild('scrollTable') private myScrollTableContainer: ElementRef;  //Ben

  url = '';
  ImageObject = {};
  displayImage = '';
  display_socket_id: any;
  selectedFile: File;
  chats: any =[];
  joinned: boolean = false;
  connected: boolean = false;
  notSelected: boolean = true;

  newUser = { nickname: '',socket_id: '', room: '' , db_id:'', operator_request:''};  //for operator
  newOpRequest = { phone_number: '', socket_id: '', room:'', message: '', operator_request:'' };  //for customer
  msgData = { phone_number: '', socket_id: '', room: '', nickname: '', message: '' };
  // imgData = { phone_number: '', socket_id: '', room: '', nickname: '', message: '', filename:'', image: { data:Buffer, contentType:'' }};
  imgData = { phone_number: '', socket_id: '', room: '', nickname: '', message: '', filename:'', image: '' };
  CusImgData = { phone_number: '', socket_id: '', room: '', nickname: '', message: '', file_path:'', image: '' };  
  CusMsgData = { phone_number: '', socket_id: '', room: '', nickname: '', message: '' };
  
  // socket = io('https://airpoint.com.hk:3637',{secure: true});
  //socket = io('https://192.168.0.102:3637',{secure: true});
  // socket = io(this.configs.socketIoServerAddr+":"+sessionStorage.getItem("socketioport"),{secure: true});
  socket = io(this.configs.socketIoServerAddr,{secure: true});
  
  constructor(private chatService: ChatService, private route: ActivatedRoute, private configs: Configs) {
    
  }

  ngOnInit() {
//      history.pushState({},"Edit","");

  // this.route.params.subscribe(params =>{
  //     // console.log(params);
  //     this.newUser.room = params['id'];
  //     // console.log(this.newUser.room);     
  // });

  var user = JSON.parse(localStorage.getItem("user"));

  this.socket.emit('user','operator');

  // var op_socket_id = localStorage.getItem("op_socket_id");

  this.socket.on('users', (userid, socket_id) => {

      var date = new Date();
      // console.log("inside users socket.on");
      console.log("userid: " +userid);
      console.log("socket.id: " +socket_id);

      this.newUser.socket_id = socket_id;
   
   //customer will join the room while operator won't do it again.
   if (userid !== 'operator'){ 
       // console.log("print userid before saveChat: " +userid);
       // console.log("print socket_id before saveChat: " +socket_id);
   // use status field to classify the new and old request
   this.newOpRequest = {phone_number: userid, socket_id: socket_id, room: userid, message: 'Customer joined', operator_request:'true' };
   // this.newRequest = { room: this.newRequest.room, phone_number: this.newRequest.phone_number, socket_id: this.newRequest.socket_id, message: 'Join this room', updated_at:date };
   // this.newRequest = Object.assign({ room: userid, phone_number: userid, socket_id: socket_id, message: 'Join this room', updated_at:date }, this.newRequest);
     // console.log(this.newOpRequest.room);
     console.log(this.newOpRequest.phone_number);
     console.log(this.newOpRequest.socket_id);
     console.log(this.newOpRequest.message);
     console.log(this.newOpRequest.operator_request);
   // // console.log(this.newRequest.updated_at);

  // this.chatService.saveRequest(this.newRequest).then( function(result)  {
  this.chatService.saveRequest(this.newOpRequest).then((result) => {
      this.socket.emit('save-message', result);
      }, (err) => {
        console.log(err);
      });

    }    //if 

  });

  this.socket.on('chat', (msg) =>{
  // this.socket.on('chat', (userid, msg) =>{
    var date = new Date();
    console.log("print customer message object: " +msg);

    // modify this to json object
    var obj = JSON.parse(msg);
    var phoneNum = obj.sessionID;
    var message = obj.message;
    var filePath = obj.photoPath;

    console.log("print customer phoneNum:" +phoneNum);
    console.log("print customer message:" +message);
    console.log("print customer photoPath:" +filePath);

    if (msg !== 'undefine'){

      if (!message.includes('\uD83D\uDCF7')){
    
        this.CusMsgData = { phone_number: phoneNum, socket_id: 'socket_id', room:phoneNum , nickname:phoneNum , message: message };
        console.log(this.CusMsgData.room);
        console.log(this.CusMsgData.phone_number);
        console.log(this.CusMsgData.socket_id);
        console.log(this.CusMsgData.message);
        
        this.chatService.saveChat(this.CusMsgData).then((result) => {
          this.socket.emit('save-message', result);
        }, (err) => {
          console.log(err);
        });
      } else { //else  (message.includes('\uD83D\uDCF7'))

        if ((!filePath) || (filePath == "Timeout")){
          console.log("filePath is null or Timeout");

          this.CusMsgData = { phone_number: phoneNum, socket_id: 'socket_id', room:phoneNum , nickname:phoneNum , message: "Sent Photo Failed!" };
          // console.log(this.CusMsgData.room);
          // console.log(this.CusMsgData.phone_number);
          // console.log(this.CusMsgData.socket_id);
          // console.log(this.CusMsgData.message);
        
          this.chatService.saveChat(this.CusMsgData).then((result) => {
            this.socket.emit('save-message', result);
          }, (err) => {
            console.log(err);
          });

        } else {
        // get admin sessionID
        var sID=localStorage.getItem('res.data.sessionID');
        var fileType = ((filePath).split(".")[1]);
        var path = 'sessionID='+sID +'&path='+filePath;
        // var completePath = 'https://airpoint.com.hk:'+sessionStorage.getItem("tinkerport")+'/api/csp/getimage?'+path;  //save complete path to db
        var completePath = 'https://airpoint.com.hk:'+this.configs.tinkerport+'/api/csp/getimage?'+path;  //save complete path to db

        console.log("sID: " + sID);
        console.log("tinkerPath: " + filePath);
        console.log("complete path: " + completePath);
        console.log("fileType: " + fileType);

          this.chatService.getImageFromNode(path).then((res) => {  //from chatService
            console.log(" get image from tinker");
          
            var blob = new Blob(
                [res],
                // Mime type is important for data url
                // {type : 'text/html'}
                {type : 'image/' +fileType}
                );


            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend =(evt:any) =>{
                // Capture result here
              var getImage = evt.target.result;
              console.log(evt.target.result);

              this.CusImgData = { phone_number: phoneNum, socket_id: 'socket_id', room:phoneNum , nickname:phoneNum , message: message, file_path:completePath, image:getImage };
              console.log('receive image from customer');
              console.log(this.CusImgData.room);
              console.log(this.CusImgData.phone_number);
              console.log(this.CusImgData.socket_id);
              console.log(this.CusImgData.message);
              console.log(this.CusImgData.image);
              console.log(this.CusImgData.file_path);

              this.chatService.saveImage(this.CusImgData).then((result) => {
                console.log('save Image from tinker');
                this.socket.emit('save-image', result);
              }, (err) => {
                console.log(err);
              });

            };
         

          }, (err) => {
            console.log(err);
          });
      
        //sessionID=193bc1f1-9799-40e7-a899-47b3aa1fbde3&path=/storage/emulated/0/WhatsApp/Media/WhatsApp%20Images/avator105.jpg
        }  // end else
      }  //end first else
    }  // end if (msg !== 'undefine')
  });

// User disconnect chat in operation mode
  // this.socket.on('disconnect', function(userid){
  //   console.log('Disconnect: ' + userid);
  //   var message = "User is disconnected!";
 
  //  this.CusMsgData = { phone_number: userid, socket_id: 'socket_id', room:userid , nickname:userid , message: message };
  //     console.log(this.CusMsgData.room);
  //     console.log(this.CusMsgData.phone_number);
  //     console.log(this.CusMsgData.socket_id);
  //     console.log(this.CusMsgData.message);
      
  //     this.chatService.saveChat(this.CusMsgData).then((result) => {
  //     this.socket.emit('save-message', result);
  //     }, (err) => {
  //       console.log(err);
  //     });
  // }.bind(this));
  // end of from johnson


    if(user!==null) {
      // this.getChatByRoom(user.room);  //from chatService
      // this.getRequestByRoom(request.phone_number);  //testing
      this.msgData = { phone_number: user.room, socket_id: user.socket_id, room: user.room, nickname: user.nickname, message: '' }
      this.joinned = true;
      this.scrollToBottom();
    }
    
    this.socket.on('new-message', function (data) {
      // console.log("data.message.room: " + data.message.room);
      // console.log("JSON.parse(localStorage.getItem('user')).room: " + (JSON.parse(localStorage.getItem("user")).room));
      // console.log("phone#: " + data.message.room);
      console.log("new-message: " + data.message.message);
    if (localStorage.getItem("user")!=null){
      if(data.message.room === JSON.parse(localStorage.getItem("user")).room) {
          user=JSON.parse(localStorage.getItem("user"));
        this.chats.push(data.message);
        this.msgData = { phone_number: user.room, socket_id: user.socket_id, room: user.room, nickname: user.nickname, message: '' }
        this.scrollToBottom();
            }
        }
    }.bind(this));


    this.socket.on('new-image', function (data) {
      console.log("new-image: " + data.room);
      
      if(data.room === JSON.parse(localStorage.getItem("user")).room) {
      console.log("new-image inside if: " + data.room);

        if (data.filename !== 'undefined'){
        // this.chats.push(data.message, data.filename);
        console.log("new-image: " + data.filename);
        this.chats.push(data);
        this.imgData = { phone_number: user.room, socket_id: user.socket_id, room: user.room, nickname: user.nickname, message: '', 
        filename: user.filename, image: user.image}
        // this.RetrievePhoto(data);
        this.scrollToBottom();
        }
      }
      
    }.bind(this));

    // console.log(this.ImageObject);

  }

    ngOnDestroy(){
        
        //socket.emit('forceDisconnect');
    this.socket.disconnect();
    // if (this.timer){
    //   clearInterval(this.timer);
    //   console.log('stop refreshing');
    // }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  getChatByRoom(room) {
     console.log("inside getChatbyRoom" +room);
    this.chatService.getChatByRoom(room).then((res) => {  //from chatService
      this.chats = res;
    }, (err) => {
      console.log(err);
    });
  }

  opJoinRoom() {   //operator join room
    // var socket_id =this.socket_id;
    // console.log('operator joinRoom using phone#: ' +this.newUser.room);

    this.Connect(this.newUser.room);  //operator join this room
    
    var date = new Date();

    localStorage.setItem("user", JSON.stringify(this.newUser));
    this.getChatByRoom(this.newUser.room);
    
    this.msgData = {phone_number:this.newUser.room, socket_id: this.newUser.socket_id, 
      room: this.newUser.room, nickname: this.newUser.nickname, message: '' };
    
    this.joinned = true;
    
    this.socket.emit('save-message', { phone_number:this.newUser.room, socket_id: this.newUser.socket_id, 
      room: this.newUser.room, nickname: this.newUser.nickname, message: ' Operator joined', updated_at: date });

    // this.socket.emit('user', this.newUser.room);
    
    // console.log('customer phone number: ' +this.newUser.room);
    // console.log('socket_id: ' +this.newUser.socket_id);



  }

  sendMessage() {
    var message = this.msgData.message;

    this.chatService.saveChat(this.msgData).then((result) => {
      this.socket.emit('save-message', result);
    }, (err) => {
      console.log(err);
    });
    this.SendForm(message);
  }

  logout() {
    console.log("disconnect customer and operator, then logout");
    var date = new Date();
    var room =this.newUser.room;
    var user = JSON.parse(localStorage.getItem("user"));
    
    this.socket.emit('save-message', { phone_number:user.room, socket_id: user.socket_id, room: user.room, nickname: user.nickname, message: 'Left this room', updated_at: date });
    localStorage.removeItem("user");
    this.joinned = false;

    //send goodbye message before logout()
    var goodbye = "goodbye";
    this.SendForm(goodbye);
    console.log("goodbye");

    this.Disconnect(room);

  }

  SendForm(message){
    console.log("operator is sending a message: " +message);
    // this.socket.emit('chat message',message);  //from admin to customer
    var obj = { type:"text", path:"null", message: message };
    this.socket.emit('chatMessageOperatorSession', obj);  //send json object from op to customer
    console.log("operator is sending object: " +obj);
    // return false;
  }

  Connect(phone_number){
    console.log("operator join the room: " +phone_number);
     this.socket.emit('connectuserOperatorSession', phone_number);
   
  }

  Disconnect(phone_number){
    console.log("disconnectuserOperatorSession: " +phone_number);
     this.socket.emit('disconnectuserOperatorSession', phone_number);
   
  }

  opSelectPhoto() {
    console.log('inside select Photo' );
    this.notSelected = false;
  }


  onOpFileSelected(event) {    

    this.selectedFile = event.target.files[0];
    console.log("event.target.files[0]: " +this.selectedFile);
    console.log("onOpFileSelected: " +this.selectedFile.name);
    // console.log("event.target.files: " +event.target.files);  //file list

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(this.selectedFile); // read file as data url
      // reader.readAsArrayBuffer(event.target.files[0]);  //read as Array buffer
      reader.onload = (event:any) => { // called once readAsDataURL is completed
        this.url = event.target.result;
        console.log("url: " +this.url);    //base64

      }
    }
  }
 
  SendPhoto(){

    console.log("admin is sending a photo: " +this.selectedFile );
    console.log("filename: " +this.selectedFile.name );
    console.log("nickname: " + this.newUser.nickname);
    console.log("room: " + this.newUser.room);
    console.log("socket_id: " + this.newUser.socket_id);
    console.log("message: " + this.msgData.message);

    //save to DB
    this.imgData = {phone_number:this.newUser.room, socket_id: this.newUser.socket_id, 
      room: this.newUser.room, nickname: this.newUser.nickname, 
      // message: this.msgData.message, filename: this.selectedFile.name, image:uploadImage }; 
            message: this.msgData.message, filename: this.selectedFile.name, image:this.url }; 

    this.chatService.saveImage(this.imgData).then((result) => {
      console.log('inside saveImage');
      this.socket.emit('save-image', result);
    }, (err) => {
      console.log(err);
    });
    

    // get admin sessionID
    var sID=localStorage.getItem('res.data.sessionID');
    
    //construct form data
    var formDataImage = new FormData();
    formDataImage.append('sessionID', sID);
    formDataImage.append('imagefilename', this.selectedFile.name);
    formDataImage.append('imagefile', this.selectedFile);

    console.log('formDataImage.sessionID: ' +sID);
    console.log('formDataImage.imagefilename: ' +this.selectedFile.name);
    // console.log('formDataImage.imagefile: ' +this.url);  //base64
    
    //post formdata to tinker
    this.chatService.postImage2Node(formDataImage).then((res) => {  //from chatService
      console.log("Image posted to tinker");
    }, (err) => {
      console.log(err);
    });

    //emit socket to android
    // console.log("admin is sending a photo: " +onFileSelected.fileName);
    var jsonMesg = {type:'', path:'', message:''};
    jsonMesg.type = "image";
    jsonMesg.path = "/storage/emulated/0/" +this.selectedFile.name;
    jsonMesg.message = this.msgData.message;
    console.log('jsonMesg.type: ' +jsonMesg.type);
    console.log('jsonMesg.path: ' +jsonMesg.path);
    console.log('jsonMesg.message: ' +jsonMesg.message);
    
    this.socket.emit('chatMessageOperatorSession', jsonMesg);
    this.notSelected = true;

  }

  CancelPhoto(){
    console.log('clicked cancel Photo' );
    this.notSelected = true;
  }


}

