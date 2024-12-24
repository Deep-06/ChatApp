import { useEffect, useReducer, useState } from "react";
import instantDB from "../instantDBConfig"; // Assuming your InstantDB client is initialized here
import {
  saveMessageToIndexedDB,
  getMessagesFromIndexedDB,
} from "../utils/indexedDB.js";

// Action types
const ACTIONS = {
  SET_MESSAGES: "SET_MESSAGES",
  ADD_MESSAGE: "ADD_MESSAGE",
};

// Reducer function for managing messages
function messagesReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_MESSAGES:
      return action.payload;
    case ACTIONS.ADD_MESSAGE:
      return [...state, action.payload];
    default:
      return state;
  }
}

// Custom hook to manage messages
export function useMessages(contactId) {
  const [messages, dispatch] = useReducer(messagesReducer, []);
  const [isOffline, setIsOffline] = useState(false);

  // Use the `instantDB.useQuery` hook to fetch messages
  const { data, error } = instantDB.useQuery({
    messages: { filter: { contact: contactId } },
  });

  // Effect to handle initial message fetch based on connectivity
  useEffect(() => {
    async function fetchMessages() {
      if (!contactId) return;

      if (navigator.onLine) {
        if (data && !error) {
          // Save messages to IndexedDB for offline access
          data.messages.forEach((message) => saveMessageToIndexedDB(message));
          dispatch({ type: ACTIONS.SET_MESSAGES, payload: data.messages });
        } else {
          console.error("Error fetching messages from InstantDB:", error);
        }
      } else {
        // Fetch messages from IndexedDB when offline
        setIsOffline(true);
        const offlineMessages = await getMessagesFromIndexedDB(contactId);
        dispatch({ type: ACTIONS.SET_MESSAGES, payload: offlineMessages });
      }
    }

    fetchMessages();
  }, [contactId, data, error]);

  // Sync new messages when the user sends them
  const addMessage = async (message) => {
    try {
      if (navigator.onLine) {
        // Save to InstantDB
        await instantDB.transact(instantDB.tx.messages[message.id].update(message));
      } else {
        // Mark as offline and save locally
        setIsOffline(true);
        message.isOffline = true; // Custom property to mark offline messages
      }

      // Save to IndexedDB and update state
      saveMessageToIndexedDB(message);
      dispatch({ type: ACTIONS.ADD_MESSAGE, payload: message });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle reconnection: Sync offline messages with InstantDB
  useEffect(() => {
    async function syncOfflineMessages() {
      if (navigator.onLine && isOffline) {
        try {
          const offlineMessages = await getMessagesFromIndexedDB(contactId);
          const unsyncedMessages = offlineMessages.filter((msg) => msg.isOffline);

          for (const message of unsyncedMessages) {
            await instantDB.transact(instantDB.tx.messages[message.id].update(message));
            message.isOffline = false; // Mark as synced
            saveMessageToIndexedDB(message); // Update in IndexedDB
          }

          setIsOffline(false);
        } catch (error) {
          console.error("Error syncing offline messages:", error);
        }
      }
    }

    window.addEventListener("online", syncOfflineMessages);
    return () => window.removeEventListener("online", syncOfflineMessages);
  }, [isOffline, contactId]);

  return { messages, addMessage, isOffline };
}