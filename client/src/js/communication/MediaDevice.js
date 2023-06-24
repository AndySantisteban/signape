import _ from "lodash";
import Emitter from "./Emitter";

class MediaDevice extends Emitter {
  /**
   * This function requests access to the user's webcam and microphone and emits a stream event with
   * the obtained stream.
   * @returns the object `this`.
   */
  start() {
    const constraints = {
      video: {
        facingMode: "user",
        height: { min: 360, ideal: 720, max: 1080 },
      },
      audio: true,
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        this.stream = stream;
        this.emit("stream", stream);
      })
      .catch((err) => {
        if (err instanceof DOMException) {
          alert("Cannot open webcam and/or microphone");
        } else {
          console.log(err);
        }
      });

    return this;
  }
  /**
   * The function toggles the enabled state of a specific type of media track in a stream.
   * @param type - The type of media track to toggle (e.g. "Audio" or "Video").
   * @param on - A boolean value indicating whether to turn the specified type of track on or off. If
   * it is true, the track will be turned on, and if it is false, the track will be turned off.
   * @returns the object `this`.
   */
  toggle(type, on) {
    const len = arguments.length;
    if (this.stream) {
      this.stream[`get${type}Tracks`]().forEach((track) => {
        const state = len === 2 ? on : !track.enabled;
        _.set(track, "enabled", state);
      });
    }
    return this;
  }

  /**
   * The function stops all tracks in a stream.
   * @returns the object that it is a method of (presumably a media stream object).
   */
  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
    return this;
  }
}

export default MediaDevice;
