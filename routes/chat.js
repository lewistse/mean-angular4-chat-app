var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var app = express();

//var server = require('http').createServer(app);

var fs = require('fs');
var key = fs.readFileSync('routes/encryption/pk.pem');
var cert = fs.readFileSync( 'routes/encryption/cert2.pem' );

var options = {
key: key,
cert: cert
//ca: ca
};

var server = require('https').createServer(options,app);

var io = require('socket.io')(server,{secure: true});
var Chat = require('../models/Chat.js');
var User = require('../models/User.js');
// var Request = require('../models/Request.js');


var userSocketID = new Array();
var userSocketIDAndUsername = new Array();
var adminSocketID = new Array();
var username = new Array();
var atou = {};
var utoa = {};

var operatorSessionUserConnected = false;

var userSocketIDOperatorChannel  = {};
var operatorSocketIDOperatorChannel = {};
var usernameOperatorChannel = {};

var port=global.socketIoPort;
server.listen(port);
console.log('Socket.io is listening on port:' + port);


 const bodyParser = require('body-parser');


 app.use(bodyParser.json());


// socket io
io.on('connection', function (socket) {
  // console.log('User connected');
  // // original disconnect
  // socket.on('disconnect', function() {
  //   console.log('User disconnected');
  // });

// start of "from johnson"

  // ack from client to server
  socket.on('KeepAliveMessage', (name, fn) => {
    if (operatorSessionUserConnected){
//      console.log('Send Ack');
      fn('ACK');
    }
  });


  socket.on('connectuser', function(SocketID){
    console.log(username[userSocketID.indexOf(SocketID)]+' connected to ' + socket.userid); //where is this socket.userid comes from???
    atou[socket.id] = SocketID;
    utoa[SocketID] = socket.id;
    io.to(atou[socket.id]).emit('adminConnected',SocketID);
    console.log(atou[socket.id]+' , '+utoa[userSocketID]);
  });

  socket.on('connectuserOperatorSession', function(phoneNumber){
    io.to(userSocketIDOperatorChannel).emit('operatorConnect',phoneNumber);
    usernameOperatorChannel = phoneNumber;
    console.log('Connected to: '+ phoneNumber);
    // io.to(socket.id).emit('users', {users: 'Connecting to: ' + phoneNumber + '.....'});
    io.to(socket.id).emit('users', phoneNumber, socket.id );  //Ben
  });


  socket.on('addContactOperatorSession', function(phoneNumber){
    console.log('Add Contact: '+ phoneNumber);
    // io.to(operatorSocketIDOperatorChannel).emit('users', {users: 'Connected to: ' + phoneNumber}); //no need for new UI
  });

  socket.on('deleteContactOperatorSession', function(phoneNumber){
    console.log('Delete Contact: '+ phoneNumber);
    // io.to(operatorSocketIDOperatorChannel).emit('users', {users: ''}); //no need in new UI
  });

  socket.on('disconnectuserOperatorSession', function(phoneNumber){
    io.to(userSocketIDOperatorChannel).emit('operatorConnect','disconnect');  // '' means disconnect on android app
    console.log('disconnected: '+ phoneNumber);
    // io.to(socket.id).emit('users', {users: 'Disconnecting: ' + phoneNumber + '.....'});  //this is for original plain UI only
  });

  socket.on('chatMessageOperatorSession', function(msg){
    if (operatorSocketIDOperatorChannel == socket.id){
      console.log('Operator sending msg "' + JSON.stringify(msg.message) + '" to ' + usernameOperatorChannel);
      // io.to(socket.id).emit('chat',socket.userid + ' (' + usernameOperatorChannel + '): '+ ': '+ JSON.stringify(msg.message));
      // io.to(socket.id).emit('chat',socket.userid , usernameOperatorChannel ,JSON.stringify(msg.message));
      io.to(userSocketIDOperatorChannel).emit('operatorToUser',msg);

      // modify this to json object
    // var obj = JSON.parse(msg);
    // var phoneNum = obj.sessionID;
    // var message = obj.message;
    }
    if (userSocketIDOperatorChannel == socket.id) {
      console.log(usernameOperatorChannel + ' sending msg "' + msg + '" to operator');
      // io.to(socket.id).emit('chat', msg);
      // io.to(socket.id).emit('chat', usernameOperatorChannel, msg);
      io.to(operatorSocketIDOperatorChannel).emit('chat', msg);  //Ben
    }
    
  });

  socket.on('user', function(userid){
    console.log("socket.on(user)" +userid+" socketid is "+socket.id);
      
    if(userid=='admin'){
      adminSocketID.push(socket.id);
      // io.to(socket.id).emit('users',{users:userSocketIDAndUsername});  //orginal
      io.to(socket.id).emit('users', userid, socket.id); //Ben
      console.log("admin emit socket.on(users)" +socket.id);
      console.dir("print array " +adminSocketID);
      // console.log("emit socket.on(users)" +{users:userSocketIDAndUsername});
    } else if (userid == 'operator') {
      console.log("emit socket.on(operator)" +socket.id);
      operatorSocketIDOperatorChannel = socket.id;
      io.to(socket.id).emit('users', userid, socket.id); //Ben, just to get the socket id
    } else if (userid == 'operatorSessionUser'){
      console.log("emit socket.on(operatorSessionUser)" +socket.id);
      userSocketIDOperatorChannel = socket.id;
      operatorSessionUserConnected = true;
      // io.to(socket.id).emit('users', userid, socket.id); //Ben
    } else {
      console.log(' Customer Lu log userid is '+ userid);   //userid is tel number
      
      userSocketIDAndUsername.push(userid + ' (' + socket.id + ')');
      userSocketID.push(socket.id);
      username.push(userid);
     
      for(var i in adminSocketID){
        //io.to(adminSocketID[i]).emit('users',{users:userSocketIDAndUsername});
          // orginal
          // io.to(adminSocketID[i]).emit('users',{users:userSocketIDAndUsername},socket.id);
          io.to(adminSocketID[i]).emit('users',userid,socket.id);
          // io.to(socket.id).emit('users',userid,socket.id);
          // io.to(adminSocketID[i]).emit('logRequest',userid,socket.id);
          console.log("emit (users) with userid" +userid+" to admin with socket ID " +adminSocketID[i]);
          // console.log("emit userSocketID " +socket.id);
          // console.log("emit username " +userid);

      }
    }
    socket.userid = userid;
    console.log(userid + ' (' +socket.id + ')' + ' is connected.' );

  });

  socket.on('chat message', function(msg){
    console.log('chatting...');
    console.log('socket.id:' + socket.id);
    if(atou[socket.id]){  //admin message
      //console.log('Admin sending msg "' + msg + '" to ' + username[userSocketID.indexOf(atou[socket.id])]);
      // io.to(socket.id).emit('chat',socket.userid +': '+ msg);
      // io.to(socket.id).emit('chat',socket.userid +': '+ msg); // this is for original admin page demo
        
        console.log('Admin sending msg "' + JSON.stringify(msg.message) + '" to ' + username[userSocketID.indexOf(atou[socket.id])]);
       //io.to(socket.id).emit('chat',socket.userid +': '+ msg);  //for chat request service
    //io.to(socket.id).emit('chat',socket.userid +': '+ JSON.stringify(msg.message)); //this is for original admin page demo
        
      io.to(atou[socket.id]).emit('adminchat',msg); //to android
    } else {  //customer message
      console.log(username[userSocketID.indexOf(socket.id)] + ' sending msg "' + msg + '" to admin');
      // io.to(socket.id).emit('chat',msg); // this is for original admin page demo
      io.to(utoa[socket.id]).emit('chat',msg);  //to android
    }
  });

  socket.on('disconnect', function(){
    if (socket.userid != null){

      if (socket.userid == 'admin'){
        // adminSocketID.pop();

        var index = adminSocketID.indexOf(socket.id);
        if (index > -1) {
          adminSocketID.splice(index, 1);
        }

        console.dir("print array " +adminSocketID);
        console.log("remove admin socket.on(users) from array" +socket.id);
      }


      if (socket.userid != 'admin'){
        // userSocketIDAndUsername.pop(socket.userid + ' (' + socket.id + ')');
        // userSocketID.pop(socket.id);
        // username.pop(socket.userid);

        // console.log("remove userSocketID from array " +socket.id);
        // console.log("remove username from array " +socket.userid);
        

      // for(var i in adminSocketID){
      //   io.to(adminSocketID[i]).emit('users',{users:userSocketIDAndUsername});
      // }
        var index = userSocketIDAndUsername.indexOf(socket.userid + ' (' + socket.id + ')');
        if (index > -1) {
          userSocketIDAndUsername.splice(index, 1);
        }

        index = userSocketID.indexOf(socket.id);
        if (index > -1) {
          userSocketID.splice(index, 1);
        }

        index = username.indexOf(socket.userid);
        if (index > -1) {
          username.splice(index, 1);
        }

        for(var i in adminSocketID){
          // io.to(adminSocketID[i]).emit('users',{users:userSocketIDAndUsername}); //no need it new UI
        }
      }
        else   //Lu test
            {
                index = adminSocketID.indexOf(socket.id);
//                if (index > -1) {
//                    adminSocketID.splice(index, 1);
//                }
                
            }

      if (socket.userid == 'operatorSessionUser'){
        operatorSessionUserConnected = false;
      }
      
      //io.to(utoa[socket.id]).emit('disconnect',socket.userid + " disconnected");
      console.log(socket.userid + ' disconnected');

    }
  });
  // end of "from johnson"


  // save-message
  socket.on('save-message', function (data) {
    console.log("save-message: " +data);
    io.emit('new-message', { message: data });
  });

  // save-image
  socket.on('save-image', function (data) {
    // console.log(data);
    console.log("new image in room: " +data.room);
    console.log("new message in image: " +data.message);
    console.log("new filename: " +data.filename);
    // io.emit('new-image', {message: data.message, filename: data.filename});
    io.emit('new-image', data);

  });

}); //io.on


/* GET ALL CHATS, THIS IS THE REAL ROOM */
router.get('/:room', function(req, res, next) {
  // Chat.find({ room: req.params.room }, function (err, chats) {
    Chat.find({ $and:
    [
      { room: req.params.room },
      { socket_id: { $exists: true } }, 
      { nickname: {$exists:true, $ne:"robot" } }  //filter robot reply
    
    ]
    }, function (err, chats) {
    if (err) return next(err);
    res.json(chats);
  });
});

/* GET SINGLE CHAT BY ID */
router.get('/id/:id', function(req, res, next) {
  Chat.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* SAVE CHAT postman POST path:192.168.0.102:4080/chat/*/
router.post('/', function(req, res, next) {
  Chat.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* UPDATE CHAT */
router.put('/:id', function(req, res, next) {
  Chat.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE CHAT */
router.delete('/:id', function(req, res, next) {
  Chat.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET home page. */   /* Lewis */
router.get('/', function(req, res) {
  //  res.send("Hello world 2 !!!");
  //res.send('index');
    res.sendFile(path.join(distDir,'index.html'));
});


/* GET ALL REQUESTS 192.168.0.102:4080/chat/request/all*/ 
router.get('/request/all', function(req, res, next) {
  Chat.find(req.body, function (err, chats) {
    if (err) return next(err);
    res.json(chats);
  });
});

/* GET ALL REQUESTS with phone# and socket id 192.168.0.102:4080/chat/requests/human*/ 
router.get('/request/human', function(req, res, next) { 
  Chat.find({ $and: 
    [ 
      { phone_number: {  $exists: true } }, 
      { socket_id: { $exists: true } }, 
      { nickname: { $exists: false } },
      { operator_request: { $exists: false } }
      // { status: "New" } 
    ]
  }, function (err, chats) {
    if (err) return next(err);
    res.json(chats);
  })
});

/* GET ALL REQUESTS with phone# and socket id 192.168.0.102:4080/chat/requests/human*/ 
router.get('/request/operator', function(req, res, next) { 
  Chat.find({ $and: 
    [ 
      { phone_number: {  $exists: true } }, 
      { operator_request: { $exists: true } }
      // { status: "New" } 
    ]
  }, function (err, chats) {
    if (err) return next(err);
    res.json(chats);
  })
});


// db.inventory.find( { $and: [ { price: { $ne: 1.99 } }, { price: { $exists: true } } ] } )

/* GET ALL REQUESTS in same room 192.168.0.102:4080/chat/request/room1*/ 
router.get('/requestroom/:room', function(req, res, next) {
  // Chat.find({ room: req.params.room }, function (err, requests) {
    Chat.find({ $and:
    [
      { room: req.params.room },
      { socket_id: { $exists: true } }, 
      { nickname: {$exists:true, $ne:"robot" } }  //filter robot reply
    
    ]
  }, function (err, chats) {
    if (err) return next(err);
    res.json(chats);
  });
});

/* GET SINGLE REQUEST BY ID */
router.get('/request/:id', function(req, res, next) {
  Chat.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET SINGLE REQUEST BY socket ID */
router.get('/requestsid/:socket_id', function(req, res, next) {
  Chat.find({socket_id:req.params.socket_id}, function (err, chats) {
    if (err) return next(err);
    res.json(chats);
  });
});

/* SAVE REQUEST */
router.post('/request', function(req, res, next) {
  Chat.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* UPDATE REQUEST */
router.put('/request/:id', function(req, res, next) {
  Chat.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE REQUEST */
router.delete('/request/:id', function(req, res, next) {
  Chat.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


/* GET ALL USERS in same room 192.168.0.102:4080/chat/user/all*/ 
router.get('/user/all', function(req, res, next) {
  User.find( req.body, function (err, users) {
    if (err) return next(err);
    res.json(users);
  });
});

/* GET SINGLE user BY ID */
router.get('/user/:id', function(req, res, next) {
  User.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


/* SAVE user */
router.post('/user', function(req, res, next) {
  User.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* UPDATE user */
router.put('/user/:id', function(req, res, next) {
  User.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE user */
router.delete('/user/:id', function(req, res, next) {
  User.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET SINGLE user BY phone_number */
router.get('/userphone/:phone_number', function(req, res, next) {
  User.find({phone_number:req.params.phone_number}, function (err, users) {
    if (err) return next(err);
    res.json(users);
  });
});

/* UPDATE user by user phone number*/
router.put('/userupdate/:phone_number', function(req, res, next) {
  User.findOneAndUpdate({phone_number:req.params.phone_number}, req.body, function (err, users) {
    if (err) return next(err);
    res.json(users);
  });
});



// Get image
/* GET ALL USERS in same room 192.168.0.102:4080/chat/image/all*/ 
router.get('/image/all', function(req, res, next) {
  // Chat.find( req.body, function (err, images) {
   Chat.find({ $and:
    [
      // { room: req.params.room },
      { filename: { $exists: true } }, 
      { nickname: { $exists:true, $ne:"robot" } }  //filter robot reply
    
    ]
  }, function (err, images) {  
    if (err) return next(err);
    res.json(images);
  });
});

/* GET IMAGE BY ROOM, THIS IS THE REAL ROOM */
router.get('/image/:room', function(req, res, next) {
  // Chat.find({ room: req.params.room }, function (err, chats) {
    Chat.find({ $and:
    [
      { room: req.params.room },
      { filename: { $exists: true } },  //image filename exist
      { nickname: {$exists:true, $ne:"robot" } }  //filter robot reply
    
    ]
    }, function (err, chats) {
    if (err) return next(err);
    res.json(chats);
  });
});

/* GET SINGLE image BY ID */
router.get('/imageid/:id', function(req, res, next) {
  Chat.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


/* SAVE image */
router.post('/image', function(req, res, next) {
  Chat.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});



/* DELETE image */
router.delete('/image/:id', function(req, res, next) {
  Chat.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


module.exports = router;
