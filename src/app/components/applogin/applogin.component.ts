//import { OnInit } from '@angular/core';
//
//@Component({
//  selector: 'app-applogin',
//  templateUrl: './applogin.component.html',
//  styleUrls: ['./applogin.component.css']
//})
//export class ApploginComponent implements OnInit {
//
//  constructor() { }
//
//  ngOnInit() {
//  }
//
//}

import { Component }   from '@angular/core';
import { Router }      from '@angular/router';
import { AuthserviceService } from '../../authservice.service';
//import { Configs } from '../../configurations';
import { Configs } from '../../../environments/environment';

@Component({
    selector: 'app-applogin',
    templateUrl: './applogin.component.html',
//  template: `
//    <h2>LOGIN</h2>
//    <p>{{message}}</p>
//    <p>
//      <button (click)="login()"  *ngIf="!authService.isLoggedIn">Login</button>
//      <button (click)="logout()" *ngIf="authService.isLoggedIn">Logout</button>
//    </p>`,
    styleUrls: ['./applogin.component.css']
})
export class ApploginComponent {
  message: string;

    
  constructor(public authService: AuthserviceService, public router: Router, private configs: Configs) {
      authService.handleAuthentication();
      
      
//      if (this.profile1){
//          console.log("profile1 exist!!!");
//      }else
//          console.log("profile1 not exist!!!");
      
    //this.setMessage();
  }

  setMessage() {
    this.message = 'You are logged ' + (this.authService.isAuthenticated() ? 'in' : 'out');
  }

    
    profile1: any;
    
    //static loginTinkerDone="0";
    
    ngOnInit() {
        
        if (!sessionStorage.getItem('loginTinkerDone'))
            {
                sessionStorage.setItem('loginTinkerDone', "0");
                //localStorage.setItem('gotProfileDone', "0");
            }
//    if (this.authService.userProfile) {
//      this.profile1 = this.authService.userProfile;
//     } else {
//      this.authService.getProfile((err, profiley) => {
//        this.profile1 = profiley;
//      });
//    }
  }
    ngDoCheck(){
        
        if (this.authService.isAuthenticated()){
            
    //if ((!this.profile1)){
       if (this.authService.userProfile) {
           
           if ((!this.profile1)){
            this.profile1 = this.authService.userProfile;
            //localStorage.setItem('gotProfileDone', "1");
            console.log("got profile1 from auth service!!!");
           }
           
        } 
        else {
            
            this.authService.getProfile((err, profiley) => {
            if (err==null){
                this.profile1 = profiley;}else{
            //localStorage.setItem('gotProfileDone', "1");
            //console.log("got profile1 from getProfile call!!!");
            console.log("got profile1 err which is "+err+" !!!");}
            });
        }
   //         }
    
    }
  }
    
    ngAfterViewChecked(){
        if (this.authService.isAuthenticated()){
        if (this.profile1&&(sessionStorage.getItem('loginTinkerDone')=="0")){
        //console.log("nickname is  "+this.profile1.nickname+"  by Lu");
            //if (localStorage.getItem('loginTinkerDone')=="0"){
        this.authService.loginTinker(this.profile1[this.configs.angularAddr+"/tinkerport"]);
//                {
                    sessionStorage.setItem('loginTinkerDone', "1");
//                 //localStorage.setItem('loginTinkerDone',"1");
//                }
                //}
        
            }
        }
    }
    
  login() {
    this.message = 'Trying to log in ...';
      this.authService.login();
 //     this.profile1=this.authService.handleAuthentication();
      
//      if (this.authService.userProfile) {
//      this.profile1 = this.authService.userProfile;
//     } else {
//      this.authService.getProfile((err, profiley) => {
//        this.profile1 = profiley;
//      });
//    }
      console.log("right after login");
      //this.profile1=this.authService.userProfile;
//    this.authService.login().subscribe(() => {
//      this.setMessage();
//      if (this.authService.isAuthenticated()) {
//        // Get the redirect URL from our auth service
//        // If no redirect has been set, use the default
//        let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '';
//
//        // Redirect the user
//        this.router.navigate([redirect]);
//      }
//    });
      

  }

  logout() {
   //   localStorage.removeItem('loginTinkerDone');
      //if (this.authService.logoutTinker(this.profile1[this.configs.angularAddr+"/tinkerport"])){
    this.authService.logout(this.profile1[this.configs.angularAddr+"/tinkerport"]);
      //}else{
        //  console.log ("some problem here in tinker logout??");
      //this.authService.logout();}
 //   this.setMessage();
  }
}