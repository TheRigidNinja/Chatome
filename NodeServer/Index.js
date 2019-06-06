const express = require("express"),
  app = express(),
  http = require("http").Server(app),
  io = require("socket.io")(http),
  mySqlDB = require("./HANDLERS/MySQLDB");

io.on("connection", async function(socket) {
  // Getting All Profile data for all users
  socket.on("GetAllProfileData", async (res, key) => {
    var dataRetrieval = { profile: null, myData: null, dbCreate: null };

    // Writes data to dB
    if (res.checkInType === "Register") {
      dataRetrieval.dbCreate = await mySqlDB.DataTomySQL(res);
    }

    console.log(dataRetrieval.dbCreate)

    // Gets data from DB
    if (dataRetrieval.dbCreate === null || dataRetrieval.dbCreate[1] === "Done!") {
      res.checkInType = "Login";
      dataRetrieval.profile = await mySqlDB.DataTomySQL(res);

      res.checkInType = "myData";
      dataRetrieval.myData = await mySqlDB.DataTomySQL(res);
    }

    console.log(dataRetrieval);

    io.emit("AllProfileData", dataRetrieval, key);
  });
});

// (async () => {
//   var resLogin = { uuID: "8ADuY8NxkSd3MaqT3WM72ZEpznN2", checkInType: "Login" };
//   var resRegister = {
//   uuID: 'AI5QLJJJnNVbK1OTzgfvxKblaX62',
//   picture: '../public/img/User.svg',
//   userName: 'user56',
//   status: 'Online',
//   ID:null,
//   checkInType: 'Register',
//   messageKey: '29b.9e9ad4aaeea',
//   phoneUpdate: 1559710329000,
//   accountCreatedDATE: 1559710329000,
//   emailUpdate: 1559710329000,
//   pictureUpdate: 1559710329000
// }

//   console.log(await mySqlDB.DataTomySQL(resLogin));
// })();

// ---- // Middleware
// app.get("/users",(req,res)=>{res.render("Inbox")});
// app.get("/users/'name'/",(req,res)=>{res.render("Inbox")});
// app.get("/users/'name'/profile",(req,res)=>{res.render("Inbox")});
// app.get("/users/'id'/messages",(req,res)=>{res.render("Inbox")});

// Making Server Live
http.listen(process.env.PORT || 8080, function() {
  console.table({ "Host URL --> ": "http://localhost:8080" });
});
