import React, { Component } from "react";
import "../CSS/SystemAlert.css";

export default class SystemAlert extends Component {
  state = {
    alertStyle: { padding: 0 },
    systemAlertMSG: ""
  };

  componentWillReceiveProps() {
    setTimeout(() => {
      let msg = this.props.systemAlertMSG;
      if (msg && msg.length > 0) {
        this.setState(
          {
            systemAlertMSG: msg ? msg.replace(/\|/g, "\n") : "",
            alertStyle: { padding: 20 }
          },
          () => {
            setTimeout(() => {
              this.setState({
                alertStyle: { padding: 0 },
                systemAlertMSG: ""
              });
            }, 5000);
          }
        );
      }
    }, 100);
  }

  // WarningHandler = data => {
  //   let alert = document.getElementById("Alert");
  //   alert.innerText = data.replace(/\|/g, "\n");

  //   this.setState({
  //     alert: { padding: 20 }
  //   });

  //   // Warning timeout
  //   setTimeout(() => {
  //     alert.innerText = "";
  //     this.setState({
  //       alert: { padding: 0 }
  //     });
  //   }, 5000);

  //   return false;
  // };

  render() {
    switch (true) {
      default:
        return (
          <span id="Alert" style={this.state.alertStyle}>
            {this.state.systemAlertMSG}
          </span>
        );
    }
  }
}
