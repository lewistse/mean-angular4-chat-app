import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild, Input, HostBinding } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as io from 'socket.io-client';
import * as $ from 'jquery';
import { Buffer } from 'buffer';
//import { Configs } from '../configurations';
import { Configs } from '../../environments/environment';
import { AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-broadcast-detail',
  templateUrl: './broadcast-detail.component.html',
  styleUrls: ['./broadcast-detail.component.css']
})
export class BroadcastDetailComponent implements OnInit {

  @HostBinding('class.view-broadcast') 
  viewBroadcast: any;
  broadcast: any =[];
  viewResult: boolean = false;
  viewDetail: boolean = true;
  addBroadcastPage: boolean = false;
  viewResultPage: boolean = false;
  notSelected: boolean = true;
  url = '';
  pdfSrc = '';  
  showImage: boolean = false;
  addImage: boolean = false;
  showPdfFilename: boolean = false;
  addPdf: boolean = false;
  enableBroadcast: any = [];
  disableBroadcast: any = [];
  jobDetail: any = [];
  selectedImage: File;
  compressedImage: File;
  csvFile: File;   
  filename: string;
  urlMessage: string;
  tinkerKey: string;
  popUpEmoji: boolean = false;
  fileExtention: string;
  showResultDetail: boolean = false;
  showMessageBox: boolean = true;
  showGroupName: boolean = true;
  showSenderPhoneNumber: boolean = true;
  basic = null;
  flash = null;
  group = null;
  whatsapp = null;
  wechat = null;
  line = null;
  showCsvFile: boolean = true;
  showBroadcastMode: boolean = true;
  selectUser: boolean = false;
  showUsers: boolean = false;
  allContacts: any;
  addUserToList: any = [];
  disableButton: boolean = false;
  selectWhatsappFile: boolean = true;
  selectNonWhatsappFile: boolean = false;

  @ViewChild('myCsv') myInputVariable: ElementRef;

  broadcastDetail = { jobID:'', message: '', contactListCsvName:'', imagefile:'', imagefilename:'', notSendAck:'', prependContactName:'', jobStatus:'', groupName:'', senderPhoneNumber:''};    
  newBroadcast = { jobID:'', message:'', contactListCsvName: '', imagefile:'', imagefilename:'', notSendAck:'',prependContactName:'', jobStatus:'', groupName:'', senderPhoneNumber:''};  
  viewResults = {jobID:'', jobStatus:''};
  updateTinkerStatus = { enableBroadcast:''};

  constructor(private chatService: ChatService, private authService: AuthService, private route: ActivatedRoute, private configs: Configs) {}

  ngOnInit() {

//    this.newBroadcast = { jobID:'', message:'', contactListCsvName: '', imagefile:'', imagefilename:'', notSendAck:'',prependContactName:'', jobStatus:'', groupName:'', senderPhoneNumber:''};  
  	this.newBroadcast.prependContactName = "Y";	//Yes
    this.flash = "flash";
    this.whatsapp = "whatsapp"
    this.showSenderPhoneNumber = false;

    this.chatService.change.subscribe(viewBroadcast => {
      console.log("this.viewBroadcast.jobID: "+viewBroadcast.jobID);
      this.broadcastDetail = viewBroadcast;

      this.showBroadcastDetail(this.broadcastDetail.jobID);

    });

  }

  showBroadcastDetail(jobID){

		this.chatService.getBroadcastbyJobId(jobID).then((res) => {  //from chatService, 
	      this.broadcast = res;

        if (this.broadcast[0] !=undefined){
          if (this.broadcast[0].imagefile != ''){
            console.log(this.broadcast[0].imagefile);          
                   
            if (this.broadcast[0].imagefilename !=''){
              console.log(this.broadcast[0].imagefilename);  

              this.fileExtention = (this.broadcast[0].imagefilename).split(".")[1];

              if (this.fileExtention == "pdf"){              
                this.showMessageBox = true;  //Lu test
                this.showPdfFilename = true;
                this.showImage = false;                      
              } else {              
                this.showMessageBox = true;
                this.showPdfFilename = false;         
                this.showImage = true;
              }            
            }    
          } else {  //text only
                this.showMessageBox = true;
                this.showPdfFilename = false;         
                this.showImage = false;            

          }
          
          if (this.broadcast[0].jobStatus == 'Completed'){
            this.showResultDetail =true;
            console.log('this.broadcast.Results' + this.broadcast[0].jobStatus);
            console.log('this.broadcast.Results' + this.broadcast[0].Results[0].Phone);
            
          }else {
            this.showResultDetail = false;
            console.log('this.broadcast.Results' + this.broadcast[0].jobStatus);
            
          }

        }

	    }, (err) => {
	      console.log(err);
	    });
  }
   
  saveBroadcastDetail(){

    if (this.whatsapp == 'whatsapp'){
      
      console.log("create new broadcast job");    
      // console.log("prepend name: " + this.newBroadcast.prependContactName);
    }

  	
    if (this.wechat == 'wechat'){

      console.log("create new Wechat broadcast job");  
    }
    
    if (this.line == 'line'){
      
      console.log("create new Line broadcast job");
    }

  	this.newBroadcast.jobStatus = "Pending";

    // get admin sessionID
    var sID=localStorage.getItem('res.data.sessionID');
      
    //construct form data
    var enable = new FormData();
    enable.append('sessionID', sID);
    // formDataImage.append('imagefilename', this.selectedImage.name);
    // formDataImage.append('imagefile', this.compressedImage);
	     
	  if (window.confirm('Once broadcast job is submitted, opeartor and administrator chat services will not be available until the job is completed!')){
			
			this.chatService.enableBroadcast(enable).then((res) => {

				this.enableBroadcast = res;
				console.log("Enable broadcast: " +this.enableBroadcast.success);
				
        if (this.enableBroadcast.success == true){

            this.tinkerKey = "running";
            this.updateTinkerStatus.enableBroadcast = "true";

            this.authService.updateTinker(this.tinkerKey, this.updateTinkerStatus).then((res) => {
              
              console.log("update tinker status");
            
            }, (err) => {
              console.log(err);        
            });  

        }
				
        // check if image is attached and post to tinker 				  
				if ((this.url.length != 0) || (this.pdfSrc.length !=0)){	//broadcast image

					console.log("newBroadcast.imagefile: " + this.compressedImage);
  				console.log("newBroadcast.imagefilename: " + this.selectedImage.name);
					
          if (this.whatsapp == 'whatsapp'){
  			    //construct form data
  			    var boardcastImage = new FormData();
  			    boardcastImage.append('sessionID', sID);
  			    // boardcastImage.append('message', this.newBroadcast.message);
  			    boardcastImage.append('prependContactName', this.newBroadcast.prependContactName); 					
  			    boardcastImage.append('contactListCsv', this.csvFile);			    
  			    boardcastImage.append('imagefilename', this.selectedImage.name);
  			    boardcastImage.append('imagefile', this.compressedImage);  				

            if ((this.newBroadcast.groupName !=undefined)&&(this.newBroadcast.senderPhoneNumber !=undefined)){
              // boardcastImage.append('groupName', this.newBroadcast.groupName);
              boardcastImage.append('senderPhoneNumber', this.newBroadcast.senderPhoneNumber);   
              this.urlMessage = this.newBroadcast.message + '&groupName=' + this.newBroadcast.groupName;

            } else {

              this.urlMessage = this.newBroadcast.message;
              // console.log('encodeURI: '+encodeURI(this.urlMessage));
            }

  					//write to DB
  					this.chatService.broadcastImage(boardcastImage, encodeURI(this.urlMessage)).then((res) => {  //from chatService, 
  				  
  				    // window.alert('Broadcast job with image is submitted successfully!');

  				    this.jobDetail = res;

  						if (this.jobDetail.jobID !=undefined){

  							this.newBroadcast.jobID = this.jobDetail.jobID;
  					  	this.newBroadcast.contactListCsvName = this.csvFile.name;						  	
  					  	this.newBroadcast.imagefilename = this.selectedImage.name;

                console.log('this.fileExtention' +this.fileExtention);

                if (this.fileExtention =='pdf'){

                  this.newBroadcast.imagefile = this.pdfSrc;

                } else {

                  this.newBroadcast.imagefile = this.url;

                }
  				

  							//write to DB
  							this.chatService.saveBroadcast(this.newBroadcast).then((res) => {  //from chatService, 
  						  
  						    // window.alert('Broadcast job is uploaded to DB successfully!');
  						  }, (err) => {
  						    console.log(err);
  						    window.alert('Write Broadcast to DB failed!');
  						  });	  
  						} else {
  							console.log("not able to get job ID");
  						}

  				  	this.viewBroadcastDetail();  

  				  }, (err) => {
  				    console.log(err);
  				    window.alert('Add Broadcast job failed!');
  				  });	  	
          }		

          if (this.wechat == 'wechat'){ 

            console.log("new wechat image broadcast flow");   

                if (this.fileExtention =='pdf'){

                  // this.newBroadcast.imagefile = this.pdfSrc;
                  var base64WechatImage = ((this.pdfSrc).split(",")[1]);
                } else {
                  var base64WechatImage = ((this.url).split(",")[1]);
                }

                        
            // var base64WechatImage = ((this.url).split(",")[1]);
            var jsonWechatImage = {sessionID:"Aptc123456", message:this.newBroadcast.message , prependContactName:"Y", imagefilename:this.selectedImage.name, imagefileBase64:base64WechatImage, contactListJson:{contactList: this.addUserToList}}
             console.log("wechat image:" +base64WechatImage);

            //write to DB
            this.chatService.broadcastWechat(jsonWechatImage).then((res) => {  //from chatService, 
            
              // window.alert('Broadcast job with image is submitted successfully!');

              this.jobDetail = res;

              if (this.jobDetail.jobID !=undefined){

                this.newBroadcast.jobID = this.jobDetail.jobID;
                this.newBroadcast.contactListCsvName = "Wechat User list";                
                this.newBroadcast.imagefilename = this.selectedImage.name;

                console.log('this.fileExtention' +this.fileExtention);

                if (this.fileExtention =='pdf'){

                  this.newBroadcast.imagefile = this.pdfSrc;

                } else {

                  this.newBroadcast.imagefile = this.url;

                }
          

                //write to DB
                this.chatService.saveBroadcast(this.newBroadcast).then((res) => {  //from chatService, 
                
                  // window.alert('Broadcast job is uploaded to DB successfully!');
                }, (err) => {
                  console.log(err);
                  window.alert('Write Broadcast to DB failed!');
                });    
              } else {
                console.log("not able to get job ID");
              }

              this.viewBroadcastDetail();  

            }, (err) => {
              console.log(err);
              window.alert('Add Broadcast job failed!');
            });               
          }
          
          if (this.line == 'line'){ 

            console.log("new Line image broadcast flow");
            if (this.fileExtention =='pdf'){

              // this.newBroadcast.imagefile = this.pdfSrc;
              var base64LineImage = ((this.pdfSrc).split(",")[1]);
            } else {

              var base64LineImage = ((this.url).split(",")[1]);
            }            

            // var base64LineImage = ((this.url).split(",")[1]);            
            var jsonLineImage = {sessionID:"Aptc123456", message:this.newBroadcast.message , prependContactName:"Y", imagefilename:this.selectedImage.name, imagefileBase64:base64LineImage, contactListJson:{contactList: this.addUserToList}}

            //write to DB
            this.chatService.broadcastLine(jsonLineImage).then((res) => {  //from chatService, 
            
              // window.alert('Broadcast job with image is submitted successfully!');

              this.jobDetail = res;

              if (this.jobDetail.jobID !=undefined){

                this.newBroadcast.jobID = this.jobDetail.jobID;
                this.newBroadcast.contactListCsvName = "Line user list";                
                this.newBroadcast.imagefilename = this.selectedImage.name;

                console.log('this.fileExtention' +this.fileExtention);

                if (this.fileExtention =='pdf'){

                  this.newBroadcast.imagefile = this.pdfSrc;

                } else {

                  this.newBroadcast.imagefile = this.url;

                }
          

                //write to DB
                this.chatService.saveBroadcast(this.newBroadcast).then((res) => {  //from chatService, 
                
                  // window.alert('Broadcast job is uploaded to DB successfully!');
                }, (err) => {
                  console.log(err);
                  window.alert('Write Broadcast to DB failed!');
                });    
              } else {
                console.log("not able to get job ID");
              }

              this.viewBroadcastDetail();  

            }, (err) => {
              console.log(err);
              window.alert('Add Broadcast job failed!');
            });               
          }


				} else {	//image not exists

					console.log("No imagefile");

          if (this.whatsapp == 'whatsapp'){
  			    //construct form data
  			    var boardcastMessage = new FormData();

  			    boardcastMessage.append('sessionID', sID);
  			    // boardcastMessage.append('message', this.newBroadcast.message);
  			    boardcastMessage.append('prependContactName', this.newBroadcast.prependContactName); 					
  			    boardcastMessage.append('contactListCsv', this.csvFile);

            if ((this.newBroadcast.groupName !='')&&(this.newBroadcast.senderPhoneNumber !='')){
              // boardcastImage.append('groupName', this.newBroadcast.groupName);
              boardcastMessage.append('senderPhoneNumber', this.newBroadcast.senderPhoneNumber);   
              this.urlMessage = this.newBroadcast.message + '&groupName=' + this.newBroadcast.groupName;
              // console.log('group sent encodeURI: '+encodeURI(this.urlMessage));
              console.log(this.newBroadcast.message + '&groupName=' + this.newBroadcast.groupName);

            } else {

              this.urlMessage = this.newBroadcast.message;
              // console.log('encodeURI: '+encodeURI(this.urlMessage));
            }

  					//write to DB
  					this.chatService.broadcastMessage(boardcastMessage, encodeURI(this.urlMessage)).then((res) => {  //from chatService, 
  				  
  				    // window.alert('Broadcast job with message only is submitted successfully!');

  				    this.jobDetail = res;

  						if (this.jobDetail.jobID !=undefined){

  							this.newBroadcast.jobID = this.jobDetail.jobID;
  					  	this.newBroadcast.contactListCsvName = this.csvFile.name;		

  							//write to DB
  							this.chatService.saveBroadcast(this.newBroadcast).then((res) => {  //from chatService, 
  						  
  						    // window.alert('Broadcast job is uploaded to DB successfully!');
  						  }, (err) => {
  						    console.log(err);
  						    window.alert('Write Broadcast to DB failed!');
  						  });	  
  						} else {
  							console.log("not able to get job ID");
  						}

  				    this.viewBroadcastDetail();

  				  }, (err) => {
  				    console.log(err);
  				    window.alert('Add Broadcast job failed!');
  				  });	
          }

          if (this.whatsapp != 'whatsapp'){

            
            if (this.wechat == 'wechat'){ 
              console.log("new wechat text broadcast flow");
              var jsonWechatData = {sessionID:"Aptc123456", message:this.newBroadcast.message , prependContactName:"Y", contactListJson:{contactList: this.addUserToList}}
              //write to tinker
              this.chatService.broadcastWechat(jsonWechatData).then((res) => {  //from chatService, 
              
                // window.alert('Broadcast job with message only is submitted successfully!');
                console.log("wechat broadcasted");
                this.jobDetail = res;

                if (this.jobDetail.jobID !=undefined){

                  this.newBroadcast.jobID = this.jobDetail.jobID;
                  this.newBroadcast.contactListCsvName = "Wechat User list";    

                  //write to DB
                  this.chatService.saveBroadcast(this.newBroadcast).then((res) => {  //from chatService, 
                  
                    // window.alert('Broadcast job is uploaded to DB successfully!');
                  }, (err) => {
                    console.log(err);
                    window.alert('Write Broadcast to DB failed!');
                  });    
                } else {
                  console.log("not able to get job ID");
                }

                this.viewBroadcastDetail();

              }, (err) => {
                console.log(err);
                window.alert('Add Wechat Broadcast job failed!');
              });
              
            }
            
            if (this.line == 'line'){ 
              console.log("new Line text broadcast flow");
              var jsonLineData = {sessionID:"Aptc123456", message:this.newBroadcast.message , prependContactName:"Y", contactListJson:{contactList: this.addUserToList}}
              //write to tinker
              this.chatService.broadcastLine(jsonLineData).then((res) => {  //from chatService, 
                
                console.log("line broadcasted");
                // window.alert('Broadcast job with message only is submitted successfully!');

                this.jobDetail = res;

                if (this.jobDetail.jobID !=undefined){

                  this.newBroadcast.jobID = this.jobDetail.jobID;
                  this.newBroadcast.contactListCsvName = "Line User list";    

                  //write to DB
                  this.chatService.saveBroadcast(this.newBroadcast).then((res) => {  //from chatService, 
                  
                    // window.alert('Broadcast job is uploaded to DB successfully!');
                  }, (err) => {
                    console.log(err);
                    window.alert('Write Broadcast to DB failed!');
                  });    
                } else {
                  console.log("not able to get job ID");
                }

                this.viewBroadcastDetail();

              }, (err) => {
                console.log(err);
                window.alert('Add Line Broadcast job failed!');
              });
            
            }            
          }
        }

		  }, (err) => {
		    console.log(err);
		    window.alert('Add Broadcast job failed!');
		  });	  	

	  } else {
	  	console.log('Broadcast job is cancelled')
	  }

  }

  updateBroadcastDetail(){
  	// this.editUser = this.user;
  	// console.log(this.userDetail.phone_number);
  	// console.log(this.userDetail.nickname);

		this.chatService.updateBroadcast(this.broadcastDetail.jobID, this.broadcastDetail).then((res) => {  //from chatService, 
	      
	    window.alert('Broadcast detail is updated successfully!\nPress "View" button in User List to view updated data!');
	  }, (err) => {
	    console.log(err);
	    window.alert('Update user detail failed!');
	  });
		this.viewBroadcastDetail();
  }

  viewBroadcastDetail(){

		this.viewResult = false;
		this.viewDetail = true;
		this.viewResultPage = false; 
		this.addBroadcastPage = false;   	

  	console.log('view Broadcast detail!');
  }

  viewJobResult(){

		this.viewResult = true;
		this.viewDetail = false;
		this.viewResultPage = true; 
		this.addBroadcastPage = false; 	

  	console.log('edit Broadcast detail!');
  }

  createBroadcast(){

    this.newBroadcast = { jobID:'', message:'', contactListCsvName: '', imagefile:'', imagefilename:'', notSendAck:'',prependContactName:'', jobStatus:'', groupName:'', senderPhoneNumber:''};  
    this.newBroadcast.prependContactName = "Y";	//Yes
    this.flash = "flash";
    this.basic = "null";
    this.group ="null";
    this.showSenderPhoneNumber = false;

      //this.csvFile=null;
//      this.myInputVariable.nativeElement.value = "";
      
      //this.csvData=null;
      this.clearSelectedFile();
     
  	this.viewResult = true;
		this.viewDetail = false;
		this.viewResultPage = false; 
		this.addBroadcastPage = true; 
		this.filename = '';
    this.showMessageBox = true;
  	console.log(' add Broadcast!');

  }

  exit() {
    console.log("Exit the Broadcast Detail");
    this.viewResult = false;
  }    

  onImageFileSelected(event) {    

    // this.compressedFile = event.target.files[0];

    // this.selectedFile = this.compressFile();
    this.selectedImage = event.target.files[0];


    console.log("event.target.files[0]: " +this.selectedImage);
    console.log("onFileSelected name: " +this.selectedImage.name);
    // console.log("event.target.files: " +event.target.files);  //file list

    
      
    if (event.target.files && event.target.files[0]) {

      this.fileExtention = (this.selectedImage.name).split(".")[1];            
      console.log('file extension: ' +this.fileExtention);      

      if (this.fileExtention != "pdf"){
        this.addImage = true;
        this.addPdf = false;
        this.showMessageBox = true;

        var reader = new FileReader();
        reader.readAsDataURL(this.selectedImage); // read file as data url
        // reader.readAsArrayBuffer(event.target.files[0]);  //read as Array buffer
        reader.onload = (event:any) => { // called once readAsDataURL is completed        
        // this.url = event.target.result;
        // console.log("url: " +this.url);    //base64

        var img = new Image();
        var imageSize:any;
        var roundedImageSize:any;

        img.src = event.target.result;        

        //jpeg -> base64, size increase 33%. scale factor = 0.75 to get the actual file size
        imageSize = (encodeURI(img.src).split(/%..|./).length - 1)*0.75/1024;
        roundedImageSize = Math.round(imageSize);  

        // this.fileExtention = (this.selectedImage.name).split(".")[1];
        console.log('file size : ' + roundedImageSize +'kB');        
        // console.log('file extension: ' +this.fileExtention); 
        // console.log('image: ' + img.src );

          img.onload = () => {
           
            var canvas: HTMLCanvasElement = document.createElement("canvas");
            var ctx: CanvasRenderingContext2D = canvas.getContext("2d");

            console.log('img.width: ' +img.width);
            console.log('img.height: ' +img.height);           

            canvas.width = img.width;
            canvas.height = img.height;
            
            // img.width and img.height will give the original dimensions
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            console.log('drawing image: ' + canvas.width +',' + canvas.height);

            if (this.fileExtention == 'gif') {
              if (roundedImageSize <1100){

                // this.url=ctx.canvas.toDataURL('image/gif', 1.0) ;
                this.url = event.target.result;
                // console.log(this.url);     
                this.compressedImage = this.selectedImage;

              } else {

                window.alert('Not supported! Gif file size cannot exceed 1MB!');
                this.url = '';
                this.compressedImage = null;

              }

            } else {

              if (roundedImageSize < 100) {

                this.url=ctx.canvas.toDataURL('image/jpeg', 1.0) ;

                console.log (this.url);

                ctx.canvas.toBlob((blob) => {

                  this.compressedImage = new File([blob], this.selectedImage.name, {
                    type: 'image/jpeg',
                    lastModified: Date.now()
                  });
                }, 'image/jpeg', 1.0);
              }  

              if ((roundedImageSize >= 100) && (roundedImageSize <500))  {

                this.url=ctx.canvas.toDataURL('image/jpeg', 0.7) ;

                console.log (this.url);

                ctx.canvas.toBlob((blob) => {

                  this.compressedImage = new File([blob], this.selectedImage.name, {
                    type: 'image/jpeg',
                    lastModified: Date.now()
                  });
                }, 'image/jpeg', 0.7);
              }            

              if ((roundedImageSize >= 500) && (roundedImageSize <5000)){

                this.url=ctx.canvas.toDataURL('image/jpeg', 0.5) ;

                console.log (this.url);

                ctx.canvas.toBlob((blob) => {

                  this.compressedImage = new File([blob], this.selectedImage.name, {
                    type: 'image/jpeg',
                    lastModified: Date.now()
                  });
                }, 'image/jpeg', 0.5);
              }

              if ((roundedImageSize >= 5000) && (roundedImageSize <16000)){

                window.alert('Image will be compressed significantly as the file is large!');

                this.url=ctx.canvas.toDataURL('image/jpeg', 0.2) ;

                console.log (this.url);

                ctx.canvas.toBlob((blob) => {

                  this.compressedImage = new File([blob], this.selectedImage.name, {
                    type: 'image/jpeg',
                    lastModified: Date.now()
                  });
                }, 'image/jpeg', 0.2);
              }            

              if (roundedImageSize >= 16000) {
                
                window.alert('Not supported! Image size is too large!');
                this.url = '';
                this.compressedImage = null;

              }
            }

          },
            reader.onerror = error => console.log(error)
        }
      } else {

        this.addImage = false;
        this.addPdf = true;
        this.showMessageBox = true;  //Lu test        
        console.log("pdf flow");
        var reader = new FileReader();
        reader.readAsDataURL(this.selectedImage); // read file as data url        
        reader.onload = (event:any) => { // called once readAsDataURL is completed        
          this.pdfSrc = event.target.result;
          this.compressedImage = this.selectedImage;
          console.log("pdfSrc: " +this.pdfSrc);    //base64       
        } 
          this.url = '';
      }
    
    }
        event.target.value='';

  } 

  onCSVSelected(event) {    

    // this.compressedFile = event.target.files[0];

    // this.selectedFile = this.compressFile();
    this.csvFile = event.target.files[0];


    console.log("event.target.files[0]: " +this.csvFile);
    console.log("csvFile name: " +this.csvFile.name);
    // console.log("event.target.files: " +event.target.files);  //file list

    if (event.target.files && event.target.files[0]) {

      var reader = new FileReader();
      reader.readAsText(this.csvFile); // read file as data url
      // reader.readAsArrayBuffer(event.target.files[0]);  //read as Array buffer
      reader.onload = (event:any) => { // called once readAsDataURL is completed        
        // this.url = event.target.result;
        // console.log("url: " +this.url);    //base64

        // var img = new Image();
        // var imageSize:any;
        // var roundedImageSize:any;

        var csvData = event.target.result;   
        console.log("csv Data: " +csvData );
      }

      reader.onerror = error => console.log(error)    
    }
      
    //  event.target.value='';

  } 

  addEmoji(event){

    // console.log(event.emoji.native);
    
    this.newBroadcast.message += event.emoji.native;
  }

  popUpEmojiBox(){

    this.popUpEmoji = !this.popUpEmoji;
  }

  clearSelectedFile(){

    console.log("clear selected file");
      
    this.selectedImage =null;
      this.url = '';
    this.pdfSrc = '';
    this.compressedImage = null;
    this.addImage = false;
    this.addPdf = false;
    this.showMessageBox = true;

  }

  clickBasic(){

    if (this.basic!="basic"){
       this.createBroadcast();
    }
    this.basic="basic";
    this.showGroupName = false;
    this.showSenderPhoneNumber = false;
    this.flash = null;
    this.group = null;
      this.csvFile = null;
//      this.csvFile.name="";
      this.myInputVariable.nativeElement.value = "";
  }

  clickFlash(){
    if (this.flash!="flash"){
      this.createBroadcast();
    }
    this.flash="flash";
    this.showGroupName = true;
    this.showSenderPhoneNumber = false;
    this.basic = null;
    this.group = null;
      this.csvFile = null;
//      this.csvFile.name="";
      this.myInputVariable.nativeElement.value = "";
  }

  clickGroup(){
    if (this.group!="group"){
      this.createBroadcast();
    }
    this.group="group";
    this.showGroupName = true;
    this.showSenderPhoneNumber = true;
    this.basic = null;
    this.flash = null;
      this.csvFile = null;
//      this.csvFile.name="";
      this.myInputVariable.nativeElement.value = "";
  }

  clickWhatsapp(){
    if (this.whatsapp!="whatsapp"){
      this.createBroadcast();
    }
    this.whatsapp="whatsapp";
    this.flash="flash";    
    this.showCsvFile = true;
    this.wechat = null;
    this.line = null;
    this.showBroadcastMode = true;
    this.showGroupName = true;
    this.selectUser = false;
    this.showUsers = false;
    this.selectNonWhatsappFile = false;
    this.selectWhatsappFile = true;     
//     this.showSenderPhoneNumber = true;
//     this.basic = null;
//     this.flash = null;
//       this.csvFile = null;
// //      this.csvFile.name="";
      // this.myInputVariable.nativeElement.value = "";
  }

  clickWechat(){
    if (this.wechat!="wechat"){
      this.createBroadcast();
    }
    this.wechat="wechat";
    this.showCsvFile = false;
    this.whatsapp = null;
    this.line = null;
    this.showBroadcastMode = false;
    this.showGroupName = false;
    this.selectUser = true;
    this.showUsers = false;
    this.selectNonWhatsappFile = true;
    this.selectWhatsappFile = false;    
//     this.showSenderPhoneNumber = true;
//     this.basic = null;
//     this.flash = null;
//       this.csvFile = null;
// //      this.csvFile.name="";
      // this.myInputVariable.nativeElement.value = "";
  }

  clickLine(){
    if (this.line!="line"){
      this.createBroadcast();
    }
    this.line="line";
    this.showCsvFile = false;
    this.wechat = null;
    this.whatsapp = null;
    this.showBroadcastMode = false;
    this.showGroupName = false;
    this.selectUser = true;
    this.showUsers = false;
    this.selectNonWhatsappFile = true;
    this.selectWhatsappFile = false;
//     this.showSenderPhoneNumber = true;
//     this.basic = null;
//     this.flash = null;
//       this.csvFile = null;
// //      this.csvFile.name="";
      // this.myInputVariable.nativeElement.value = "";
  } 

  selectUsers(){
    
    this.showUsers = true;
    this.addUserToList =[];
    console.log("addUserToList" +this.addUserToList);    
    if (this.wechat=="wechat"){
      console.log("select wechat users");
      this.chatService.getAllWechatContact().then((res) => {  //from chatService, 
        this.allContacts = res;
      }, (err) => {
        console.log(err);
      });      
    }
    
    if (this.line=="line"){
      console.log("select line users");
      this.chatService.getAllLineContact().then((res) => {  //from chatService, 
        this.allContacts = res;
      }, (err) => {
        console.log(err);
      });      
    }    
  }

  addUsers(name, id){
    console.log("user info: " +name +id);

    if (this.wechat=="wechat"){
    
      var broadcastWechatObj = {name:'' , wechatId: ''};
      broadcastWechatObj.name = name;
      broadcastWechatObj.wechatId = id;
      this.addUserToList.push(broadcastWechatObj);
      console.log("addUserToList" +this.addUserToList);

    }
    
    if (this.line=="line"){
    
      var broadcastLineObj = {name: '', lineId: ''};
      broadcastLineObj.name = name;
      broadcastLineObj.lineId = id;
      this.addUserToList.push(broadcastLineObj);
      console.log("addUserToList" +this.addUserToList);

    }

  }       

}
