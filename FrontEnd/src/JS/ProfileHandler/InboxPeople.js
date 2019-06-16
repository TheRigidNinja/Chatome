import React from "react";

export default function InboxPeople({
  people,
  togglePage,
  myDataID,
  latestChats
}) {
  var msgCnt = 0;

  const People = () => {
    return people.map(data => {
      var chats = " ",
        timeStamp = " ",
        status = data.status === "Online" ? "status" : "";

      if (data.ID !== myDataID + 1) {
        if (typeof latestChats === "object") {
          var myName = people[myDataID].userName,
            myMsgKey = people[myDataID].messageKey,
            key1 = myMsgKey + data.messageKey,
            key2 = data.messageKey + myMsgKey,
            check = latestChats[key2] ? latestChats[key2] : latestChats[key1];

          if (check !== undefined) {
            var objKeys = Object.keys(check);
            timeStamp = check.timeStamp;
            chats = (objKeys[0] === myName ? "You: " : "") + check[objKeys[0]];
          }
        }

        return (
          <>
            <div
              className="Person"
              messageKey={data.messageKey}
              onClick={() => togglePage("Messaging", data.ID - 1)}
            >
              <span id="ProfilePic">
                <img src={data.picture} alt="IMG" />
                <span id={status} />
              </span>
              <div className="details">
                <h4>{data.userName}</h4>
                <p>{chats}</p>
              </div>
              <time>{timeStamp}</time>
            </div>
          </>
        );
      } else {
        return <></>;
      }
    });
  };
  return <People />;
}
