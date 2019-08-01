const express = require("express"),
  app = express(),
  http = require("http").Server(app),
  io = require("socket.io")(http),
  profile = require("./HANDLERS/ServeProfile"),
  messaging = require("./HANDLERS/ServeMessaging"),
  streamHandle = require("./HANDLERS/StreamHandler");

var rooms = {},
  userDetails = {},
  subscribedRooms = [];

// Initialising // Connecting to the server
io.on("connection", socket => {
  // --- // Checks user name if taken
  socket.on("FetchUserNames", async req => {
    let warning = await profile.checkUserName(req);
    socket.emit("ReturnUserNames", warning);
  });

  // --- // Gets All Profile data for all users
  socket.on("getUsersProfileDATA", async (req, key) => {
    let profileDataRetrieval = await profile.serveProfile(req);

    // You get all the data from everybody
    socket.emit("returnUsersProfileDATA", profileDataRetrieval, "None");

    // Everybody gets update about you
    socket.broadcast.emit(
      "returnUsersProfileDATA",
      (() => {
        var onlineUser = profileDataRetrieval.myDataID;
        return profileDataRetrieval.people[onlineUser];
      })(),
      "Broadcast"
    );
  });

  // --- // Assigning room ID to user names so i can better identify who is who
  // For easy communication
  socket.on("UserDetails", res => {
    // console.log(res)
    rooms[res.userName] = res.roomID;
    userDetails[res.userName] = { id: res.id, uuID: res.uuID };
  });

  // --- // Write messages to the DataBase
  socket.on("SendMessage", async (res, key, friend) => {
    var newFriend = false,
      roomID = rooms[friend];

    // console.log(roomID,res)
    if (roomID) {
      // Subscribe to a room if needed
      if (!subscribedRooms[friend]) {
        socket.join(roomID);
        subscribedRooms[friend] = "";
      }

      if (!/[|]/g.test(res.messageKey)) {
        io.sockets.in(roomID).emit(roomID, res);
      } else {
        newFriend = true;
      }
    }

    // Sends message to the database
    var sendMSG = await messaging.sendMessage(res, key, friend);

    // Only works if you are a new friends to the person who send the MSG
    if (newFriend === true) {
      res.messageKey = sendMSG;
      io.sockets.in(roomID).emit(roomID, res);
    }
  });

  // --- // Handles getting individual accounts MSG from DataBase
  socket.on("GetMessages", async (res, myName) => {
    var msgData = await messaging.serverMessaging(res);

    io.emit(rooms[myName] + "MSGChannel", msgData);
  });

  // --- // Handles video and Audio streaming
  socket.on("GetStream", (streamData, details) => {
    // console.log(streamData, details);
    // streamHandle.VideoStreamHandle;
  });

  // --- // Handles Disconnection
  socket.on("disconnect", res => {
    disconnectUsers(socket.id);
  });

  // // Sends a pulse to user if they are online otherwise disconnect them
  // var activeRooms = {};
  // socket.on("ActiveRoomsCheckIn", res => {
  //   activeRooms[res] = "";
  // });

  // setInterval(() => {
  //   Object.values(rooms).forEach(elm => {
  //     if (!Object.keys(activeRooms).includes(elm)) {
  //       disconnectUsers(elm);
  //     }
  //   });

  // }, 1000 * 10);

  async function disconnectUsers(socketID) {
    var index = Object.values(rooms).indexOf(socketID),
      roomUserName = Object.keys(rooms)[index];

    if (userDetails[roomUserName]) {
      var disc = await profile.disconnectHandler(
        userDetails[roomUserName].uuID
      );
      socket.broadcast.emit("UserOffline", userDetails[roomUserName].id);

      // Delete that user from object arrays
      delete rooms[roomUserName];
      delete subscribedRooms[roomUserName];
      socket.leave(rooms[roomUserName]);
    }
  }
});

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
