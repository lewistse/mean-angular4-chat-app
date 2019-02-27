import { Injectable } from '@angular/core';
//import { AuthserviceService } from './authservice.service';

@Injectable()
export class Configs {
  
  //    constructor(public authService: AuthserviceService) {}
    
  // angularAddr: string = 'https://cs.roboassistant.ai:3101';
  // expressAddr: string = 'https://cs.roboassistant.ai:3004';
  // socketIoServerAddr: string = 'https://cs.roboassistant.ai:3003';   
  // tinkerboardAddr: string = 'https://cs.roboassistant.ai';
  // tinkerport: string = '8013';

  // multiChatAddr: string = 'https://cs.roboassistant.ai';
  // multiChatPort: string = '3992';
  // multiChatCode: string = 'Aptc123456';

  angularAddr: string = 'https://cs.roboassistant.ai:4080';
  expressAddr: string = 'https://cs.roboassistant.ai:4060';
  socketIoServerAddr: string = 'https://cs.roboassistant.ai:3637';   
  tinkerboardAddr: string = 'https://cs.roboassistant.ai';
  tinkerport: string = '8006';
  tinkerpassword: string = 'Aptc123456';

  ngrok: boolean = true;  //true = ngrok, false = 443 route server

  multiChatNgrokAddr: string = ' https://79fec3a3.ngrok.io'; 
  multiChatAddr: string = 'https://cs.roboassistant.ai'; 
  multiChatPort: string = '3891';
  multiChatCode: string = 'Aptc123456';
  


  // angularAddr: string = 'https://airpoint.com.hk:4080';
  // expressAddr: string = 'https://airpoint.com.hk';
  // socketIoServerAddr: string = 'https://airpoint.com.hk';   
  // tinkerboardAddr: string = 'https://airpoint.com.hk';
  
   // loginTinkerDone:string="0";
    
// update server express addr in app.js
 //global.expressIp = 'https://192.168.0.102';
 //global.expressPort = 3088;

// update mongodb addr and name in app.js
 //global.dbIp = 'mongodb://192.168.0.102/';
 //global.dbName = 'luChatService';
}

export const csRegPath = "api/registerID/afc-tXO0TlCMMyZUrdf6Ca5_C6PA3rmf7CkKlfwg10w";
export const environment = {
    
  production: true

};
