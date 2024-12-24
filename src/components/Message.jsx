import React from 'react';

export const Message = ({ message }) => (
  <div className={`message ${message.isMine ? 'mine' : ''}`}>
    <span>{message.text}</span>
    <span className="timestamp">{new Date(message.timestamp).toLocaleTimeString()}</span>
  </div>
);
