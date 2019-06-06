const mysql = require("mysql"),
  config = {
    host: "localhost",
    port: 8889,
    user: "root",
    password: "1234"
  };

async function DataTomySQL(data) {
  // Seperate OBJ keys and values to strings
  var keysWithType = [],
    keysNoType = [],
    values = [],
    sql = [];

  for (let elm in data) {
    var elmType = (() => {
      switch (true) {
        case [
          "phoneUpdate",
          "accountCreatedDATE",
          "emailUpdate",
          "pictureUpdate",
          "messageKey"
        ].includes(elm):
          return " VARCHAR(20) NOT NULL";
        case [
          "uuID",
          "status",
          "checkInType",
          "messageKey",
          "userName"
        ].includes(elm):
          return " TEXT NOT NULL";
        case "picture" === elm:
          return " TEXT NOT NULL"; //LONGBLOB NOT NULL
        case "ID" === elm:
          return " INT PRIMARY KEY AUTO_INCREMENT";
      }
    })();

    keysWithType.push(elm + elmType);
    keysNoType.push(elm);
    values.push(data[elm]);
  }

  keysWithType = keysWithType.toString();
  keysNoType = keysNoType.toString();

  switch (data.checkInType) {
    case "Register":
      sql.push(
        "CREATE DATABASE IF NOT EXISTS ProfileData",
        "CREATE TABLE IF NOT EXISTS PublicUserData (" + keysWithType + ")",
        "INSERT INTO PublicUserData (" + keysNoType + ") VALUES ?"
      );
      break;

    case "Login":
      sql.push("SELECT *, NULL AS uuID FROM PublicUserData");
      break;

    case "myData":
      sql.push(
        "SELECT *, NULL AS uuID FROM PublicUserData WHERE uuID='" +
          data.uuID +
          "'"
      );
      break;

    default:
      return '"checkInType" did not match';
  }

  // Interacting with mySQL DataBase!

  var promise1, promise2, promise3, connect;

  // if (["Login", "myData"].includes(data.checkInType)) {
  //   connect = mysql.createConnection({
  //     ...config,
  //     database: "ProfileData"
  //   });
  // }

  console.log(data.checkInType);
  sql.forEach(elm => {
    // console.log(elm)
    switch (true) {
      // Write data to Database when registering
      case /DATABASE/g.test(elm) && data.checkInType === "Register":
        connect = mysql.createConnection({ ...config });

        promise1 = new Promise((resolve, reject) => {
          connect.query(elm, (err, result) => {
            if (err) reject(["Error CreatingDB ---->", err]);
            resolve("Done!");
          });
        });
        console.log(">",elm);
        break;

      // Works only to insert data in the after making it above Database
      case /TABLE/g.test(elm):
        connect = mysql.createConnection({
          ...config,
          database: "ProfileData"
        });

        console.log(">",elm);
        promise2 = new Promise((resolve, reject) => {
          connect.query(elm,(err, result) => {
            if (err) reject(["Error Creating TABLE ---->", err]);
            resolve("Done!");
          });
        });
        break;

      case /INSERT INTO/g.test(elm):
        console.log(">",elm);
        
        connect = mysql.createConnection({
          ...config,
          database: "ProfileData"
        });

        promise2 = new Promise((resolve, reject) => {
          connect.query(elm, [[values]], (err, result) => {
            if (err) reject(["Error Inserting VALUES ---->", err]);
            resolve("Done!");
          });
        });
        break;

      // Handles Login data retrieval from Database
      case ["Login", "myData"].includes(data.checkInType):
        console.log(">","Getting data");
        connect = mysql.createConnection({
          ...config,
          database: "ProfileData"
        });
  
        promise3 = new Promise((resolve, reject) => {
          connect.query(elm, (err, result) => {
            if (err) reject(["Error Inserting values to table ---->", err]);
            resolve(result);
          });
        });
        break;
    }
  });

  return Promise.all([promise1, promise2, promise3]);
}

module.exports = {
  DataTomySQL: DataTomySQL
};
