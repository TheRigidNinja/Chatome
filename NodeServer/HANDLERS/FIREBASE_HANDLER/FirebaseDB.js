const admin = require("../../node_modules/firebase-admin/lib"),
  serviceAccount = require("./adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// // THIS IS A FIREBASE DB FUNCTION PROCESSOR
// // This function tries to emulate out put data like MYSQL FUNCTION over in "MySQLDB.js"
// // Its an easy way to do things without breaking other function that relays on mysql data format

async function dataBaseHandler(Userdata, dbType) {
  var promise1, promise2, promise3, promise4, dbDATA, dbExportDATA;

  // Register data to the DB
  if (Userdata.checkInType === "Register") {
    var user = { [Userdata.uuID]: Userdata };

    // Removes uneeded info
    delete user[Userdata.uuID].checkInType;
    delete user[Userdata.uuID].uuID;

    if (
      Userdata.message ||
      (Userdata.messageKey && Userdata.messageKey.length > 20)
    ) {
      user = { [await promise1]: Userdata };
    }

    // Runs when setting user data
    if (dbType.dbTable === "UserNames") {
      user = { [Userdata.userName]: "" };
    }

    // Run if sending messages
    if (dbType.db === "MSGChannel") {
      delete Userdata.messageKey;

      user = {
        [Userdata.timeStamp]: Userdata
      };
    }

    if (dbType.db === "Friends") {
      delete Userdata.checkInType;
      user = { ...Userdata };
    }

    if (dbType.db === "Activities") {
      delete Userdata.checkInType;
      user = Userdata;
    }
    
    promise2 = new Promise((resolve, reject) => {
      db.collection(dbType.db)
        .doc(dbType.dbTable)
        .set(user, { merge: true })
        .then(() => {
          resolve("Done Creating!!!");
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  // Checks to see if Object " firebaseUserDATA " is Empty
  if (
    ["Login", "MyData", "Chats", "Friends", "UserNames"].includes(
      Userdata.checkInType
    )
  ) {
    var dbDATA = await getUserDATA(dbType);

    promise4 = new Promise((resolve, reject) => {
      switch (Userdata.checkInType) {
        case "UserNames":
          var userNames = "";

          if (dbDATA) {
            userNames = Object.keys(dbDATA);
          }
          resolve(userNames);
          break;

        default:
          resolve(dbDATA);
      }
    });
  }

  return Promise.all([promise1, promise2, promise3, promise4]);
}

async function getUserDATA(dbType) {
  // Gets DB DATA only if the value I'm looking for don't exists in "firebaseUserDATA"
  promise = new Promise((resolve, reject) => {
    db.collection(dbType.db)
      .doc(dbType.dbTable)
      .get()
      .then(snapshot => {
        resolve(snapshot.data());
      })
      .catch(err => {
        reject(err);
      });
  });

  return await promise;
}

module.exports = {
  dataBaseHandler: dataBaseHandler
};
