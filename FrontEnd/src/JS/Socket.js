import socketIOClient from "socket.io-client";

// ----- // Socket connector handler
const socket = (() => {
  return socketIOClient("http://ed2139d6.ngrok.io/");//https://chatome56.herokuapp.com/
})();

export default socket;
