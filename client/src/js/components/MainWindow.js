import { faPhone } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import Brand from "../../assets/traductor-brand.png";
import { socket } from "../communication";
import ActionButton from "./ActionButton";

/**
 * This function sets the client ID and updates the document title in a video call application using
 * React and Socket.IO.
 * @returns The `useClientID` function returns the `clientID` state variable, which is initially an
 * empty string but is updated with the ID received from the server through a socket connection in the
 * `useEffect` hook. The `clientID` is also used to set the document title.
 */
function useClientID() {
  const [clientID, setClientID] = useState("");

  useEffect(() => {
    socket.on("init", ({ id }) => {
      document.title = `${id} - Signape`;
      setClientID(id);
    });
  }, []);

  return clientID;
}

/**
 * The MainWindow function returns a component that displays a user's client ID and allows them to
 * enter a friend's ID to initiate a call with or without video.
 * @returns A function is being returned by the `callWithVideo` function.
 */
function MainWindow({ startCall }) {
  const clientID = useClientID();
  const [friendID, setFriendID] = useState(null);

  /**
   * The function returns a callback that starts a call with audio and video if a friend ID is present.
   * @param video - The `video` parameter is a boolean value that determines whether or not video
   * should be included in the call configuration. If `video` is `true`, then video will be included in
   * the call configuration. If `video` is `false`, then video will not be included in the call
   * configuration.
   * @returns A function is being returned.
   */
  const callWithVideo = (video) => {
    const config = { audio: false, video };
    return () => friendID && startCall(true, friendID, config);
  };
  return (
    <div className="main-window  container p-4">
      <div className=" d-flex justify-content-center align-items-center pt-5 flex-wrap ">
        <div className=" card-body p-5 col-md-6 ">
          <div className="text-start">
            <div>
              <h3 className="fw-bold">
                Tu ID de usuario es:
                <span>
                  <br />
                  <input
                    type="text"
                    className="txt-clientId  border-0 text-muted"
                    defaultValue={clientID}
                    readOnly
                  />
                </span>
              </h3>
              <br />
              <h6>
                O Copia el ID de tu amigo aquí:
                <br />
                <span>
                  <br />
                  <input
                    type="text"
                    className="txt-clientId pb-2"
                    spellCheck={false}
                    placeholder="Nombre de usuario"
                    onChange={(event) =>
                      setFriendID(event.target.value?.trim() ?? "")
                    }
                  />
                </span>
              </h6>
            </div>
            <div>
              <div className="text-start">
                <div>
                  <ActionButton icon={faPhone} onClick={callWithVideo(false)} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 " hidden={window.innerWidth < 728}>
          <img src={Brand} width={"100%"} />
        </div>
      </div>
      <div className="text-center mt-5">
        <small>Nicolette Isis Pacheco Contreras y </small> <br />
        <small>Andy Josue Santisteban Ostos</small>
      </div>
    </div>
  );
}

MainWindow.propTypes = {
  startCall: PropTypes.func.isRequired,
};

export default MainWindow;
