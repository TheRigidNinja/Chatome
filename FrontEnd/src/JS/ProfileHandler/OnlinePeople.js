import React from "react";

export default function OnlinePeople({ peopleData, TogglePage, myData }) {

  const People = () => {
    console.log("object");
    return peopleData.map(data => {
      if (!(data.ID === myData)) {
        return (
          <>
            <div
              className="Onlineperson"
              messageKey={0}
              onClick={() => TogglePage("Messaging", data.ID - 1)}
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
  };

  return (
    <div className="onlinePeople">
      <div className="Onlineperson" onClick={0}>
        <img src="../public/Img/Story.svg" alt="IMG" />
        <h6>Your story</h6>
      </div>
      <People />
    </div>
  );
}
// return (
//     <div className="onlinePeople">
//         <div className="Onlineperson" onClick={0}>
//             <img src="../public/Img/Story.svg" alt="IMG"/>
//             <h6>Your story</h6>
//         </div>
//         <div className="Onlineperson" messageKey={0} onClick={0}>
//             <img src="../public/Img/User.svg"/>
//             <span id="status"></span>
//             <h6>NAN</h6>
//         </div>
//     </div>
// )
