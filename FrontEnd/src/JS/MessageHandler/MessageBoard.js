import React, { Component } from "react";
import "../../CSS/Messaging.css";
import "../../CSS/TextArea.css";
import socket from "../Socket";
import Texts from "./Texts";
import { connect } from "react-redux";
import Cookie from "../Cookies";

export class MessageBoard extends Component {
  state = {
    PhoneCallStyle: {
      display: "none",
      opacity: 0
    },
    textareaHght: { height: 35 },
    chatRooms: {},
    myMSGRoom: {},
    ChatsUpdated: false
  };

  componentDidUpdate() {
    // Tries to get User MSG after Page loads from server
    if (!this.state.ChatsUpdated) {
      this.initialGetMessageFromServer();
      this.messageScroll();
    }

    // console.log(this.props);
    // if (this.props.inboxState.toggleType === "MessagingBoard") {
    //   // Scrolls message Board
    //   this.messageScroll();
    // }

    console.log("Scroll");
    this.messageScroll();
  }

  // This is the process of getting Pre- Messages from Online DataBase
  initialGetMessageFromServer = () => {
    let myData = this.props.myData,
      friendsMSGKeys = {
        checkInType: "Friends",
        uuID: myData.uuID,
        friends: myData.friends
      },
      myDetail = {
        userName: myData.userName,
        id: myData.ID,
        uuID: myData.uuID,
        roomID: socket.id
      };

    // The Socket that triggers A server Function to get Messages
    socket.emit("UserDetails", myDetail, myData.userName);
    socket.emit("GetMessages", friendsMSGKeys, myData.userName);

    // Waits for prov Messages after emitting
    socket.on(socket.id + "MSGChannel", messages => {
      this.setState(
        {
          chatRooms: messages,
          ChatsUpdated: true
        },
        () => {
          // Get latest MSG
          this.handleLastChats("GetInitialMSG");
        }
      );
    });
  };

  // ----- // Scrolls Down Messages from the Message Dashboard
  messageScroll = () => {
    var chatScrollHght = document.querySelector(".msgDashboard");
    chatScrollHght.scrollTop = chatScrollHght.scrollHeight;
  };

  // ----- // Function that handles Sending Messages to the server
  sendMessageToServer = (friendGroup, checkKey, key2) => {
    var msgTextarea = document.querySelector("textarea"),
      userMSGForm = {
        message: msgTextarea.value,
        checkInType: "Register",
        messageKey: checkKey,

        uuID: this.props.myData.uuID,
        timeStamp: Date.parse(new Date()),
        name: friendGroup.me
      };

    console.log(friendGroup);

    // Makes sure MSG box is not empty
    if (
      userMSGForm.message.trim() !== "" &&
      userMSGForm.message.length <= 3000
    ) {
      // ----- // Sends Message to the server Here
      console.log("Sending");

      socket.emit("SendMessage", userMSGForm, userMSGForm.uuID, friendGroup.friend);

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
          msgTextarea.value = "";
          // Get latest MSG

          this.handleLastChats("GetLocalMSG");
        }
      );

    }
  };

  // ----- // Gets any messages from friends of people wanting to be friends
  getFriendMessage = myDetail => {
    socket.emit("UserDetails", myDetail);

    // console.log(object);
    socket.on(myDetail.roomID, res => {
      console.log("Active");
      let recipientData = res.messageKey;

      if (recipientData) {
        let myData = this.props.myData,
          myMSGkey = myData.messageKey,
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
    // var lastChats = {},
    //   inboxState = this.props.inboxState,
    //   myName = inboxState.people[inboxState.myDataID].userName,
    //   roomType = ["GetFriendsMSG", "GetInitialMSG"].includes(ActionType)
    //     ? "chatRooms"
    //     : "myMSGRoom";

    // for (const msgKey of Object.keys(this.state[roomType])) {
    //   let msg = this.state[roomType][msgKey],
    //     lastMSG = msg[msg.length - 1];
    //   if (
    //     lastMSG &&
    //     (lastMSG.recipient === myName || lastMSG.name === myName)
    //   ) {
    //     let nameSort =
    //       lastMSG.recipient === myName ? lastMSG.name : lastMSG.recipient;
    //     lastChats[nameSort] = lastMSG;
    //   }
    // }

    switch (ActionType) {
      case "GetInitialMSG":
        // this.props.latestChats(lastChats);

        // Triggering friends function to send roomID to server so i can keep track who is who

        var myData = this.props.myData,
          myDetail = {
            myName: myData.userName,
            roomID: socket.id,
            id: myData.ID,
            uuID: myData.uuID
          };

        this.getFriendMessage(myDetail);
        break;

      default:

      // Clear Text Area After setting to state
      // if (document.querySelector(".MSGBox")) {
      //   document.querySelector(".MSGBox").innerHTML = "";
      // }

      // this.props.latestChats({
      //   ...this.props.profileDetails.latestChats,
      //   ...lastChats
      // });

    }
  };

  handleTextAreaEdit = (text, height) => {
    let main = document.querySelector(".InsertImage"),
      arrow = main.querySelector(".fa-chevron-right"),
      icons = main.querySelector(".optionIcons");

    if (text.length > 0 && arrow.classList[2] === "iconToggle") {
      arrow.classList.remove("iconToggle");
      icons.classList.add("iconToggle");
    } else if (text.length === 0) {
      arrow.classList.add("iconToggle");
      icons.classList.remove("iconToggle");
    }

    // console.log((height / 35) * 35, this.state.textareaHght.height);
    if (height > this.state.textareaHght.height) {

      
      // this.setState({
      //   textareaHght:{height: height}
      // })
    }console.log(height);

    // console.log((8.5*text.length)/width, count,width);
  };

  render() {
    let people = this.props.people,
      activeChatID = this.props.activeChatID,
      userName =
        typeof activeChatID === "number" ? people[activeChatID].userName : "",
      picture =
        typeof activeChatID === "number" ? people[activeChatID].picture : "-",
      friendsMSGkey =
        typeof activeChatID === "number" ? people[activeChatID].messageKey : "",
      myData = this.props.myData,
      myUserName = myData.userName,
      myMSGkey = myData.messageKey,
      key1 = friendsMSGkey + myMSGkey,
      key2 = myMSGkey + friendsMSGkey,
      checkKey = this.state.chatRooms[key1] ? key1 : key2,
      myChats = this.state.myMSGRoom[key2],
      messageData = this.state.chatRooms[checkKey];
    // console.log(key1, activeChatID);
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
    myChats = myChats ? myChats : [];
    messageData = [...messageData, ...myChats];

    return (
      <>
        <div className="MessagingBoard" style={{ left: this.props.MSGstyle }}>
          <div className="Header">
            <i
              className="fas fa-chevron-left"
              onClick={() => this.props.togglePage("Previous")}
            />

            <div className="MSGheader1">
              <div className="msgPic">
                <img
                  style={{
                    backgroundImage: "url(" + picture + ")"
                  }}
                  alt=""
                />
                <span id="status" />
              </div>
              <div className="PersonStatus">
                <span>{userName}</span>
                <time>Now Active</time>
              </div>
            </div>

            <div className="header2">
              <i
                className="fas fa-phone"

                // onClick={() =>
                //   this.HandlePhoneCall("phone", {
                //     me: myUserName,
                //     friend: userName
                //   })
                // }
              />
              <i
                className="fas fa-video"
                // onClick={() =>
                //   this.HandlePhoneCall("video", {
                //     me: myUserName,
                //     friend: userName
                //   })
                // }

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
          <form className="userTyping">
            <div className="messageTools">
              <span className="InsertImage">
                <i
                  className="fas fa-chevron-right iconToggle"
                  onClick={() => this.handleTextAreaEdit("")}
                />
                <div className="optionIcons">
                  <i className="fas fa-mountain" />
                  <i className="fas fa-image" />
                  <i className="fas fa-camera-retro" />
                </div>
              </span>

              <span className="TextArea">
                <textarea
                  style={this.state.textareaHght}
                  placeholder="Aa"
                  onInput={event => {
                    this.handleTextAreaEdit(
                      event.target.value,
                      event.target.scrollHeight
                    );
                  }}
                />
                <i className="fas fa-laugh" id="emoji" />
              </span>

              <span
                className="submitMessage"
                onClick={() =>
                  this.sendMessageToServer(
                    { me: myUserName, friend: userName },
                    checkKey,
                    key2
                  )
                }
              >
                <i className="fas fa-arrow-up" id="submitMessage" />
              </span>
            </div>
          </form>
        </div>

        <div className="PhoneCall" style={this.state.PhoneCallStyle}>
          <video className="myVideo" />
          <canvas id="recipientVideo" />
          <canvas id="myCanvasVideo" />

          <div className="ControlCont">
            <div className="PhoneProfile">
              <img
                style={{
                  backgroundImage: "url(" + picture + ")"
                }}
                alt=""
              />
              <label>{userName}</label>
              <small>Ringing...</small>
            </div>

            <div className="ButtonsCont">
              <div className="Controls">
                <span>
                  <i className="fas fa-microphone-alt-slash" />
                  <label>Mute</label>
                </span>
                <span>
                  <i className="fas fa-volume-up" />
                  <label>Speaker</label>
                </span>
                <span

                  // onClick={event =>
                  //   this.HandlePhoneCall("videoToggle", {
                  //     me: myUserName,
                  //     friend: userName
                  //   })
                  // }

                  id="videoToggle"
                  className=""
                >
                  <i className="fas fa-video" />
                  <label>Video</label>
                </span>
              </div>

              <div className="endCall">
                <span

                  // onClick={() =>
                  //   this.HandlePhoneCall("MSG", {
                  //     me: myUserName,
                  //     friend: userName
                  //   })
                  // }

                >
                  <i className="fas fa-phone" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default MessageBoard;
