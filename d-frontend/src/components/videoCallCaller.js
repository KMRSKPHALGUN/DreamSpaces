import React, { useEffect, useRef, useState } from 'react';
import SimplePeer from 'simple-peer';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const VideoCallCaller = () => {
  const localhost = '10.0.49.88';
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const roomId = params.get('roomId'); // property ID is used as roomId
  const ownerId = params.get('ownerId');
  const callerName = params.get('callerName');
  const callerId = params.get('callerId');
  const navigate = useNavigate();

  const [stream, setStream] = useState(null);
  const [peer, setPeer] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callRejected, setCallRejected] = useState(false);

  const userVideo = useRef(null);
  const peerVideo = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    console.log(callAccepted);
    console.log(callRejected);
  }, [callAccepted, callRejected]);


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
      if (callerId && ownerId) {
        webSocket.send(JSON.stringify({
          type: 'call_request',
          roomId: roomId,
          ownerId: ownerId,
          callerName: callerName,
          callerId: callerId,
        }));
      }
    };

    webSocket.onmessage = (message) => {
      const data = JSON.parse(message.data);

      // Call response handling
      if(data.type === 'call_response') {
        if(data.response === 'accepted') {
          setCallAccepted(true);
          createPeer(data.ownerId, stream);
        } else {
          setCallRejected(true);
        }
      }

      // Signaling for WebRTC
      if (data.type === 'signal') {
        peer.signal(data.signal);
      }
    };

    webSocket.onclose = () => {
      console.log("WebSocket closed.");
    };

    return () => {
      webSocket.close();
    };
  }, [callerId, ownerId, roomId, callerName]);

  // Create peer and signal owner
  const createPeer = (ownerId, stream) => {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream: stream
    });

    peer.on('signal', (signal) => {
      socket.current.send(JSON.stringify({
        type: 'signal',
        signal,
        to: ownerId,
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

  const addPeer = (incomingSignal, stream) => {
    const peer = new SimplePeer({
      initiator: false,
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
        <p>Your call was rejected by the owner.</p>
      ) : callAccepted ? (
        <div>
          <p>Call accepted. Connecting...</p>
        </div>
      ) : (
        <p>Waiting for the owner to respond...</p>
      )}
      </div>
    </>
  );
};

export default VideoCallCaller;
