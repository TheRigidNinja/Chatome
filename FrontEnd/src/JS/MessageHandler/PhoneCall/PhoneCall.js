import React from "react";
import "../../../CSS/PhoneCall.css";
import profile from "../../../IMG/defaultPic.jpeg";

export default function PhoneCall({ phoneType, HandlePhoneCall }) {
  if (phoneType) {
    return (
      <>
        <div>
          <div className="PhoneProfile">
            <img src={profile} />
            <label>Brian Shisanya</label>
            <small>Ringing...</small>
          </div>

          <div className="Controls">
            <span>
              <i class="fas fa-microphone-alt-slash" />
              <label>Mute</label>
            </span>
            <span>
              <i class="fas fa-volume-up" />
              <label>Speaker</label>
            </span>
            <span>
              <i className="fas fa-video" />
              <label>Video</label>
            </span>
          </div>
        </div>

        <div className="endCall">
          <span onClick={() => HandlePhoneCall("MSG")}>
            <i className="fas fa-phone" />
          </span>
        </div>
      </>
    );
  } else {
    return <></>;
  }

  //   if (phoneType === "video") {
  //     return (
  //       <>
  //         <div>v</div>
  //       </>
  //     );
  //   } else if (phoneType === "phone") {
  //     return (
  //       <>
  //         <div>p</div>
  //       </>
  //     );
  //   } else {
  //     return <></>;
  //   }
}
