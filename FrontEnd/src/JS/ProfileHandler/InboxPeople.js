import React from "react";

export default function InboxPeople({
  peopleData,
  TogglePage,
  myData,
  LatestChats
}) {
  var msgCnt = -1,
  chats = null,
  timeStamp = null;


  const People = () => {
    return peopleData.map(data => {
      if (!(data.ID === myData)) {

        if((typeof LatestChats) === "object"){
          msgCnt++;

          var objKeys = Object.keys(LatestChats[msgCnt]);


          timeStamp = LatestChats[msgCnt].timeStamp;
          chats = LatestChats[msgCnt][objKeys[0]];

          console.log(chats);
          // chats = LatestChats[msgCnt]?LatestChats[msgCnt]:"";
        }

        return (
          <>
            <div
              className="Person"
              messageKey={data.messageKey}
              onClick={() => TogglePage("Messaging", data.ID - 1)}
            >
              <span id="ProfilePic">
                <img src={data.picture} alt="IMG" />
                <span id="status" />
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
