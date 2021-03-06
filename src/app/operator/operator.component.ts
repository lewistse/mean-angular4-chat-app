import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import * as io from 'socket.io-client';
import * as $ from 'jquery';

@Component({
  selector: 'app-operator',
  templateUrl: './operator.component.html',
  styleUrls: ['./operator.component.css']
})
export class OperatorComponent implements OnInit {

  socket = io('https://airpoint.com.hk:3087',{secure: true});
  // socket = io('https://airpoint.com.hk:3637',{secure: true});
  connected = false;

  constructor() { }

  ngOnInit() {

//      history.pushState({},"Edit","");
      
  // var socket = io('http://192.168.0.102:3637');
  
  // this.socket.emit('user','operator');

  this.socket.on('users', function(data){
  //alert(JSON.stringify(data));
  $('#users').empty();
  for(var i in data){
    $('#users').append('<li>'+data[i]+'</li>');
  }});

  this.socket.on('chat', function(msg){
    $('#messages').append('<li>'+msg+'</li>');
      //$('#messages').append('<li>'+msg[3]+'</li>');
  });

}

    ngOnDestroy(){
        
        //socket.emit('forceDisconnect');
        this.socket.disconnect();
        
    }
    
  SendForm(){
  	console.log("operator is sending a message");
      var obj = { type:"text", path:"null", message: $('#m').val() };
      this.socket.emit('chatMessageOperatorSession', obj);
    //this.socket.emit('chatMessageOperatorSession', $('#m').val());
      
    $('#m').val('');
    // return false;
  }

  ConnectNumber(){
  	console.log("operator pressed connect button");
    if ($('#u').val() != ''){
      if (this.connected == false){
        this.socket.emit('connectuserOperatorSession', $('#u').val());
        $('#btnConnect').html('Disconnect');
        this.connected = true;
        // return false;
      } else {
        this.socket.emit('disconnectuserOperatorSession', $('#u').val());
        $('#btnConnect').html('Connect Number');
        this.connected = false;
        $('#u').val('');
        $('#messages').empty();
        // return false;
      }
    } else {
      alert("Please input phone number!");
    }
    // return false;
  }


}
