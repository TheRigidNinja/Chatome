const admin = require("../../node_modules/firebase-admin/lib"),
  serviceAccount = require("./adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

var firebaseUserDATA = { profile: [], messages: [], friends: [] };
var exportUserDATA = { profile: [], messages: [], friends: [] };

// THIS IS A FIREBASE DB FUNCTION PROCESSOR
// This function tries to emulate out put data like MYSQL FUNCTION over in "MySQLDB.js"
// Its an easy way to do things without breaking other function that relays on mysql data format

async function DatabaseHandler(Userdata, dbType) {
  var promise1, promise2, promise3, promise4;

  // Register data to the DB
  if (Userdata.checkInType === "Register") {
    promise1 = new Promise((resolve, reject) => {
      db.collection(dbType.db)
        .doc(dbType.dbTable)
        .get()
        .then(snapshot => {
          var num = snapshot._fieldsProto
            ? Object.keys(snapshot._fieldsProto).length + 1
            : 1;
          resolve(num);
        })
        .catch(err => {
          reject(err);
        });
    });

    // Setting ID
    Userdata.ID = await promise1;
    var user = { [Userdata.uuID]: Userdata };

    if (
      Userdata.message ||
      (Userdata.messageKey && Userdata.messageKey.length > 20)
    ) {
      user = { [await promise1]: Userdata };
    }

    promise2 = new Promise((resolve, reject) => {
      db.collection(dbType.db)
        .doc(dbType.dbTable)
        .set({ ...user }, { merge: true })
        .then(() => {
          resolve("Done Creating!!!");
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  // Checks to see if Object " firebaseUserDATA " is Empty
  if (["Login", "MyData", "Chats", "Friends"].includes(Userdata.checkInType)) {
    // exportUserDATA.profile = [];
    // firebaseUserDATA.profile = [];

    switch (true) {
      case Userdata.checkInType == "Login":
        exportUserDATA.profile = [];
        firebaseUserDATA.profile = await getUserDATA(dbType);
        
        if (firebaseUserDATA.profile) {
          Object.keys(firebaseUserDATA.profile).forEach(element => {
            exportUserDATA.profile.push(firebaseUserDATA.profile[element]);
          });
        }

        // Getting ready data to be exported
        promise4 = new Promise((resolve, reject) => {
          resolve(exportUserDATA.profile);
        });
        break;

      case Userdata.checkInType == "MyData":
        promise4 = new Promise((resolve, reject) => {
          resolve([{ ID: firebaseUserDATA.profile[Userdata.uuID].ID }]);
        });
        break;

      case Userdata.checkInType == "Chats":
        firebaseUserDATA.messages = [];
        firebaseUserDATA.messages = await getUserDATA(dbType);

        exportUserDATA.messages[dbType.uuID] = [];

        if (firebaseUserDATA.messages) {
          Object.keys(firebaseUserDATA.messages).forEach(msg => {
            exportUserDATA.messages[dbType.uuID].push(
              firebaseUserDATA.messages[msg]
            );
          });
        }

        promise4 = new Promise((resolve, reject) => {
          resolve(exportUserDATA.messages[dbType.uuID]);
        });
        break;

      // Getting friends from DB
      case Userdata.checkInType == "Friends":
        firebaseUserDATA.friends = {
          [dbType.uuID]: await getUserDATA(dbType)
        };

        if (firebaseUserDATA.friends[dbType.uuID]) {
          exportUserDATA.friends[dbType.uuID] = [];

          Object.keys(firebaseUserDATA.friends[dbType.uuID]).forEach(friend => {
            exportUserDATA.friends[dbType.uuID].push(
              firebaseUserDATA.friends[dbType.uuID][friend]
            );
          });
        }

        // Getting friends list ready for export
        promise4 = new Promise((resolve, reject) => {
          resolve(exportUserDATA.friends[dbType.uuID]);
        });
        break;

      default:
        promise4 = new Promise((resolve, reject) => {
          resolve('"checkInType" did not match');
        });
    }
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
  DatabaseHandler: DatabaseHandler
};
