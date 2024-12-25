import React, { useState } from "react";

export const MessageInput = ({ onSend }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="message-input" style={{ display: "flex", gap: "10px", width: "100%" }}>
      <input
        style={{
          flex: 1,
          height: "35px",
          borderRadius: "10px",
          padding: "0 10px",
          border: "1px solid #ccc",
        }}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        onKeyPress={handleKeyPress}
      />
      <button
        style={{
          height: "35px",
          borderRadius: "10px",
          backgroundColor: "#25d366",
          color: "white",
          fontSize: "16px",
          border: "none",
          cursor: "pointer",
        }}
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
};
