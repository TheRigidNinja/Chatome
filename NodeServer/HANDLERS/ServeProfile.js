const dataBase = require("../HANDLERS/FIREBASE_HANDLER/FirebaseDB"); //require("./MySQLDB");
// All user names
var namesDB = [];

// --- // Gets or Registers profile data in the DB
async function serveProfile(clientsData) {
  var uuID = clientsData.uuID;

  if (clientsData.checkInType == "Login") {
    return await handleGetDATA(clientsData);
  } else if (clientsData.checkInType == "Register") {
    let register = await handleSetDATA(clientsData,uuID);

    if (register[1] === "Done Creating!!!") {
      clientsData.checkInType = "Login";
      clientsData["uuID"] = uuID;

      return await handleGetDATA(clientsData);
    } else {
      return "Something when wrong when registering";
    }
  } else {
    return 'Error with "checkInType"';
  }
}

// --- // Support functions
async function handleGetDATA(clientsData) {
  var dbType;

  // Gets FROM database
  if (clientsData.checkInType === "Login") {
    dbType = { db: "ProfileData", dbTable: "PublicUserData" };
    const respData = (await dataBase.dataBaseHandler(clientsData, dbType))[3];

    dbType = { db: "Friends", dbTable: clientsData.uuID };
    var friendList = (await dataBase.dataBaseHandler(clientsData, dbType))[3];

    const friendsData = friendList ? Object.keys(friendList) : "";
    var uuIDKeys = Object.keys(respData);

    // Setting up online status
    var Activities = { checkInType: "Register", status: true };

    dbType = { db: "Activities", dbTable: clientsData.uuID };
    await dataBase.dataBaseHandler(Activities, dbType);

    return {
      people: (() => {
        let userData = [],
          idCnt = 0;
        uuIDKeys.forEach(elm => {
          respData[elm]["ID"] = idCnt;
          idCnt++;
          userData.push({ ...respData[elm] });
        });

        return userData;
      })(),
      myDataID: uuIDKeys.indexOf(clientsData.uuID),
      friends: friendsData
    };
  }
}

async function handleSetDATA(clientsData,uuID) {
  var dbType = { db: "ProfileData", dbTable: "PublicUserData" };
  var setDATA = await dataBase.dataBaseHandler(clientsData, dbType);

  // Registers UserName
  var UserName = { checkInType: "Register", userName: clientsData.userName };
  dbType = { db: "ProfileData", dbTable: "UserNames" };
  var setUser = await dataBase.dataBaseHandler(UserName, dbType);

  // Setting up online status
  var Activities = { checkInType: "Register", status: true };
  dbType = { db: "Activities", dbTable: uuID };
  await dataBase.dataBaseHandler(Activities, dbType);

  // Push user name to the local DB
  if (setUser[1] === "Done Creating!!!") {
    namesDB.push(clientsData.userName);
  }

  return setDATA;
}

// Updating user online status
async function disconnectHandler(uuID) {
  var Activities = { checkInType: "Register", status: false };
  dbType = { db: "Activities", dbTable: uuID };
  var setUser = await dataBase.dataBaseHandler(Activities, dbType);

  return setUser;
}

// ----- // Checks if user has been take?
async function checkUserName(userName) {
  if (namesDB.length === 0) {
    var getUserNames = { checkInType: "UserNames" };
    dbType = { db: "ProfileData", dbTable: "UserNames" };
    var allUserNames = (await dataBase.dataBaseHandler(
      getUserNames,
      dbType
    ))[3];

    if (allUserNames) {
      namesDB.push(...allUserNames);
    }
  }

  let warning = "";
  if (namesDB.includes(userName)) {
    warning = `User "${userName}" Has already been TAKEN`;
  }

  return warning;
}

module.exports = {
  serveProfile: serveProfile,
  checkUserName: checkUserName,
  disconnectHandler: disconnectHandler
};
