// Creating data base and selecting values

function Templates(templateType, data) {
  switch (templateType) {
    case "createDb":
      var dbPublicUserInfo = {
        dbName: "ProfileData",
        tableName: "UserDATA",
        Insertion: {
          // e.g. email-text reffers to make   "TEXT NOT NULL" in mysql
          keys: 
          values: data
        }
      };
      return dbPublicUserInfo;

    case "dbPrivateMessage":
      var dbPrivateMessage = {
        dbName: "PrivateMessaging",
        tableName: data.uuID,
        Insertion: {
          // e.g. email-text reffers to make   "TEXT NOT NULL" in mysql
          keys: ["date-int-", "message-text-", "name-text-"],
          values: data.values
        }
      };
      return dbPrivateMessage;

    case "dbLastMessages":
      var dbLastMessages = {
        dbName: "PrivateMessaging",
        tableName: "LastSends",
        Insertion: {
          // e.g. email-text reffers to make   "TEXT NOT NULL" in mysql
          keys: ["lastSMG-int-", "sender-text-", "date-int-"],
          values: data
        }
      };
      return dbLastMessages;

    // -------- // Selecting Values Tamplates
    case "dbSelect":
      var dbSelect = {
        dbName: "Mesaage",
        tableName: "UserTable",
        exactValues: {
          email: "brian",
          time: "2019"
        },
        whereRules: "email LIKE p%",
        orderBy: ""
      };

      return dbSelect;

      default:
        return "No Template Type was found!"
  }
}

module.exports = {
  Templates: Templates
};
