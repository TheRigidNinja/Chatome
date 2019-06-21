const express = require("express"),
  app = express(),
  http = require("http").Server(app),
  io = require("socket.io")(http),
  profile = require("./HANDLERS/serveProfile"),
  messaging = require("./HANDLERS/ServeMessaging");

var rooms = {},
userDetails = {},
subscribedRooms = [];

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
  socket.on("UserDetails", res => {
    rooms[res.myName] = res.roomID;
    userDetails[res.myName] = {id: res.id, uuID: res.uuID};

  });

  // --- // Write messages to the DB
  socket.on("SendMessage", async (res, key, recipient) => {
    var newFriend = false,
      roomID = rooms[recipient.friend];

    if (roomID) {
      // Subscribe to a room if needed
      if (!subscribedRooms[recipient.friend]) {
        socket.join(roomID);
        subscribedRooms[recipient.friend] = "";
      }

      if (!/[|]/g.test(res.messageKey)) {
        io.sockets.in(roomID).emit(roomID,res);
      } else {
        newFriend = true;
      }
    }

    // Sends message to the database
    var sendMSG = await messaging.sendMessage(res, key,recipient);

    // Only works if you are a new friends to the persorn who send the MSG
    if (newFriend === true) {
      res.messageKey = sendMSG;
      io.sockets.in(roomID).emit(roomID,res);
    }
  });

  // // --- // Handles getting individual accounts MSG from DataBase
  socket.on("GetMessages", async (res, key) => {
    var msgData = await messaging.serverMessaging(res);
    io.emit("MSGChannel", msgData, key);
  });

  // Handle Disconnection
  socket.on("disconnect", async res => {

    var index = Object.values(rooms).indexOf(socket.id),
    roomUserName = (Object.keys(rooms))[index];

    console.log(userDetails[roomUserName]);
    if (userDetails[roomUserName]) {
      var disc = await profile.disconnectHandler(userDetails[roomUserName].uuID);
      socket.broadcast.emit("UserOffline", userDetails[roomUserName].id);

      // Delete that user from object arrays
      delete rooms[roomUserName];
      delete subscribedRooms[roomUserName];
      console.log(roomUserName,"was deleted from |");
      console.log(rooms)
      console.log(disc);
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
