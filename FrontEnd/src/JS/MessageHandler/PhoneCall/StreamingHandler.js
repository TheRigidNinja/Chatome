// import socket from "../../Socket";


export default function StreamingHandler(phoneType) {
  if (
    (phoneType && navigator.mediaDevices) ||
    navigator.mediaDevices.enumerateDevices
  ) {
    setTimeout(() => {
      myVideoStream(phoneType);
    }, 100);
  } else {
    // Alert a message
    console.log("FAILED");
  }
}

var FPS = 30,
  streamActive = false,
  streamData = null,
  src = null,
  dst = null;

function myVideoStream(phoneType) {
  const video = document.querySelector(".myVideo"),
    recipientVideo = document.querySelector("#recipientVideo"),
    myCanvVideo = document.querySelector("#myCanvasVideo"),
    width = myCanvVideo.offsetWidth,
    height = myCanvVideo.offsetHeight;
    let videoDimension = { width: 100, height: 100 };

  // Seting dimensions for canvas
  recipientVideo.height = height;
  recipientVideo.width = width;
  myCanvVideo.height = height;
  myCanvVideo.width = width;

  // If video call display myvideo element else don't
  if (phoneType === "video") {
    video.style.display = "block";
  } else {
    video.style.display = "none";
    videoDimension = false;
  }

  // Getting a video from webcam to stream on myCanvasVideo canvas
  if (phoneType !== "MSG") {
    navigator.mediaDevices
      .getUserMedia({ video: videoDimension, audio: true })
      .then(stream => {
        streamData = stream;
        video.srcObject = stream;
        video.play();
        streamActive = true;

        setTimeout(processVideo, 0);
      })
      .catch(err => console.log(`An error occurred: ${err}`));

    // Processing video to get Image data so i can stream to my server
    function processVideo(){
      // Stops this Streaming
      if(!streamActive){
        return;
      }

      const begin = Date.now();
      const context = myCanvVideo.getContext("2d");
      context.drawImage(video,0,0,videoDimension.width,videoDimension.height);
      const delay = 1000/FPS - (Date.now() - begin);
      setTimeout(processVideo, delay);


      // Call Online Streamer Function
      OnlinerStreamer();
    };

    // Start streaming images to server 
    function OnlinerStreamer(callState){
      const imgURL = myCanvVideo.toDataURL('image/jpeg', 0.5);

      // socket.emit("GetStream", imgURL, uuID);
      // console.log("imgURL");
    }
    

  }

  // Stops Everything when user ends the call
  if (phoneType === "MSG") {
    video.pause();
    video.srcObject = null;
    streamActive = false;
    if (streamData) {
      streamData.getTracks().forEach(track => {
        track.stop();
      });
    }
  }
}
