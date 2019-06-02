import React, { Component } from "react";
import "../../CSS/Authentifacation.css";
import Fire from "../../FIREBASE/FBConfig";
import { Cookies } from "../Cookies";
import { Link } from "react-router-dom";


class LoginPage extends Component {
    state = {
        userNameStyle: {
            display: "none",
            opacity: 0,
            height: 0 
        },
        alert:{ padding: 0 }
    }


    // componentDidMount(){
    //     console.log("object");
    // }
    

    SubmitForm = async(e) =>{
        e.preventDefault();

        let elms = document.querySelectorAll("#check1, #picture, #userLabel, #email, #password"),          returnLogs = null,
            source = elms[0].src.toString(),
            userLoginData = {
                picture: "../"+source.slice(source.indexOf("public")),
                newCustomer: elms[1].checked,
                userName: elms[2].value,
                email: elms[3].value,
                password: elms[4].value,            
            };
            
        // Validates Form Data and checks if everything is correct
        if(this.ValidateFormData(userLoginData)){

            if(userLoginData.newCustomer === true){
                returnLogs = await this.RegisterHandler(userLoginData);
            }else{
                returnLogs = await this.LoginHandler(userLoginData);
            }
            
            // Changes page IF user successfully Logs or register 
            if(returnLogs.alertMsg === "Success"){
                Cookies("SET",{name:"userInfo",value:JSON.stringify(returnLogs)});
                document.getElementById("GotoChat").click()
            }
        }

    }

    RegisterBox = () =>{
        var dom = document.querySelectorAll(".userName, #userLabel"),
            userName = dom[0],
            userLabel = dom[1];

        if(userName.offsetHeight === 0){
            userLabel.removeAttribute("required");

            this.setState({
                userNameStyle:{
                    display: "block",
                    opacity: 1,
                    height: 70 
                }
            })
        }else{
            userLabel.removeAttribute("required");
            // var promise = new Promise((resolve)=>{
            //     setTimeout(()=>{resolve("none")},1000)
            // })

            this.setState({
                userNameStyle:{
                    opacity: 0,
                    height: 0,
                    display: "none",
                }
            })
        }
    }

    RegisterHandler = (userLoginData) =>{
        return(
            Fire.auth().createUserWithEmailAndPassword(userLoginData.email, userLoginData.password).then((userInfo) => {
                
                delete userLoginData.email;
                delete userLoginData.password;

                const db = Fire.firestore(),
                      msgKey = (Math.random()*1000).toString(16).substring(),
                      userFormInfo = {
                            ...userLoginData,
                            state: "Online",
                            alertMsg: "Success",
                            userId: userInfo.user.uid,
                            msgKey: msgKey
                        };

                db.collection("All_Users").doc(userInfo.user.uid).set({...userFormInfo});

                return userFormInfo

            }).catch((error) =>{
                return this.WarningHandler(error.message);
            })
        )
    }

    LoginHandler = (userLoginData) =>{
        return(
            Fire.auth().signInWithEmailAndPassword(userLoginData.email, userLoginData.password).then(async(userInfo) => {

                const db = Fire.firestore(),
                userProfileData = await db.collection("All_Users").doc(userInfo.user.uid).get().then((snapshot) => {return snapshot.data()});

                return userProfileData

            }).catch((error) => {
                return this.WarningHandler(error.message);
            })
        )
    }


// Checks if everything is correct in the form before submiting
    ValidateFormData = (formData) =>{
        var warnings = "";

        if (formData.password.replace(" ", "").length < 6){
            warnings+="Password must be > 6 char|";
        } 

        if (formData.newCustomer === true && formData.userName.length < 4){
            warnings+="User Name must be > 4 char|";
        } 
        
        // Showing warnings to the user
        if(warnings !== ""){
            return this.WarningHandler(warnings);
        }else{
            return true
        }
    }


    WarningHandler = (data) =>{

        let alert = document.getElementById("Alert");
        alert.innerText = data.replace(/\|/g,"\n");

        this.setState({
            alert:{ padding: 20}
        })

        // Warning timeout
        setTimeout(() => {
            alert.innerText = "";
            this.setState({
                alert:{ padding: 0}
            })
        }, 5000);

        return false
    }


    render() {
        return (
            <section>
                <Link to="/Chat" id="GotoChat"></Link>

                <span id="Alert" style={this.state.alert}></span>
                <div className="content container">
                    <h3>Welcome to Chatome</h3>
                    
                    <form onSubmit={(event)=>(this.SubmitForm(event))} className="container d-flex flex-column">
                        <div className="avatar">
                            <i className="fas fa-camera"></i> 
                            <img src="../public/img/User.svg" alt="Avatar"  title="Choose your avatar" id="picture"/>
                        </div>

                        <div className="form-group">
                            <input type="checkbox" onChange={this.RegisterBox} id="check1"/>
                            <label className="form-check-label" htmlFor="check1">- I'm new to this!!!</label>
                        </div>

                        <div className="form-group userName" style={this.state.userNameStyle}> 
                            <label>*User Name</label>
                            <input type="text" placeholder="e.i: Smaff56" id="userLabel" />
                        </div>

                        <div className="form-group"> 
                            <label>*Email</label>
                            <input type="email" placeholder="e.i: example@gmail.com" id="email" required/>
                        </div> 

                        <div className="form-group"> 
                            <label>*Password </label>
                            <input type="password" id="password" required/>
                        </div>
            
                        <input type="submit" id="Submit"/>
                    </form>
                </div>
            </section>
        )
    }
}


export default LoginPage
