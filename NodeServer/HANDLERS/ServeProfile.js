const mySqlDB = require("./MySQLDB");

async function serveProfile(clientsData) {
  var dataRetrieval = {
      profile: null,
      myData: null,
      dbCreate: null,
      friends: null
    },
    dbType = { db: "ProfileData", dbTable: "PublicUserData" };

  //  Writes data to DataBase if need be
  dataRetrieval.dbCreate =
    clientsData.checkInType === "Register"
      ? await mySqlDB.DataTomySQL(clientsData, dbType)
      : null;
      
  // Gets Profile data from DataBase
  clientsData.checkInType = "Login";
  dataRetrieval.profile = await mySqlDB.DataTomySQL(clientsData, dbType);

  // Get the individual requested user data among other profiles in the DB
  clientsData.checkInType = "MyData";
  dataRetrieval.myData = await mySqlDB.DataTomySQL(clientsData, dbType);

  // Get friends if you have them
  dbType = { db: "Friends", dbTable: clientsData.uuID };
  clientsData.checkInType = "Friends";
  dataRetrieval.friends = await mySqlDB.DataTomySQL(clientsData, dbType);

  return dataRetrieval;
}

module.exports = {
  serveProfile: serveProfile
};
