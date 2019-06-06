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

class ProfilePage extends Component {
  state = {
    inboxToMessage: {
      display: "none"
    },
    recipientData: {
        picture: "##",
        userName: "null"
    },
    friendsDashBoard: {
      height: 0,
      top: "100%",
      opacity: 0,
      display: "none"
    },
    dataRetrieval: { profile: null, myData: null, dbCreate: null }
  };

  async componentDidMount() {
    let Userdetails = this.props.yourDetails;

    if (Object.keys(Userdetails).length != 0) {
      Socket().emit("GetAllProfileData", Userdetails, Userdetails.uuID);
    }

    await Socket().on("AllProfileData", res => {
      // console.log(this.state);
      this.setState({
        dataRetrieval:res.profile[2],
        // res.myData,
        // res.dbCreate
      })
    });

    console.log("Done!",this.state);
  }

  TogglePage = (PageType,recipientArray) => {

    switch (PageType) {
      case "Inbox":
        this.setState({
          friendsDashBoard: {
            height: 0,
            top: "600px"
            // opacity: 0,
            // display: "block"
          }
        });
        break;

      case "Friends":
        this.setState({
          friendsDashBoard: {
            height: "70%",
            top: 166,
            opacity: 1,
            display: "block"
          }
        });
        break;

      case "Profile":
        break;

      case "Messaging":
          let selected = this.state.dataRetrieval.profile[recipientArray-1];

        this.setState({
          inboxToMessage: {
            display: "block"
          },
          recipientData:{
            picture: selected.picture,
            userName: selected.userName
          }
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

    // console.log(PageType);
  };

  render() {
    
    var myPic = this.state.dataRetrieval.myData[0].picture;

    return (
      <section className="UserInterface">
        <div className="Profile">
          <div className="scollArea">
            <div className="Header">
              <div className="header1">
                <img src={myPic} alt="User" id="userPicture" />
                <span id="LogoDescription">Chats</span>
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
              <OnlinePeople />
              <InboxPeople
                TogglePage={this.TogglePage}
                peopleData={this.state.dataRetrieval.profile}
              />
            </div>

            {/* Displays Friends or people you have communicated to */}
            <div className="FriendsSection" style={this.state.friendsDashBoard}>
              <FriendsSection />
            </div>

            {/* Shows your profile */}
            <div className="ProfileManager">
              <div className="UserDetails">
                <img src="##" id="userPicture" alt="IMG" />
                <span className="editImg">
                  <i className="fas fa-user-edit" />
                </span>
                <span className="userName">---</span>
              </div>

              <div className="MoreDetail">
                <ProfileManager />
              </div>
            </div>
          </div>
        </div>

        <div className="navFooter">
          <a href="##inbox" id="inbox" onClick={() => this.TogglePage("Inbox")}>
            <i className="fas fa-comment-dots" />
          </a>

          <a
            href="##friends"
            id="friends"
            onClick={() => this.TogglePage("Friends")}
          >
            <i className="fas fa-address-book" />
          </a>

          <a
            href="##profile"
            id="profile"
            onClick={() => this.TogglePage("Profile")}
          >
            <i className="fas fa-user" />
          </a>
        </div>

        {/* --------------- Massaging Section --------------- */}
        <Messaging
          style={this.state.inboxToMessage}
          TogglePage={this.TogglePage}
          recipientData = {this.state.recipientData}
        />
      </section>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return 0;
};

const mapStateToProps = state => {
  return {
    yourDetails: { ...state.ProfileDB }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfilePage);
