import React from "react";
import ReactHtmlParser from "react-html-parser";

export default function Texts({ ChatData, myUserName, ImgSrc }) {
  const UserMessages = () => {
    if (ChatData) {
      return ChatData.map(msg => {

        // Replay Message Style
        if (msg.name  !== myUserName) {
          return (
            <li className="replyMessage" key={Math.random()}>
              <time>{msg.timeStamp}</time>
              <div>
                <img
                  style={{
                    backgroundImage: "url(" + ImgSrc + ")"
                  }}
                  id="userIcon"
                  alt="IMG"
                />
                <label>{msg.name}</label>
                <div>{ReactHtmlParser(msg.message)}</div>
              </div>
            </li>
          );

          // Sending message Style
        } else {
    
          return (
            <li className="sentMessage" key={Math.random()}>
              <time>{msg.timeStamp}</time>
              <div>
                <label>{msg.name}</label>
                <div>{ReactHtmlParser(msg.message)}</div>
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
