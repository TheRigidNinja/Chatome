import ProfileReducer from "./ProfileReducer"
import MessagingReducer from "./MessagingReducer";
import ServerIDReducer from "./ServerIDReducer"
import { combineReducers } from "redux"

const RootReducer = combineReducers({
    ProfileDB: ProfileReducer,
    MessagingDB: MessagingReducer,
    ServerIDReducer: ServerIDReducer
});

export default RootReducer;

