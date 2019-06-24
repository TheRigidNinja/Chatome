const dataBase = require("../HANDLERS/FIREBASE_HANDLER/FirebaseDB"); //require("./MySQLDB");
var msgKeyStore = [],
  tempChats = {};

async function serverMessaging(clientsData) {
  // Gets all the Massage keys for all your friends
  if (clientsData.checkInType === "Friends") {
    msgKeyStore[clientsData.uuID] = [];
    msgKeyStore[clientsData.uuID].push(...clientsData.friends);
  }


  // Gets the chats messaging Data using Massage Keys
  for (const key of msgKeyStore[clientsData.uuID]) {
    var dbType = { db: "MSGChannel", dbTable: key };
    clientsData.checkInType = "Chats";
    var msgData = (await dataBase.dataBaseHandler(clientsData, dbType))[3];
    msgData = msgData ? msgData : [];
    tempChats[key] = [];

    for (const timeStamp of Object.keys(msgData).sort()) {
      tempChats[key].push(msgData[timeStamp]);
    }
  }

  return tempChats;
}
// --- // Sending messages in the DB
async function sendMessage(clientsData, key, recipient) {
  var messageKey = clientsData.messageKey,
    uuID = clientsData.uuID,
    checkInType = clientsData.checkInType,
    dbType;

  //  Checks to see if the " messageKey " exist in MSGChannel MSQL table
  // If yes then use that particular key so the people you talk to can
  // See what you have messaged them

  // " /[|]/g.test " Checks to see if we have | meaning its a new connection
  if (/[|]/g.test(messageKey)) {
    var tempKey = messageKey.split("|"),
      key1 = tempKey[0] + tempKey[1],
      key2 = tempKey[1] + tempKey[0];
    messageKey = key1;

    clientsData.checkInType = "Chats";
    var dbType = { db: "MSGChannel", dbTable: messageKey },
      msgData = (await dataBase.dataBaseHandler(clientsData, dbType))[3];

    //  Gettign the right key
    if (!msgData) {
      messageKey = key2;
    }
  }

  clientsData.checkInType = "Register";
  var dbType = { db: "MSGChannel", dbTable: messageKey },
    sendMSG = await dataBase.dataBaseHandler(clientsData, dbType);

  // Establishing friends in the DB
  var msgKeyExists = false;
  try {
    msgKeyExists = msgKeyStore[key].includes(messageKey) ? false : true;
  } catch (error) {
    msgKeyExists = true;
  }

  if (msgKeyExists) {
    console.log("Now firends!!!!! !!!");
    var dbType = { db: "Friends", dbTable: recipient.friend };
    msgData = await dataBase.dataBaseHandler(
      { [messageKey]: "", checkInType: "Register" },
      dbType
    );

    // My key
    var dbType = { db: "Friends", dbTable: recipient.me };
    msgData = await dataBase.dataBaseHandler(
      { [messageKey]: "", checkInType: "Register" },
      dbType
    );

    // Inserts new friend to msgKeyStore list to prevent this statement from inserting same values in DB
    msgKeyStore[key] = [];
    msgKeyStore[key].push(messageKey);
  }

  return messageKey;
}

module.exports = {
  serverMessaging: serverMessaging,
  sendMessage: sendMessage
};
