import React, { Component } from "react";
import "../../CSS/UserProfile.css";
import "../../CSS/Friends.css";
import Fire from "../../FIREBASE/FBConfig";
import { Cookies } from "../Cookies";
import { Socket } from "../Socket";
import { connect } from "redux";
import Messaging from "../MessageHandler/MessagingArea";
import InboxPeople from "./InboxPeople";
import FriendsSection from "./FriendsSection";
import ProfileManager from "./ProfileManager";
import OnlinePeople from "./OnlinePeople";

class ProfilePage extends Component {
    state = {
        friendsDashBoard:{
            height: 0,
            top: "100%",
            opacity: 0,
            display: "none"
        }
    }

    // componentDidMount(){
    //     console.log(Socket().emit("--"));
    //     // Socket.emit("first");  
    // }


    TogglePage =(PageType)=>{

        switch(PageType){
            case "Inbox":
                    this.setState({
                        friendsDashBoard:{
                            height: 0,
                            top: "600px",
                            // opacity: 0,
                            // display: "block"  
                        }
                    })
            break

            case "Friends":
                this.setState({
                    friendsDashBoard:{
                        height: "70%",
                        top: 166,
                        opacity: 1,
                        display: "block"  
                    }
                })


            break 

            case "Profile":
            break 
        }
        console.log(PageType);
    }



    render(){
        return(
            <section classNameName="UserInterface">
                <div classNameName="Profile">
                    <div className="scollArea">

                        <div className="Header">
                            <div className="header1">
                                <img src="../public/Img/User.svg" alt="User" id="userPicture"/>
                                <span id="LogoDescription">Chats</span>
                            </div>
                            <div className="header2">
                                <a href="##camera"><i className="fas fa-camera"></i></a>
                                <a href="##post"><i className="fas fa-edit"></i></a>
                            </div>
                        </div>

                        {/* Display People that have ever created an account */}
                        <div className="inboxSection">
                            <input type="search" placeholder="search" onChange={0}/>
                            <OnlinePeople/>
                            <InboxPeople/>
                        </div>

                        {/* Displays Friends or people you have communicated to */}
                        <div className="FriendsSection" style={this.state.friendsDashBoard}>
                            <FriendsSection/>
                        </div>

                        {/* Shows your profile */}
                        <div className="ProfileManager">
                            <div className="UserDetails"> 
                                <img src="##" id="userPicture" alt="IMG"/>
                                <span className="editImg"><i className="fas fa-user-edit"></i></span>
                                <span className="userName">---</span>
                            </div>

                            <div className="MoreDetail">
                                <ProfileManager/>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="navFooter">
                    <a href="##inbox" id="inbox" onClick={()=>this.TogglePage("Inbox")}>
                    <i className="fas fa-comment-dots"></i></a>
                    
                    <a href="##friends" id="friends" onClick={()=>this.TogglePage("Friends")}>
                    <i className="fas fa-address-book"></i></a>

                    <a href="##profile" id="profile" onClick={()=>this.TogglePage("Profile")}>
                    <i className="fas fa-user"></i></a>
                </div>

                {/* --------------- Massaging Section --------------- */}
                <Messaging/>
            </section>     
        )
    }
}



export default ProfilePage;