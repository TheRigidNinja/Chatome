import React from "react";

export default function Chats({ people, togglePage, myDataID }) {
  //   var myName = people[myDataID].userName,
  //     chats = "",
  //     timeStamp = "",
  //     status,
  //     paragraphStyle = {};

  console.log(people);
  
  const People = () => {
    return people.map(data => {
      if (data.status === "Online" && data.ID !== myDataID) {
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
                  backgroundImage:
                    "url("+data.picture+")"
                }}
                key={Math.random()}
                alt=""
              />

              <span id={"status"} key={Math.random()} />
            </span>
            <div className="details" key={Math.random()}>
              <h4 key={Math.random()}>{data.userName}</h4>
            </div>

            <time key={Math.random()} id="OnlinePeople">
              <span role="img" aria-label="">
                👋
              </span>
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
