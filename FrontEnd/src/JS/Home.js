import React, { Component } from "react";
import "../CSS/UserProfile.css";
import "../CSS/Stories.css";

import socket from "./Socket";
// import { connect } from "react-redux";
import MessagingBoard from "./MessageHandler/MessageBoard";
import LookUp from "./ProfileHandler/LookUp";
import Chats from "./ProfileHandler/Chats";
import Profile from "./ProfileHandler/Profile";
import OnlinePeople from "./ProfileHandler/People";
import Cookie from "./Cookies";

export class Home extends Component {
  state = {
    myData: {},
    people: [],
    friends: null,
    stories: null,
    activeChatID: null,
    lookupType: "",
    toggleType: "Messages",
    ProfileStyle: { color: "#8486a2" },
    StoriesStyle: { color: "#8486a2" },
    MainPageStyle: { color: "white" },
    inputToggle: { display: "block" },
    onlineToggle: { display: "none" },
    messageStyle: { display: "block" },
    peopleStyle: { display: "none" },
    settingStyle: { display: "none" },
    messagingBoardStyle: "100%"
  };


  componentDidUpdate(){
    console.log("Updateded------------------->>>");
  }
  componentWillMount() {
    let keys = ["uuID", "checkInType"],
      cookieData = Cookie("GET", keys);

    if (cookieData[1] === "Register") {
      keys = [
        "uuID",
        "status",
        "checkInType",
        "messageKey",
        "phoneUpdate",
        "accountCreatedDATE",
        "emailUpdate",
        "pictureUpdate",
        "userName"
      ];
      cookieData = Cookie("GET", keys);
    }

    let myDetails = Object.assign(
      ...keys.map((k, i) => ({ [k]: cookieData[i] }))
    );

    // Prevent user to see the main interface unless signed in
    if (!myDetails.checkInType) {
      this.props.history.push("/");
    } else {
      // Triggers get profile data for all users
      this.getUsersProfileDATA(myDetails);
    }

    // Triggers for other users if you go offline
    socket.on("UserOffline", ID => {
      console.log(ID);
      // var people = this.state.people;

      // if (people) {
      //   people[ID].status = "Offline";
      //   this.setState({
      //     people: people
      //   });
      // }
    });
  }

  //----// Gets everyones profile data e.g name,pic, messages, etc...
  getUsersProfileDATA = myDetails => {
    let uuID = myDetails.uuID;
    socket.emit("getUsersProfileDATA", myDetails, uuID);

    socket.on("returnUsersProfileDATA", (res, action) => {
      if (action === "None") {
        this.setState({
          ...this.state,
          people: res.people,
          myData: {
            ...res.people[res.myDataID],
            uuID: uuID,
            friends: res.friends
          }
        });
      } else if (action === "Broadcast") {
        let updatedData = this.state.people;
        updatedData[res.ID] = res;

        this.setState({
          people: updatedData
        });
      }
    });
  };

  //----// Handling Page toggle from "MessagingBoard","Friends" and "Inbox"
  togglePage = (PageType, activeChatID) => {
    PageType = PageType === "Previous" ? this.state.toggleType : PageType;

    switch (PageType) {
      // Toggles to MessagingBoard
      case "MessagingBoard":
        this.setState({
          toggleType: this.state.toggleType,
          activeChatID: activeChatID,
          messagingBoardStyle: 0
        });
        break;

      case "Messages":
        this.setState({
          toggleType: PageType,
          ProfileStyle: { color: "#8486a2" },
          StoriesStyle: { color: "#8486a2" },
          MainPageStyle: { color: "white" },
          inputToggle: { display: "block" },
          onlineToggle: { display: "none" },
          messageStyle: { display: "block" },
          peopleStyle: { display: "none" },
          settingStyle: { display: "none" },
          messagingBoardStyle: "100%"
        });
        break;

      case "People":
        this.setState({
          toggleType: PageType,
          ProfileStyle: { color: "#8486a2" },
          StoriesStyle: { color: "white" },
          MainPageStyle: { color: "#8486a2" },
          inputToggle: { display: "block" },
          onlineToggle: { display: "flex" },
          messageStyle: { display: "none" },
          peopleStyle: { display: "block" },
          settingStyle: { display: "none" },
          messagingBoardStyle: "100%"
        });
        break;

      case "Profile":
        this.setState({
          toggleType: PageType,
          ProfileStyle: { color: "white" },
          StoriesStyle: { color: "#8486a2" },
          MainPageStyle: { color: "#8486a2" },
          inputToggle: { display: "none" },
          onlineToggle: { display: "none" },
          messageStyle: { display: "none" },
          peopleStyle: { display: "none" },
          settingStyle: { display: "block" }
        });
        break;

      default:
        return false;
    }
  };

  handleSearch = type => {
    if (type === "focus") {
      document.querySelector("#CancelSearch").classList.remove("iconToggle");
      document
        .querySelector(".headerCont")
        .classList.add("iconToggle", "iconToggleUp");
      document.querySelector(".LookUp").classList.add("pushUp");
    } else if (type === "Cancel") {
      document
        .querySelector(".headerCont")
        .classList.remove("iconToggle", "iconToggleUp");
      document.querySelector("#CancelSearch").classList.add("iconToggle");
      document.querySelector(".LookUp").classList.remove("pushUp");
    } else if (
      type === "Camera" ||
      type === "PostComment" ||
      type === "makePost" ||
      type === "showPost"
    ) {
      document.querySelector(".LookUp").classList.add("pushFullUp");
    } else {
      document.querySelector(".LookUp").classList.remove("pushFullUp");
    }

    this.setState({
      lookupType: type
    });
  };

  render() {
    // MAIN RENDERER
    return (
      <section className="UserInterface">
        <div className="Profile">
          <div className="scollArea">
            <div className="Header">
              <div className="headerCont">
                <div className="header1">
                  <span id="LogoDescription">{this.state.toggleType}</span>
                </div>
                <div className="header2">
                  <i
                    className="fas fa-camera-retro"
                    onClick={() => this.handleSearch("Camera")}
                  />
                  <i
                    className="fas fa-feather-alt"
                    onClick={() => this.handleSearch("PostComment")}
                  />
                </div>
              </div>

              <div className="OnlineCont">
                <div className="SearchBar">
                  <input
                    onFocus={() => this.handleSearch("focus")}
                    onInput={() => this.handleSearch("Input")}
                    type="search"
                    placeholder="Search by name"
                    style={this.state.inputToggle}
                  />
                  <span
                    onClick={() => this.handleSearch("Cancel")}
                    id="CancelSearch"
                    className="iconToggle"
                  >
                    Cancel
                  </span>
                </div>

                <div className="Stories" style={this.state.onlineToggle}>
                  <div
                    className="DailySnap"
                    onClick={() => this.handleSearch("makePost")}
                  >
                    <i className="fas fa-plus" />
                    <label>Your Story</label>
                  </div>

                  <div
                    className="DailySnap"
                    onClick={() => this.handleSearch("showPost")}
                  >
                    <img src="##" alt="name" />
                    <label>---</label>
                  </div>

                  <div className="DailySnap">
                    <img src="##" alt="name" />
                    <label>---</label>
                  </div>
                  <div className="DailySnap">
                    <img src="##" alt="name" />
                    <label>---</label>
                  </div>
                  <div className="DailySnap">
                    <img src="##" alt="name" />
                    <label>---</label>
                  </div>
                  <div className="DailySnap">
                    <img src="##" alt="name" />
                    <label>---</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Display People that have ever created an account */}
            <div className="inboxSection" style={this.state.messageStyle}>
              <Chats
                togglePage={this.togglePage}
                people={this.state.people}
                myDataID={this.state.myData.ID}
                // latestChats={this.props.latestChats}
              />
            </div>

            {/* Displays Stories for everyone*/}
            <div className="inboxSection" style={this.state.peopleStyle}>
              <OnlinePeople togglePage={this.togglePage} />
            </div>

            {/* Shows your profile */}
            <div className="YourProfileInfor" style={this.state.settingStyle}>
              <div className="myDetails">
                <img src={this.state.myData.picture} id="userPicture" alt="IMG" />
                <span className="editImg">
                  <i className="fas fa-user-edit" />
                </span>
                <span className="userName">{this.state.myData.userName}</span>
              </div>

              <div className="MoreDetail">
                <Profile />
              </div>
            </div>
          </div>
        </div>

        <div className="navFooter">
          <i
            className="fas fa-comment"
            id="Messages"
            style={this.state.MainPageStyle}
            onClick={e => this.togglePage("Messages", e)}
          />

          <i
            className="fas fa-user-friends"
            id="Stories"
            style={this.state.StoriesStyle}
            onClick={e => this.togglePage("People", e)}
          />

          <i
            className="fas fa-cog"
            id="Profile"
            style={this.state.ProfileStyle}
            onClick={e => this.togglePage("Profile", e)}
          />
        </div>

        {/* --------------- Massaging Section --------------- */}
        <MessagingBoard
          MSGstyle={this.state.messagingBoardStyle}
          togglePage={this.togglePage}
          myData={this.state.myData}
          people = {this.state.people}
          activeChatID={this.state.activeChatID}
        />
        <LookUp lookupType={this.state.lookupType} />
      </section>
    );
  }
}

export default Home;
