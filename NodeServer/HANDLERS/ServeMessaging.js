const mySqlDB = require("./MySQLDB");

var msgKeyStore = {},
  MSGChannel = {};

async function serverMessaging(clientsData) {
  // Gets all the Massage keys for all your friends
  if (clientsData.checkInType === "Friends") {
    var dbType = { db: "Friends", dbTable: clientsData.uuID },
      msgKeysData = await mySqlDB.DataTomySQL(clientsData, dbType);
      // console.log("===>Friends",msgKeysData)

    // Sets uuID in the local msgKeys storage if not exists
    if (!msgKeyStore[clientsData.uuID]) {
      msgKeyStore[clientsData.uuID] = [];
    }

    // just getting the msgKey only

    // console.log(msgKeysData[3])
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
    // console.log("===>Chats",msgData)
    // Creates key in MSGChannel if not exists
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

  // If you have friends it will return an array of them else
  if (Object.keys(MSGChannel) == "undefined") {
    return "You Don't Have Friends!!";
  } else {
    delete MSGChannel.undefined;
    return MSGChannel;
  }
}

// Setting messages in the DB
async function sendMessage(clientsData, key) {
  var messageKey = clientsData.messageKey,
    uuID = clientsData.uuID;

  delete clientsData.messageKey;
  delete clientsData.uuID;
  // delete clientsData.uuID

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
      msgData = (await mySqlDB.DataTomySQL(clientsData, dbType))[3];

    //  Gettign the right key
    if (!msgData) {
      messageKey = key2;
    }
  }

  clientsData.checkInType = "Register";
  var dbType = { db: "MSGChannel", dbTable: messageKey },
    sendMSG = await mySqlDB.DataTomySQL(clientsData, dbType);

  // Establishing friends in the DB
  var msgKeyExists = false;
  try {
    msgKeyExists = msgKeyStore[key].includes(messageKey)?false:true;
  } catch (error) {
    msgKeyExists = true
  }

  if (msgKeyExists) {
    console.log("Now firends!!!!! !!!")
    var dbType = { db: "Friends", dbTable: key };
    mySqlDB.DataTomySQL(
      { messageKey: messageKey, checkInType: "Register" },
      dbType
    );

    // Inserts new friend to msgKeyStore list to prevent this statement from inserting same values in DB
    msgKeyStore[key] = [];
    msgKeyStore[key].push(messageKey);
  }

  return { sendMSG, messageKey };
}

module.exports = {
  serverMessaging: serverMessaging,
  sendMessage: sendMessage
};
