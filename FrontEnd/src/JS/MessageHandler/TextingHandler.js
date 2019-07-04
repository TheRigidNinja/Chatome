import React, { Component } from "react";
import "../../CSS/TextArea.css";

export class TextingHandler extends Component {
  state = {
    firstInput: false,
    textArea: null,
    textAreaPos: {
      top: "calc(100% - 45px)"
    }
  };

  componentDidMount() {
    let textArea = document.querySelector(".MSGBox");
    textArea.addEventListener("drag", () => {
      this.TextAreaEventAction("drag");
    });

    this.setState({
      textArea: textArea
    });
  }

  TextAreaEventAction(action) {
    console.log("Active Text area");

    switch (action) {
      case "Input":
        let hght = this.state.textArea.offsetHeight;

        this.setState({
          textAreaPos: {
            top: "calc(100% - " + (hght + 10) + "px)"
          }
        });
        console.log(hght);
        break;

      case "drag":
        break;

      default:
        return false;
    }
  }

  render() {
    return (
      <form className="userTyping" style={this.state.textAreaPos}>
        <div className="messageTools">
          <span className="InsertImage">
            <i class="fas fa-chevron-right"/>
            {/* <i class="fas fa-mountain" />
            <i className="fas fa-camera-retro" />
            <i className="fas fa-image" /> */}
          </span>

          <span className="TextArea">
            <div
              className="MSGBox"
              contentEditable="true"
              onInput={() => this.TextAreaEventAction("Input")}
            >
              New Message
            </div>
      
            <i className="fas fa-laugh" id="emoji" />
          </span>

          <span className="submitMessage">
            <i
              className="fas fa-paper-plane"
              id="submitMessage"
              //   onClick={() => this.sendMessageToServer(myUserName, checkKey, key2)}
            />
          </span>
        </div>
      </form>
    );
  }
}

export default TextingHandler;
