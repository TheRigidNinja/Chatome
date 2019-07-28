import WebCam from "../WebCam";
import socket from "../Socket";

var myVideo, recipientVideo, myCanvasVideo;

export default function StreamingCalls(type, details) {
  if (type !== "Stream") {
    myVideo = document.querySelector(".myVideo");
    recipientVideo = document.querySelector("#recipientVideo");
    myCanvasVideo = document.querySelector("#myCanvasVideo");
    
    // Gets the Recipient Call Ready
    recipientHandler();

    if (type === "phone") {
      type = "continuousAudio";
    } else if (type === "video") {
      type = "continuousVideo";
    }

    WebCam(type, myVideo, myCanvasVideo);
  } else {
    // Starts stream videos to server
    const imgURL = myCanvasVideo.toDataURL("image/jpeg", 0.5);
    socket.emit("GetStream", imgURL, details);

    // this is just a test to see if this will work
  }
}




// This is a place where you get to see the recipientVideo / Audio

function recipientHandler() {
  socket.on("GetStreamData", streamData => {

  });
}
