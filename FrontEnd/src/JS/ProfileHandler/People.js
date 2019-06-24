import React from "react";
// import LZString from "lz-string";

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
    status,
    paragraphStyle = {};

  const People = () => {
    return people.map(data => {
      chats = `Say hello ${emojis[Math.floor(Math.random() * 4)]} to ${
        data.userName
      }`;
      timeStamp = " ";
      status = data.status === "Online" ? "status" : "";
      paragraphStyle = {"font-weight": "700", "opacity": ".8"};

      if (data.ID !== myDataID) {
        if (latestChats !== undefined && latestChats[data.userName]) {
          let userDetail = latestChats[data.userName];

          // paragraphStyle
          // Check to see if the text is from you or your friend
          if (userDetail.recipient === myName) {
            chats = " " + userDetail.message;
          } else {
            paragraphStyle = {};
            chats = "You: " + userDetail.message;
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
                <p style={paragraphStyle}>{chats}</p>
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
