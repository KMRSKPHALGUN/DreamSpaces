import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PhoneIcon from '@mui/icons-material/Phone';
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { CopyToClipboard } from "react-copy-to-clipboard";
import Peer from "simple-peer";
import io from "socket.io-client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import socket from './socketInstance.js';
import "../css/videoCall.css";
import "../css/callNotification.css";

export const VideoCall = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const params = new URLSearchParams(location.search);
	const name = params.get('callerName');
	const idToCall = params.get('ownerId');
	const callerId = params.get('callerId');
	const [ me, setMe ] = useState("")
	const [ stream, setStream ] = useState()
	const [ receivingCall, setReceivingCall ] = useState(false)
	const [ caller, setCaller ] = useState("")
	const [isInitiator, setIsInitiator] = useState(!!idToCall);
	const [ callerName, setCallerName ] = useState("")
	const [ callerSignal, setCallerSignal ] = useState()
	const [ callAccepted, setCallAccepted ] = useState(false)
	// const [ idToCall, setIdToCall ] = useState("")
	const [ callEnded, setCallEnded] = useState(true)
	// const [ name, setName ] = useState("")
	const myVideo = useRef()
	const userVideo = useRef()
	const connectionRef= useRef()

	useEffect(() => {
		if(location.pathname.startsWith("/videoCall"))
		{
			navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
				setStream(stream)
				if(myVideo.current)
				{
					myVideo.current.srcObject = stream
				}
			});
		}

		socket.on("me", (id) => {
			setMe(id);
			console.log(me);
		});

		socket.on("callUser", (data) => {
			setReceivingCall(true)
			setCaller(data.from)
			setCallerName(data.name)
			setCallerSignal(data.signal)
		})
	}, [])

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
			setCallEnded(false);
		});
		peer.on("stream", (stream) => {
			userVideo.current.srcObject = stream;
		});
		socket.on("callAccepted", (data) => {
			console.log("Call Accepted");
			setCallAccepted(true);
			console.log("Signalling Peer");
			console.log(data.signal);
			peer.signal(data.signal);
			console.log("Completed");
		});
		connectionRef.current = peer;
	};

	// Call user if idToCall is present (initiator)
	useEffect(() => {
		if (isInitiator && idToCall && location.pathname.startsWith("/videoCall")) {
			console.log("calling owner");
			callUser();
		}
	}, [isInitiator, idToCall, location.pathname]);

	const answerCall =() =>  {
		setCallAccepted(true)
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream: stream
		})
		peer.on("signal", (data) => {
			socket.emit("answerCall", { signal: data, to: caller })
		})
		peer.on("stream", (stream) => {
			userVideo.current.srcObject = stream
		})

		console.log(callerSignal)
		peer.signal(callerSignal)
		connectionRef.current = peer
		navigate('/videoCall');
	}

	const leaveCall = () => {
		setCallEnded(true);
		connectionRef.current.destroy();
		userVideo.current.destroy();
		navigate(-1);
	}

	return (
		<>
			{/* Call notification visible on all pages */}
			<button className="back-button" onClick={() => leaveCall()}><FontAwesomeIcon icon={faArrowLeft}/></button>
			{receivingCall && !callAccepted ? (
				<div className='notification-overlay'>
					<div className='notification-popup'>
						<h1 >{name} is calling...</h1>
						<button onClick={() => {answerCall(); }}>Accept</button>
            			<button>Reject</button>
					</div>
				</div>
			) : null}

			{/* Only show video call UI on the designated route (e.g., /videoCallReceiver) */}
			{location.pathname.startsWith("/videoCall") && (
				<>
					<div className="video-call">
						<div className="container">
							<div className="video-container">
								<div className="video">
									{stream &&  <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />}
								</div>
								<div className="video">
									{callAccepted && !callEnded ?
									<video playsInline ref={userVideo} autoPlay style={{ width: "300px"}} />:
									null}
								</div>
							</div>
							<div className="myId">
								<div className="call-button">
									{!callEnded && (
										<Button variant="contained" color="secondary" onClick={leaveCall}>
											End Call
										</Button>
									)}
								</div>
							</div>
						</div>
					</div>
				</>
			)}
    	</>
	)
}
