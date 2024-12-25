import React from "react";

export const Message = ({ message }) => (
  <div
    className={`message ${message.isMine ? "mine" : "theirs"}`}
    style={{
      padding: "10px",
      margin: "5px 0",
      borderRadius: "10px",
      maxWidth: "50%",
      backgroundColor: message.isMine ? "#caf4aa" : "#fff",
      alignSelf: message.isMine ? "flex-start" : "flex-end",
      boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
      textAlign:'left',
    }}
  >
    <span style={{color:'black',alignItems:'center'}}>{message.content}</span>
    <div
      style={{
        fontSize: "10px",
        color: "#888",
        marginTop: "5px",
        textAlign: "right",
      }}
    >
      {new Date(message.timestamp).toLocaleTimeString()}
    </div>
  </div>
);
