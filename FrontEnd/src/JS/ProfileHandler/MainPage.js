import React, { Component } from "react";
import "../../CSS/UserProfile.css";
import "../../CSS/Friends.css";
import Fire from "../../FIREBASE/FBConfig";
import socket from "../Socket";
import { connect } from "react-redux";
import MessagingBoard from "../MessageHandler/MessagingBoard";
import People from "./People";
import Friends from "./Friends";
import YourProfileInfor from "./YourProfileInfor";
import OnlinePeople from "./OnlinePeople";
import Cookie from "../Cookie";
import loaderGIF from "../../IMG/Loader.gif";
import LZString from "lz-string";

class MainPage extends Component {
  state = {
    myDataID: null,
    people: null,
    friends: null,
    activeChatID: null,
    toggleType: "Default"
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

    // Triggers get profile data for all users

    this.getUsersProfileDATA(myDetails);

    // Triggers When user goes offline
    socket.on("UserOffline", ID => {
      var people = this.state.people;

      if (people) {
        people[ID].status = "Offline";
        this.setState({
          people: people
        });
      }
    });
  }

  //----// Getting all users profile data
  getUsersProfileDATA = myDetails => {
    let uuID = myDetails.uuID;
    socket.emit("getUsersProfileDATA", myDetails, uuID);

    socket.on("returnUsersProfileDATA", (res, action) => {
      if (action === "None") {
        this.setState({
          ...this.state,
          ...res
        });
      } else if (action === "Broadcast") {
        console.log(res);
        let updatedData = this.state.people;
        updatedData[res.ID] = res;

        this.setState({
          people: [...updatedData]
        });
      }
    });
  };

  //----// Handling Page toggle from "MessagingBoard","Friends" and "Inbox"
  togglePage = (PageType, activeChatID) => {
    let event = activeChatID;
    console.log(PageType);

    switch (PageType) {
      // Toggles to MessagingBoard
      case "MessagingBoard":
        this.setState({
          toggleType: "MessagingBoard",
          activeChatID: activeChatID
        });
        break;

      // Toggles to inbox
      case "MainPage":
        this.setState({
          toggleType: "MainPage"
        });
        break;

      case "Inbox":
          this.setState({
            toggleType: "Inbox"
          });
        break;
      case "Friends":
          this.setState({
            toggleType: "Friends"
          });
        break;

      case "Profile":
          this.setState({
            toggleType: "MyProfile"
          });
        break;
    }
  };

  render() {
    if (!this.state.people) {
      return (
        <div id="Loader">
          <img src={loaderGIF} />
          <small>Loading...</small>
        </div>
      );
    } else {
      var myID = this.state.myDataID,
        picture = this.state.people[myID].picture,
        InboxElements = () => {
          return <></>;
        },
        FriendsDashBoard = () => {
          return <></>;
        },
        MyProfile = () => {
          return <></>;
        },
        Footer = () => {
          return (
            <>
              <i
                className="fas fa-comment-dots"
                id="inbox"
                onClick={e => this.togglePage("Inbox", e)}
              />

              <i
                className="fas fa-address-book"
                id="friends"
                onClick={e => this.togglePage("Friends", e)}
              />

              <i
                className="fas fa-user"
                id="profile"
                onClick={e => this.togglePage("Profile", e)}
              />
            </>
          );
        };

      switch (this.state.toggleType) {
        case "MessagingBoard":
          Footer = () => {
            return <></>;
          };
          break;

        case "Friends":
            FriendsDashBoard = () => {
            return <Friends />;
          };
          break;

        case "MyProfile":
          MyProfile = () => {
            return (
              <>
                <div className="myDetails">
                  <img src={picture} id="userPicture" alt="IMG" />
                  <span className="editImg">
                    <i className="fas fa-user-edit" />
                  </span>
                  <span className="userName">---</span>
                </div>

                <div className="MoreDetail">{/* <YourProfileInfor /> */}</div>
              </>
            );
          };
          break;

        default:
          InboxElements = () => {
            return (
              <>
                <OnlinePeople
                  togglePage={this.togglePage}
                  people={this.state.people}
                  myDataID={this.state.myDataID}
                />
                <People
                  togglePage={this.togglePage}
                  people={this.state.people}
                  myDataID={this.state.myDataID}
                  latestChats={this.props.latestChats}
                />
              </>
            );
          };
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
                <input type="search" placeholder="search by name" onChange={0} />
                <InboxElements />
              </div>

              {/* Displays Friends or people you have communicated to */}
              <div className="Friends" style={this.state.friendsDashBoard} />

              <FriendsDashBoard />

              {/* Shows your profile */}
              <div className="YourProfileInfor">
                <MyProfile />
              </div>
            </div>
          </div>

          <div className="navFooter">
            <Footer />
          </div>

          {/* --------------- Massaging Section --------------- */}
          <MessagingBoard
            inboxState={{ ...this.state }}
            style={this.state.inboxToMessage}
            togglePage={this.togglePage}
            activeChatID={this.state.activeChatID}
          />
        </section>
      );
    }
  }
}

// Dispatch infor or get data from Redux
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
