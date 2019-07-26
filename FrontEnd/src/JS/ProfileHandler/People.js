import React from "react";

export default function Chats({ people, togglePage, myDataID, latestChats }) {
  //   var myName = people[myDataID].userName,
  //     chats = "",
  //     timeStamp = "",
  //     status,
  //     paragraphStyle = {};

  people = ["Brian sHISANYA", "Matthew french"];

  const People = () => {
    return people.map(data => {
      return (
        <div
          className="Person"
          // messagekey={data.messageKey}
          onClick={() => togglePage("MessagingBoard", "data.ID")}
          key={Math.random()}
        >
          <span id="ProfilePic" key={Math.random()}>
            <img
              style={{
                backgroundImage:
                  "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs-4j_db6aDDKJnLcLprBjRFX7cOesiVmGT-WysEUnemBUdEaJMw)"
              }}
              key={Math.random()}
              alt=""
            />

            <span id={"status"} key={Math.random()} />
          </span>
          <div className="details" key={Math.random()}>
            <h4 key={Math.random()}>{"Brian William Shisanya"}</h4>
          </div>

          <time key={Math.random()} id="OnlinePeople"><span role="img" aria-label="">👋</span></time>
        </div>
      );
    });
  };

  return <People />;
}
