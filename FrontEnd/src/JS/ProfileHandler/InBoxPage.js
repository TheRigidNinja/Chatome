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
    myData: {
      name: "",
      id: 1,
      picture: "",
      status: "",
      details: {}
    },
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
    // dataRetrieval: { profile: null, myData: null, dbCreate: null }
    dataRetrieval: {
      profile: [
        {
          ID: 1,
          uuID: null,
          picture: {},
          userName: "user56",
          status: "Online",
          checkInType: "Register",
          messageKey: "186.20fc1005235",
          phoneUpdate: "1560039688000",
          accountCreatedDATE: "1560039688000",
          emailUpdate: "1560039688000",
          pictureUpdate: "1560039688000"
        },
        {
          ID: 2,
          uuID: null,
          picture: {},
          userName: "Rigid",
          status: "Online",
          checkInType: "Register",
          messageKey: "a4.63928ecf1638",
          phoneUpdate: "1560039698000",
          accountCreatedDATE: "1560039698000",
          emailUpdate: "1560039698000",
          pictureUpdate: "1560039698000"
        },
        {
          ID: 3,
          uuID: null,
          picture: {},
          userName: "Mity50",
          status: "Online",
          checkInType: "Register",
          messageKey: "1ec.f10a3f1bcce",
          phoneUpdate: "1560039710000",
          accountCreatedDATE: "1560039710000",
          emailUpdate: "1560039710000",
          pictureUpdate: "1560039710000"
        }
      ],
      myData: [{ ID: 1 }],
      dbCreate: null
    }
  };

  componentWillMount() {
    let Userdetails = this.props.yourDetails;

    console.log(Userdetails);

    if (Object.keys(Userdetails).length != 0) {
      Socket().emit("GetAllProfileData", Userdetails, Userdetails.uuID);
    }

    // Sets All user data to local state

    Socket().on("AllProfileData", (res, key) => {
      var myIdData = res.myData[3][0].ID - 1;

      if (key === Userdetails.uuID) {
        this.setState({
          dataRetrieval: {
            profile: res.profile[3],
            myData: res.myData[3],
            dbCreate: res.dbCreate
          },
          myData: {
            ...this.state.myData,
            name: res.profile[3][myIdData].userName,
            id: myIdData+1,
            picture: res.profile[3][myIdData].picture,
            status: res.profile[3][myIdData].status
          }
        });
      }
      // var data = JSON.stringify(this.state.dataRetrieval);
      // console.log(this.state.dataRetrieval, data);
    });
  }

  TogglePage = (PageType, recipientArray) => {
    switch (PageType) {
      // case "Inbox":
      //   this.setState({
      //     friendsDashBoard: {
      //       height: 0,
      //       top: "600px"
      //       // opacity: 0,
      //       // display: "block"
      //     }
      //   });
      //   break;

      // case "Friends":
      //   this.setState({
      //     friendsDashBoard: {
      //       height: "70%",
      //       top: 166,
      //       opacity: 1,
      //       display: "block"
      //     }
      //   });
      //   break;

      // case "Profile":
      //   break;

      case "Messaging":
        let selected = this.state.dataRetrieval.profile,
        myMessageKey = this.state.dataRetrieval.myData[0].ID;

        console.log(selected);

        this.setState({
          inboxToMessage: {
            display: "block"
          },
          recipientData: {
            picture: selected[recipientArray].picture,
            userName: selected[recipientArray].userName,
            senderMSGKey: selected[recipientArray].messageKey,
            myMessageKey: selected[myMessageKey - 1].messageKey,
            myUserName: selected[myMessageKey - 1].userName
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
    var myPic;
    try {
      myPic = this.state.dataRetrieval.myData[0].picture;
    } catch (error) {
      return <>If you see me just know the page would have crashed!</>;
    }

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
              <OnlinePeople
                TogglePage={this.TogglePage}
                peopleData={this.state.dataRetrieval.profile}
                myData={this.state.myData.id}
              />
              <InboxPeople
                TogglePage={this.TogglePage}
                peopleData={this.state.dataRetrieval.profile}
                myData={this.state.myData.id}
                LatestChats={this.props.LatestChats}
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
          recipientData={this.state.recipientData}
        />
      </section>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    messageKey: stutas => {
      dispatch({ type: "KEY", data: stutas });
    }
  };
};

const mapStateToProps = state => {
  return {
    yourDetails: { ...state.ProfileDB },
    LatestChats: state.MessagingDB.LatestChats
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfilePage);
