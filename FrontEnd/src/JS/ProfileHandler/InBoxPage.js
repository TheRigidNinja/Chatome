import React, { Component } from "react";
import "../../CSS/UserProfile.css";
import "../../CSS/Friends.css";
import Fire from "../../FIREBASE/FBConfig";
import { Socket } from "../Socket";
import { connect } from "react-redux";
import Messaging from "../MessageHandler/MessagingArea";
import InboxPeople from "./InboxPeople";
import FriendsSection from "./FriendsSection";
import ProfileManager from "./ProfileManager";
import OnlinePeople from "./OnlinePeople";
import Cookie from "../Cookie";
import loaderGIF from "../../IMG/Loader.gif";

class ProfilePage extends Component {
  state = {
    myDataID: null,
    people: [
      {
        picture: [],
        userName: [],
        status: [],
        messageKey: [],
        details: [],
        id: []
      }
    ],
    friends: {
      id: []
    },
    activeChatID: null,
    friendsDashBoard: {
      height: 0,
      top: "100%",
      opacity: 0,
      display: "none"
    },
    inboxToMessage: {
      display: "none"
    }
  };

  componentWillMount() {
    let myDetails = this.props.myDetails;

    if (Object.keys(myDetails).length !== 0) {
      Cookie("SET", { ...myDetails });
    } else {
      var cookieData = Cookie("GET", ["uuID", "checkInType"]);
      myDetails = {
        uuID: cookieData[0],
        checkInType: cookieData[1]
      };
    }

    Socket().emit("GetAllProfileData", myDetails, myDetails.uuID);

    // Sets All user data to local state
    Socket().on("AllProfileData", (res, key) => {
      try {
        // Only show frieds in the state if have the key
        var friendsDATA = "",
          myID = "";
        if (key === myDetails.uuID) {
          friendsDATA = res.friends[3];
          myID = res.myData[3][0].ID - 1;
        }

        this.setState({
          ...this.state,
          myDataID: myID === "" ? this.state.myDataID : myID,
          people: res.profile[3],
          friends: friendsDATA === "" ? this.state.friends : friendsDATA
        });
      } catch (error) {
        console.log("Failed to get Info from server ========>>>", error);
      }
      // var data = JSON.stringify(res);
    });
    // alert("--")
    //     // Trigger when window closes
    //     this.addEventListener("beforeunload", ()=> {

    //       Socket().emit("UserOffline", "myDetails.uuID");

    //     });

    window.onbeforeunload = function() {
      Socket().emit("UserOffline", "myDetails.uuID");
    }

  }


  togglePage = (PageType, activeChatID) => {
    switch (PageType) {
      // case "Inbox":
      //   break;

      // case "Friends":
      //   break;

      // case "Profile":
      //   break;

      case "Messaging":
        this.setState({
          inboxToMessage: {
            display: "block"
          },
          activeChatID: activeChatID
        });
        break;

      case "BackToInbox":
        this.setState({
          inboxToMessage: {
            display: "none"
          }
        });
        break;
    }
  };

  render() {
    var myID = this.state.myDataID,
      picture = this.state.people[myID];

    if (myID === null) {
      return (
        <div id="Loader">
          <img src={loaderGIF} />
          <small>Loading...</small>
        </div>
      );
    }

    return (
      <section className="UserInterface">
        <div className="Profile">
          <div className="scollArea">
            <div className="Header">
              <div className="header1">
                <img src={picture} alt="User" id="userPicture" />
                <span id="LogoDescription">{"Chats"}</span>
              </div>
              <div className="header2">
                <a href="##camera">
                  <i className="fas fa-camera" />
                </a>
                <a href="##post">
                  <i className="fas fa-edit" />
                </a>
              </div>
            </div>

            {/* Display People that have ever created an account */}
            <div className="inboxSection">
              <input type="search" placeholder="search" onChange={0} />
              <OnlinePeople
                togglePage={this.togglePage}
                people={this.state.people}
                myDataID={this.state.myDataID}
              />
              <InboxPeople
                togglePage={this.togglePage}
                people={this.state.people}
                myDataID={this.state.myDataID}
                latestChats={this.props.myDetails.LatestChats}
              />
            </div>

            {/* Displays Friends or people you have communicated to */}
            <div className="FriendsSection" style={this.state.friendsDashBoard}>
              {/* <FriendsSection /> */}
            </div>

            {/* Shows your profile */}
            <div className="ProfileManager">
              <div className="myDetails">
                <img src="##" id="userPicture" alt="IMG" />
                <span className="editImg">
                  <i className="fas fa-user-edit" />
                </span>
                <span className="userName">---</span>
              </div>

              <div className="MoreDetail">{/* <ProfileManager /> */}</div>
            </div>
          </div>
        </div>

        <div className="navFooter">
          <a href="##inbox" id="inbox" onClick={() => this.togglePage("Inbox")}>
            <i className="fas fa-comment-dots" />
          </a>

          <a
            href="##friends"
            id="friends"
            onClick={() => this.togglePage("Friends")}
          >
            <i className="fas fa-address-book" />
          </a>

          <a
            href="##profile"
            id="profile"
            onClick={() => this.togglePage("Profile")}
          >
            <i className="fas fa-user" />
          </a>
        </div>

        {/* --------------- Massaging Section --------------- */}
        <Messaging
          inboxState={{ ...this.state }}
          style={this.state.inboxToMessage}
          togglePage={this.togglePage}
          activeChatID={this.state.activeChatID}
        />
      </section>
    );
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
    LatestChats: state.MessagingDB.LatestChats
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfilePage);
