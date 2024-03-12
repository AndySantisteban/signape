import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // set backend to webgl
import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import ClipLoader from "react-spinners/GridLoader";
import Logo from "../assets/logo-2.png";
import USS from "../assets/uss.png";
import { PeerConnection, socket } from "./communication";
import Modal from "./components/CallModal";
import Call from "./components/CallWindow";
import Main from "./components/MainWindow";

const useLocalStorage = (storageKey, fallbackState) => {
  const [value, setValue] = React.useState(
    JSON.parse(localStorage.getItem(storageKey)) ?? fallbackState
  );

  React.useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }, [value, storageKey]);

  return [value, setValue];
};

const App = () => {
  const [isOpen, setOpen] = useLocalStorage("is-loaded", false);
  const [callWindow, setCallWindow] = useState("");
  const [callModal, setCallModal] = useState("");
  const [callFrom, setCallFrom] = useState("");
  const [localSrc, setLocalSrc] = useState(null);
  const [peerSrc, setPeerSrc] = useState(null);
  const pcRef = useRef({});
  const configRef = useRef(null);

  const [loading, setLoading] = useState({ loading: true, progress: 0 });
  const [model, setModel] = useState({
    net: null,
    inputShape: [1, 0, 0, 3],
  });

  const modelName = "best3";
  const MODEL_NAME = "my-model";

  useEffect(() => {
    tf.ready().then(async () => {
      let yolov5;
      if (isOpen) {
        yolov5 = await tf.loadGraphModel("indexeddb://my-model");
        console.log("Modelo cargado desde IndexedDB");
      } else {
        yolov5 = await tf.loadGraphModel(
          `/models/${modelName}_web_model/model.json`,
          {
            onProgress: (fractions) => {
              setLoading({ loading: true, progress: fractions });
            },
          }
        );

        await yolov5.save("indexeddb://my-model");
        console.log("Modelo guardado en IndexedDB");
        setOpen(true);
      }

      const dummyInput = tf.ones(yolov5.inputs[0].shape);
      const warmupResult = await yolov5.executeAsync(dummyInput);
      tf.dispose(warmupResult);
      tf.dispose(dummyInput);

      setLoading({ loading: false, progress: 1 });
      setModel({
        net: yolov5,
        inputShape: yolov5.inputs[0].shape,
      });
    });
  }, []);

  useEffect(() => {
    socket
      .on("request", ({ from: callFrom }) => {
        setCallModal("active");
        setCallFrom(callFrom);
      })
      .on("call", (data) => {
        if (data.sdp) {
          pcRef.current.setRemoteDescription(data.sdp);
          if (data.sdp.type === "offer") pcRef.current.createAnswer();
        } else pcRef.current.addIceCandidate(data.candidate);
      })
      .on("end", () => endCall(false))
      .emit("init");

    return () => {
      socket.off("request");
      socket.off("call");
      socket.off("end");
    };
  }, []);

  /**
   * The function starts a peer connection with a friend and sets the local and peer streams based on
   * whether the user is the caller or not.
   * @param isCaller - A boolean value indicating whether the current user is the caller or not.
   * @param friendID - The ID of the friend or peer that the user wants to establish a connection with.
   * @param config - The `config` parameter is an object that contains configuration options for the
   * PeerConnection. It is passed to the `startCall` function and then stored in a `configRef` for
   * later use. The specific properties and values of the `config` object are not shown in the code
   * snippet provided.
   */
  const startCall = (isCaller, friendID, config) => {
    configRef.current = config;
    const pc = new PeerConnection(friendID)
      .on("localStream", (src) => {
        const newState = { callWindow: "active", localSrc: src };
        if (!isCaller) newState.callModal = "";
        setCallWindow(newState.callWindow);
        setLocalSrc(newState.localSrc);
        if (!isCaller) setCallModal(newState.callModal);
      })
      .on("peerStream", (src) => setPeerSrc(src))
      .start(isCaller);

    pcRef.current = pc;
  };

  /**
   * The function `rejectCall` emits an "end" event to a socket and sets a call modal to an empty
   * string.
   */
  const rejectCall = () => {
    socket.emit("end", { to: callFrom });
    setCallModal("");
  };

  /**
   * The function "endCall" stops a video call and resets various states and references.
   * @param isStarter - isStarter is a boolean parameter that indicates whether the current user is the
   * one who initiated the call or not. It is used in the function to stop the peer connection and
   * reset some state variables when the call ends.
   */
  const endCall = (isStarter) => {
    if (_.isFunction(pcRef.current.stop)) {
      pcRef.current.stop(isStarter);
    }
    pcRef.current = {};
    configRef.current = null;
    setCallWindow("");
    setCallModal("");
    setLocalSrc(null);
    setPeerSrc(null);
  };

  return (
    <div className="bg-white">
      {loading.loading && (
        <div className="bg-light position-fixed vh-100 vw-100">
          <div className="position-absolute top-50 start-50 translate-middle">
            <ClipLoader
              color={"#121212"}
              loading={loading.loading}
              cssOverride={{
                display: "block",
                margin: "0 auto",
                borderColor: "#121212",
              }}
              size={15}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
            {loading.loading
              ? `Cargando modelo para web... ${loading.progress.toFixed(2)}`
              : "Modelo cargado"}
          </div>
        </div>
      )}

      <nav className="navbar bg-light shadow-sm">
        <div className="container">
          <div className="d-flex  align-items-center gap-3" href="#">
            <div className="d-flex align-items-center">
              <img src={Logo} alt="icon" width={"80px"} />
              <h2 className="text-decoration-none text-dark fw-bold mb-0">
                SignApe
              </h2>
            </div>
          </div>
          <div>
            <img src={USS} loading="lazy" width={"80px"} />
          </div>
        </div>
      </nav>
      <Main startCall={startCall} />
      {!_.isEmpty(configRef.current) && (
        <Call
          status={callWindow}
          localSrc={localSrc}
          peerSrc={peerSrc}
          config={configRef.current}
          mediaDevice={pcRef.current.mediaDevice}
          endCall={endCall}
          onPlay={() => {}}
          model={model}
        />
      )}
      <Modal
        status={callModal}
        startCall={startCall}
        rejectCall={rejectCall}
        callFrom={callFrom}
      />
    </div>
  );
};

export default App;
