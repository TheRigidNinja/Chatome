import socketIOClient from "socket.io-client";

// ----- // Socket connector handler
const socket = (() => {
  return socketIOClient("https://chatome56.herokuapp.com/");
})();

export default socket;
