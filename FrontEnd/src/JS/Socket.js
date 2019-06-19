import socketIOClient from "socket.io-client";

// ----- // Socket connector handler
const socket = (() => {
  return socketIOClient("https://git.heroku.com/chatome56.git");//http://localhost:8080
})();

export default socket;
