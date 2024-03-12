/* eslint-disable jsx-a11y/media-has-caption */
import {
  faBackspace,
  faEraser,
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
  let undefinedCount = 0;
  const MAX_UNDEFINED_COUNT = 3;

  const handleKeyDown = (event) => {
    if (
      event.key === " " &&
      event.target.tagName !== "INPUT" &&
      event.target.tagName !== "TEXTAREA"
    ) {
      // Si la tecla presionada es la tecla de espacio y el foco no está en un input o textarea
      event.preventDefault(); // Evitar la acción predeterminada (como hacer clic en un botón)
      if (!textRef?.current) return;
      if (!textRef?.current?.innerText?.length === 0) return;
      textRef.current.innerHTML += " ";
    }
  };

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

  // Agregar el controlador de eventos al evento keydown de la ventana
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    // Limpiar el efecto cuando el componente se desmonta
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // Se ejecutará solo una vez al montar el componente

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
            if (!peerVideo?.current) return;

            detectVideo(
              peerVideo.current,
              model,
              classThreshold,
              canvasRef.current,
              (res) => {
                if (!res) {
                  undefinedCount++;
                  if (undefinedCount > MAX_UNDEFINED_COUNT) {
                    undefinedCount = 0;
                  }
                  return;
                }

                undefinedCount = 0;

                try {
                  if (textRef.current === undefined || textRef.current === null)
                    return;
                  const innerText = textRef.current.innerText;
                  const lastChar = innerText[innerText.length - 1];

                  if (res !== lastChar) {
                    textRef.current.innerHTML += res;
                  }
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
          style={{ zIndex: -1 }}
          ref={canvasRef}
        />
        <div
          ref={textRef}
          style={{
            position: "absolute",
            zIndex: 99999,
            color: "white",
            bottom: "20%",
            left: 0,
            right: 0,
            fontSize: 25,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#00000080",
            overflowWrap: "break-word",
            wordWrap: "break-word",
            hyphens: "auto",
          }}
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
          key="btnClear"
          icon={faEraser}
          disabled={!audio}
          onClick={() => {
            if (textRef.current !== undefined && textRef.current !== null) {
              const innerText = textRef.current.innerText;
              const newText = innerText.slice(0, -1); // Elimina el último carácter
              textRef.current.innerHTML = newText;
            }
          }}
        />
        <ActionButton
          key="btnClear"
          icon={faBackspace}
          disabled={!audio}
          onClick={() => {
            if (textRef.current !== undefined && textRef.current !== null) {
              const innerText = textRef.current.innerText;
              const words = innerText.trim().split(/\s+/);

              // Eliminar la última palabra
              words.pop();

              // Actualizar el contenido con las palabras restantes
              textRef.current.innerHTML = words.join(" ");
            }
          }}
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
