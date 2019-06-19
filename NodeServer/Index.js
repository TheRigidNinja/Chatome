const express = require("express"),
  app = express(),
  http = require("http").Server(app),
  io = require("socket.io")(http),
  profile = require("./HANDLERS/serveProfile"),
  messaging = require("./HANDLERS/ServeMessaging");

var connectClients = {};
var roomSubscribe = [];

io.on("connection", socket => {
  // --- // Checks user name if taken
  socket.on("FetchUserNames", async req => {
    let warning = await profile.checkUserName(req);
    socket.emit("ReturnUserNames", warning);
  });

  // --- // Getting All Profile data for all users
  socket.on("getUsersProfileDATA", async (req, key) => {
    let profileDataRetrieval = await profile.serveProfile(req);

    // You get all the data from everybody
    socket.emit("returnUsersProfileDATA", profileDataRetrieval, key);

    // Everybody gets update about you
    socket.broadcast.emit(
      "returnUsersProfileDATA",
      (() => {
        var onlineUser = profileDataRetrieval.mydata;
        return profileDataRetrieval[onlineUser];
      })()
    );
  });

  // --- // Message communication handler

  // --- // Write messages to the DB
  socket.on("SendMessage", async (res, key) => {
    var sendMSG = await messaging.sendMessage(res, key);

    // Subscribe to a room
    // if(!roomSubscribe.includes(sendMSG)){
    //   socket.join(sendMSG)
    //   roomSubscribe.push(sendMSG);
    // }

    // io.sockets.in(sendMSG).emit(sendMSG,res);

    socket.emit("FriendsMSG",res,sendMSG)
  });

  // // --- // Handles getting individual accounts MSG from DataBase
  socket.on("GetMessages", async (res, key) => {
    var msgData = await messaging.serverMessaging(res);
    // console.log(msgData);
    io.emit("MSGChannel", msgData, key);
  });

  // Handle Disconnection
  socket.on("ConnectClients", res => {
    connectClients[socket.id] = res;
  });

  socket.on("disconnect", async res => {
    var disconnectKey = connectClients[socket.id];
    if (disconnectKey) {
      var disc = await profile.disconnectHandler(disconnectKey.uuID);
      socket.broadcast.emit("UserOffline", disconnectKey.id);

      delete disconnectKey;
    }
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
