import React, { Component } from "react";
import "../../CSS/Messaging.css";
import Chats from "./Chats";
import { Socket } from "../Socket";
import { connect } from "react-redux";
import Cookie from "../Cookie";
class MessagingArea extends Component {
  state = {
    messages: {},
    tempMessages: []
  };

  componentWillMount() {
    if (this.props.profileDetails.checkInType !== "Register") {
      this.getMessage();
    }
  }

  componentDidUpdate() {
    this.messageScroll();
  }

  messageScroll() {
    var chatScrollHght = document.querySelector(".msgDashboard");
    chatScrollHght.scrollTop = chatScrollHght.scrollHeight;
  }

  // Sending messange handler
  handleMessagingActions = (myUserName, messageKey) => {
    this.messageScroll();

    var userMSGForm = {
      message: document.querySelector("#userMessage").value,
      checkInType: "Register",
      messageKey: messageKey,
      name: myUserName,
      uuID: Cookie("GET", ["uuID"])[0],
      timeStamp: Date.parse(new Date())
    };

    this.sendMessage(userMSGForm, "GetMessage");
  };

  // Send chat data to the server
  sendMessage(msgData, GetMessage) {
    console.log("Sending");

    // this.renderChats(res, Cookie("GET", ["uuID"])[0], action);
    Socket().emit("SendMessage", msgData, msgData.uuID);
  }

  // Getting chats from database
  getMessage() {
    var uuID = Cookie("GET", ["uuID"])[0];
    var friendsMSGKeys = {
      checkInType: "Friends",
      uuID: uuID
    };

    Socket().emit("GetMessages", friendsMSGKeys, uuID);

    // Waits for prov messages after emitting
    Socket().on("MSGChannel", (res, key, action) => {
      this.renderChats(res, key, action);
    });
  }

  renderChats(res, key, action) {
    var uuID = Cookie("GET", ["uuID"])[0];
    
    try {
      // console.log("Got Message -------->>>🤩🤩🤩", res);
      if (uuID === key) {
        var profile = this.props.inboxState;
        var myID = profile.myDataID;
        var myMessageKey = profile.people[myID].messageKey;

        Object.keys(res).forEach(msgKey => {
          if (!msgKey.includes(myMessageKey)) {
            delete res[msgKey];
          }
        });
      }

      if (res) {
        if (!action) {
          this.setState({
            messages: res
          });
        } else {
          var tempMSG = this.state.messages[Object.keys(res)] || [];
          tempMSG.push(res[Object.keys(res)][0]);

          this.setState({
            messages: {
              ...this.state.messages,
              [Object.keys(res)]: [...tempMSG]
            }
          });
        }

        //----// Set the first Message to Props so i can display it on people section
        var tempMessages = {};
        Object.keys(res).forEach(msg => {
          tempMessages[msg] = res[msg][res[msg].length - 1];
        });

        this.setState({
          tempMessages: {
            ...this.state.tempMessages,
            ...tempMessages
          }
        });

        this.props.latestChats(this.state.tempMessages);
      }
    } catch (err) {
      console.log("Erro Trying to Fetch Messages ====>>>>", err);
    }
  }

  render() {
    var inboxState = this.props.inboxState,
      togglePage = this.props.togglePage,
      msgStyle = inboxState.inboxToMessage,
      activeChatID = inboxState.activeChatID,
      userName = "",
      picture = "",
      myID = inboxState.myDataID,
      messageData = "",
      myUserName = "";

    if (activeChatID !== null) {
      userName = inboxState.people[activeChatID].userName;
      picture = inboxState.people[activeChatID].picture;

      var friendsMSGkey = inboxState.people[activeChatID].messageKey,
        myMSGkey = inboxState.people[myID].messageKey,
        key1 = friendsMSGkey + myMSGkey,
        key2 = myMSGkey + friendsMSGkey,
        checkKey = this.state.messages[key1] ? key1 : key2,
        myUserName = inboxState.people[myID].userName;

      messageData = this.state.messages[checkKey];

      // Puts "|" in the middle of the messagekey so we can search if that perticular key
      // exists in mySQL table
      if (!messageData) {
        let tempKey1 = checkKey.split(myMSGkey),
          tempKey2 =
            tempKey1[0] === ""
              ? myMSGkey + "|" + tempKey1[1]
              : tempKey1[1] + "|" + myMSGkey;
        checkKey = tempKey2;
      }
    }

    return (
      <div className="MessagingArea" style={msgStyle}>
        <div className="Header">
          <i
            className="fas fa-chevron-left"
            onClick={() => togglePage("BackToInbox")}
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
          <Chats ChatData={messageData} myUserName={myUserName} />
        </ul>

        {/* A place where users type */}
        <form onSubmit={0} className="userTyping">
          <div className="messageTools">
            <i className="fas fa-camera" />
            <i className="fas fa-image" />

            <div className="MSGBox">
              <textarea placeholder="New Message" id="userMessage" />
              <i className="far fa-grin-beam" id="emoji" />
            </div>

            <i
              className="fas fa-paper-plane"
              id="submitMessage"
              onClick={() => this.handleMessagingActions(myUserName, checkKey)}
            />
          </div>
        </form>
      </div>
    );
  }
}

// export default MessagingArea;

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
)(MessagingArea);
