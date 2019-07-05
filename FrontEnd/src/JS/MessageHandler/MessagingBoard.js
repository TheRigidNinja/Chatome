import React, { Component } from "react";
import "../../CSS/Messaging.css";
import Texts from "./Texts";
import socket from "../Socket";
import { connect } from "react-redux";
import Cookie from "../Cookie";
// import LZString from "lz-string";
import PhoneCall from "./PhoneCall/PhoneCall";
import TextArea from "./TextingHandler";

class MessagingBoard extends Component {
  state = {
    chatRooms: {},
    myMSGRoom: {},
    textAreaStyle: {
      height: "35px"
    },
    textHeight: false,
    togglePhoneCall: false,
    phoneType: null,
    PhoneCallStyle: {
      "z-index": "-1"
    }
  };

  componentWillMount() {
    // Tries to get User MSG after Page loads from server
    this.initialGetMessageFromServer();
  }

  componentDidUpdate() {
    console.log("object");
    if (this.props.inboxState.toggleType === "MessagingBoard") {
      // Scrolls message Board
      this.messageScroll();
    }
  }

  // This is the process of getting Pre- Messages from Online DataBase
  initialGetMessageFromServer = () => {
    var uuID = Cookie("GET", ["uuID"])[0],
      friendsMSGKeys = {
        checkInType: "Friends",
        uuID: uuID,
        friends: this.props.inboxState.friends
      };

    // The Socket that triggers A server Function to get Messages
    socket.emit("GetMessages", friendsMSGKeys, uuID);

    // Waits for prov Messages after emitting
    socket.on("MSGChannel", (messages, key, action) => {
      this.setState(
        {
          chatRooms: {
            ...this.state.chatRooms,
            ...messages
          }
        },
        () => {
          // Get latest MSG
          this.handleLastChats("GetInitialMSG");
        }
      );
    });
  };

  // ----- // Scrolls Down Messages from the Message Dashboard
  messageScroll() {
    var chatScrollHght = document.querySelector(".msgDashboard");
    chatScrollHght.scrollTop = chatScrollHght.scrollHeight;
  }

  // ----- // Function that handles Sending Messages to the server
  sendMessageToServer = (myUserName, checkKey, key2) => {
    var recipient = this.props.inboxState,
      recipientName = {
        friend: recipient.people[recipient.activeChatID].userName,
        me: recipient.people[recipient.myDataID].userName
      },
      userMSGForm = {
        message: document.querySelector(".MSGBox").innerHTML,
        checkInType: "Register",
        messageKey: checkKey,
        name: myUserName,
        recipient: recipientName.friend,
        uuID: Cookie("GET", ["uuID"])[0],
        timeStamp: Date.parse(new Date())
      };

    // Makes sure MSG box is not empty
    if (
      userMSGForm.message.trim() !== "" &&
      userMSGForm.message.length <= 3000
    ) {
      // ----- // Sends Message to the server Here
      console.log("Sending");
      socket.emit("SendMessage", userMSGForm, userMSGForm.uuID, recipientName);

      delete userMSGForm.uuID;
      delete userMSGForm.messageKey;
      delete userMSGForm.checkInType;

      var localMSG = this.state.myMSGRoom[key2];
      localMSG = localMSG ? localMSG : [];

      this.setState(
        {
          myMSGRoom: {
            ...this.state.myMSGRoom,
            [key2]: [...localMSG, userMSGForm]
          }
        },
        () => {
          // Get latest MSG
          this.handleLastChats("GetLocalMSG");
        }
      );
    }
  };

  // ----- // Gets any messages from friends of people wanting to be friends
  getFriendMessage = myDetail => {
    socket.emit("UserDetails", myDetail);

    socket.on(myDetail.roomID, res => {
      let recipientData = res.messageKey;

      if (recipientData) {
        let myID = this.props.inboxState.myDataID,
          myMSGkey = this.props.inboxState.people[myID].messageKey,
          recipientKey = recipientData.replace(myMSGkey, ""),
          key1 = recipientKey + myMSGkey,
          key2 = myMSGkey + recipientKey,
          localMsg1 = this.state.myMSGRoom[key1],
          localMsg2 = this.state.myMSGRoom[key2],
          localMSGDATA = [],
          checkKey = "",
          globalMSGDATA = this.state.chatRooms[recipientData];
        globalMSGDATA = globalMSGDATA ? globalMSGDATA : [];

        // Checking for local MSG KEY
        if (localMsg1) {
          localMSGDATA = localMsg1;
          checkKey = key1;
        } else if (localMsg2) {
          localMSGDATA = localMsg2;
          checkKey = key2;
        }

        delete res.uuID;
        delete res.messageKey;
        delete res.checkInType;

        this.setState(
          {
            chatRooms: {
              ...this.state.chatRooms,
              [recipientData]: [...globalMSGDATA, ...localMSGDATA, res]
            },
            myMSGRoom: {
              ...this.state.myMSGRoom,
              [checkKey]: []
            }
          },
          () => {
            // Get latest MSG
            this.handleLastChats("GetFriendsMSG");
          }
        );
      }
    });
  };

  // ----- // Handles Getting latest Chat messages and push them to props for people section
  handleLastChats = ActionType => {
    var lastChats = {},
      inboxState = this.props.inboxState,
      myName = inboxState.people[inboxState.myDataID].userName,
      roomType = ["GetFriendsMSG", "GetInitialMSG"].includes(ActionType)
        ? "chatRooms"
        : "myMSGRoom";

    for (const msgKey of Object.keys(this.state[roomType])) {
      let msg = this.state[roomType][msgKey],
        lastMSG = msg[msg.length - 1];
      if (
        lastMSG &&
        (lastMSG.recipient === myName || lastMSG.name === myName)
      ) {
        let nameSort =
          lastMSG.recipient === myName ? lastMSG.name : lastMSG.recipient;
        lastChats[nameSort] = lastMSG;
      }
    }

    switch (ActionType) {
      case "GetInitialMSG":
        this.props.latestChats(lastChats);

        // Triggering friends function to send roomID to server so i can keep track who is who
        var myID = inboxState.myDataID,
          myDetail = {
            myName: inboxState.people[myID].userName,
            roomID: socket.id,
            id: myID,
            uuID: Cookie("GET", ["uuID"])[0]
          };

        this.getFriendMessage(myDetail);
        break;

      default:
        // Clear Text Area After setting to state
        if (document.querySelector(".MSGBox").innerHTML) {
          document.querySelector(".MSGBox").innerHTML = "";
        }

        this.props.latestChats({
          ...this.props.profileDetails.latestChats,
          ...lastChats
        });
    }
  };

  // ----- // Handles Video or Audio Call Actions
  HandlePhoneCall = type => {
    let phone = this.state.togglePhoneCall ? false : true;
    let zIndex = this.state.PhoneCallStyle["z-index"] === "-1" ? "3" : "-1";

    this.setState({
      togglePhoneCall: phone,
      phoneType: type,
      PhoneCallStyle: { "z-index": zIndex }
    });
  };

  render() {
    var inboxState = this.props.inboxState,
      togglePage = this.props.togglePage,
      textAreaStyle = this.state.textAreaStyle,
      activeChatID = inboxState.activeChatID,
      userName = "",
      picture = "",
      myID = inboxState.myDataID,
      messageData = "",
      myUserName = "",
      checkKey = "";

    if (activeChatID !== null) {
      userName = inboxState.people[activeChatID].userName;
      picture = inboxState.people[activeChatID].picture;
      var friendsMSGkey = inboxState.people[activeChatID].messageKey,
        myMSGkey = inboxState.people[myID].messageKey,
        key1 = friendsMSGkey + myMSGkey,
        key2 = myMSGkey + friendsMSGkey,
        checkKey = this.state.chatRooms[key1] ? key1 : key2,
        myUserName = inboxState.people[myID].userName;

      messageData = this.state.chatRooms[checkKey];

      // Puts "|" in the middle of the messagekey so we can search if that perticular key
      // exists in mySQL table
      if (!messageData) {
        let tempKey1 = checkKey.split(myMSGkey),
          tempKey2 =
            tempKey1[0] === ""
              ? myMSGkey + "|" + tempKey1[1]
              : tempKey1[1] + "|" + myMSGkey;
        checkKey = tempKey2;
        messageData = [];
      }

      // Marges messages from my local chat and the updated friend chat
      var myChats = this.state.myMSGRoom[key2];
      myChats = myChats ? myChats : [];
      messageData = [...messageData, ...myChats];
    }

    if (inboxState.toggleType === "MessagingBoard") {
      return (
        <>
          <div className="MessagingBoard">
            <div className="Header">
              <i
                className="fas fa-chevron-left"
                onClick={() => togglePage("Messages")}
              />
              <div className="MSGheader1">
                <div className="msgPic">
                  <img src={picture} alt="User" />
                  <span id="status" />
                </div>
                <div>
                  <span>{userName}</span>
                  <time>Now Active</time>
                </div>
              </div>

              <div className="header2">
                <i
                  className="fas fa-phone"
                  onClick={() => this.HandlePhoneCall("phone")}
                />
                <i
                  className="fas fa-video"
                  onClick={() => this.HandlePhoneCall("video")}
                />
              </div>
            </div>

            {/* A place where messages show */}
            <ul className="msgDashboard">
              <Texts
                ChatData={messageData}
                myUserName={myUserName}
                ImgSrc={picture}
              />
            </ul>

            {/* TexTING aREA */}
            <TextArea
              myUserName={myUserName}
              checkKey={checkKey}
              key2={key2}
              sendMessageToServer={this.sendMessageToServer}
            />
          </div>

          <div className="PhoneCallPhoneCall" style={this.state.PhoneCallStyle}>
            <PhoneCall
              recipientData={{ name: userName, pic: picture }}
              phoneType={this.state.phoneType}
              HandlePhoneCall={this.HandlePhoneCall}
            />
          </div>
        </>
      );
    } else {
      return <></>;
    }
  }
}

// export default MessagingBoard;
const mapDispatchToProps = dispatch => {
  return {
    latestChats: stutas => {
      dispatch({ type: "LATESTCHATS", stutas: stutas });
    }
  };
};

const mapStateToProps = state => {
  return {
    profileDetails: { ...state.ProfileDB }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessagingBoard);
