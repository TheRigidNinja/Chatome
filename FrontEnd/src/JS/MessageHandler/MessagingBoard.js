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

    socket.on("FriendsMSG", (res,main,local) => {
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
    });
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

  // Sending messange handler
  handleMessagingActions = (myUserName, messageKey) => {
    var userMSGForm = {
      message: document.querySelector("#userMessage").value,
      checkInType: "Register",
      messageKey: messageKey,
      name: myUserName,
      uuID: Cookie("GET", ["uuID"])[0],
      timeStamp: Date.parse(new Date())
    };

    // Server handler
    this.sendMessage(userMSGForm, userMSGForm.messageKey);

    delete userMSGForm.uuID;
    delete userMSGForm.messageKey;
    delete userMSGForm.checkInType;

    this.setState(
      {
        myMSGRoom: {
          ...this.state.myMSGRoom,
          [messageKey]: [...this.state.myMSGRoom[messageKey], userMSGForm]
        }
      },
      () => {
        document.querySelector("#userMessage").value = "";
      }
    );
  };

  // Send chat data to the server
  sendMessage(msgData, messageKey) {
    console.log("Sending");
    socket.emit("SendMessage", msgData, msgData.uuID);
  }

  // // Getting chats from database
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
      this.setState({
        chatRooms: {
          ...this.state.chatRooms,
          ...messages
        }
      });
    });
  };

  renderChats(res, key, action) {
    // var uuID = Cookie("GET", ["uuID"])[0];
    // try {
    //   // console.log("Got Message -------->>>🤩🤩🤩", res);
    //   if (uuID === key) {
    //     var profile = this.props.inboxState;
    //     var myID = profile.myDataID;
    //     var myMessageKey = profile.people[myID].messageKey;
    //     Object.keys(res).forEach(msgKey => {
    //       if (!msgKey.includes(myMessageKey)) {
    //         delete res[msgKey];
    //       }
    //     });
    //   }
    //   if (res) {
    //     if (!action) {
    //       this.setState({
    //         messages: res
    //       });
    //     } else {
    //       var tempMSG = this.state.messages[Object.keys(res)] || [];
    //       tempMSG.push(res[Object.keys(res)][0]);
    //       this.setState({
    //         messages: {
    //           ...this.state.messages,
    //           [Object.keys(res)]: [...tempMSG]
    //         }
    //       });
    //     }
    //     //----// Set the first Message to Props so i can display it on people section
    //     var tempMessages = {};
    //     Object.keys(res).forEach(msg => {
    //       tempMessages[msg] = res[msg][res[msg].length - 1];
    //     });
    //     this.setState({
    //       tempMessages: {
    //         ...this.state.tempMessages,
    //         ...tempMessages
    //       }
    //     });
    //     this.props.latestChats(this.state.tempMessages);
    //   }
    // } catch (err) {
    //   console.log("Erro Trying to Fetch Messages ====>>>>", err);
    // }
  }

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

      var myChats = this.state.myMSGRoom[key2];
      if (!myChats) {
        this.setState({
          myMSGRoom: { ...this.state.myMSGRoom, [key2]: [] }
        });
        myChats = [];
      }

      // Marges messages from my local chat and the updated friend chat
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
                  this.handleMessagingActions(myUserName, checkKey)
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
