import socketIOClient from "socket.io-client";

// ----- // Socket connector handler
const socket = (() => {
  return socketIOClient("http://localhost:8080/");//http://localhost:8080
})();

export default socket;
