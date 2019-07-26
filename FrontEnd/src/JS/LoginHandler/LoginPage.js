import React, { Component } from "react";
import "../../CSS/Authentifacation.css";
import Fire from "./FB-ConfigKey";
import ProfilePic from "./PicHandler";
import socket from "../Socket";
import SystemAlert from "../SystemAlert";
import Cookie from "../Cookies";

class LoginPage extends Component {
  state = {
    avatar: {
      opacity: 0,
      marginTop: -230
    },
    userNameStyle: {
      display: "none"
    }
  };

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
        Cookie("SET", { ...returnLogs });
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
      userLabel.setAttribute("required", "required");
      alert(
        "I see you want to Register,\n\n You can use a 'FAKE' Email or 'Username'. \n\nI will not collect any information that you provide beyond the use on this application. \n\n Cheers!"
      );

      // formgroup
      this.setState({
        avatar: {
          opacity: 1,
          marginTop: 0
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
          marginTop: -230
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
        this.setState({
          systemAlertMSG: error.message
        });
        return false;
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
        this.setState({
          systemAlertMSG: error.message
        });

        return false;
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
      this.setState({
        systemAlertMSG: warnings
      });

      return false;
    } else {
      return true;
    }
  }

  // Broadcast this function to other files
  systemWarning = data => {
    this.setState({
      systemAlertMSG: data
    });
  };

  render() {
    return (
      <section className="LoginSection">
        <SystemAlert systemAlertMSG={this.state.systemAlertMSG} />

        <div className="content container">
          <h3>Welcome to Chatome</h3>

          <form
            onSubmit={event => this.SubmitForm(event)}
            className="container d-flex flex-column LoginForm"
          >
            <div className="avatar" style={this.state.avatar}>
              <ProfilePic
                imgStyle={this.state.avatar}
                systemWarning={this.systemWarning}
              />
            </div>

            <div className="form-group">
              <input
                className="styled-checkbox"
                id="check1"
                type="checkbox"
                onChange={this.RegisterBox}
              />
              <label htmlFor="check1"> I'm new to this!!!</label>
            </div>

            <div
              className="form-group userName"
              style={this.state.userNameStyle}
            >
              <label>*User Name</label>
              <input type="text" placeholder="e.g: Smaff56" id="userLabel" />
            </div>

            <div className="form-group">
              <label>*Email</label>
              <input
                type="email"
                placeholder="e.g: example@gmail.com"
                id="email"
                autoComplete="on"
                required
              />
            </div>

            <div className="form-group">
              <label>*Password </label>
              <input type="password" id="password" autoComplete="on" required />
            </div>

            <input type="submit" id="Submit" />
          </form>
        </div>
      </section>
    );
  }
}

export default LoginPage;
