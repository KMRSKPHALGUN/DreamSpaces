import React, { useEffect, useRef, useState } from 'react';
import SimplePeer from 'simple-peer';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const VideoCallReceiver = () => {
  const localhost = '10.0.49.88';
  const location = useLocation();
  let navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const roomId = params.get('roomId'); // property ID is used as roomId
  const ownerId = params.get('ownerId');
  const callerName = params.get('callerName');
  const callerId = params.get('callerId');

  const [stream, setStream] = useState(null);
  const [peer, setPeer] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callRejected, setCallRejected] = useState(false);

  const userVideo = useRef(null);
  const peerVideo = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    // Access user's media (camera/microphone)
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setStream(stream);
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });

    // Set up WebSocket connection
    const webSocket = new WebSocket(`ws://${localhost}:5001`);
    socket.current = webSocket;

    webSocket.onopen = () => {
      console.log("WebSocket connection established.");
    };

    webSocket.onmessage = (message) => {
      const data = JSON.parse(message.data);

      // Handle incoming call request
      if (data.type === 'call_request' && data.ownerId === ownerId) {
        console.log(`${data.callerName} is calling...`);

        // For now, let's automatically accept the call
        acceptCall(data.callerId);
      }

      // Handle WebRTC signaling
      if (data.type === 'signal') {
        if (peer) {
          peer.signal(data.signal);
        } else {
          addPeer(data.signal, stream);
        }
      }
    };

    webSocket.onclose = () => {
      console.log("WebSocket closed.");
    };

    return () => {
      webSocket.close();
    };
  }, [ownerId]);

  // Accept the call by signaling back to the caller
  const acceptCall = (callerId) => {
    socket.current.send(JSON.stringify({
      type: 'call_response',
      response: 'accepted',
      callerId,
    }));
    setCallAccepted(true);
    createPeer(callerId, stream);
  };

  // Create a peer for the owner
  const createPeer = (callerId, stream) => {
    const peer = new SimplePeer({
      initiator: false, // owner is the receiver, so initiator is false
      trickle: false,
      stream: stream
    });

    peer.on('signal', (signal) => {
      socket.current.send(JSON.stringify({
        type: 'signal',
        signal,
        to: callerId,
        roomId
      }));
    });

    peer.on('stream', (remoteStream) => {
      if (peerVideo.current) {
        peerVideo.current.srcObject = remoteStream;
      }
    });

    setPeer(peer);
  };

  // Add peer for receiving signal from the caller
  const addPeer = (incomingSignal, stream) => {
    const peer = new SimplePeer({
      initiator: false, // owner is the receiver
      trickle: false,
      stream: stream
    });

    peer.on('signal', (signal) => {
      socket.current.send(JSON.stringify({
        type: 'signal',
        signal,
        roomId
      }));
    });

    peer.on('stream', (remoteStream) => {
      if (peerVideo.current) {
        peerVideo.current.srcObject = remoteStream;
      }
    });

    peer.signal(incomingSignal);
    setPeer(peer);
  };

  return (
    <>
      <button className="back-button" onClick={() => navigate(-1)}><FontAwesomeIcon icon={faArrowLeft}/></button>
      <div>
        <video muted ref={userVideo} autoPlay playsInline style={{ width: '300px' }} />
        <video ref={peerVideo} autoPlay playsInline style={{ width: '300px' }} />
      </div>

      <div>
        {callRejected ? (
          <p>You rejected the call.</p>
        ) : callAccepted ? (
          <p>Connected to the call.</p>
        ) : (
          <p>Waiting for the caller to connect...</p>
        )}
      </div>
    </>
  );
};

export default VideoCallReceiver;
