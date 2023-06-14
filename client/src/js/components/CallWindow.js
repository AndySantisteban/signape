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
  const [video, setVideo] = useState(config.video);
  const [audio, setAudio] = useState(config.audio);
  const classThreshold = 0.2;

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
   * Turn on/off a media device
   * @param {'Audio' | 'Video'} deviceType - Type of the device eg: Video, Audio
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
              canvasRef.current
            );
          }}
        />

        <canvas
          width={model.inputShape[1]}
          height={model.inputShape[2]}
          style={{zIndex: 10}}
          ref={canvasRef}
        />
      </div>

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
