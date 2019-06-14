import React, { Component } from "react";
import Webcam from "react-webcam";
import "../../CSS/RegisterPhoto.css";
import defaultPic from "../../IMG/defaultPic.jpeg";

export default class ProfilePic extends Component {
  state = {
    toggleProfile: "Profile",
    profilePic: defaultPic
  };

  setRef = webcam => {
    this.webcam = webcam;
  };

  capture = () => {
    const imageSrc = this.webcam.getScreenshot();
    
    this.setState({
      toggleProfile: "Profile",
      profilePic: imageSrc
    });
  };

  toggleCamera = () => {
    this.setState({
      toggleProfile: "Camera"
    });
  };

  render() {
    const videoConstraints = {
      width: 300,
      height: 300,
      facingMode: "user"
    };

    if (this.state.toggleProfile === "Profile") {
      return (
        <>
          <i className="fas fa-camera" onClick={this.toggleCamera} />
          <img
            src={this.state.profilePic}
            alt="Avatar"
            title="Choose your avatar"
            id="picture"
            style={this.props.imgStyle}
          />
        </>
      );
    } else {
      return (
        <div className="Camera">
          <Webcam
            className="RegisterPic"
            audio={false}
            ref={this.setRef}
            screenshotFormat="image/jpeg"
            width={300}
            videoConstraints={videoConstraints}
          />
          <span onClick={this.capture} className="takePic">
            <span />
          </span>
        </div>
      );
    }
  }
}
