import { useEffect, useState } from 'react';  
import './App.css';  

function App() {  
  const [socket, setSocket] = useState(null);  
  const [messageList, setMessageList] = useState([]);  
  const [latestMessage, setLatestMessage] = useState("");  
  const [message, setMessage] = useState("");  
  const [clientId, setClientId] = useState(null); // State to store the client ID  

  useEffect(() => {  
    const socket = new WebSocket('ws://localhost:8080');  

    socket.onopen = () => {  
      console.log("Connected");  
      setSocket(socket);  
    };  

    socket.onmessage = (event) => {  
      console.log('Received msg: ', event.data);  
      if (clientId === null && event.data.startsWith("Your client ID is ")) {  
        const id = event.data.split(" ")[5]; // Extract client ID from the welcome message  
        setClientId(id); // Store the client ID  
      } else {  
        setMessageList((prev) => [...prev, event.data]);  
        setLatestMessage(event.data);  
      }  
    };  

    // Cleanup on component unmount  
    return () => {  
      socket.close();  
    };  
  }, [clientId]);  

  if (!socket) {  
    return <div>Loading...</div>;  
  }  

  const handleSend = () => {  
    if (message.length !== 0){
      socket.send(message);  
      setMessage("");
      } 
    // if (clientId) {  
    //   if (message != null){
    //   socket.send(message);  
    //   setMessage("");
    //   } // Clear the input after sending  
    // } else {  
    //   //socket.send(message)
    //   console.warn("Client ID is not set yet.");  
    // }  
  };  

  return (  
    <>  
      <input  
        value={message}  
        onChange={(e) => {  
          setMessage(e.target.value);  
        }}  
        placeholder="Type your message"  
      />  
      <button onClick={handleSend}>Send</button>  
      <div>  
        <strong>Latest Message:</strong> {latestMessage}  
      </div>  
      <div>  
        <strong>Message List:</strong>  
        <ul>  
          {messageList.map((msg, index) => (  
            <li key={index}>{msg}</li>  
          ))}  
        </ul>  
      </div>  
    </>  
  );  
}  

export default App;