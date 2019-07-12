import React, { Component } from "react";
import "../../CSS/TextArea.css";

export class TextingHandler extends Component {
  state = {
    firstInput: false,
    textArea: null,
    placeHolder: "Aa",
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
    switch (true) {
      case action === "Input":
        let hght = this.state.textArea.offsetHeight + 13,
          placeHolderText = "";
        if (["", "<br>"].includes(this.state.textArea.innerHTML)) {
          placeHolderText = "Aa";

          // this.setState({
          //   textArea: this.textArea.innerHTML = ""
          // }) 
        }

        this.setState({
          textAreaPos: {
            top: "calc(100% - " + hght + "px)"
          },
          placeHolder: placeHolderText
        });
        break;

      case action === "paste" || action === "drop":
        // console.log(document.querySelector(".MSGBox").innerHTML);
        // let elment = document.querySelector(".MSGBox");
        // setTimeout(() => {

        //   let img = elment.innerHTML.match(
        //       /((\w+:\/\/\S+)|(\w+[\.:]\w+\S+))[^\s,\.]/gi
        //     ),
        //     imgAdress = elment.innerText;

        //   if (img) {
        //     imgAdress = JSON.stringify(
        //       img.map(urls => {
        //         return "<img src=" + urls + ">";
        //       })
        //     ).replace(/\[|\]|"/g, "");

        //     imgAdress =
        //       action === "drop"
        //         ? imgAdress.substr(0, imgAdress.length - 2) + ">"
        //         : imgAdress;
        //   }
        //   // elment.innerText

        //   console.log(imgAdress,);
        //   // elment.innerHTML = imgAdress;
        // }, 0);

        // console.log(elment.inner);
        break;

      default:
        return false;
    }
  }

  render() {
    var { checkKey, key2, myUserName, sendMessageToServer } = this.props;

    return (
      <form className="userTyping" style={this.state.textAreaPos}>
        <div className="messageTools">
          <span className="InsertImage">
            <i class="fas fa-chevron-right" />
            {/* <i class="fas fa-mountain" />
            <i className="fas fa-image" />
            <i className="fas fa-camera-retro" /> */}
          </span>

          <span className="TextArea">
            <span id="placeHolder">{this.state.placeHolder}</span>
            <div
              className="MSGBox"
              contentEditable="true"
              onInput={() => this.TextAreaEventAction("Input")}
              onPasteCapture={() => this.TextAreaEventAction("paste")}
              onDrop={() => this.TextAreaEventAction("drop")}
            />

            {/* <i className="fas fa-laugh" id="emoji" /> */}
          </span>

          <span className="submitMessage">
            <i
              className="fas fa-paper-plane"
              id="submitMessage"
              onClick={() => sendMessageToServer(myUserName, checkKey, key2)}
            />
          </span>
        </div>
      </form>
    );
  }
}

export default TextingHandler;
