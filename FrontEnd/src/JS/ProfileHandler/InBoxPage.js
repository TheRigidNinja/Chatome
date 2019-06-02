import React, { Component } from "react";
import "../../CSS/UserProfile.css";
import Fire from "../../FIREBASE/FBConfig";
import { Cookies } from "../Cookies";
import { connect } from "redux";
import Messaging from "../MessageHandler/MessagingArea";
import InboxPeople from "./InboxPeople";
import FriendsSection from "./FriendsSection";

class ProfilePage extends Component {


    render(){
        return(
            <section className="UserInterface">
                <div className="Profile">
                    <div class="scollArea">

                        <div class="Header">
                            <div class="header1">
                                <img src="../public/Img/User.svg" alt="User" id="userPicture"/>
                                <span id="LogoDescription">Chats</span>
                            </div>
                            <div class="header2">
                                <a href="##camera"><i class="fas fa-camera"></i></a>
                                <a href="##post"><i class="fas fa-edit"></i></a>
                            </div>
                        </div>

                        {/* Display People that have ever created an account */}
                        <div class="InboxPeople">
                            {/* <div class="Template2 Person" data-UserID={0} onclick={"pageToggle(event,'msgPerson')"}>
                                <span id="ProfilePic">
                                    <img src="../public/Img/User.svg"/>
                                    <span id="status"></span>
                                </span>
                                <div class="details">
                                    <h4>NAN</h4>
                                    <p>---</p>
                                </div>
                                <time>8:40pm</time>
                            </div> */}
                        </div>

                            {/* Displays Friends or people you have communicated to */}
                            <div class="FriendsSection">

                            </div>

                            {/* Shows your profile */}
                            <div class="ProfileManager">
                                <div class="UserDetails"> 
                                    <img src="##" id="userPicture"/>
                                    <span class="editImg"><i class="fas fa-user-edit"></i></span>
                                    <span class="userName">---</span>
                                </div>

                                <div class="MoreDetail">
                        
                                    {/* User Email */}
                                    {/* <div class="Person" data-UserID={0} onclick={"MoreDetail(event,'msgPerson')"}>
                                        <img src="../public/Img/User.svg"/>
                                        <div class="details">
                                            <h4>NAN</h4>
                                            <p>---</p>
                                        </div>
                                        <time>8:40pm</time>
                                    </div>

                                {/* User Phone number */}
                                {/* <div class="Person" data-UserID={0} onclick={"MoreDetail(event,'msgPerson')"}>
                                    <img src="../public/Img/User.svg"/>
                                    <div class="details">
                                        <h4>NAN</h4>
                                        <p>---</p>
                                    </div>
                                    <time>8:40pm</time>
                                </div> */}

                                {/* UserNickName */}
                                {/* <div class="Person" data-UserID={0} onclick={"MoreDetail(event,'msgPerson')"}>
                                    <img src="../public/Img/User.svg"/>
                                    <div class="details">
                                        <h4>NAN</h4>
                                        <p>---</p>
                                    </div>
                                    <time>8:40pm</time>
                                </div>  */}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="navFooter">
                    <a href="##inbox" id="inbox" onclick="pageToggleInbox('inbox')">
                    <i class="fas fa-comment-dots"></i></a>
                    
                    <a href="##friends" id="friends" onclick="pageToggleInbox('friends')">
                    <i class="fas fa-address-book"></i></a>

                    <a href="##profile" id="profile" onclick="pageToggleInbox('profile')">
                    <i class="fas fa-user"></i></a>
                </div>

                {/* --------------- Massaging Section --------------- */}
                <div class="MessagingArea">
                    
                    <div class="Header">
                        <i class="fas fa-chevron-left" onclick={"pageToggleToMsg(event,'backToInbox')"}></i>

                        <div class="MSGheader1">
                            <img src="../public/Img/User.svg" alt="User"/>
                            <div>
                                <span>---</span>
                                <time>----</time>
                            </div>
                        </div>

                        <div class="header2">
                            <i class="fas fa-phone"></i>
                            <i class="fas fa-video"></i>
                        </div>
                    </div>

                    <ul class="msgDashboard">
                        {/* <li class="replyMessage">
                            <time>---</time>
                            <div>
                                <img src="../public/img/User.svg" id="userIcon"/>
                                <label>Name</label>
                                <p>Testing</p>
                            </div>
                        </li>

                        <li class="sentMessage">
                            <time>--</time>
                            <div>
                                <label>Name</label>
                                <p>---</p>
                            </div>
                        </li> */}
                    </ul>

                    <form onsubmit={"event.preventDefault();WriteMessages(event)"}> 
                        <div class="messageTools">
                            <i class="fas fa-camera"></i>
                            <i class="fas fa-image"></i>

                            <div class="MSGBox">
                                <textarea placeholder="New Message"/>
                                <i class="far fa-grin-beam" id="emoji"></i>
                            </div>

                            <i class="fas fa-paper-plane" id="submitMessage" onclick={"$(this).submit();"}></i>
                        </div>

                    </form>
                </div>
            </section>     
        )
    }
}



export default ProfilePage;