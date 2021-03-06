// Record a video
// Record Audio
// Take a photo

// Take Continouse Audio
// Take Continouse Video

import StreamingCalls from "./MessageHandler/StreamingCalls";

var endStream = false;

export default function WebCam(dataType, video, canvas) {
  endStream = dataType === "MSG" ? true : false;

  let controls = {
    dataType: dataType,
    audio: true,
    mediaSize: false,
    canvas: canvas,
    video: video,
    canvasWdth: canvas.offsetWidth,
    canvasHght: canvas.offsetHeight
  };

  switch (dataType) {
    case "recordVideo":
      return false;

    case "recordAudio":
      return false;

    case "takePhoto":
      return false;

    case "continuousAudio":
      startMedia(controls);
      return false;

    case "continuousVideo":
      setTimeout(() => {
        controls.mediaSize = {
          width: video.offsetWidth,
          height: video.offsetHeight
        };
        startMedia(controls);
      }, 120);
      return false;

    default:
      return false;
  }
}

var streamData = null,
  streamActive = false,
  FPS = 30;

function startMedia(controls) {
  navigator.mediaDevices
    .getUserMedia({
      video: controls.mediaSize,
      audio: controls.audio
    })
    .then(stream => {
      streamData = stream;
      controls.video.srcObject = stream;
      controls.video.play();
      streamActive = true;

      setTimeout(processVideo, 0);
    })
    .catch(err => console.log(`An error occurred: ${err}`));

  // Starts a continues Loop of Streaming data
  function processVideo() {
    // Stops this Streaming
    if (!streamActive) {
      return;
    }

    const begin = Date.now();
    const context = controls.canvas.getContext("2d");
    context.drawImage(controls.video, 0, 0, 300, 150);
    const delay = 1000 / FPS - (Date.now() - begin);
    setTimeout(processVideo, delay);

    // Start calling the function to broadCast Images
    StreamingCalls("Stream");

    // Ends the call if requested
    if (endStream) {
      endCall(controls.video);
    }
  }

  function endCall(video) {
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
