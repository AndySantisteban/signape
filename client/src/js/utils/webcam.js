/* The `Webcam` class contains methods to open and close the webcam stream using the `getUserMedia`
method and the `srcObject` property of a video element. */
export class Webcam {
  open = (videoRef) => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            facingMode: "environment",
          },
        })
        .then((stream) => {
          videoRef.srcObject = stream;
        });
    } else alert("Can't open Webcam!");
  };

  /* The `close` method is a function that takes a `videoRef` parameter and stops the video stream from
  the webcam. It checks if the `videoRef` has a `srcObject` property, which indicates that the
  webcam is currently open. If it does, it loops through all the tracks in the `srcObject` and stops
  them using the `stop()` method. Then it sets the `srcObject` to `null` to close the webcam. If the
  `videoRef` does not have a `srcObject` property, it alerts the user to open the webcam first. */
  close = (videoRef) => {
    if (videoRef.srcObject) {
      videoRef.srcObject.getTracks().forEach((track) => {
        track.stop();
      });
      videoRef.srcObject = null;
    } else alert("Please open Webcam first!");
  };
}
