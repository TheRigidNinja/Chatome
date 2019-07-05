import socketIOClient from "socket.io-client";

// ----- // Socket connector handler
const socket = (() => {
  return socketIOClient("http://f487262a.ngrok.io");
})();

export default socket;
