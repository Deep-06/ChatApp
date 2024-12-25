import React, { useEffect, useState } from "react";
// import { useMessages } from "../hooks/useMessage";
import { MessageInput } from "./MessageInput";
import { Message } from "./Message";
import { useChatContext } from "../context/ChatContext";
import { getMessagesFromIndexedDB, performIndexedDBOperation, MESSAGES_STORE_NAME } from "../utils/indexedDB";

function ChatWindow() {
  const { state } = useChatContext();
  const { currentContact, contacts } = state;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isOffline, setIsOffline] = useState(false);

  const currentContactDetails = contacts.find(
    (contact) => contact.id === currentContact
  );

  // Fetch messages from IndexedDB when contact changes or is loaded for the first time
  useEffect(() => {
    if (currentContact) {
      loadMessages(currentContact);
    }
  }, [currentContact]);

  // Load messages from IndexedDB
  async function loadMessages(contactId) {
    try {
      const messages = await getMessagesFromIndexedDB(contactId);
      setMessages(messages); // Update state with the fetched messages
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  }

  // Send a new message with a key
  async function sendMessage(contactId, messageContent) {
    const newMessage = {
      id: Date.now().toString(),
      contact: contactId,
      content: messageContent,  // This is where the message content goes
      timestamp: new Date().toISOString(),
    };

    console.log("New message:", newMessage);

  
    try {
      await performIndexedDBOperation(MESSAGES_STORE_NAME, "readwrite", (store) => {
        store.add(newMessage); // Do not pass the key manually
      });
      loadMessages(contactId);  // Refresh the messages after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
  


  // Update state when new contact is selected
  useEffect(() => {
    if (!currentContact) setNewMessage("");
  }, [currentContact]);

  // Handle the send message logic
  const handleSend = (text) => {
    if (!text.trim()) return;

    const message = {
      id: Date.now().toString(),
      contact: currentContact,
      content: text,
      timestamp: Date.now(),
      isMine: true,
    };

    sendMessage(currentContact, text); // Send message to IndexedDB and refresh
    setMessages((prevMessages) => [...prevMessages, message]); // Optimistically update UI
  };

  // Handle changes to the connection status
  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    // Clean up event listeners
    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, []);

  if (!currentContact) {
    return (
      <div className="chat-window" style={{ textAlign: "center", padding: "20px" }}>
        <p style={{ color: "#888" }}>Select a contact to start chatting</p>
      </div>
    );
  }

  return (
    <div className="chat-window" style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
    <div
        className="chat-header"
        style={{
          padding: "10px",
          backgroundColor: "#25d366", 
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <img
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            border: "2px solid #fff",
          }}
          src='https://t3.ftcdn.net/jpg/02/61/90/28/360_F_261902858_onbxqSHf193X4w7e8fdRH8vjjoT3vOVZ.jpg'
          alt='pic'
        />
        <h4 style={{ fontSize: "20px" }}>{currentContactDetails?.name || "Chat"}</h4>
      </div>

      {isOffline && (
        <div
          className="offline-banner"
          style={{
            backgroundColor: "#ffcccb",
            color: "#900",
            textAlign: "center",
            padding: "5px",
          }}
        >
          You are offline. Messages will sync when online.
        </div>
      )}
      <div
        className="message-list"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
          backgroundColor: "#f0f0f0",
        }}
      >
        {messages.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888", marginTop: "25%" }}>
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages.map((msg) => <Message key={msg.id} message={msg} />)
        )}
      </div>
      <div style={{ padding: "10px", backgroundColor: "#fff", borderTop: "1px solid #ddd" }}>
        <MessageInput onSend={handleSend} />
      </div>
    </div>
  );
}

export default ChatWindow;
