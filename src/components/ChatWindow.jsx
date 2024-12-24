import React, { useEffect, useState } from "react";
import { useMessages } from "../hooks/useMessage";
import {MessageInput} from "./MessageInput";
import {Message} from "./Message";
import {useChatContext} from '../context/ChatContext'

function ChatWindow() {
  const { state } = useChatContext();
  const { currentContact, contacts  } = state;

  const { messages, addMessage, isOffline } = useMessages(currentContact);
  const [newMessage, setNewMessage] = useState("");

  const currentContactDetails = contacts.find(
    (contact) => contact.id === currentContact
  );

  useEffect(() => {
    if (!currentContact) {
      setNewMessage(""); // Reset input when no contact is selected
    }
  }, [currentContact]);
  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(), // Unique ID
      contact: currentContact,
      text: newMessage,
      timestamp: Date.now(),
    };

    addMessage(message);
    setNewMessage("");
  };

  if (!currentContact) {
    return (
      <div className="chat-window" style={{ textAlign: "center", padding: "20px" }}>
        <p style={{ color: "#888" }}>Select a contact to start chatting</p>
      </div>
    );
  }

  return (
    <div className="chat-window" style={{ display: "flex", flexDirection: "column", height: "100vh" }}>

    {/* Chat header */}
    <div
        className="chat-header"
        style={{
          padding: "10px",
          backgroundColor: "#25d366", 
          color: "#fff",
          fontWeight: "bold",
          fontSize: "18px",
          textAlign: "center",
          borderTopLeftRadius: "5px",
          borderTopRightRadius: "5px",
        }}
      >
             <div style={{display:'flex', gap:'20px'}}>
               <img style={{width:'100px', borderRadius:'50%'}} src='https://t3.ftcdn.net/jpg/02/61/90/28/360_F_261902858_onbxqSHf193X4w7e8fdRH8vjjoT3vOVZ.jpg' alt='pic'/>
               <h4 style={{fontSize:'24px'}}>{currentContactDetails?.name || "Chat"}</h4>
             </div>
        
      </div>

      {isOffline && (
        <div
          className="offline-banner"
          style={{
            backgroundColor: "#ffcccb",
            color: "#900",
            textAlign: "center",
            padding: "5px",
            fontSize: "14px",
          }}
        >
          You are offline. Messages will be sent when you're back online.
        </div>
      )}
      <div
        className="message-list"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
          backgroundColor: "#f0f0f0",
          borderRadius: "5px",
        }}
      >
        {messages.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888",paddingTop:'25%' }}>No messages yet. Start the conversation!</p>
        ) : (
          
          messages.map((msg) => <Message key={msg.id} message={msg} />)  
        )}
      </div>
      <div
        style={{
          marginTop: "10px",
          padding: "10px",
          borderTop: "1px solid #ddd",
          backgroundColor: "#fff",
          borderRadius:'10px',
        }}
      >
        <MessageInput
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onSend={handleSend}
        />
      </div>
    </div>
  );
}

export default ChatWindow;
