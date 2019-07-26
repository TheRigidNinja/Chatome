import ProfileReducer from "./ProfileReducer";
import MessagingReducer from "./MessagingReducer";
import { combineReducers } from "redux";

const RootReducer = combineReducers({
  ProfileDB: ProfileReducer,
  MessagingDB: MessagingReducer
});

export default RootReducer;
