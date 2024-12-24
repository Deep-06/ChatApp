import React, { createContext, useReducer, useContext, useEffect } from 'react';
import {
  saveContactToIndexedDB,
  getContactsFromIndexedDB,
  saveMessageToIndexedDB,
  getMessagesFromIndexedDB,
} from '../utils/indexedDB.js'; // Make sure this is the path to your IndexedDB utils

const ChatContext = createContext();

const initialState = {
  contacts: [], 
  messages: {}, 
  currentContact: null, 
};

function chatReducer(state, action) {
  switch (action.type) {
    case 'SET_CONTACTS':
      return { ...state, contacts: action.payload };
    case 'SET_MESSAGES':
      return { ...state, messages: { ...state.messages, [action.contact]: action.payload } };
    case 'SET_CURRENT_CONTACT':
      return { ...state, currentContact: action.payload };
    case 'ADD_CONTACT':
      return { ...state, contacts: [...state.contacts, action.payload] };
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.contact]: [...(state.messages[action.contact] || []), action.payload],
        },
      };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  useEffect(() => {
    // Load contacts from IndexedDB when the app starts
    async function loadContacts() {
      const contacts = await getContactsFromIndexedDB();
      dispatch({ type: 'SET_CONTACTS', payload: contacts });
    }

    loadContacts();

    // Load messages for the current contact from IndexedDB (if any)
    async function loadMessages(contactId) {
      if (contactId) {
        const messages = await getMessagesFromIndexedDB(contactId);
        dispatch({ type: 'SET_MESSAGES', contact: contactId, payload: messages });
      }
    }

    if (state.currentContact) {
      loadMessages(state.currentContact);
    }
  }, [state.currentContact]);

  const addContact = async (contact) => {
    // Add contact to IndexedDB
    await saveContactToIndexedDB(contact);

    // Dispatch to update the state with the new contact
    dispatch({ type: 'ADD_CONTACT', payload: contact });
  };

  const addMessage = async (contactId, message) => {
    // Save the message to IndexedDB
    await saveMessageToIndexedDB(message);

    // Dispatch to update the state with the new message
    dispatch({ type: 'ADD_MESSAGE', contact: contactId, payload: message });
  };

  return (
    <ChatContext.Provider value={{ state, dispatch, addContact, addMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
