import socketIOClient from "socket.io-client";

// ----- // Socket connector handler
const socket = (() => {
    console.log("Connect");
  return socketIOClient("http://localhost:8080/");//https://chatome56.herokuapp.com/
})();

export default socket;
