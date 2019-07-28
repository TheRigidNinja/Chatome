import WebCam from "../WebCam";
import socket from "../Socket";

var myVideo, recipientVideo, myCanvasVideo;

export default function StreamingCalls(type) {
  if (type !== "Stream") {
    myVideo = document.querySelector(".myVideo");
    recipientVideo = document.querySelector("#recipientVideo");
    myCanvasVideo = document.querySelector("#myCanvasVideo");

    let typeMediaResp =
      type === "phone" ? "continuousAudio" : "continuousVideo";
    WebCam(typeMediaResp, myVideo, myCanvasVideo);
  } else {
    // Starts stream videos to server
    const imgURL = myCanvasVideo.toDataURL("image/jpeg", 0.5);
    
    // console.log("Yes!! boxa", type);
    // socket.emit("GetStream", imgURL, "uuID"); 

    // this is just a test to see if this will work
  }
}

