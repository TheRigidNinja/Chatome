import React, { Component } from "react";
import Webcam from "react-webcam";
import "../../CSS/RegisterPhoto.css";

export default class CameraHandler extends Component {
  setRef = webcam => {
    this.webcam = webcam;
  };

  capture = () => {
    const imageSrc = this.webcam.getScreenshot();
    // console.log(imageSrc)
  };

  render() {
    const videoConstraints = {
      width: 300,
      height: 300,
      facingMode: "user"
    };

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
            <span/>
        </span>
      </div>
    );

    // return (
    //     <div>
    //         {/* <img src={}/> */}
    //     </div>
    // )
  }
}