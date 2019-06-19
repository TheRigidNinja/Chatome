import socketIOClient from "socket.io-client";

// ----- // Socket connector handler
const socket = (() => {
  return socketIOClient("http://0315d2d6.ngrok.io/");//http://localhost:8080
})();

export default socket;
