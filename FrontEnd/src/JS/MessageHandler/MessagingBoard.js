import React, { Component } from "react";
import "../../CSS/Messaging.css";
import Chats from "./Chats";
import socket from "../Socket";
import { connect } from "react-redux";
import Cookie from "../Cookie";
import LZString from "lz-string";

class MessagingBoard extends Component {
  state = {
    chatRooms: {},
    myMSGRoom: {},
    textAreaStyle: {
      height: "35px"
    },
    textHeight: false
  };

  componentWillMount() {
    this.setState({
      ...this.state,
      ...this.props.inboxState
    });

    this.getMessage();

    // socket.on("FriendsMSG", (res, main, local) => {

    //   console.log("object",res,main,local);
    //   var g = {
    //   ...this.state.chatRooms,
    //   // ...this.state.myMSGRoom,
    //   // ...res
    // }
    //   console.log(this.state.myMSGRoom[local],main)
    // this.setState({
    //   chatRooms: {
    //     ...this.state.chatRooms,
    //     [main]:{
    //     ...this.state.chatRooms[main],
    //     ...res
    //   }
    //   }
    // });
    // });
  }

  componentDidUpdate() {
    // Works scrolls down every time you post a message
    if (this.props.inboxState.toggleType === "MessagingBoard") {
      this.messageScroll();

      var textArea = document.querySelector("#userMessage");

      textArea.addEventListener("input", () => {
        this.textAreaHandler(textArea);
      });
    }
  }

  // Getting chats from database
  getMessage = () => {
    var uuID = Cookie("GET", ["uuID"])[0];
    var friendsMSGKeys = {
      checkInType: "Friends",
      uuID: uuID,
      friends: this.props.inboxState.friends
    };

    socket.emit("GetMessages", friendsMSGKeys, uuID);

    // Waits for prov messages after emitting
    socket.on("MSGChannel", (messages, key, action) => {
      this.setState(
        {
          chatRooms: {
            ...this.state.chatRooms,
            ...messages
          }
        },
        () => {
          var lastChats = {};
          for (const msgKey of Object.keys(this.state.chatRooms)) {
            let msg = this.state.chatRooms[msgKey],
              lastMSG = msg[msg.length - 1];

            if (lastMSG) {
              lastChats[lastMSG.recipient] = lastMSG;
            }
          }

          this.props.latestChats(lastChats);

          var myID = this.state.myDataID,
            myDetail = {
              myName: this.state.people[myID].userName,
              roomID: socket.id,
              id: myID,
              uuID: Cookie("GET", ["uuID"])[0]
            };

          this.getFriendMessage(myDetail);
        }
      );
    });
  };

  // ----- // Scrolls
  messageScroll() {
    var chatScrollHght = document.querySelector(".msgDashboard");
    chatScrollHght.scrollTop = chatScrollHght.scrollHeight;
  }

  // ----- // Handles Textarea style when typing
  textAreaHandler = elm => {
    // if(elm.value.length > 20 && this.state.textHeight == false){
    //   this.setState({
    //     textAreaStyle: {height:"150px"},
    //     textHeight: true
    //   })
    // }
    // console.log(elm.value.length );
  };

  // ----- // Sending messange handler
  handleMessagingActions = (myUserName, checkKey, key2) => {
    var recipient = this.props.inboxState,
      recipientName = {
        friend: recipient.people[recipient.activeChatID].userName,
        me: recipient.people[recipient.myDataID].userName
      };

    var userMSGForm = {
      message: document.querySelector("#userMessage").value,
      checkInType: "Register",
      messageKey: checkKey,
      name: myUserName,
      uuID: Cookie("GET", ["uuID"])[0],
      timeStamp: Date.parse(new Date())
    };

    // ----- // Server handler
    this.sendMessage(userMSGForm, recipientName);

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
        document.querySelector("#userMessage").value = "";

        // Gets the lastest chats and push them to props for people section
        let lastChats = {};
        for (const msgKey of Object.keys(this.state.myMSGRoom)) {
          let msg = this.state.myMSGRoom[msgKey],
            lastMSG = msg[msg.length - 1];

          if (lastMSG) {
            lastChats[lastMSG.name] = lastMSG;
          }
        }
        this.props.latestChats({
          ...this.props.profileDetails.latestChats,
          ...lastChats
        });
      }
    );
  };

  // ----- // Send chat data to the server
  sendMessage(msgData, recipientName) {
    console.log("Sending");
    socket.emit("SendMessage", msgData, msgData.uuID, recipientName);
  }

  // ----- // Gets any messages from friends of people wanding to be friend
  getFriendMessage = myDetail => {
    // Emits my info to the server to so it can better identify myself
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
            // Gets the lastest chats and push them to props for people section
            let lastChats = {};
            for (const msgKey of Object.keys(this.state.chatRooms)) {
              let msg = this.state.chatRooms[msgKey],
                lastMSG = msg[msg.length - 1];

              if (lastMSG) {
                lastChats[lastMSG.name] = lastMSG;
              }
            }

            console.log(this.state.chatRooms);
            this.props.latestChats({
              ...this.props.profileDetails.latestChats,
              ...lastChats
            });
          }
        );
      }
    });
  };

  render() {
    var inboxState = this.props.inboxState,
      togglePage = this.props.togglePage,
      msgStyle = inboxState.inboxToMessage,
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
        <div className="MessagingBoard">
          <div className="Header">
            <i
              className="fas fa-chevron-left"
              onClick={() => togglePage("MainPage")}
            />
            <div className="MSGheader1">
              <img src={picture} alt="User" />
              <div>
                <span>{userName}</span>
                <time>----</time>
              </div>
            </div>

            <div className="header2">
              <i className="fas fa-phone" />
              <i className="fas fa-video" />
            </div>
          </div>

          {/* A place where messages show */}
          <ul className="msgDashboard">
            <Chats
              ChatData={messageData}
              myUserName={myUserName}
              ImgSrc={picture}
            />
          </ul>

          {/* A place where users type */}
          <form onSubmit={0} className="userTyping">
            <div className="messageTools">
              <i className="fas fa-camera" />
              <i className="fas fa-image" />

              <div className="MSGBox">
                <textarea
                  placeholder="New Message"
                  id="userMessage"
                  style={textAreaStyle}
                />
                <i className="far fa-grin-beam" id="emoji" />
              </div>

              <i
                className="fas fa-paper-plane"
                id="submitMessage"
                onClick={() =>
                  this.handleMessagingActions(myUserName, checkKey, key2)
                }
              />
            </div>
          </form>
        </div>
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
