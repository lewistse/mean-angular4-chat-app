# mean-angular4-chat-app

This source code is part of tutorial [Building Chat Application using MEAN Stack (Angular 4) and Socket.io](https://www.djamware.com/post/58e0d15280aca75cdc948e4e/building-chat-application-using-mean-stack-angular-4-and-socketio)

Step to run:

* Prepare Node.js and Angular CLI
* Clone this repo
* Run 'npm install'
* Run 'ng build --prod'
* Run 'nodemon' or 'npm start'

If you think this source code is useful, it will be great if you just give it star or just buy me a cup of cofee [![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=Q5WK24UVWUGBN)


<!-- Ben  -->
<!-- Enable angular to update automatically -->
sudo ng serve --poll=2000

Simple MEAN apps

https://www.youtube.com/watch?v=wtIvu085uU0

MongoDB
Express
Angular
NodeJS

Create
Read
Update
Delete

environment:
Install npm
Install node


Create a MEAN project under the project directory. Server side
- npm init 
- npm install dependency components
  	- sudo npm install express --save
  	- sudo npm install mongoose cors body-parser --save
	- sudo npm install nodemon
	
Client side
	under angular project folder
	- sudo npm install @angular/cli
	- sudo npm install socket.io-client
	- sudo npm install @types/socket.io-client


- Create an angular folder, you need to rename the package.json file, after the new ng file is created, rename the package.json
  	- ng new client	//new projectFolderName

- Create new component under angular project folder
    - Ng g c componentName
    - Ng g s serviceName



Make sure mongoDB is running with auth enabled and admin user set up

- use admin

db.createUser(
  {
    user: "admin",
    pwd: "abc123",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
  }
)


//Re-start the MongoDB instance with access control.
mongod --auth --port 27017 --dbpath /data/db
mongod --auth --port 27017 --dbpath /var/lib/mongodb
mongod --port 27017 --dbpath /var/lib/mongodb

//To authenticate during connection
mongo --port 27017 -u "admin" -p "abc123" --authenticationDatabase "admin"

//To authenticate after connected
use admin
db.auth("admin", "abc123" )

//grant the role at first time
db.grantRolesToUser("admin", [ { role: "read", db: "admin" } ])
db.grantRolesToUser("owner", [ { role: "readWrite", db: "chatService" } ])


// then admin can assign role to other users
use chatService
db.createUser(
  {
    user: "owner",
    pwd: "xyz123",
    roles: [ { role: "readWrite", db: "chatService" },
             { role: "readWrite", db: "contactlist" } ]
  }
)


privileges: [
  { resource: { db: "products", collection: "inventory" }, actions: [ "find", "update", "insert" ] },
  { resource: { db: "products", collection: "orders" },  actions: [ "find" ] }
]


// show users
db.getUsers()

//remove users
db.dropUser("user")

//change pw to SOh3TbYhxuLiW8ypJPxmt1oOfL
db.changeUserPassword("reporting", "SOh3TbYhxuLiW8ypJPxmt1oOfL")


// To dump chatService DB in default folder /dump
mongodump --gzip --db chatService

// To archive and gzip chatService DB to gz file under /dump folder 
mongodump --gzip --archive=dump/chatServiceBackUp.20181025.gz --db chatService 

// To archive and gzip chats collection of chatService DB to gz file under /dump folder with filtering in the query.json file.
mongodump --gzip --archive=dump/chatServiceBackUp.20181025.gz --db chatService  --collection chats --queryFile query.json

// To restore chatService DB from folder /dump/chatService
mongorestore --gzip --db chatService dump/chatService

// To restore chatService DB from gz and archive file under /dump folder
mongorestore --gzip --archive=dump/chatServiceBackUp.20181025.gz --db chatService


Check mongoDB command
- mongo
- Show dbs
- Show collections
- use dbs
- Db.collectionName.find().pretty()
- db.collection.drop()
db.user.remove({})
db.chats.remove({})

Execute on server side:
npm start 

Execute on client side:
ng serve -o --port 4080 --env=prod --host 0.0.0.0 --ssl true --ssl-key ./routes/encryption/privkey.pem --ssl-cert ./routes/encryption/cert.pem --public airpoint.com.hk

node version.js
ng serve -o --port 4080 --configuration=production --host 0.0.0.0 --ssl true --ssl-key ./routes/encryption/privkey.pem --ssl-cert ./routes/encryption/cert.pem --public-host cs.roboassistant.ai

export GOOGLE_APPLICATION_CREDENTIALS="/home/bchong/Webapps/googleCredentials.json"
node index.js

./ngrok http 3991

#Line
https://developers.line.me/console/channel/1594950287/basic/

#Wechat
https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login

adb push .\configuration.json /storage/emulated/0/whatsAppQueueMessagesJobs/configuration.json


