import React from 'react'
import { ContactList } from './ContactList'
import ChatWindow from './ChatWindow'

export const Dashboard = () => {
  return (
    <div style={{display:'flex'}}>
        <div className="contact-list-container" 
        style={{
        width:'30%', 
        borderRight:'1px solid #ddd', 
        // overflowY:'auto'
        }}>
          <h2 style={{color:'green', textAlign:'left', padding:'8px', paddingLeft:'10px'}}>ChatApp</h2>
          <input style={{
            width:'90%', borderRadius:'10px', height:'20px', padding:'5px'
          }} placeholder='Search'/>
          <ContactList />
        </div>
        <div className="chat-window-container" style={{
            width:'70%',
            display:'flex',
            flexDirection:'column'
        }}>
          <ChatWindow />
        </div>
    </div>
  )
}

