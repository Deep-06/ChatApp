import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveContactToIndexedDB } from '../utils/indexedDB'; // Import the function to save contact

export const AddContact = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate(); // Initialize navigation

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form fields
    if (!name || !phone) {
      alert('Please provide both name and phone number.');
      return;
    }

    // Create a new contact object
    const newContact = {
      id: Date.now(), // Use timestamp as a unique ID
      name: name,
      phone: phone,
    };

    // Save contact to IndexedDB
    await saveContactToIndexedDB(newContact);

    // After saving, navigate back to the contact list
    navigate('/');
  };

  return (
    <div className="add-contact-form" style={{ padding: '20px', maxWidth: '400px', 
    margin: 'auto', backgroundColor:'#fff', borderRadius:'10px', boxShadow:'0px 2px 10px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{textAlign:'center'}}>Add New Contact</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '5px', textAlign:'left' }}>Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '90%', padding: '10px', margin:'10px 0', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="phone" style={{ display: 'block', marginBottom: '5px', textAlign:'left' }}>Phone Number</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ width: '90%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        <button type="submit" style={{
          backgroundColor: '#25d366', color: 'white', padding: '10px 20px', border: 'none', 
          borderRadius: '5px', cursor: 'pointer'
        }}>
          Add Contact
        </button>
      </form>
    </div>
  );
};
