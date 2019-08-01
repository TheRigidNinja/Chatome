import React from "react";

export default function Chats({ people, togglePage, myDataID, latestChats }) {
  var chats = "",
    timeStamp = "",
    status,
    paragraphStyle = {};

  const People = () => {
    return people.map(data => {
      if (myDataID !== data.ID) {
        chats = `Say hello to ${data.userName}`;
        timeStamp = data.timeStamp ? " " : " ";
        status = data.status === "Online" ? "status" : "";
        paragraphStyle = { fontWeight: "600", color: "rgba(58, 66, 79,.9)" };

        // if (data.ID !== myDataID) {
        //   if (latestChats !== undefined && latestChats[data.userName]) {
        //     let userDetail = latestChats[data.userName];

        //     // paragraphStyle
        //     // Check to see if the text is from you or your friend
        //     if (userDetail.recipient === myName) {
        //       chats = " " + userDetail.message;
        //     } else {
        //       paragraphStyle = {};
        //       chats = "You: " + userDetail.message;
        //     }
        //   }

        return (
          <div
            className="Person"
            messagekey={data.messageKey}
            onClick={() => togglePage("MessagingBoard", data.ID)}
            key={Math.random()}
          >
            <span id="ProfilePic" key={Math.random()}>
              <img
                style={{
                  backgroundImage: "url(" + data.picture + ")"
                }}
                key={Math.random()}
                alt=""
              />

              <span id={status} key={Math.random()} />
            </span>
            <div className="details" key={Math.random()}>
              <h4 key={Math.random()}>{data.userName}</h4>
              <p key={Math.random()}>{chats}</p>
            </div>
            <time key={Math.random()} style={paragraphStyle}>
              {timeStamp}
            </time>
          </div>
        );
      } else {
        return;
      }
    });
  };

  return <People />;
}
