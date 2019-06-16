import React from "react";

export default function Chats({ ChatData,myUserName,ImgSrc }) {
  if(!ChatData){
    return <></>
  }

  const UserMessages = () => {

    // console.log(ChatData);
    return ChatData.map(msg => {
      var userName = Object.keys(msg);
      if (userName[0] !== myUserName) {
        return (
          <li className="replyMessage" key={userName + Math.random()}>
            <time>{msg[userName[1]]}</time>
            <div>
              <img src={ImgSrc} id="userIcon" alt="IMG" />
              <label>{userName[0]}</label>
              <p>{msg[userName[0]]}</p>
            </div>
          </li>
        );
      } else {
        return (
          <li className="sentMessage" key={userName + Math.random()}>
            <time>{msg[userName[1]]}</time>
            <div>
              <label>{userName[0]}</label>
              <p>{msg[userName[0]]}</p>
            </div>
          </li>
        );
      }
    });
  };

  return <UserMessages />;
}
