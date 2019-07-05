import React from "react";

export default function Stories(data) {
  console.log("Active Stories");

  const DailySnapShoots = data => {
    return [].map(info => {
      return (
        <div className="DailySnap">
          <img src="##" alt="name" />
          <label>---</label>
        </div>
      );
    });
  };

  return (
    <>
      <div className="DailySnap addStory">
        <i class="fas fa-plus"/>
        <label>Your Story</label>
      </div>

      <DailySnapShoots />
    </>
  );
}
