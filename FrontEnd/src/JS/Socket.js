import socketIOClient from "socket.io-client";

// ----- // Socket connector handler
const socket = (() => {
    console.log("Connect");
  return socketIOClient("http://d7c5d76e.ngrok.io");//https://chatome56.herokuapp.com/
})();

export default socket;
