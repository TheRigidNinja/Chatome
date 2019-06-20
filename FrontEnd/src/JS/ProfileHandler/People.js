import React from "react";
import LZString from "lz-string";
import { async } from "q";

export default function InboxPeople({
  people,
  togglePage,
  myDataID,
  latestChats
}) {
  var emojis = ["🙋", "😃", "🤗", "👋"],
    myName = people[myDataID].userName,
    chats = "",
    timeStamp = "",
    status;

  const People = () => {
    return people.map(data => {
      chats = `Say hello ${emojis[Math.floor(Math.random() * 4)]} to ${
        data.userName
      }`;
      timeStamp = " ";
      status = data.status === "Online" ? "status" : "";

      if (data.ID !== myDataID) {
        if (latestChats !== undefined && latestChats[data.userName]) {

          
          let userDetail = latestChats[data.userName];
          chats =
            userDetail.name !== myName
              ? " " + userDetail.message
              : "You: " + userDetail.message;
          timeStamp = userDetail.timeStamp;

          console.log(chats);
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
