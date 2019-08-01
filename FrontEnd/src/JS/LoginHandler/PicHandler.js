import React, { Component } from "react";
import Webcam from "react-webcam";
import "../../CSS/RegisterPhoto.css";
import defaultPic from "../../IMG/defaultPic.jpeg";

export default class ProfilePic extends Component {
  state = {
    toggleProfile: "default",
    profilePic: defaultPic,
    options: {
      left: "calc(100% - 79px)",
      width: "54.4px"
    }
  };

  componentDidMount() {
    // ----- // This function handles when user clicks on window ---> Its for toggling options menu when choosing avatar for your profile
    var elm = document.getElementById("root");
    elm.addEventListener("click", event => {
      if (event.target.parentNode.className !== "uploadMethods") {
        this.revealOptions(event, "window");
      }
    });
  }

  // ----- // This will trigger if user wants to get to default state
  defaultPage = () => {
    this.handleProfilePicToState(this.state.profilePic);
  };

  // ----- // Checking if device is touch screen
  checkTouchDevice() {
    return "ontouchstart" in document.documentElement;
  }

  // ----- // Taking screen Shots
  setRef = webcam => {
    this.webcam = webcam;
  };

  // ----- // Functions handles taking a photo
  capture = () => {
    const imageSrc = this.webcam.getScreenshot();

    this.handleProfilePicToState(imageSrc);
  };

  // ----- // Determines if phone camera should be used or computer web cam
  toggleCamera = () => {
    this.setState(
      {
        toggleProfile: this.checkTouchDevice()
          ? "Phone_Camera"
          : "Computer_Camera"
      },
      () => {
        if (this.state.toggleProfile === "Phone_Camera") {
          let uploadImage = document.querySelector(".uploadImage");
          uploadImage.addEventListener("change", event => {
            this.handleChangeEvent(event);
          });
          uploadImage.click();
        }
      }
    );
  };

  // ----- // Activates upload image method
  uploadImage = () => {
    this.setState(
      {
        toggleProfile: "UploadImage"
      },
      () => {
        let uploadImage = document.querySelector(".uploadImage");
        uploadImage.addEventListener("change", event => {
          this.handleChangeEvent(event);
        });
        uploadImage.click();
      }
    );
  };

  // ----- // Activates when clicked link icon
  linkedImage = () => {
    this.setState({
      toggleProfile: "LinkedImage"
    });
  };

  // ----- // Checks if link is valid as IMG other wise return an err OR Procced
  submitLink = () => {
    let link = document.querySelector(".urlImage").value;

    // Check if URL is an image
    if (!/(\.jpeg|\.jpg|\.png|\.gif)/g.test(link)) {
      this.props.systemWarning(
        "URL is not not an Image. Please provide a valid Image URL"
      );
      document.querySelector(".urlImage").value = "";
    } else {
      this.handleProfilePicToState(link);
    }
  };

  // ----- // Handles when Event changes on upload
  handleChangeEvent = event => {
    if (event.target.files[0] && event.target.files[0].size < 512284) {
      let imgUrl = URL.createObjectURL(event.target.files[0]);
      this.handleProfilePicToState(imgUrl);
    } else {
      // Give warning
      this.props.systemWarning(
        "Image Size Too Big!! Please Choose images that are < than 512 KB"
      );
    }
  };

  // ----- // Sends image to state for later use
  handleProfilePicToState = imageSrc => {
    this.setState({
      toggleProfile: "Profile",
      profilePic: imageSrc
    });
  };

  // ----- // Reveals / Hides more option when taking profile photos
  revealOptions = (event, action) => {
    if (
      event.target.className === "fas fa-hand-point-right" ||
      this.state.options.width !== "54.4px"
    ) {
      var left = "calc(100% - 79px)",
        width = "54.4px";

      if (
        event.target.className === "fas fa-hand-point-right" &&
        this.state.options.width !== "231px"
      ) {
        left = "calc(100% - 216px)";
        width = "231px";
      }

      this.setState({
        options: {
          left: left,
          width: width
        }
      });
    } else if (
      !["SubmitLink", "urlImage", "uploadImage"].includes(
        event.target.className
      )
    ) {
      this.defaultPage();
    }
  };
  // Reset the toggled button

  render() {
    switch (this.state.toggleProfile) {
      // ----- // Handler computer camera

      case "Computer_Camera":
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
              <span />
            </span>
          </div>
        );

      // ----- // Handle phone camera
      case "Phone_Camera":
        return (
          <>
            <img
              src={this.state.profilePic}
              alt="Avatar"
              title="Choose your avatar"
              id="picture"
              className="demoPic"
              style={this.props.imgStyle}
            />
            <input
              type="file"
              accept="image/*"
              capture="camera"
              className="uploadImage"
            />
          </>
        );

      // ----- // Handles on upload image
      case "UploadImage":
        return (
          <>
            <img
              src={this.state.profilePic}
              alt="Avatar"
              title="Choose your avatar"
              id="picture"
              className="demoPic"
              style={this.props.imgStyle}
            />
            <input type="file" accept="image/*" className="uploadImage" />
          </>
        );

      case "LinkedImage":
        return (
          <>
            <img
              src={this.state.profilePic}
              alt="Avatar"
              title="Choose your avatar"
              id="picture"
              className="demoPic"
              style={this.props.imgStyle}
            />

            <div className="LinkedImage">
              <input
                type="text"
                placeholder="https://..... .jpg"
                className="urlImage"
              />
              <span className="SubmitLink" onClick={this.submitLink}>
                Done!
              </span>
            </div>
          </>
        );
      // ----- // Default display
      default:
        return (
          <>
            <div className="uploadMethods" style={this.state.options}>
              <i
                className="fas fa-hand-point-right"
                onClick={this.revealOptions}
              />
              <i className="fas fa-camera-retro" onClick={this.toggleCamera} />
              <i className="fas fa-upload" onClick={this.uploadImage} />
              <i className="fas fa-link" onClick={this.linkedImage} />
            </div>

            <img
              src={this.state.profilePic}
              alt="Avatar"
              title="Choose your avatar"
              id="picture"
              style={this.props.imgStyle}
              // style={{
              //   ...this.props.imgStyle
              //   backgroundImage: "url(" + this.state.profilePic + ")"
              // }}
            />
          </>
        );
    }
  }
}
