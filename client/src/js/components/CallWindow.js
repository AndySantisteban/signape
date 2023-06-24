/* eslint-disable jsx-a11y/media-has-caption */
import {
  faMicrophone,
  faPhone,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import classnames from "classnames";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import { detectVideo } from "../utils/detect";
import ActionButton from "./ActionButton";

/**
 * The function renders a video call window with options to toggle video and audio devices and end the
 * call.
 * @returns A React component that renders a video call window with options to toggle video and audio
 * devices, and end the call. It also uses a machine learning model to detect objects in the video
 * stream and displays the results on a canvas element.
 */
function CallWindow({
  peerSrc,
  localSrc,
  config,
  mediaDevice,
  status,
  endCall,
  model,
}) {
  const peerVideo = useRef(null);
  const localVideo = useRef(null);
  const canvasRef = useRef(null);
  const textRef = useRef(null);
  const [video, setVideo] = useState(config.video);
  const [audio, setAudio] = useState(config.audio);
  const classThreshold = 0.15;

  useEffect(() => {
    if (peerVideo.current && peerSrc) peerVideo.current.srcObject = peerSrc;
    if (localVideo.current && localSrc) localVideo.current.srcObject = localSrc;
  });

  useEffect(() => {
    if (mediaDevice) {
      mediaDevice.toggle("Video", video);
      mediaDevice.toggle("Audio", audio);
    }
  });

  /**
   * The function toggles the state of a media device (either video or audio) and calls the
   * corresponding method from the mediaDevice object.
   * @param deviceType - A string that specifies the type of media device to toggle. It can be either
   * "Video" or "Audio".
   */
  const toggleMediaDevice = (deviceType) => {
    if (deviceType === "Video") {
      setVideo(!video);
    }
    if (deviceType === "Audio") {
      setAudio(!audio);
    }
    mediaDevice.toggle(deviceType);
  };

  return (
    <div className={classnames("call-window", status)}>
      <div className="position-relative">
        <video
          id="peerVideo"
          ref={peerVideo}
          autoPlay
          onPlay={() => {
            detectVideo(
              peerVideo.current,
              model,
              classThreshold,
              canvasRef.current,
              (res) => {
                if (!res) return;
                try {
                  if (textRef.current === undefined || textRef.current === null)
                    return;
                  textRef.current.innerHTML += res;
                } catch (e) {
                  console.log("error - subtitle", e);
                }
              }
            );
          }}
        />

        <canvas
          width={model.inputShape[1]}
          height={model.inputShape[2]}
          style={{ zIndex: 10 }}
          ref={canvasRef}
        />
      </div>
      <div
        ref={textRef}
        style={{
          position: "fixed",
          zIndex: 99999999999,
          color: "white",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
          overflowWrap: "break-word",
          wordWrap: "break-word",
          hyphens: "auto",
        }}
      />

      <video id="localVideo" ref={localVideo} autoPlay muted />
      <div className="video-control">
        <ActionButton
          key="btnVideo"
          icon={faVideo}
          disabled={!video}
          onClick={() => toggleMediaDevice("Video")}
        />
        <ActionButton
          key="btnAudio"
          icon={faMicrophone}
          disabled={!audio}
          onClick={() => toggleMediaDevice("Audio")}
        />
        <ActionButton
          className="hangup"
          icon={faPhone}
          onClick={() => endCall(true)}
        />
      </div>
    </div>
  );
}

CallWindow.propTypes = {
  status: PropTypes.string.isRequired,
  localSrc: PropTypes.object, // eslint-disable-line
  peerSrc: PropTypes.object, // eslint-disable-line
  config: PropTypes.shape({
    audio: PropTypes.bool.isRequired,
    video: PropTypes.bool.isRequired,
  }).isRequired,
  mediaDevice: PropTypes.object, // eslint-disable-line
  endCall: PropTypes.func.isRequired,
  model: PropTypes.object,
};

export default CallWindow;
