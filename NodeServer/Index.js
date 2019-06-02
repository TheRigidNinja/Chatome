const express = require("express");
      app = express(),
      http = require("http").Server(app),
      io = require("socket.io")(http);



io.on("connection", function(socket){

    console.log("Yes!");

});


app.set("view engine", "ejs");

// ---- // Middleware
// app.get("/users",(req,res)=>{res.render("Inbox")});
// app.get("/users/'name'/",(req,res)=>{res.render("Inbox")});
// app.get("/users/'name'/profile",(req,res)=>{res.render("Inbox")});
// app.get("/users/'id'/messages",(req,res)=>{res.render("Inbox")});


// Making Server Live
http.listen(process.env.PORT || 8080, function(){
    console.table({"Host URL --> ":"http://localhost:8080"});
});
