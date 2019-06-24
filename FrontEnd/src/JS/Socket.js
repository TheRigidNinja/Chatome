import socketIOClient from "socket.io-client";

// ----- // Socket connector handler
const socket = (() => {
  return socketIOClient("https://5853b1d9.ngrok.io/"); //https://chatome56.herokuapp.com/
})();

export default socket;
