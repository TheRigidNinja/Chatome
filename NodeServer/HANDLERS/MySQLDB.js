const mysql = require("mysql"),
  config = require("./ConfigFile")();

async function DataTomySQL(data, dbType) {
  // Seperate OBJ keys and values to strings
  var keysWithType = [],
    keysNoType = [],
    values = [],
    sql = [];

    console.log(data)
  for (let elm in data) {
    if (elm !== "checkInType") {
      var elmType = (() => {
        switch (true) {
          case [
            "phoneUpdate",
            "accountCreatedDATE",
            "emailUpdate",
            "pictureUpdate",
            "status"
          ].includes(elm):
            return " VARCHAR(20) NOT NULL";
          case [
            "uuID",
            "userName",
            "messageKey",
            "message",
            "name",
            "timeStamp"
          ].includes(elm):
            return " TEXT NOT NULL ";
          case "picture" === elm:
            return " LONGBLOB NOT NULL";
          case "ID" === elm:
            return " INT PRIMARY KEY AUTO_INCREMENT";
        }
      })();

      keysWithType.push(elm + elmType);
      keysNoType.push(elm);
      values.push(data[elm]);
    }
  }


  keysNoType = keysNoType.toString();

  switch (data.checkInType) {
    case "Register":
      sql.push(
        "CREATE DATABASE IF NOT EXISTS " + dbType.db,
        "CREATE TABLE IF NOT EXISTS " +
          dbType.dbTable +
          " (" +
          keysWithType +
          ")",
        "INSERT INTO " + dbType.dbTable + " (" + keysNoType + ") VALUES ?"
      );
      break;

    case "Login":
      sql.push("SELECT *, NULL AS uuID FROM " + dbType.dbTable + "");
      break;

    case "MyData":
      sql.push(
        "SELECT ID FROM " + dbType.dbTable + " WHERE uuID='" + data.uuID + "'"
      );
      break;

    case "Chats":
      sql.push("SELECT * FROM " + dbType.dbTable+" ORDER BY timeStamp ASC");
      break;

    case "Friends":
      sql.push("SELECT * FROM " + data.uuID);
      break;

    default:
      return '"checkInType" did not match';
  }

  // Interacting with mySQL DataBase!
  var promise1, promise2, promise3, promise4, connect;

  sql.forEach(elm => {
    switch (true) {
      // Write data to Database when registering
      case /DATABASE/g.test(elm) && data.checkInType === "Register":
        promise1 = new Promise((resolve, reject) => {
          connect = mysql.createConnection({ ...config });

          connect.query(elm, (err, result) => {
            if (err) reject(["Error CreatingDB ---->", err]);
            resolve(["Done! Creating DB", result]);
          });

          connect.end();
        }).catch(err => {
          console.log("--> Promise erro", err);
        });
        break;

      // Works only to insert data in the after making it above Database
      case /TABLE/g.test(elm):
        promise2 = new Promise((resolve, reject) => {
          setTimeout(() => {
            connect = mysql.createConnection({
              ...config,
              database: dbType.db
            });

            connect.query(elm, (err, result) => {
              if (err) reject(["Error Creating TABLE ---->", err]);
              resolve("Done! Creating Table");
            });

            connect.end();
          }, 10);
        }).catch(err => {
          console.log("--> Promise erro", err);
        });
        break;

      case /INSERT INTO/g.test(elm):
        promise3 = new Promise((resolve, reject) => {
          setTimeout(() => {
            connect = mysql.createConnection({
              ...config,
              database: dbType.db
            });

            connect.query(elm, [[values]], (err, result) => {
              if (err) reject(["Error Inserting VALUES ---->", err]);
              resolve("Done! Inserting Values");
            });
            connect.end();
          }, 10);
        }).catch(err => {
          console.log("--> Promise erro", err);
        });

        break;

      // Handles Login data retrieval from Database
      case ["Login", "MyData", "Chats", "Friends"].includes(data.checkInType):
        promise4 = new Promise((resolve, reject) => {
          connect = mysql.createConnection({
            ...config,
            database: dbType.db
          });

          connect.query(elm, (err, result) => {
            if (err) reject(["Error selecting values to table ---->", err]);
            resolve(result);
          });

          connect.end();
        }).catch(err => {
          console.log("--> Promise erro", err);
        });
        break;
    }
  });

  return Promise.all([promise1, promise2, promise3, promise4]);
}

module.exports = {
  DataTomySQL: DataTomySQL
};
