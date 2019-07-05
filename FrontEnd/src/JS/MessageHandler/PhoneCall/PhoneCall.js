import React from "react";
import "../../../CSS/PhoneCall.css";
import Streaming from "./StreamingHandler";

export default function PhoneCall({
  phoneType,
  HandlePhoneCall,
  recipientData
}) {
  // console.log(window.openCV);

  if (phoneType) {
    Streaming("GetElm");

    return (
      <>
        {/* Video element for streaming */}
        <video className="myVideo" />
        <canvas className="recipientVideo" />

        <div className="ControlCont">
          <div>
            <div className="PhoneProfile">
              <img src={recipientData.pic} />
              <label>{recipientData.name}</label>
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
        </div>
      </>
    );
  } else {
    return <></>;
  }
}
