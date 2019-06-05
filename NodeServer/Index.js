const express = require("express");
      app = express(),
      http = require("http").Server(app),
      io = require("socket.io")(http),
      mySqlDB = require("./HANDLERS/MySQLDB");


io.on("connection", function(socket){

    socket.on("GetAllProfileData",async(res,key)=>{
        // console.log(await mySqlDB.CreateTable("UserProfiles","tb"));
        // profileDetials.FetchProfileDetials(mysql);

    })
});


(async()=>{
    // Creating data base and selecting values
    var dbCreate = {
        dbName: "UserProfile",
        tableName:"UserTable",
        Insertion:{
            // e.g. email-text reffers to make   "TEXT NOT NULL" in mysql
            keys:["email-text","user-id","phone"],
            values:[
                ["Probrian.hisanya200@gmail.com","4Rigid","12345678"],
                ["ProRigid.hsds@gmail.com","45dMogon","042345678"],
                ["Pro5xxx.ss@gmail.com","yo3456","034245678"]
            ]
        }
    }

    
// Selecting Values
var dbSelect = {
    dbName: "Mesaage",
    tableName:"UserTable",
    exactValues:{
        email: "brian",
        time: "2019"
    },
    whereRules: "email LIKE p%",
    orderBy:""
}



    // CREATING NEW DATABASE / INSERTING VALUES
    // let dbCreate = await mySqlDB.CreateDB(dbDetails.dbName),//DBName
    //     tbCreate = await mySqlDB.CreateTable(dbDetails),//DBname,tableName
    //     tbValue = await mySqlDB.InsertValue(dbDetails);//DBname,{tableName:sd,keys:[],values:[[]]}

    // await mySqlDB.SelectValues(dbSelect)
})//();



// profileDetials.FetchProfileDetials(mysql);

// app.set("view engine", "ejs");

// ---- // Middleware
// app.get("/users",(req,res)=>{res.render("Inbox")});
// app.get("/users/'name'/",(req,res)=>{res.render("Inbox")});
// app.get("/users/'name'/profile",(req,res)=>{res.render("Inbox")});
// app.get("/users/'id'/messages",(req,res)=>{res.render("Inbox")});


// Making Server Live
http.listen(process.env.PORT || 8080, function(){
    console.table({"Host URL --> ":"http://localhost:8080"});
});
