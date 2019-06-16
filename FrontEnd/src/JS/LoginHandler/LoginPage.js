import React, { Component } from "react";
import "../../CSS/Authentifacation.css";
import Fire from "../../FIREBASE/FBConfig";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import ProfilePic from "./ProfilePic";

class LoginPage extends Component {
  state = {
    formgroup: {
      margin: "15px 0px"
    },
    loginForm: {
      padding: "60px 20px"
    },
    avatar: {
      opacity: 0,
      height: 0,
    },
    userNameStyle: {
      opacity: 0,
      height: 0,
      margin: "0px 0px",
      display: "none"
    },
    alert: { padding: 0 }
  };

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
    if (this.ValidateFormData(myLoginData)) {
      if (myLoginData.newCustomer === true) {
        returnLogs = await this.RegisterHandler(myLoginData);
      } else {
        returnLogs = await this.LoginHandler(myLoginData);
      }

      // Changes page IF user successfully Login or registers
      if (["Login", "Register"].includes(returnLogs.checkInType)) {
        this.props.myDetails(returnLogs); // Set to props
        this.props.history.push("/chat");
      }
    }
  }

  RegisterBox = () => {
    var dom = document.querySelectorAll(".userName, #userLabel"),
      userName = dom[0],
      userLabel = dom[1];

    if (userName.offsetHeight === 0) {
      userLabel.removeAttribute("required");

      this.setState({
        formgroup: {
          margin: "12px 0px"
        },
        loginForm: {
          padding: "20px 20px"
        },
        avatar: {
          opacity: 1,
          height: 200,
          // margin: "10px 0px 0px 50px"
        },
        userNameStyle: {
          opacity: 1,
          height: 70,
          margin: "10px 0px",
          display: "block"
        }
      });
    } else {
      userLabel.removeAttribute("required");

      this.setState({
        formgroup: {
          margin: "15px 0px"
        },
        loginForm: {
          padding: "60px 20px"
        },
        avatar: {
          opacity: 0,
          height: 0
        },
        userNameStyle: {
          opacity: 0,
          height: 0,
          margin: "0px 0px",
          display: "none"
        }
      });
    }
  };

  //-----------------//   Registration Section
  RegisterHandler(myLoginData) {
    return Fire.auth()
      .createUserWithEmailAndPassword(myLoginData.email, myLoginData.password)
      .then(userInfo => {
        delete myLoginData.email;
        delete myLoginData.password;
        delete myLoginData.newCustomer;

        const timeStamp = Date.parse(new Date()),
          myFormInfo = {
            ID: null,
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

  //-----------------//   Login Section
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

  // Checks if everything is correct in the form before submiting
  ValidateFormData(formData) {
    var warnings = "";

    if (formData.password.replace(" ", "").length < 6) {
      warnings += "Password must be > 6 char|";
    }

    if (formData.newCustomer === true && formData.userName.length < 4) {
      warnings += "User Name must be > 4 char|";
    }

    // Showing warnings to the user
    if (warnings !== "") {
      return this.WarningHandler(warnings);
    } else {
      return true;
    }
  }

  //-----// Alert box handler
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
            style={this.state.loginForm}
          >
            <div className="avatar" style={this.state.avatar}>
              <ProfilePic imgStyle={this.state.avatar} />
            </div>

            <div className="form-group" style={this.state.formgroup}>
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

            <div className="form-group" style={this.state.formgroup}>
              <label>*Email</label>
              <input
                type="email"
                placeholder="e.i: example@gmail.com"
                id="email"
                required
                defaultValue={"brian.shisanya2000@gmail.com"}
              />
            </div>

            <div className="form-group" style={this.state.formgroup}>
              <label>*Password </label>
              <input
                type="password"
                id="password"
                required
                defaultValue={123456}
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
