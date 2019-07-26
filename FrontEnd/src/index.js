import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { createStore } from "redux";
import RootReducer from "./REDUCERS/RootReducer";
import { Provider } from "react-redux";
import "./CSS/Index.css";
import App from "./App.js";

const store = createStore(RootReducer);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();
