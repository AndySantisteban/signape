import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import Logo from '../assets/Screenshot_2.png';
import { PeerConnection, socket } from './communication';
import CallModal from './components/CallModal';
import CallWindow from './components/CallWindow';
import MainWindow from './components/MainWindow';

const App = () => {
  const [callWindow, setCallWindow] = useState('');
  const [callModal, setCallModal] = useState('');
  const [callFrom, setCallFrom] = useState('');
  const [localSrc, setLocalSrc] = useState(null);
  const [peerSrc, setPeerSrc] = useState(null);
  const pcRef = useRef({});
  const configRef = useRef(null);

  useEffect(() => {
    socket
      .on('request', ({ from: callFrom }) => {
        setCallModal('active');
        setCallFrom(callFrom);
      })
      .on('call', (data) => {
        if (data.sdp) {
          pcRef.current.setRemoteDescription(data.sdp);
          if (data.sdp.type === 'offer') pcRef.current.createAnswer();
        } else pcRef.current.addIceCandidate(data.candidate);
      })
      .on('end', () => endCall(false))
      .emit('init');

    return () => {
      socket.off('request');
      socket.off('call');
      socket.off('end');
    };
  }, []);

  const startCall = (isCaller, friendID, config) => {
    configRef.current = config;
    const pc = new PeerConnection(friendID)
      .on('localStream', (src) => {
        const newState = { callWindow: 'active', localSrc: src };
        if (!isCaller) newState.callModal = '';
        setCallWindow(newState.callWindow);
        setLocalSrc(newState.localSrc);
        if (!isCaller) setCallModal(newState.callModal);
      })
      .on('peerStream', (src) => setPeerSrc(src))
      .start(isCaller);

    pcRef.current = pc;
  };

  const rejectCall = () => {
    socket.emit('end', { to: callFrom });
    setCallModal('');
  };

  const endCall = (isStarter) => {
    if (_.isFunction(pcRef.current.stop)) {
      pcRef.current.stop(isStarter);
    }
    pcRef.current = {};
    configRef.current = null;
    setCallWindow('');
    setCallModal('');
    setLocalSrc(null);
    setPeerSrc(null);
  };

  return (
    <div className='bg-white'>
      <nav className="navbar bg-light shadow-sm">
        <div className="container">
          <a className=" " href="#">
            <img src={Logo} alt="icon" width={"100px"} />
          </a>
          <div><small>
          <code className="text-muted">
            - Nicolette Isis Pacheco Contreras
            <br/>
            - Andy Josue Santisteban Ostos
          </code>
        </small></div>
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
