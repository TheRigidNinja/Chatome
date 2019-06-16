import React from "react";
import addStory from "../../IMG/story.svg";

export default function OnlinePeople({ people, togglePage, myDataID }) {
  const People = () => {
    try {
      return people.map(data => {
        if (data.ID !== myDataID + 1 && data.status == "Online") {
          return (
            <>
              <div
                className="Onlineperson"
                onClick={() => togglePage("Messaging", data.ID - 1)}
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
