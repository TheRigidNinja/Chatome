import socketIOClient from "socket.io-client";

// ----- // Socket connector handler
const socket = (() => {
    console.log("Connect");
  return socketIOClient("http://7139dde6.ngrok.io/");//https://chatome56.herokuapp.com/
})();

export default socket;
