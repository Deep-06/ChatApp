import React, { useState } from 'react';

export const MessageInput = ({ onSend }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText('');
    }
  };

  return (
    <div className="message-input" style={{display:'flex',gap:'20px',width:'100%'}}>
      <input style={{height:'35px',width:'95%', borderRadius:'10px', paddingLeft:'10px'}}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
      />
      <button style={{height:'40px',borderRadius:'10px', backgroundColor:'green', 
      color:'white', border:'1px solid whitesmoke',fontSize:'25px',fontWeight:'32px', width:'4%'}} onClick={handleSend}>↑</button>
    </div>
  );
};
