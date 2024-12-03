import { useState, useEffect } from 'react';
import { useWebSocket } from './websocketContext';

const CallNotification = () => {
  const localhost = localStorage.getItem('localhost');
  const [incomingCall, setIncomingCall] = useState(null); // Call details
  const [roomId, setRoomId] = useState(null);
  const { socket: webSocket, isConnected } = useWebSocket(); // Get both socket and connection status
  const user = JSON.parse(localStorage.getItem('client'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (isConnected && token) {
      // Only set handlers if the WebSocket is connected
      webSocket.onmessage = (message) => {
        console.log("Connection Established");
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

      // Send initialization message with user ID
      webSocket.send(JSON.stringify({
        type: 'initialize',
        userId: user._id,
      }));

      return () => {
        webSocket.close(); // Cleanup on unmount
      };
    }
  }, [isConnected, token, webSocket, user]);

  if (!isConnected) {
    console.log("WebSocket not yet connected");
    return null; // or some fallback
  }

  const handleCallResponse = (accept) => {
    if (webSocket && incomingCall) {
      if (accept) {
        // Navigate to the video call page
        window.location.href = `/videoCallReceiver?roomId=${roomId}&ownerId=${user._id}&callerId=${incomingCall.callerId}&callerName=${incomingCall.callerName}`;
      } else {
        // Send a rejection response
        webSocket.send(JSON.stringify({
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
