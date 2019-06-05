const mysql = require("mysql"),
  config = {
    host: "localhost",
    port: 8889,
    user: "root",
    password: "1234"
  };

// Creating DataBase
function CreateDB(Name) {
  const promise = new Promise(resolve => {
    let connect = mysql.createConnection({ ...config });
    connect.connect(function(err) {
      if (err) {
        resolve(["Error Connecting! to DB --->", err]);
      }

      if (/[^\s]/.test(Name)) {
        let sql =
          "CREATE DATABASE IF NOT EXISTS " + Name.replace(/ /g, "_") + "";

        connect.query(sql, (err, result) => {
          if (err) {
            resolve(["Error Connecting! to DB ---->", err]);
          }
          resolve("Done!");
        });
      } else {
        resolve("DB name must not be empty");
      }
    });
  });
  return promise;
}

// Creating Table in the DB
function CreateTable({ dbName, tableName, Insertion, TableDetail }) {
  const promise = new Promise(resolve => {
    let connect = mysql.createConnection({
      ...config,
      database: dbName
    });

    connect.connect(function(err) {
      if (err) {
        resolve(["Error Connecting! to DB --->", err]);
      }

      if (/[^\s]/.test(tableName)) {
        var tableKeys = "";

        Insertion.keys.forEach(element => {
          let elementType = element.slice(element.indexOf("-") + 1);
          element = element.slice(element.indexOf("-") - 1);

          switch (elementType) {
            case "time":
              tableKeys +=
                element + " TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, ";
              break;

            case "Id":
              break;

            case "boolean":
              break;

            case "text":
              tableKeys += element + " TEXT NOT NULL, ";
              break;

            case "int":
              break;
          }
        });

        let sql =
          "CREATE TABLE IF NOT EXISTS " +
          TableDetail.tableName.replace(/ /g, "_") +
          "(" +
          // Replaces last , accurance
          "" +
          tableKeys.replace(/,([^,]*)$/, "$1") +
          ")";

        connect.query(sql, (err, result) => {
          if (err) {
            resolve(["Error Making table ---->", err]);
          }

          resolve("Done!");
        });
      } else {
        resolve("Table name must not be empty");
      }
    });
  });

  return promise;
}

// Inserting Values From DB
async function InsertValue({
  tableName,
  database,
  Insertion,
  dbName,
  TableDetail
}) {
  const promise = new Promise(resolve => {
    let connect = mysql.createConnection({
      ...config,
      database: dbName
    });

    connect.connect(function(err) {
      if (err) {
        resolve(["Error Connecting! to DB --->", err]);
      }

      if (Object.keys(Insertion).length === 3) {
        let sql =
          "INSERT INTO " +
          tableName +
          " (" +
          Insertion.keys.toString() +
          ") VALUES ?";

        connect.query(sql, [Insertion.values], (err, result) => {
          if (err) {
            resolve(["Error Inserting values to table ---->", err]);
          }
          resolve("Done!");
        });
      } else {
        resolve("Values must not be empty");
      }
    });
  });

  return promise;
}

// Selecting Values From DB
async function SelectValues({
  dbName,
  tableName,
  exactValues,
  whereRules,
  orderBy,
  SelectDetails
}) {
  const promise = new Promise(resolve => {
    let connect = mysql.createConnection({ ...config, database: dbName });
    connect.connect(function(err) {
      if (err) {
        resolve(["Error Connecting! to DB --->", err]);
      }

      let colExactValues = Object.keys(exactValues).toString() || "*",
        orderByElm = "";
      fieldRules = "";

      // fieldRules2 = ([fieldRules1.length]).toString().replace("true"," ") || " WHERE"+fieldRules1;
      if (whereRules.length > 4 && /%|=/g.test(whereRules)) {
        if (/LIKE/g.test(whereRules)) {
          fieldRules = " WHERE " + whereRules.replace("LIKE ", "LIKE '") + "'";
        } else {
          fieldRules = " WHERE " + whereRules.replace("=", "='") + "'";
        }
      }

      if (orderBy !== "") {
        orderByElm = " " + orderBy;
      }

      let sql =
        "SELECT " +
        colExactValues +
        " FROM " +
        tableName +
        orderByElm +
        "" +
        fieldRules;

      console.log(sql);
      connect.query(sql, (err, result) => {
        if (err) {
          resolve(["Values from table ---->", err]);
        }
        resolve(result);
      });

      //       }else{resolve("Values must not be empty");}
    });
  });

  return promise;
}

// function FetchProfileDetials(){

//     var connect = mysql.createConnection({
//         host: "localhost",
//         port:8889,
//         user: "root",
//         password: "1234",
//         database: "ProfileDetails"
//       });

//       connect.connect(function(err) {
//         if (err){
//           console.log("---->","err");
//         };

//         let sql = "CREATE DATABASE IF NOT EXISTS ProfileDetails";
//         // let sql = "CREATE TABLE ProfileDetails (name VARCHAR(255), address VARCHAR(255))";

//         connect.query(sql, (err,result)=>{
//           if (err) throw err;
//             console.log(result);
//         });

//       });
// }

module.exports = {
  CreateDB: CreateDB,
  CreateTable: CreateTable,
  InsertValue: InsertValue,
  SelectValues: SelectValues
};
