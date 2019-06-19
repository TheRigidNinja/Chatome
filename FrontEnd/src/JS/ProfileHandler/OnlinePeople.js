import React from "react";
import addStory from "../../IMG/story.svg";
import LZString from "lz-string";

export default function OnlinePeople({ people, togglePage, myDataID }) {

  const People = () => {
    try {
      return people.map(data => {
        if (data.ID !== myDataID && data.status === "Online") {
          return (
            <>
              <div
                key={Math.random()}
                className="Onlineperson"
                onClick={() => togglePage("MessagingBoard", data.ID)}
              >
                <img src={data.picture} />
                <span id="status" />
                <h6>{data.userName}</h6>
              </div>
            </>
          );
        } else {
          return <></>;
        }
      });
    } catch (error) {
      return <>Erro</>;
    }
  };

  return (
    <div className="onlinePeople">
      <div className="Onlineperson" onClick={0}>
        <img src={addStory} alt="IMG" />
        <h6>Your story</h6>
      </div>
      <People />
    </div>
  );
}
