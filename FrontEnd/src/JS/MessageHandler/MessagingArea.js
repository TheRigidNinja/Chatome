import React from "react";
import "../../CSS/Messaging.css";
import Chats from "./Chats";


function MessagingArea() {
    return (
            <div className="MessagingArea">    
                <div className="Header">
                    <i className="fas fa-chevron-left" onClick={0}></i>
                    <div className="MSGheader1">
                        <img src="../public/Img/User.svg" alt="User"/>
                        <div>
                            <span>---</span>
                            <time>----</time>
                        </div>
                    </div>
                
                    <div className="header2">
                        <i className="fas fa-phone"></i>
                        <i className="fas fa-video"></i>
                    </div>
                </div>

                {/* A place where messages show */}
                <ul className="msgDashboard">
                    <Chats/>
                </ul>

                {/* A place where users type */}
                <form onSubmit={0} className="userTyping"> 
                    <div className="messageTools">
                        <i className="fas fa-camera"></i>
                        <i className="fas fa-image"></i>

                        <div className="MSGBox">
                            <textarea placeholder="New Message"/>
                            <i className="far fa-grin-beam" id="emoji"></i>
                        </div>

                        <i className="fas fa-paper-plane" id="submitMessage" onClick={0}></i>
                    </div>
                </form>
            </div>
        )
}

export default MessagingArea