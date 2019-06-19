import React from "react";

export default function Chats({ ChatData, myUserName, ImgSrc }) {
  if (!ChatData) {
    return <></>;
  }
  
  const UserMessages = () => {
    return ChatData.map(msg => {
      var userName = Object.keys(msg);

      if (msg.name !== myUserName) {
        return (
          <li className="replyMessage" key={myUserName + Math.random()}>
            <time>{msg.timeStamp}</time>
            <div>
              <img src={ImgSrc} id="userIcon" alt="IMG" />
              <label>{msg.name}</label>
              <p>{msg.message}</p>
            </div>
          </li>
        );
      } else {
        return (
          <li className="sentMessage" key={userName + Math.random()}>
            <time>{msg.timeStamp}</time>
            <div>
              <label>{msg.name}</label>
              <p>{msg.message}</p>
            </div>
          </li>
        );
      }
    });
  };

  return <UserMessages />;
}
