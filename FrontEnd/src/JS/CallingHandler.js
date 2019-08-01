import "../../CSS/PhoneCall.css";
import StreamingCalls from "./StreamingCalls";

export default function CallingHandler() {
  // ----- // Handles Video or Audio Call Actions
  HandlePhoneCall = (type, details) => {
    let myCanvasVideo = document.querySelector("#myCanvasVideo"),
      ControlCont = document.querySelector(".ControlCont"),
      ButtonsCont = document.querySelector(".ButtonsCont"),
      PhoneProfile = document.querySelector(".PhoneProfile"),
      Controls = document.querySelector(".Controls"),
      endCall = document.querySelector(".endCall"),
      videoToggle = document.querySelector("#videoToggle");

    if (type === "videoToggle") {
      type = videoToggle.classList[0] === "ActiveCall" ? "phone" : "video";
    }

    switch (type) {
      case "phone":
        myCanvasVideo.classList.remove("activeCallShow");
        ControlCont.classList.remove("activeCallFlexEnd");
        ButtonsCont.classList.remove("activeCallHeight");
        PhoneProfile.classList.remove("activeCallHide");
        Controls.classList.remove("activeCallJustify");
        endCall.classList.remove("activeCallMargin");
        videoToggle.classList.remove("ActiveCall");
        break;

      case "video":
        myCanvasVideo.classList.add("activeCallShow");
        ControlCont.classList.add("activeCallFlexEnd");
        ButtonsCont.classList.add("activeCallHeight");
        PhoneProfile.classList.add("activeCallHide");
        Controls.classList.add("activeCallJustify");
        endCall.classList.add("activeCallMargin");
        videoToggle.classList.add("ActiveCall");
        break;

      default:
    }

    // Actually Starts the Action Audio or Video transmition
    StreamingCalls(type, details);

    if (this.state.PhoneCallStyle.display === "none" || type === "MSG") {
      let displayType1 =
          this.state.PhoneCallStyle.display === "none"
            ? { opacity: 0, display: "block" }
            : { opacity: 0, display: "block" },
        displayType2 =
          this.state.PhoneCallStyle.display === "none"
            ? { opacity: 1, display: "block" }
            : { opacity: 0, display: "none" };

      this.setState({
        PhoneCallStyle: displayType1
      });

      setTimeout(() => {
        this.setState({
          PhoneCallStyle: displayType2
        });
      }, 100);
    }
  };

  return (
    <div className="PhoneCall" style={this.state.PhoneCallStyle}>
      <video className="myVideo" />
      <canvas id="recipientVideo" />
      <canvas id="myCanvasVideo" />

      <div className="ControlCont">
        <div className="PhoneProfile">
          <img
            style={{
              backgroundImage: "url(" + picture + ")"
            }}
            alt=""
          />
          <label>{userName}</label>
          <small>Ringing...</small>
        </div>

        <div className="ButtonsCont">
          <div className="Controls">
            <span>
              <i className="fas fa-microphone-alt-slash" />
              <label>Mute</label>
            </span>
            <span>
              <i className="fas fa-volume-up" />
              <label>Speaker</label>
            </span>
            <span
              onClick={event =>
                this.HandlePhoneCall("videoToggle", {
                  me: myUserName,
                  friend: userName
                })
              }
              id="videoToggle"
              className=""
            >
              <i className="fas fa-video" />
              <label>Video</label>
            </span>
          </div>

          <div className="endCall">
            <span
              onClick={() =>
                this.HandlePhoneCall("MSG", {
                  me: myUserName,
                  friend: userName
                })
              }
            >
              <i className="fas fa-phone" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
