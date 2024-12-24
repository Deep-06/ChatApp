import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import { getContactsFromIndexedDB } from '../utils/indexedDB';
import { useChatContext } from '../context/ChatContext';

export const ContactList = () => {
  const { state, dispatch } = useChatContext();
  const { contacts, currentContact } = state;
  const [fetchedContacts, setFetchedContacts] = useState([]);
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    const fetchContacts = async () => {
      const storedContacts = await getContactsFromIndexedDB(); // Fetch contacts from IndexedDB
      setFetchedContacts(storedContacts);
    };

    fetchContacts();
  }, []); // This runs once when the component is mounted

  useEffect(() => {
    dispatch({ type: 'SET_CONTACTS', payload: fetchedContacts }); // Optionally update global state
  }, [fetchedContacts, dispatch]);

  return (
    <div className="contact-list" style={{ position: 'relative', height: '100vh' }}>
      {/* "+" Button to navigate to Add Contact page */}
      <button
        className="add-contact-btn"
        onClick={() => navigate('/add-contact')} // Navigate to "add-contact" page
        style={{
          position: 'absolute',
          bottom: '20vh', // Position at the bottom of the container
          right: '20px',  // Position at the right of the container
          padding: '15px', // Increased padding for better appearance
          backgroundColor: '#25d366', // WhatsApp green
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          fontSize: '30px', // Larger font size for better visibility
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Add subtle shadow for better visibility
        }}
      >
        +
      </button>

      {fetchedContacts.length === 0 ? (
        <div
          className="no-contacts"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '16px',
            color: '#888',
            height: '100vh',
          }}
        >
          No Contacts added
        </div>
      ) : (
     
        fetchedContacts.map((contact) => (
          <div style={{padding:'2%', paddingTop:'5%'}}
            key={contact.id}
            className={`contact-item ${currentContact === contact.id ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SET_CURRENT_CONTACT', payload: contact.id })}
          >
             <div style={{display:'flex', gap:'10px'}}>
               <img style={{width:'15%', borderRadius:'50%'}} src='https://t3.ftcdn.net/jpg/02/61/90/28/360_F_261902858_onbxqSHf193X4w7e8fdRH8vjjoT3vOVZ.jpg' alt='pic'/>
               <h4>{contact.name}</h4>
             </div>
          </div>
        ))
      )}
    </div>
  );
};
