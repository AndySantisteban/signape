import { faPhone, faVideo } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { socket } from "../communication";
import ActionButton from "./ActionButton";

function useClientID() {
  const [clientID, setClientID] = useState("");

  useEffect(() => {
    socket.on("init", ({ id }) => {
      document.title = `${id} - VideoCall`;
      setClientID(id);
    });
  }, []);

  return clientID;
}

function MainWindow({ startCall }) {
  const clientID = useClientID();
  const [friendID, setFriendID] = useState(null);

  /**
   * Start the call with or without video
   * @param {Boolean} video
   */
  const callWithVideo = (video) => {
    const config = { audio: true, video };
    return () => friendID && startCall(true, friendID, config);
  };

  return (
    <div className="main-window  container p-4">
      <div className=" card-body p-5">
        <div className="text-center">
          <div>
            <h3 className='fw-bold'>
              Tu nombre de usuario es:
              <span>
                <br/>
                <input
                  type="text"
                  className="txt-clientId"
                  defaultValue={clientID}
                  readOnly
                />
              </span>
            </h3>
            <h5>
              O Copia el ID de tu amigo aquí:
              <span> {" "}
              <br/>
                <input
                  type="text"
                  className="txt-clientId"
                  spellCheck={false}
                  placeholder="Nombre de usuario"
                  onChange={(event) => setFriendID(event.target.value)}
                />
              </span>
            </h5>
          </div>
          <div>

            <div className="text-center">
              <div>
                <ActionButton icon={faVideo} onClick={callWithVideo(true)} />
                <ActionButton icon={faPhone} onClick={callWithVideo(false)} />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

MainWindow.propTypes = {
  startCall: PropTypes.func.isRequired,
};

export default MainWindow;
