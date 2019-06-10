const mySqlDB = require("./MySQLDB");

var msgKeyStore = {},
  MSGChannel = {};

async function serverMessaging(clientsData) {
  
  // Gets all the Massage keys for all your friends
  if (clientsData.checkInType === "Friends") {
    var dbType = { db: "Friends", dbTable: clientsData.uuID },
      msgKeysData = await mySqlDB.DataTomySQL(clientsData, dbType);

    // Sets uuID in the local msgKeys storage if not exists
    if (!msgKeyStore[clientsData.uuID]) {
      msgKeyStore[clientsData.uuID] = [];
    }

    // just getting the msgKey only
    msgKeysData[3].forEach(element => {
      msgKeyStore[clientsData.uuID].push(element.messageKey);
    });
  }


  // Gets the chats messaging Data using Massage Keys
  for (let key in msgKeyStore[clientsData.uuID]) {
    key = msgKeyStore[clientsData.uuID][key];

    var dbType = { db: "MSGChannel", dbTable: key };
    clientsData.checkInType = "Chats";
    msgData = (await mySqlDB.DataTomySQL(clientsData, dbType))[3];

    // // Creates key in MSGChannel if not exists
    // if (!MSGChannel[key]) {
    //   MSGChannel[key] = [];
    // }

    MSGChannel[key] = [];
    msgData.forEach(data => {
      MSGChannel[key].push({
        [data.name]: data.message,
        timeStamp: data.timeStamp
      });
    });
  }

  return MSGChannel;
}

// Setting messages in the DB
async function sendMessage(clientsData, key) {
  var tempKey = clientsData.messageKey.split("|"),
    key1 =tempKey[0] + tempKey[1],
    key2 = tempKey[1] + tempKey[0];

  clientsData.messageKey = key1;
  clientsData.checkInType = "Chats";
  var dbType = { db: "MSGChannel", dbTable: clientsData.messageKey },
    msgData = (await mySqlDB.DataTomySQL(clientsData, dbType))[3];

  //  Gettign the right key
  if (!msgData) {
    clientsData.messageKey = key2;
  }

  clientsData.checkInType = "Register";
  var dbType = { db: "MSGChannel", dbTable: clientsData.messageKey },
    sendMSG = await mySqlDB.DataTomySQL(clientsData, dbType);

  // Establishing friends in the DB
  if (!(msgKeyStore[key] && msgKeyStore[key].includes(clientsData.messageKey))) {

    var dbType = { db: "Friends", dbTable: key };
    mySqlDB.DataTomySQL(
      { messageKey: clientsData.messageKey, checkInType: "Register" },
      dbType
    );

    // Inserts new friend to msgKeyStore list to prevent this statement from inserting same values in DB
    msgKeyStore[key] = [];
    msgKeyStore[key].push(clientsData.messageKey)
  }

  console.log("======>",msgKeyStore);
  return sendMSG;
}

module.exports = {
  serverMessaging: serverMessaging,
  sendMessage: sendMessage
};
