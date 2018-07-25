import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { Router } from '@angular/router';
import { Configs } from './../configurations';
import { of } from 'rxjs/observable/of';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';


export interface UserDetails {
  _id: string;
  email: string;
  name: string;
  exp: number;
  iat: number;
}

interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  email: string;
  password: string;
  name?: string;
}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
    //  'Content-Type':'application/x-www-form-urlencoded'
    //'Authorization': 'my-auth-token'
  })
};

@Injectable()
export class AuthService {

private token: string;

  constructor(private http: HttpClient, private router: Router, private configs: Configs) {}

  private saveToken(token: string): void {
    localStorage.setItem('mean-token', token);
    this.token = token;
  }

  private getToken(): string {

    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
      // console.log("getToken: " +this.token);
    }
    return this.token;
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    // console.log("getUserDetails: ");
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  private request(method: 'post'|'get', type: 'login'|'register'|'profile', user?: TokenPayload): Observable<any> {
    let base;

    if (method === 'post') {
      console.log("request post base" );
      // base = this.http.post(`/api/${type}`, user);
      if (type === 'register') {
      base = this.http.post('https://airpoint.com.hk:4060/api/register', user);
      console.log("register post base" );
      }
      if (type === 'login') {
      base = this.http.post('https://airpoint.com.hk:4060/api/login', user);
      console.log("login post base" );
      }
      
    } else {
      console.log("request method: GET" );
      // base = this.http.get(`/api/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }});
      base = this.http.get('https://airpoint.com.hk:4060/api/profile', { headers: { Authorization: `Bearer ${this.getToken()}` }});
    }

    const request = base.pipe(
      map((data: TokenResponse) => {
        console.log("before data.token" );
        if (data.token) {
          console.log("inside data.token" );
          // if (type === 'login'){
            this.saveToken(data.token);
          // }
        }
        return data;
      })
    );

    return request;
  }

  public register(user: TokenPayload): Observable<any> {
    console.log("inside register auth.service");
    console.log("name: " + user.name);
    console.log("email: " + user.email);
    console.log("password: " + user.password);
    return this.request('post', 'register', user);
  }

  public login(user: TokenPayload): Observable<any> {
    console.log("inside login auth.service");
    return this.request('post', 'login', user);
  }

  public profile(): Observable<any> {
    console.log("inside profile auth.service");
    return this.request('get', 'profile');
  }

  public logout(): void {
    this.token = '';
    window.localStorage.removeItem('mean-token');
    this.logoutTinker();
    console.log("logout tinker");
    
    // sessionStorage.removeItem('expressport');
    // sessionStorage.removeItem('socketioport');
    // sessionStorage.removeItem('tinkerport');
    // sessionStorage.clear();

    this.router.navigateByUrl('/');
    console.log("logout user");
  }

  private handleErrorObservable (error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
  }

  // public loginTinker(port:string) :boolean{
  public loginTinker() :boolean{
     
    // this.http.post (this.configs.tinkerboardAddr+":"+sessionStorage.getItem("tinkerport")+'/api/user/login', {
    this.http.post (this.configs.tinkerboardAddr+':'+this.configs.tinkerport+'/api/user/login', {
      userID: 'admin',
      Password: 'admin'
    }, httpOptions)
    .pipe(
      catchError(this.handleErrorObservable)
    )
    .subscribe(
        res => {
          localStorage.setItem('res.data.sessionID', res.data.sessionID);  //Lu test storage
          this.router.navigate(['/chat/request']);
          sessionStorage.setItem('loginTinkerDone', "1");
          return true;
        });



    return true;
  }

  // public logoutTinker(port:string): boolean{
  public logoutTinker(): boolean{
    var sID2 = '222';
    sID2=localStorage.getItem('res.data.sessionID');
      
    // this.http.post (this.configs.tinkerboardAddr+":"+sessionStorage.getItem("tinkerport")+'/api/user/logout'+'?sessionID='+sID2, {
    this.http.post (this.configs.tinkerboardAddr+':'+this.configs.tinkerport+'/api/user/logout'+'?sessionID='+sID2, {
    }, httpOptions)
      .pipe(
      catchError(this.handleErrorObservable)
      )
      .subscribe(
        res => {
          localStorage.removeItem('res.data.sessionID');
          return true;
        });
      sessionStorage.setItem('loginTinkerDone','0');
      // sessionStorage.removeItem('loginTinkerDone');
      return true;      
  }
}

