import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./JS/LoginHandler/LoginPage";
import MessagePage from "./JS/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route path="/chat" component={MessagePage} />
        <Route path="/" component={Login} />
      </Switch>
    </BrowserRouter>
  );
}
