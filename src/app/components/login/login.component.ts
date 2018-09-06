import { Component, OnInit } from '@angular/core';
import { AuthService, TokenPayload } from '../../auth/auth.service';
import { Router } from '@angular/router';
//import { Configs } from '../../configurations';
import { Configs } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  credentials: TokenPayload = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router, private configs: Configs) {}

  ngOnInit() {      
    if (!sessionStorage.getItem('loginTinkerDone'))
      {
        sessionStorage.setItem('loginTinkerDone', "0");
        console.log('login ngOnInit');
      }
  }

  login() {
    this.authService.login(this.credentials).subscribe(() => {
      console.log('login user is done and now login to tinker');
      //login to tinker
      if (sessionStorage.getItem('loginTinkerDone')=="0"){
        // this.auth.loginTinker(this.configs.angularAddr+"/"+this.configs.tinkerport);
        this.authService.loginTinker();
        // sessionStorage.setItem('loginTinkerDone', "1");
      }
           
      // this.router.navigateByUrl('/api/profile');
      // this.router.navigateByUrl('/chat/request');
      this.router.navigate(['/chat/request']);
      console.log("redirect the link to request");
    }, (err) => {
      console.error(err);
    });
  }
}