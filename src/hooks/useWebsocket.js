import { use, useEffect, useCallback, useRef } from 'react';

const useWebSocket = (requestId, onMessage) => {
  const wsRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);

  const handleMessage = useCallback((data) => {

    onMessage(data);

  }, [onMessage]);

  useEffect(() => {
    // Only connect if we have a valid requestId.
    if (!requestId) return;

    let ws;

    const connectWebSocket = () => {
      // Create a new WebSocket connection with the requestId as a query parameter.
      ws = new WebSocket(
        `wss://aucm12x6m4.execute-api.us-east-1.amazonaws.com/prod?Id=${requestId}`
      );
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected for request:', requestId);
        // Reset reconnect attempts when connection is successful.
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        console.log('Received message:', event.data);
        try {
          const data = JSON.parse(event.data);
          // Invoke the provided callback function, if any.

          if (data?.event !== undefined) {
            handleMessage(data);
          }

        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
        // Increase the reconnect attempts count
        reconnectAttemptsRef.current++;
        // Calculate an exponential backoff delay (capped at 5 seconds)
        const maxDelay = 5000;
        const reconnectDelay = Math.min(
          Math.pow(2, reconnectAttemptsRef.current) * 100,
          maxDelay
        );
        setTimeout(() => {
          console.log(
            `Attempting to reconnect... (attempt ${reconnectAttemptsRef.current})`
          );
          connectWebSocket();
        }, reconnectDelay);
      };
    };
    // Initiate the WebSocket connection.

    connectWebSocket();

    // Cleanup function: close the WebSocket when the component using the hook unmounts.
    return () => {
      console.log('WebSocket clean up ', ws);
      if (ws) {
        ws.close();
      }
    };
  }, [requestId, handleMessage]); // Re-run effect if requestId or onMessage changes.

  // Optionally, you can return the WebSocket instance or any other utility functions.
  return wsRef.current;
};

export default useWebSocket;
