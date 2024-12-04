import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Peer from "simple-peer";
import socket from './socketInstance.js';
import Button from '@mui/material/Button';
import MicOffIcon from '@mui/icons-material/MicOff';
import MicIcon from '@mui/icons-material/Mic';
import IconButton from '@mui/material/IconButton';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import "../css/videoCall.css";
import "../css/callNotification.css";

export const VideoCall = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const name = params.get('callerName');
  const idToCall = params.get('ownerId');
  const callerId = params.get('callerId');
  const user = JSON.parse(localStorage.getItem('client'));

  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [isInitiator, setIsInitiator] = useState(!!idToCall);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    if (location.pathname.startsWith("/videoCall")) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        setStream(stream);
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
      });
    }

    socket.on("me", (id) => setMe(id));
    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });

    socket.on("endCall", (data) => {
        setCallEnded(true);
        endCall();
    })

  }, [location.pathname]);

  const callUser = () => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: idToCall,
        signalData: data,
        from: callerId,
        name: name,
      });
    });

    setCallEnded(false);

    peer.on("stream", (remoteStream) => {
		  console.log("call")
      userVideo.current.srcObject = remoteStream;
    });

    socket.on("callAccepted", (data) => {
      setCallAccepted(true);
      peer.signal(data.signal);
    });

    connectionRef.current = peer;

    socket.on("endCall", (data) => {
        setCallEnded(true);
        endCall();

    })
  };

  // Call user if idToCall is present (initiator)
	useEffect(() => {
		if (isInitiator && idToCall && location.pathname.startsWith("/videoCall")) {
			console.log("calling owner");
			callUser();
		}
	}, [isInitiator, idToCall, location.pathname]);

  const answerCall = () => {
    setCallAccepted(true);
    setCallEnded(false);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });

    peer.on("stream", (remoteStream) => {
      userVideo.current.srcObject = remoteStream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
    navigate('/videoCall');

    socket.on("endCall", (data) => {

        setCallEnded(true);
        endCall();

    })
  };

  const leaveCall = () => {
    setCallEnded(true);
    if(user._id === idToCall)
    {
      socket.emit("endCall", {
        to: callerId,
      });
    }
    else
    {
      socket.emit("endCall", {
        to: idToCall,
      });
    }
    endCall();
  };

  const endCall = () => {
    if(callAccepted === true)
    {
      connectionRef.current.destroy();
    }
    navigate('/home');
  }

  const rejectCall = () => {
    setCallEnded(true);
  }

  // Toggle video
  const toggleVideo = () => {
    const videoTrack = stream.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
    setIsVideoOn(videoTrack.enabled);
    if(user._id === idToCall)
    {
      socket.emit("toggleVideo", { to: callerId, isVideoOn: videoTrack.enabled });
    }
    else
    {
      socket.emit("toggleVideo", { to: idToCall, isVideoOn: videoTrack.enabled });
    }
    
  };

  // Toggle microphone
  const toggleMic = () => {
	const audioTrack = stream.getAudioTracks()[0];
	audioTrack.enabled = !audioTrack.enabled;
	setIsMicOn(audioTrack.enabled);
  if(user._id === idToCall)
  {
    socket.emit("toggleMic", { to: callerId, isMicOn: audioTrack.enabled });
  }
  else
  {
    socket.emit("toggleMic", { to: idToCall, isMicOn: audioTrack.enabled });
  }
	
  };
  

  // Listen for video toggle from peer
  useEffect(() => {
    socket.on("peerVideoToggle", ({ isVideoOn }) => {
      if (userVideo.current && userVideo.current.srcObject) {
        const videoTrack = userVideo.current.srcObject.getVideoTracks()[0]; // Get the video track
  
        if (videoTrack) {
          videoTrack.enabled = isVideoOn; // Enable or disable the video track
        }
      }
    });

    return () => socket.off("peerVideoToggle");
  }, [stream]);

  useEffect(() => {
    socket.on("peerMicToggle", ({ isMicOn }) => {
      if (userVideo.current && userVideo.current.srcObject) {
        const audioTrack = userVideo.current.srcObject.getAudioTracks()[0]; // Get the video track
  
        if (audioTrack) {
          audioTrack.enabled = isMicOn; // Enable or disable the video track
        }
      }
    });

    return () => socket.off("peerVideoToggle");
  }, [stream]);

  return (
    <>
      {receivingCall && !callAccepted ? (
        <div className='notification-overlay'>
          <div className='notification-popup'>
            <h1>{name} is calling...</h1>
            <button onClick={answerCall}>Accept</button>
            <button onClick={rejectCall}>Reject</button>
          </div>
        </div>
      ) : null}

      {location.pathname.startsWith("/videoCall") && (
        <div className="video-call">
            <div className="container">
              <div className="video-container">
                <div className="video">
                  {stream && <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />}
                </div>
                <div className="video">
                  {callAccepted && !callEnded && (
                  <video playsInline ref={userVideo} autoPlay style={{ width: "300px" }} />
                  )}
                </div>
              </div>

              <div className="controls">
                <IconButton onClick={toggleVideo} color={isVideoOn ? "primary" : "secondary"}>
                  {isVideoOn ? <VideocamIcon /> : <VideocamOffIcon />}
                </IconButton>
                <IconButton onClick={toggleMic} color={isMicOn ? "primary" : "secondary"}>
                  {isMicOn ? <MicIcon /> : <MicOffIcon />}
                </IconButton>
                <Button variant="contained" color="secondary" onClick={leaveCall}>
                  End Call
                </Button>
              </div>
            </div>
        </div>
      )}
    </>
  );
};
