import { Injectable } from '@angular/core';
// import { Http, Headers, ResponseContentType } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/map';
//import { Configs } from './configurations';
import { Configs } from './../environments/environment';
// import { AuthserviceService } from './authservice.service'
import { AuthService, TokenPayload } from './auth/auth.service';

// let httpOptions = {
//   headers: new Headers({
//     // 'Content-Type':  'multipart/form-data'
//     'Content-Type':  'application/octet-stream'
//     'Content-Disposition':  'form-data; filename = '
//     // 'Content-Type':  'application/json'
//     //  'Content-Type':'application/x-www-form-urlencoded'
//     //'Authorization': 'my-auth-token'
//   })
// };

interface TokenResponse {
  token: string;
}


@Injectable()
export class ChatService {

  private token: string;

  // constructor(private http : Http, private configs: Configs,private authService: AuthserviceService) { }
  constructor(private http : HttpClient, private configs: Configs,private authService: AuthService) { }
  //private serverUrl = 'https://airpoint.com.hk:3088';
  // private serverUrl = 'https://airpoint.com.hk:4060';
    //sessionStorage.setItem("expressport",self.userProfile[this.configs.angularAddr+"/expressport"]);
  private serverUrl = this.configs.expressAddr;
  private tinkerUrl = this.configs.tinkerboardAddr +':'+this.configs.tinkerport ;

  private getToken(): string {

    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
      // console.log("getToken: " +this.token);
    }
    return this.token;
  }
    
    // updateUrl(){
    //     this.serverUrl = "https://airpoint.com.hk"+":"+sessionStorage.getItem("expressport");
    //     this.tinkerUrl = "https://airpoint.com.hk"+":"+sessionStorage.getItem("tinkerport");
    // }
    
    //sessionStorage.setItem("serverUrl",serverUrl);
   // sessionStorage.setItem("tinkerUrl",tinkerUrl);

  // private dataSubject: BehaviorSubject<YourDataModel[]> = new BehaviorSubject([]);
  // private dataSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});

  // data$: Observable<any> = this.dataSubject.asObservable();

  // updateData(): Observable<any>  {
  //   // return this.getData().do((data) => {
  //   //   this.dataSubject.next(data);
  //   //   console.log("updateData");
  //   // });

  //    console.log("getData");
  //     var data = 'getdata';
  //     return data;

  // }  

  // My data is an array of model objects
  // getData(): Observable<any>{
  //   return this.http.get(this.serverUrl+'/chat/request/human')
  //     .map(res => {
  //       let data = res.json()
  //       if(data){
  //           return data;
  //         }
  //       })

      
  //     .map((response: Response) => {
  //       let data = response.json() && response.json().your_data_objects;
  //       let data = res.json();
  //         if(data){
  //           return data;
  //         }
  //     })
  // }

  getChatByRoom(room) {    //here we use room as phone_number
    return new Promise((resolve, reject) => {
      this.http.get(this.serverUrl+'/chat/' + room, { headers: { Authorization: `Bearer ${this.getToken()}` }})
        // .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  showChat(id) {
    return new Promise((resolve, reject) => {
        this.http.get(this.serverUrl+'/chat/id/' + id, { headers: { Authorization: `Bearer ${this.getToken()}` }})
          // .map(res => res.json())
          .subscribe(res => {
            resolve(res)
        }, (err) => {
          reject(err);
        });
    });
  }

  saveChat(data) {
    return new Promise((resolve, reject) => {
        this.http.post(this.serverUrl+'/chat', data, { headers: { Authorization: `Bearer ${this.getToken()}` }})
          // .map(res => res.json())
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
    });
  }

  updateChat(id, data) {
    return new Promise((resolve, reject) => {
        this.http.put(this.serverUrl+'/chat/'+id, data, { headers: { Authorization: `Bearer ${this.getToken()}` }})
          // .map(res => res.json())
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
    });
  }

  deleteChat(id) {
    return new Promise((resolve, reject) => {
        this.http.delete(this.serverUrl+'/chat/'+id, { headers: { Authorization: `Bearer ${this.getToken()}` }})
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
    });
  }

  // get all Request
  getAllRequest() {
    return new Promise((resolve, reject) => {
      this.http.get(this.serverUrl+'/chat/request/all', { headers: { Authorization: `Bearer ${this.getToken()}` }} )
        // .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }


 // get customer request except opeartor and robot
  getHumanRequest(human) {
    return new Promise((resolve, reject) => {
      // this.updateUrl();
      // this.http.get(this.serverUrl+'/chat/request/human')
      this.http.get(this.serverUrl+'/chat/request/human', { headers: { Authorization: `Bearer ${this.getToken()}` }} )
        // .map(res: TokenResponse())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

 // get customer request except opeartor and robot
  getNewRequestCount() {
    return new Promise((resolve, reject) => {
      // this.updateUrl();
      this.http.get(this.serverUrl+'/chat/newrequest/human', { headers: { Authorization: `Bearer ${this.getToken()}` }})
        // .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  // get operator Request
  getOperatorRequest(){
    return new Promise((resolve, reject) => {
        // this.updateUrl();
      this.http.get(this.serverUrl+'/chat/request/operator', { headers: { Authorization: `Bearer ${this.getToken()}` }} )
        // .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  // get all chats in room
  getAllChatHistory(phoneNum){
    return new Promise((resolve, reject) => {
        // this.updateUrl();
      this.http.get(this.serverUrl+'/chat/roomhistory/' +phoneNum, { headers: { Authorization: `Bearer ${this.getToken()}` }} )
        // .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  // Request, room refer to phone number
  // getRequestByRoom(room) {
  //   return new Promise((resolve, reject) => {
  //     this.http.get(this.serverUrl+'/chat/requestroom/' + room)
  //       // .map(res => res.json())
  //       .subscribe(res => {
  //         resolve(res);
  //       }, (err) => {
  //         reject(err);
  //       });
  //   });
  // }

  // showRequest(id) {
  //   return new Promise((resolve, reject) => {
  //       this.http.get(this.serverUrl+'/chat/request' + id)
  //         // .map(res => res.json())
  //         .subscribe(res => {
  //           resolve(res)
  //       }, (err) => {
  //         reject(err);
  //       });
  //   });
  // }

  //  showRequestSocket(id) {
  //   return new Promise((resolve, reject) => {
  //       this.http.get(this.serverUrl+'/chat/requestsid' + id)
  //         // .map(res => res.json())
  //         .subscribe(res => {
  //           resolve(res)
  //       }, (err) => {
  //         reject(err);
  //       });
  //   });
  // }

  saveRequest(data) {
    return new Promise((resolve, reject) => {
        this.http.post(this.serverUrl+'/chat/request', data)
          // .map(res => res.json())
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
    });
  }

  updateRequest(id, data) {
    return new Promise((resolve, reject) => {
        this.http.put(this.serverUrl+'/chat/request/'+id, data, { headers: { Authorization: `Bearer ${this.getToken()}` }})
          // .map(res => res.json())
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
    });
  }

  deleteRequest(id) {
    return new Promise((resolve, reject) => {
        this.http.delete(this.serverUrl+'/chat/request/'+id, { headers: { Authorization: `Bearer ${this.getToken()}` }})
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
    });
  }

  //get all users

  getAllUser() {
    return new Promise((resolve, reject) => {
      this.http.get(this.serverUrl+'/chat/user/all', { headers: { Authorization: `Bearer ${this.getToken()}` }})
        // .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }


  showUser(phoneNum) {
    return new Promise((resolve, reject) => {
        this.http.get(this.serverUrl+'/chat/userphone/' + phoneNum)
          // .map(res => res.json())
          .subscribe(res => {
            resolve(res)
        }, (err) => {
          reject(err);
        });
    });
  }


  saveUser(data) {
    return new Promise((resolve, reject) => {
        this.http.post(this.serverUrl+'/chat/user', data, { headers: { Authorization: `Bearer ${this.getToken()}` }})
          // .map(res => res.json())
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
    });
  }

  updateUser(phoneNum, data) {
    return new Promise((resolve, reject) => {
        this.http.put(this.serverUrl+'/chat/userupdate/'+phoneNum, data, { headers: { Authorization: `Bearer ${this.getToken()}` }})
          // .map(res => res.json())
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
    });
  }

  deleteUser(phoneNum) {
    return new Promise((resolve, reject) => {
        this.http.delete(this.serverUrl+'/chat/userdelete/'+phoneNum, { headers: { Authorization: `Bearer ${this.getToken()}` }})
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
    });
  }

//get all images
  getAllImage() {
    return new Promise((resolve, reject) => {
      this.http.get(this.serverUrl+'/chat/image/all', { headers: { Authorization: `Bearer ${this.getToken()}` }})
        // .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  //get image by room
  getImageByRoom(room) {    //here we use room as phone_number
    return new Promise((resolve, reject) => {
      this.http.get(this.serverUrl+'/chat/image' + room, { headers: { Authorization: `Bearer ${this.getToken()}` }})
        // .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

// Show signle image by ID
  showImage(id) {
    return new Promise((resolve, reject) => {
        this.http.get(this.serverUrl+'/chat/image' + id, { headers: { Authorization: `Bearer ${this.getToken()}` }})
          // .map(res => res.json())
          .subscribe(res => {
            resolve(res)
        }, (err) => {
          reject(err);
        });
    });
  }

// Save image to DB
  saveImage(object) {
    return new Promise((resolve, reject) => {
        this.http.post(this.serverUrl+'/chat/image', object, { headers: { Authorization: `Bearer ${this.getToken()}` }})
          // .map(res => res.json())
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
    });
  }

// delete signle image by ID
  deleteImage(id) {
    return new Promise((resolve, reject) => {
        this.http.delete(this.serverUrl+'/chat/image/'+id, { headers: { Authorization: `Bearer ${this.getToken()}` }})
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
    });
  }

  //post formdata image to tinker
  postImage2Node(formdata) {
    return new Promise((resolve, reject) => {
      console.log("formdata: " +formdata);
      console.log("formdata.sessionID: " +formdata.sessionID);
      console.log("formdata.imagefilename: " +formdata.imagefilename);

      // this.http.post('https://192.168.0.157:8011/api/csp/postimage', formdata, httpOptions )
     this.http.post(this.tinkerUrl +'/api/csp/postimage', formdata )
         // .map(res => res.json())
         .subscribe(res => {
           resolve(res);
           // console.log("post successful");
         }, (err) => {
           reject(err);
           // console.log("post failed");
         });
    });
  }

    //get image from tinker
  getImageFromNode(path) {
    return new Promise((resolve, reject) => {
      console.log("path: " +path);

      // path = sessionID=193bc1f1-9799-40e7-a899-47b3aa1fbde3&path=/storage/emulated/0/WhatsApp/Media/WhatsApp%20Images/avator105.jpg
     // this.http.get(this.tinkerUrl +'/api/csp/getimage?'+path,{responseType: ResponseContentType.Blob} )  //for old angular http module
     this.http.get(this.tinkerUrl +'/api/csp/getimage?'+path,{responseType: "blob"} )
         // .map(res => res.blob())
         .subscribe(res => {
           resolve(res);
           console.log("get image successful");
           // console.log(res);
           
         }, (err) => {
           reject(err);
           console.log("get image failed");
         });
    });
  }


  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

}
