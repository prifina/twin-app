// components/WebSocketListener.js
import { useState, useEffect } from 'react';

const WebSocketListener = ({ requestId }) => {
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);

  useEffect(() => {

    // Append requestId as a query parameter to the WebSocket URL.
    let websocket = ""
    let reconnectAttempts = 0;
    const connectWebSocket = () => {
      websocket = new WebSocket(`wss://aucm12x6m4.execute-api.us-east-1.amazonaws.com/prod?Id=${requestId}`);
      websocket.onopen = () => {
        console.log('WebSocket connected ', requestId);
      };

      websocket.onmessage = (event) => {
        console.log('Received message:', event.data);
        try {
          const data = JSON.parse(event.data);
          setMessages((prev) => [...prev, data]);
          /* setMessages((prev) => {
            const updatedMessages = [...prev, data];
            console.log("Updated messages: ", updatedMessages); // Check if state update is working
            return updatedMessages;
          }); */
          console.log("MESSAGES ", messages);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      websocket.onclose = () => {
        console.log('WebSocket closed ');
        reconnectAttempts++;
        const maxDelay = 5000; // Maximum delay of 5 seconds
        const reconnectDelay = Math.min(
          Math.pow(2, reconnectAttempts) * 100,
          maxDelay
        );
        setTimeout(() => {
          console.log(
            `Attempting to reconnect... Attempt ${reconnectAttempts}`
          );
          //setConnectionId(null);
          connectWebSocket(); // Attempt to reconnect
        }, reconnectDelay);
      };
    }

    if (requestId && requestId !== "") {
      connectWebSocket();
      setWs(websocket); // You may need to adjust this based on how you use `setWs`
    }

    return () => {
      websocket === "" ? null : websocket.close();
    };


  }, [requestId]);
  console.log('Component re-rendered'); // Logs each time the component is re-rendered

  return (
    <div>
      <h1>Messages for request {requestId}</h1>
      {messages.length > 0 ? (
        messages.map((msg, index) => (
          <div key={index}>
            <pre>{JSON.stringify(msg, null, 2)}</pre>
          </div>
        ))
      ) : (
        <p>No messages yet.</p>
      )}
    </div>
  );
};

export default WebSocketListener;
