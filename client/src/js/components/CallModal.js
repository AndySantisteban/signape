import { faPhone, faVideo } from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ActionButton from './ActionButton';

function CallModal({ status, callFrom, startCall, rejectCall }) {
  const acceptWithVideo = (video) => {
    const config = { audio: true, video };
    return () => startCall(false, callFrom, config);
  };

  return (
    <div className={classnames('call-modal', status)}>
      <p>
        <span className="caller">{`${callFrom}, te está llamando`}</span>
      </p>
      <ActionButton
        icon={faVideo}
        onClick={acceptWithVideo(true)}
      />
      <ActionButton
        icon={faPhone}
        onClick={acceptWithVideo(false)}
      />
      <ActionButton
        className="hangup"
        icon={faPhone}
        onClick={rejectCall}
      />
    </div>
  );
}

CallModal.propTypes = {
  status: PropTypes.string.isRequired,
  callFrom: PropTypes.string.isRequired,
  startCall: PropTypes.func.isRequired,
  rejectCall: PropTypes.func.isRequired
};

export default CallModal;
