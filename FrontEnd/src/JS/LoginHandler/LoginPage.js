import React, { Component } from "react";
import "../../CSS/Authentifacation.css";
import Fire from "../../FIREBASE/FBConfig";
import { connect } from "react-redux";
import ProfilePic from "./ProfilePic";
import socket from "../Socket";

var pageToggle = 0;
class LoginPage extends Component {
  state = {
    avatar: {
      opacity: 0,
      "margin-top": -230
    },
    userNameStyle: {
      display: "none"
    },
    alert: { padding: 0 }
  };

  componentDidMount(){
    pageToggle+=1;
    if(pageToggle >= 2){
      window.location.reload();
    }
  }

  //----//  This function handles form submition --> It simply sends user content to props
  //----//  It also Takes user to the chat app home
  async SubmitForm(event) {
    event.preventDefault();

    var elms = document.querySelectorAll(
        "#check1, #picture, #userLabel, #email, #password"
      ),
      returnLogs = null,
      myLoginData = {
        picture: elms[0].src.toString(),
        newCustomer: elms[1].checked,
        userName: elms[2].value,
        email: elms[3].value,
        password: elms[4].value
      };

    // Validates Form Data and checks if everything is correct
    if (await this.ValidateFormData(myLoginData)) {
      if (myLoginData.newCustomer === true) {
        returnLogs = await this.RegisterHandler(myLoginData);
      } else {
        returnLogs = await this.LoginHandler(myLoginData);
      }
      // Changes page IF user successfully Login or registers
      if (
        returnLogs !== null &&
        ["Login", "Register"].includes(returnLogs.checkInType)
      ) {
        this.props.myDetails(returnLogs); // Set to props
        this.props.history.push("/chat");
      }
    }
  }

  //----// This function is triggered when user toggles "I'm new here Checkbox"
  RegisterBox = () => {
    var dom = document.querySelectorAll(".userName, #userLabel"),
      userName = dom[0],
      userLabel = dom[1];

    if (userName.offsetHeight === 0) {
      userLabel.removeAttribute("required");
      // formgroup
      this.setState({
        avatar: {
          opacity: 1,
          "margin-top": 0
        },
        userNameStyle: {
          display: "block"
        }
      });
    } else {
      userLabel.removeAttribute("required");

      this.setState({
        avatar: {
          opacity: 0,
          "margin-top": -230
        },
        userNameStyle: {
          display: "none"
        }
      });
    }
  };

  //----// This function will trigger when a user wants to register --> the trigger happens when a user presses submit button
  RegisterHandler(myLoginData) {
    return Fire.auth()
      .createUserWithEmailAndPassword(myLoginData.email, myLoginData.password)
      .then(userInfo => {
        delete myLoginData.email;
        delete myLoginData.password;
        delete myLoginData.newCustomer;

        const timeStamp = Date.parse(new Date()),
          myFormInfo = {
            uuID: userInfo.user.uid,
            ...myLoginData,
            status: "Online",
            checkInType: "Register",
            messageKey: (Math.random() * 1000)
              .toString(16)
              .substring()
              .replace(/[.]/g, ""),
            phoneUpdate: timeStamp,
            accountCreatedDATE: timeStamp,
            emailUpdate: timeStamp,
            pictureUpdate: timeStamp
          };

        return myFormInfo;
      })
      .catch(error => {
        return this.WarningHandler(error.message);
      });
  }

  //----//   Handles Login process, It triggers when user presses Submit button
  LoginHandler(myLoginData) {
    return Fire.auth()
      .signInWithEmailAndPassword(myLoginData.email, myLoginData.password)
      .then(userInfo => {
        return { uuID: userInfo.user.uid, checkInType: "Login" };
      })
      .catch(error => {
        return this.WarningHandler(error.message);
      });
  }

  //----//  This function only works after user presses submit --> It will check user input if valid
  async ValidateFormData(formData) {
    var warnings = "";

    if (formData.password.replace(" ", "").length < 6) {
      warnings += "Password must be > 6 char|";
    }

    if (formData.newCustomer === true && formData.userName.length < 4) {
      warnings += "User Name must be > 4 char|";
    }

    // Check for userName in the server
    if (formData.newCustomer === true) {
      socket.emit("FetchUserNames", formData.userName);

      // Wait for response
      var promise = new Promise(resolve => {
        socket.on("ReturnUserNames", res => {
          resolve(res);
        });
      });

      warnings += await promise;
    }

    // Showing warnings to the user
    if (warnings !== "") {
      return this.WarningHandler(warnings);
    } else {
      return true;
    }
  }

  //-----// This function handles all alerts, to let the user know whats wrong
  WarningHandler = data => {
    let alert = document.getElementById("Alert");
    alert.innerText = data.replace(/\|/g, "\n");

    this.setState({
      alert: { padding: 20 }
    });

    // Warning timeout
    setTimeout(() => {
      alert.innerText = "";
      this.setState({
        alert: { padding: 0 }
      });
    }, 5000);

    return false;
  };

  render() {
    return (
      <section className="LoginSection">
        <span id="Alert" style={this.state.alert} />
        <div className="content container">
          <h3>Welcome to Chatome</h3>

          <form
            onSubmit={event => this.SubmitForm(event)}
            className="container d-flex flex-column LoginForm"
          >
            <div className="avatar" style={this.state.avatar}>
              <ProfilePic
                imgStyle={this.state.avatar}
                WarningHandler={this.WarningHandler}
              />
            </div>

            <div className="form-group">
              <input type="checkbox" onChange={this.RegisterBox} id="check1" />
              <label className="form-check-label" htmlFor="check1">
                - I'm new to this!!!
              </label>
            </div>

            <div
              className="form-group userName"
              style={this.state.userNameStyle}
            >
              <label>*User Name</label>
              <input
                type="text"
                placeholder="e.i: Smaff56"
                id="userLabel"
                defaultValue={"user56"}
              />
            </div>

            <div className="form-group">
              <label>*Email</label>
              <input
                type="email"
                placeholder="e.i: example@gmail.com"
                id="email"
                required
              />
            </div>

            <div className="form-group">
              <label>*Password </label>
              <input
                type="password"
                id="password"
                required
              />
            </div>

            <input type="submit" id="Submit" />
          </form>
        </div>
      </section>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    myDetails: stutas => {
      dispatch({ type: "UPDATE", data: stutas });
    }
  };
};

export default connect(
  null,
  mapDispatchToProps
)(LoginPage);
