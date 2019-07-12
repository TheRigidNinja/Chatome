import React, { Component } from "react";
import "../../CSS/UserProfile.css";
import "../../CSS/Stories.css";

// import Fire from "../../FIREBASE/FBConfig";
// import socket from "../Socket";
import { connect } from "react-redux";
// import MessagingBoard from "../MessageHandler/MessagingBoard";
// import People from "./People";
// import Stories from "./Stories";
// import YourProfileInfor from "./YourProfileInfor";
// // import OnlinePeople from "./OnlinePeople";
import Cookie from "../Cookie";
// import loaderGIF from "../../IMG/Loader.gif";

class MainPage extends Component {
  state = {
    myDataID: null,
    people: null,
    stories: null,
    activeChatID: null,
    toggleType: "Messages",
    ProfileStyle: { color: "#8486a2" },
    StoriesStyle: { color: "#8486a2" },
    MainPageStyle: { color: "white" }
  };

  componentWillMount() {
    // Prevent user to see the main interface unless signed in
    let myDetails = this.props.myDetails;

    if (Object.keys(myDetails).length !== 0) {
      Cookie("SET", { ...myDetails });
    } else {
      var cookieData = Cookie("GET", ["uuID", "checkInType"]);

      if (cookieData[0] !== null || cookieData[1] !== null) {
        myDetails = {
          uuID: cookieData[0],
          checkInType: "Login"
        };
      } else {
        this.props.history.push("/");
      }
    }
  }

  render() {
    return <></>;
  }
}

const mapDispatchToProps = dispatch => {
  return {
    myProfileDetails: data => {
      dispatch({ type: "UPDATE", data: data });
    }
  };
};

const mapStateToProps = state => {
  return {
    myDetails: { ...state.ProfileDB },
    latestChats: state.ProfileDB.latestChats
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainPage);
