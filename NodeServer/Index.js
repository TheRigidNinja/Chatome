const express = require("express"),
  app = express(),
  http = require("http").Server(app),
  io = require("socket.io")(http),
  profile = require("./HANDLERS/serveProfile"),
  messaging = require("./HANDLERS/ServeMessaging");

io.on("connection", socket => {
  // Getting All Profile data for all users
  socket.on("GetAllProfileData", async (res, key) => {
    var profileDataRetrieval = await profile.serveProfile(res);

    // Emits back to client all profile data from all users
    io.emit("AllProfileData", profileDataRetrieval, key);
  });

  // Handles getting individual accounts MSG from DataBase
  socket.on("GetMessages", async (res, key) => {
    var msgData = await messaging.serverMessaging(res);

    io.emit("MSGChannel", msgData, key);
  });

  // Write MSG to DataBase
  socket.on("SendMessage", async (res, key) => {
    var msg = {
      [res.messageKey]: [{ [res.name]: res.message, timeStamp: String(res.timeStamp) }]
    },
    checkInDB = /[|]/g.test(res.messageKey);
    
    if(checkInDB == false){
      io.emit("MSGChannel", msg, key,"msg");
    }
    
    var sendMSG = await messaging.sendMessage(res, key);

    // Tries to get messages 
    if(checkInDB === true){
      res.messageKey = sendMSG.messageKey;

      var msg = {
        [res.messageKey]: [{ [res.name]: res.message, timeStamp: String(res.timeStamp) }]
      };

      // sendMSG.messageKey
      io.emit("MSGChannel", msg, key,"msg");
    }
  });

  socket.on('UserOffline',(res)=> {
      console.log(res);
  });
});

// const mySqlDB = require("./HANDLERS/MySQLDB");
// (async () => {
//   var resLogin = { uuID: "8ADuY8NxkSd3MaqT3WM72ZEpznN2", checkInType: "Login" };
//   var resRegister = {
//     uuID: "AI5QLJJJnNVbK1OTzgfvxKblaX62",
//     picture: "../public/img/User.svg",
//     userName: "user56",
//     status: "Online",
//     ID: null,
//     checkInType: "Register",
//     messageKey: "29b.9e9ad4aaeea",
//     phoneUpdate: 1559710329000,
//     accountCreatedDATE: 1559710329000,
//     emailUpdate: 1559710329000,
//     pictureUpdate: 1559710329000
//   };

//   var res = {
//       msg: "Hello",
//       checkInType: "Chats",
//       messageKey: "2ee.31466e7a912ee.31466e7a91",
//       name: "TheRigidNinja",
//       timeStamp: 1559907165000
//     },
//     dbType = { db: "TestingDB", dbTable: "Test1" };
//   console.log(await mySqlDB.DataTomySQL(resRegister, dbType));
// })//();

// ---- // Middleware
// app.get("/users",(req,res)=>{res.render("Inbox")});
// app.get("/users/'name'/",(req,res)=>{res.render("Inbox")});
// app.get("/users/'name'/profile",(req,res)=>{res.render("Inbox")});
// app.get("/users/'id'/messages",(req,res)=>{res.render("Inbox")});

app.get("/", (req, res) => {
  res.send("Connection was a Success");
});
// Making Server Live
http.listen(process.env.PORT || 8080, function() {
  console.table({ "Host URL --> ": "http://localhost:8080" });
});
