import { faPhone, faVideo } from "@fortawesome/free-solid-svg-icons";
import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import ActionButton from "./ActionButton";
/**
 * The function CallModal displays a modal with options to accept or reject a call with or without
 * video.
 * @returns The CallModal component is being returned, which is a functional component that renders a
 * modal with options to accept or reject a call.
 */

function CallModal({ status, callFrom, startCall, rejectCall }) {
  const acceptWithVideo = (video) => {
    const config = { audio: false, video };
    return () => startCall(false, callFrom, config);
  };

  return (
    <div className={classnames("call-modal", status)}>
      <p>
        <span className="caller">{`${callFrom}, te está llamando`}</span>
      </p>
      <ActionButton icon={faVideo} onClick={acceptWithVideo(true)} />
      <ActionButton icon={faPhone} onClick={acceptWithVideo(false)} />
      <ActionButton className="hangup" icon={faPhone} onClick={rejectCall} />
    </div>
  );
}

CallModal.propTypes = {
  status: PropTypes.string.isRequired,
  callFrom: PropTypes.string.isRequired,
  startCall: PropTypes.func.isRequired,
  rejectCall: PropTypes.func.isRequired,
};

export default CallModal;
