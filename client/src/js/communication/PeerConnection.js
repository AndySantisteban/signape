import Emitter from "./Emitter";
import MediaDevice from "./MediaDevice";
import socket from "./socket";

const PC_CONFIG = { iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }] };

class PeerConnection extends Emitter {
  /**
   * This is a constructor function that creates a new RTCPeerConnection and sets up event listeners
   * for ice candidates and incoming tracks, as well as a media device and a friend ID.
   * @param friendID - The friendID parameter is a unique identifier for the friend or peer that this
   * RTCPeerConnection object is being created for. It is used to establish a connection between two
   * peers in a WebRTC application.
   */
  constructor(friendID) {
    super();
    this.pc = new RTCPeerConnection(PC_CONFIG);
    this.pc.onicecandidate = (event) =>
      socket.emit("call", {
        to: this.friendID,
        candidate: event.candidate,
      });
    this.pc.ontrack = (event) => this.emit("peerStream", event.streams[0]);

    this.mediaDevice = new MediaDevice();
    this.friendID = friendID;
  }

  /**
   * The function starts the media device and adds its tracks to the peer connection, emits a local
   * stream event, and either sends a request to the friend or creates an offer depending on whether
   * the user is the caller.
   * @param isCaller - A boolean value indicating whether the current user is the one initiating the
   * call (true) or receiving the call (false).
   * @returns The `this` object is being returned.
   */
  start(isCaller) {
    this.mediaDevice
      .on("stream", (stream) => {
        stream.getTracks().forEach((track) => {
          this.pc.addTrack(track, stream);
        });
        this.emit("localStream", stream);
        if (isCaller) socket.emit("request", { to: this.friendID });
        else this.createOffer();
      })
      .start();

    return this;
  }

  /**
   * The function stops the media device and closes the peer connection, and emits an "end" event if it
   * is the starter.
   * @param isStarter - A boolean value indicating whether the current user is the one who initiated
   * the call. If true, the "end" event will be emitted to the friendID (the person being called) to
   * notify them that the call has ended.
   * @returns The "stop" method is returning the current instance of the object.
   */
  stop(isStarter) {
    if (isStarter) {
      socket.emit("end", { to: this.friendID });
    }
    this.mediaDevice.stop();
    this.pc.close();
    this.pc = null;
    this.off();
    return this;
  }

  /**
   * The function creates an offer using a peer connection and returns the object.
   * @returns The object that the `createOffer()` method is being called on (`this`) is being returned.
   */
  createOffer() {
    this.pc
      .createOffer()
      .then(this.getDescription.bind(this))
      .catch((err) => console.log(err));
    return this;
  }

  /**
   * This function creates an answer for a peer connection and calls the getDescription function to set
   * the local description.
   * @returns The object that the `createAnswer()` method is being called on (`this`) is being
   * returned.
   */
  createAnswer() {
    this.pc
      .createAnswer()
      .then(this.getDescription.bind(this))
      .catch((err) => console.log(err));
    return this;
  }

  /**
   * This function sets the local description and emits a call event with the friend ID and SDP.
   * @param desc - `desc` is a parameter that represents a session description protocol (SDP) object.
   * It contains information about the local media stream, such as the codecs and transport protocols
   * to be used, and is used to negotiate the connection between two peers in a WebRTC call. The
   * `setDescription()` method sets
   * @returns The object that the method is being called on (i.e. `this`).
   */
  getDescription(desc) {
    this.pc.setLocalDescription(desc);
    socket.emit("call", { to: this.friendID, sdp: desc });
    return this;
  }

  /**
   * This function sets the remote description for a WebRTC peer connection.
   * @param sdp - sdp stands for Session Description Protocol. It is a text-based format used to
   * describe multimedia communication sessions, such as video or audio calls, over the internet. In
   * this code snippet, the sdp parameter is passed to the setRemoteDescription() method of a WebRTC
   * PeerConnection object to set the
   * @returns The object that the `setRemoteDescription` method is a part of is being returned.
   */
  setRemoteDescription(sdp) {
    const rtcSdp = new RTCSessionDescription(sdp);
    this.pc.setRemoteDescription(rtcSdp);
    return this;
  }

  /**
   * This function adds an ICE candidate to a WebRTC peer connection.
   * @param candidate - The parameter "candidate" is an object that represents a candidate for
   * establishing a WebRTC connection. It contains information about the network address and port of a
   * potential peer, as well as other details such as the transport protocol and priority. The
   * addIceCandidate() method takes this candidate object and adds it to
   * @returns The object that the `addIceCandidate` method is a part of is being returned.
   */
  /**
   * This function adds an ICE candidate to a WebRTC peer connection.
   * @param candidate - The parameter "candidate" is an object that represents a candidate for
   * establishing a WebRTC connection. It contains information about the network address and port of a
   * potential peer, as well as other details such as the transport protocol and priority. This method
   * creates a new RTCIceCandidate object from the candidate parameter and
   * @returns The object that the `addIceCandidate` method is a part of is being returned.
   */
  addIceCandidate(candidate) {
    if (candidate) {
      const iceCandidate = new RTCIceCandidate(candidate);
      this.pc.addIceCandidate(iceCandidate);
    }
    return this;
  }
}

export default PeerConnection;
