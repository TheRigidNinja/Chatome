import React from "react";
import addStory from "../../IMG/story.svg";
import LZString from "lz-string";

export default function OnlinePeople({ people, togglePage, myDataID }) {
  const People = () => {
    try {
      return people.map(data => {
        if (data.ID !== myDataID && data.status === "Online") {
          return (
            <div className="onlinePeople">
              <div
                key={Math.random()}
                className="Onlineperson"
                onClick={() => togglePage("MessagingBoard", data.ID)}
              >
                <img src={data.picture} />
                <span id="status" />
                {/* <h6>{data.userName}</h6> */}
              </div>
            </div>
          );
        } else {
          return <></>;
        }
      });
    } catch (error) {
      return <>Erro</>;
    }
  };

  return <People />;
}
