import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [socket, setSocket] = useState(null);
  const [messageList, setMessageList] = useState([]);
  const [latestMessage, setLatestMessage] = useState("");
  const [message, setMessage] = useState("");
  const [clientId, setClientId] = useState(null);
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    const socket = new WebSocket('wss://chatroom-backend-gke0.onrender.com');

    socket.onopen = () => {
      console.log("Connected");
      setSocket(socket);
    };

    socket.onmessage = (event) => {
      console.log('Received msg: ', event.data);
      if (clientId === null && event.data.startsWith("New client connected with ID: ")) {
        const id = event.data.split(" ")[5];
        setClientId(id);
      } else if (event.data.startsWith("Online Users Count: ")) {
        const count = event.data.split(": ")[1];
        setOnlineCount(count);
      } else {
        setMessageList((prev) => [...prev, event.data]);
        setLatestMessage(event.data);
      }
    };

    return () => {
      socket.close();
    };
  }, [clientId]);

  const handleSend = () => {
    if (message.trim().length > 0) {
      socket.send(message);
      setMessage("");
    }
  };

  if (!socket) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chat-container">
      <header>
        <h2>Chat Room</h2>
        <div><strong>Online Users: {onlineCount}</strong></div>
      </header>

      <div className="message-area">
        <div className="messages">
          <ul>
            {messageList.map((msg, index) => (
              <li key={index} className="message">
                {msg}
              </li>
            ))}
          </ul>
        </div>
        <div className="latest-message">
          <strong>Latest Message:</strong> {latestMessage}
        </div>
      </div>

      <footer className="input-area">
        <input
          aria-label="Type your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button onClick={handleSend}>Send</button>
      </footer>
    </div>
  );
}

export default App;
