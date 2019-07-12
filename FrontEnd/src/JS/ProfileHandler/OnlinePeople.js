import React from "react";
// import addStory from "../../IMG/story.svg";

export default function OnlinePeople({ people, togglePage, myDataID }) {
  console.log(people);

  // const People = () => {
  // try {
  //   return people.map(data => {
  //     if (data.ID !== myDataID && data.status === "Online") {
  //       return (
  //         <div
  //           key={Math.random()}
  //           className="Onlineperson"
  //           onClick={() => togglePage("MessagingBoard", data.ID)}
  //         >
  //           <img src={data.picture} alt="IMG"/>
  //           <span id="status"/>
  //         </div>
  //       );
  //     } else {
  //       return <></>;
  //     }
  //   });

  // } catch (error) {
  //   return <>Erro</>;
  // }

  //   return <>Erro</>;
  // };

  return (
    <div className="onlinePeople">
      {/* People Online */}
      {(() => {
        return people.map(data => {
          if (data.ID !== myDataID && data.status === "Online") {
            return(
            <div
              key={Math.random()}
              className="Onlineperson"
              onClick={() => togglePage("MessagingBoard", data.ID)}
            >
              {/* <img src={data.picture} alt="IMG"/>
              <span id="status"/> */}
            </div>
            )}else{
              return <></>
            }
        });
      })()}
    </div>
  );
}
