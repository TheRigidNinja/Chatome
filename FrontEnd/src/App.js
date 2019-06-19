import React, { Component } from "react";
import { BrowserRouter, Route, Switch} from "react-router-dom";
import Login from "./JS/LoginHandler/LoginPage";
import ProfilePage from "./JS/ProfileHandler/MainPage";

export class App extends Component {

    render() {
        return(
            <BrowserRouter>

                <Switch> 
                    <Route exact path="/Login" component={Login} />
                    <Route path="/Chat" component={ProfilePage} />
                    <Route path="/" component={Login} />
                </Switch>

            </BrowserRouter>
        )
    }
}



export default App