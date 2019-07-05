import React from "react";

var video,
  recipientVideo,
  cv = window.openCV;

export default function StreamingHandler(data) {

  if (data === "GetElm" && !(!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices)) {
    setTimeout(() => {
      video = document.querySelector(".myVideo");
      recipientVideo = document.querySelector(".recipientVideo");

      myVideoStream();
    }, 100);
  } else {
  }
}

function myVideoStream() {
  let height = video.offsetHeight,
    width = video.offsetWidth,
    streaming = false,
    FPS = 30,
    src,
    dst;
  // const cap = new cv.VideoCapture(video);

  // Getting a video from webcam to stream online
  navigator.mediaDevices
    .getUserMedia({ video: { width: 200, height: 300 }, audio: true })
    .then(stream => {
      video.srcObject = stream;
      video.play();
      streaming = true;
      src = new cv.Mat(height, width, cv.CV_8UC4);
      dst = new cv.Mat(height, width, cv.CV_8UC1);
      // setTimeout(processVideo, 0);
    })
    .catch(err => console.log(`An error occurred: ${err}`));

  // Processing video to get Image data so i can stream to my server
  // function processVideo() {
  //   if (!streaming) {
  //     src.delete();
  //     dst.delete();
  //     return;
  //   }
  //   const begin = Date.now();
  //   cap.read(src);
  //   // cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
  //   cv.imshow("canvasOutput", dst);
  //   const delay = 1000 / FPS - (Date.now() - begin);
  //   setTimeout(processVideo, delay);
  // }
}
