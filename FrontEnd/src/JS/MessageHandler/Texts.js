import React from "react";

export default function Chats({ ChatData, myUserName, ImgSrc }) {

  console.log("Active Chats");

  const UserMessages = () => {
    if (ChatData) {
      return ChatData.map(msg => {
        var userName = Object.keys(msg);

        // Replay Message Style
        if (msg.name !== myUserName) {
          return (
            <li className="replyMessage" key={myUserName + Math.random()}>
              <time>{msg.timeStamp}</time>
              <div>
                <img src={ImgSrc} id="userIcon" alt="IMG" />
                <label>{msg.name}</label>
                <div>{msg.message}</div>
              </div>
            </li>
          );

          // Sending message Style
        } else {
          return (
            <li className="sentMessage" key={userName + Math.random()}>
              <time>{msg.timeStamp}</time>
              <div>
                <label>{msg.name}</label>
                <div>{msg.message}</div>
              </div>
            </li>
          );
        }
      });
    } else {
      //  Return Empty if no Messages
      return <></>;
    }
  };

  return <UserMessages />;
}
