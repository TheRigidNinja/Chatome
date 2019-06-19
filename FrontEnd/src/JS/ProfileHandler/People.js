import React from "react";
import LZString from "lz-string";
import { async } from "q";

export default function InboxPeople({
  people,
  togglePage,
  myDataID,
  latestChats
}) {
  var msgCnt = 0;

  // console.log(LZString.decompress("঄〮⁜ॠ똠猂頞聖r䈍쀣ဆ牀㘀堁ꅀ临匠䄆ѐ᥀欀됂选䄆失ᰡ耑᐀頃먈铀Ⲁ愆ࠂ䦨䪽䛅는丐"))

  const People = () => {
    return people.map(data => {
      var chats = " ",
        timeStamp = " ",
        status = data.status === "Online" ? "status" : "";

      if (data.ID !== myDataID) {
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
              messagekey={data.messageKey}
              onClick={() => togglePage("MessagingBoard", data.ID)}
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

  // var PeopleDATA  = JSON.stringify(People());
  return <People />;
}
