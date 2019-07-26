import React from "react";

export default function Chats({ people, togglePage, myDataID, latestChats }) {
  const People = () => {
    return people.map(data => {
      if (myDataID !== data.ID) {
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

              <span id={"status"} key={Math.random()} />
            </span>
            <div className="details" key={Math.random()}>
              <h4 key={Math.random()}>{data.userName}</h4>
              <p key={Math.random()}>{"chats"}</p>
            </div>
            <time key={Math.random()}>{"timeStamp"}</time>
          </div>
        );
      } else {
        return;
      }
    });
  };

  return <People />;
}
