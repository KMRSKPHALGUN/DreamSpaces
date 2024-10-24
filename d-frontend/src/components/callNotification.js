import { useState, useEffect } from 'react';


const CallNotification = () => {
  const localhost = '10.0.49.88';
  const [incomingCall, setIncomingCall] = useState(null); // Call details
  const [roomId, setRoomId] = useState(null);
  const [ws, setWs] = useState(null); // WebSocket instance
  const user = JSON.parse(localStorage.getItem('client'));


  useEffect(() => {
    const webSocket = new WebSocket(`ws://${localhost}:5001`);
    setWs(webSocket);

    webSocket.onopen = () => {
      console.log("WebSocket connection established.");
    };

    webSocket.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.type === 'incoming_call' && data.ownerId === user._id) {
        setIncomingCall({
          callerId: data.callerId,
          callerName: data.callerName,
        });
        setRoomId(data.roomId);
      }
    };

    webSocket.onclose = (event) => {
      console.log("WebSocket closed: ", event);
    };

    webSocket.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };

    return () => {
      webSocket.close();
    };
  }, []);

  const handleCallResponse = (accept) => {
    if (ws && incomingCall) {
      if (accept) {
        // Navigate to the video call page
        window.location.href = `/videoCallReceiver?roomId=${roomId}&ownerId=${user._id}&callerId=${incomingCall.callerId}&callerName=${incomingCall.callerName}`;
      } else {
        // Send a rejection response
        ws.send(JSON.stringify({
          type: 'call_response',
          response: 'rejected',
          callerId: incomingCall.callerId,
        }));
      }

      setIncomingCall(null); // Hide the notification after response
    }
  };

  return (
    <>
      {incomingCall && (
        <div className='notification-overlay'>
          <div className="notification-popup">
            <p>{incomingCall.callerName} is calling you...</p>
            <button onClick={() => handleCallResponse(true)}>Accept</button>
            <button onClick={() => handleCallResponse(false)}>Reject</button>
          </div>
        </div>
      )}
    </>
  );
};

export default CallNotification;
