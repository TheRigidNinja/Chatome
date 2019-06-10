import React, { Component } from "react";
import "../../CSS/Messaging.css";
import Chats from "./Chats";
import { Socket } from "../Socket";
import { connect } from "react-redux";
class MessagingArea extends Component {
  state = {
    userdetails: this.props.yourDetails,
    messages: {}
  };

  componentDidMount() {
    if (this.state.userdetails.uuID) {
      this.getMessage("Friends");
    }
  }

  componentDidUpdate() {
    this.messageScroll();
  }

  messageScroll = () => {
    var chatScrollHght = document.querySelector(".msgDashboard");
    chatScrollHght.scrollTop = chatScrollHght.scrollHeight;
  };

  // Sending messange handler
  handleMessagingActions = () => {
    this.messageScroll();

    var userMSGForm = {
      message: document.querySelector("#userMessage").value,
      checkInType: "Register",
      messageKey:
        this.props.recipientData.myMessageKey +
        "|" +
        this.props.recipientData.senderMSGKey,
      name: this.props.recipientData.myUserName,
      timeStamp: Date.parse(new Date())
    };

    this.sendMessage(userMSGForm,"GetMessage");
    console.log("Send ====== >",userMSGForm);
  };

  // Getting chats from database

  getMessage = type => {
    var checkInType = type === "Friends" ? "Friends" : "chats",
      uuID = this.state.userdetails.uuID;

    var friendsMSGKeys = {
      messageKey:
        this.props.recipientData.myMessageKey +
        "|" +
        this.props.recipientData.senderMSGKey,
      checkInType: checkInType,
      uuID: uuID
    };

    Socket().emit("GetMessages", friendsMSGKeys, uuID);

    // Waits for prov messages after emitting
    Socket().on("MSGChannel", (res, key) => {
      if (res) {
        this.setState({
          messages: res
        });
        
        //----// Set the first Message to Props so i can display it on people section
        console.log(res);
        var tempMessages = [];
        Object.keys(res).forEach(msg => {
          // Gets the latest comment

          tempMessages.push(res[msg][res[msg].length-1]);
        });
        this.props.LatestChats(tempMessages);
      }
    });
  };

  sendMessage = (msgData,GetMessage) => {
    Socket().emit("SendMessage", msgData, this.state.userdetails.uuID);
    
    Socket().on("MessageStatus",(res,key)=>{
      if(key === this.state.userdetails.uuID && GetMessage === "GetMessage"){
        this.getMessage();
      }
    })
  };

  render() {
    var style = this.props.style,
      userName = this.props.recipientData.userName,
      picture = this.props.recipientData.picture,
      TogglePage = this.props.TogglePage,
      messageData = "";

    // identifying which orientation of the key works

    console.log(this.state.messages);
    if (this.props.recipientData.myMessageKey) {
      var mykey = this.props.recipientData.myMessageKey.replace(/[.]/g, ""),
        friendKey = this.props.recipientData.senderMSGKey.replace(/[.]/g, ""),
        msgingKey = this.state.messages[mykey + friendKey]
          ? mykey + friendKey
          : friendKey + mykey;

      messageData = this.state.messages[msgingKey];
    }
    

    //   return <></>
    return (
      <div className="MessagingArea" style={style}>
        <div className="Header">
          <i
            className="fas fa-chevron-left"
            onClick={() => TogglePage("BackToInbox")}
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
          <Chats ChatData={messageData} myUserName={this.props.recipientData.myUserName}/>
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
              onClick={this.handleMessagingActions}
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
      LatestChats: stutas => {
        dispatch({ type: "LATESTCHATS", data: stutas });
      }
    }
  };

const mapStateToProps = state => {
  return {
    yourDetails: { ...state.ProfileDB }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessagingArea);
