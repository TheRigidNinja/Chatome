import React, { Component } from "react";
import "../../CSS/UserProfile.css";
import "../../CSS/Stories.css";
// import Fire from "../../FIREBASE/FBConfig";
// import socket from "../Socket";
// import { connect } from "react-redux";
// import MessagingBoard from "../MessageHandler/MessagingBoard";
// import People from "./People";
// import Stories from "./Stories";
// import YourProfileInfor from "./YourProfileInfor";
// // import OnlinePeople from "./OnlinePeople";
// import Cookie from "../Cookie";
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
    // let event = activeChatID;

    switch (PageType) {
      // Toggles to MessagingBoard
      case "MessagingBoard":
        this.setState({
          toggleType: PageType,
          activeChatID: activeChatID
        });
        break;

      // Toggles to inbox
      case "MainPage":
        this.setState({
          toggleType: PageType,
          ProfileStyle: { color: "#8486a2" },
          StoriesStyle: { color: "#8486a2" },
          MainPageStyle: { color: "white" }
        });
        break;

      case "Messages":
        this.setState({
          toggleType: PageType,
          ProfileStyle: { color: "#8486a2" },
          StoriesStyle: { color: "#8486a2" },
          MainPageStyle: { color: "white" }
        });
        break;

      case "Stories":
        this.setState({
          toggleType: PageType,
          ProfileStyle: { color: "#8486a2" },
          StoriesStyle: { color: "white" },
          MainPageStyle: { color: "#8486a2" }
        });
        break;

      case "Profile":
        this.setState({
          toggleType: PageType,
          ProfileStyle: { color: "white" },
          StoriesStyle: { color: "#8486a2" },
          MainPageStyle: { color: "#8486a2" }
        });
        break;

      default:
        return false
    }
  };

  render() {
    if (!this.state.people) {
      // Renders this screen if loading
      return (
        <div id="Loader">
          <img src={loaderGIF} alt="Loading"/>
          <small>Loading...</small>
        </div>
      );
    } else {
      // Renders the following depending on page toggle
      var myID = this.state.myDataID,
        picture = this.state.people[myID].picture,
        userName = this.state.people[myID].userName,
        InboxElements = () => {
          return <></>;
        },
        ExploreStories = () => {
          return <></>;
        },
        MyProfile = () => {
          return <></>;
        },
        Footer = () => {
          return (
            <>
              <div>
                <i
                  className="fas fa-comment"
                  id="Messages"
                  style={this.state.MainPageStyle}
                  onClick={e => this.togglePage("Messages", e)}
                />
                {/* <div className="Notifications">12232</div> */}
              </div>

              <i
                className="fas fa-compass"
                id="Stories"
                style={this.state.StoriesStyle}
                onClick={e => this.togglePage("Stories", e)}
              />

              <i
                className="fas fa-user-cog"
                id="Profile"
                style={this.state.ProfileStyle}
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

        case "Stories":
          ExploreStories = () => {
            return (
              <div className="Stories" style={this.state.stories}>
                <Stories />
              </div>
            );
          };
          break;

        case "Profile":
          MyProfile = () => {
            return (
              <div className="YourProfileInfor">
                <div className="myDetails">
                  <img src={picture} id="userPicture" alt="IMG" />
                  <span className="editImg">
                    <i className="fas fa-user-edit" />
                  </span>
                  <span className="userName">{userName}</span>
                </div>

                <div className="MoreDetail">
                  <YourProfileInfor />
                </div>
              </div>
            );
          };
          break;

        default:
          InboxElements = () => {
            return (
              <>
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

      // Renders The following search bar and online people depending on page type
      const HeaderStatus = () => {
        var PeopleOnline = () => {
            return <></>;
          },
          SearchBar = () => {
            return <></>;
          };

        if (this.state.toggleType === "Messages") {
          PeopleOnline = () => {
            return (
              <></>
              // <OnlinePeople
              //   togglePage={this.togglePage}
              //   people={this.state.people}
              //   myDataID={this.state.myDataID}
              // />
            );
          };
        }

        if (["Messages", "Stories"].includes(this.state.toggleType)) {
          SearchBar = () => {
            return <input type="search" placeholder="Search by name" />;
          };
        }

        return (
          <>
            <PeopleOnline />
            <SearchBar />
          </>
        );
      };

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
                    <i className="fas fa-camera-retro" />
                    <i className="fas fa-feather-alt" />
                  </div>
                </div>

                <div className="OnlineCont">
                  <HeaderStatus />
                </div>
              </div>

              {/* Display People that have ever created an account */}
              <div className="inboxSection">
                <InboxElements />
              </div>

              {/* Displays Stories for everyone*/}
              <ExploreStories />

              {/* Shows your profile */}
              <MyProfile />
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
