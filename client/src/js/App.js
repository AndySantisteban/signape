import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // set backend to webgl
import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import ClipLoader from "react-spinners/GridLoader";
import Logo from "../assets/Screenshot_2.png";
import { PeerConnection, socket } from "./communication";
import CallModal from "./components/CallModal";
import CallWindow from "./components/CallWindow";
import MainWindow from "./components/MainWindow";

const App = () => {
  const [callWindow, setCallWindow] = useState("");
  const [callModal, setCallModal] = useState("");
  const [callFrom, setCallFrom] = useState("");
  const [localSrc, setLocalSrc] = useState(null);
  const [peerSrc, setPeerSrc] = useState(null);
  const pcRef = useRef({});
  const configRef = useRef(null);

  const [loading, setLoading] = useState({ loading: true, progress: 0 });

  /* `const [model, setModel] = useState({ net: null, inputShape: [1, 0, 0, 3] });` is declaring a
  state variable `model` using the `useState` hook. The initial state of `model` is an object with
  two properties: `net` and `inputShape`. `net` is initially set to `null`, while `inputShape` is an
  array with four elements: `[1, 0, 0, 3]`. The `setModel` function can be used to update the state
  of `model` later in the component's lifecycle. */
  const [model, setModel] = useState({
    net: null,
    inputShape: [1, 0, 0, 3],
  });

  /* `const modelName = "best3";` is declaring a constant variable `modelName` and assigning it the
  value `"best3"`. This variable is later used to load a specific pre-trained machine learning model
  in the `useEffect` hook. */
  const modelName = "best3";

  useEffect(() => {
    tf.ready().then(async () => {
      /* This code is loading a pre-trained machine learning model called YOLOv5 using TensorFlow.js.
      The `tf.loadGraphModel()` function is used to load the model from a JSON file located in the
      `/models` directory with a specific file name based on the `modelName` variable. The second
      argument to this function is an options object that includes a callback function `onProgress`
      which is called during the loading process to update the `loading` state with the current
      progress fraction. Once the model is loaded, it is stored in the `yolov5` constant variable. */
      const yolov5 = await tf.loadGraphModel(
        `/models/${modelName}_web_model/model.json`,
        {
          onProgress: (fractions) => {
            setLoading({ loading: true, progress: fractions });
          },
        }
      );

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
          <a className=" " href="#">
            <img src={Logo} alt="icon" width={"100px"} />
          </a>
          <div>
            <small>
              <code className="text-muted">
                - Nicolette Isis Pacheco Contreras
                <br />- Andy Josue Santisteban Ostos
              </code>
            </small>
          </div>
        </div>
      </nav>
      <MainWindow startCall={startCall} />
      {!_.isEmpty(configRef.current) && (
        <CallWindow
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
      <CallModal
        status={callModal}
        startCall={startCall}
        rejectCall={rejectCall}
        callFrom={callFrom}
      />
    </div>
  );
};

export default App;
