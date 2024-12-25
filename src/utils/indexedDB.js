const DB_NAME = "ChatAppDB";
const DB_VERSION = 1;
export const MESSAGES_STORE_NAME = "messages";
const CONTACTS_STORE_NAME = "contacts";

// Open the IndexedDB
export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(MESSAGES_STORE_NAME)) {
        db.createObjectStore(MESSAGES_STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(CONTACTS_STORE_NAME)) {
        db.createObjectStore(CONTACTS_STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Perform operations in IndexedDB
export async function performIndexedDBOperation(storeName, mode, operation) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);
      const result = operation(store);
      transaction.oncomplete = () => resolve(result);
      transaction.onerror = () => reject(transaction.error);
    };
    request.onerror = () => reject(request.error);
  });
}

// Save message to IndexedDB
export async function saveMessageToIndexedDB(message) {
  return performIndexedDBOperation(MESSAGES_STORE_NAME, "readwrite", (store) => store.put(message));
}

// Fetch messages from IndexedDB by contactId
export async function getMessagesFromIndexedDB(contactId) {
  return performIndexedDBOperation(MESSAGES_STORE_NAME, "readonly", (store) => {
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const messages = request.result.filter((msg) => msg.contact === contactId);
        resolve(messages);
      };
      request.onerror = (event) => {
        console.error("Error fetching messages from IndexedDB:", event);
        reject(event.target.error);
      };
    });
  });
}

// Save contact to IndexedDB
export async function saveContactToIndexedDB(contact) {
  return performIndexedDBOperation(CONTACTS_STORE_NAME, "readwrite", (store) => store.put(contact));
}

// Get all contacts from IndexedDB
export async function getContactsFromIndexedDB() {
  return performIndexedDBOperation(CONTACTS_STORE_NAME, "readonly", (store) => {
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  });
}







// const DB_NAME = "ChatAppDB";
// const DB_VERSION = 1;
// const MESSAGES_STORE_NAME = "messages";
// const CONTACTS_STORE_NAME = "contacts";

// // open indexDB

// const dbRequest = indexedDB.open('ChatAppDB', 1);
// dbRequest.onsuccess = function() {
//   const db = dbRequest.result;
//   const transaction = db.transaction('messages', 'readonly');
//   const store = transaction.objectStore('messages');
//   const getAllRequest = store.getAll();
//   getAllRequest.onsuccess = () => {
//     console.log('All Messages:', getAllRequest.result);
//   };
// };

// export async function performIndexedDBOperation(storeName, mode, operation) {
//   return new Promise((resolve, reject) => {
//     const request = indexedDB.open("ChatAppDB", 1);
//     request.onsuccess = () => {
//       const db = request.result;
//       const transaction = db.transaction(storeName, mode);
//       const store = transaction.objectStore(storeName);
//       const result = operation(store);
//       transaction.oncomplete = () => resolve(result);
//       transaction.onerror = () => reject(transaction.error);
//     };
//     request.onerror = () => reject(request.error);
//   });
// }







// // function openDB() {
// //   return new Promise((resolve, reject) => {
// //     const request = indexedDB.open(DB_NAME, DB_VERSION);

// //     // Handle database upgrades (create object stores if they don't exist)
// //     request.onupgradeneeded = (event) => {
// //       const db = event.target.result;
// //       if (!db.objectStoreNames.contains(MESSAGES_STORE_NAME)) {
// //         db.createObjectStore(MESSAGES_STORE_NAME, { keyPath: "id" });
// //       }
// //       if (!db.objectStoreNames.contains(CONTACTS_STORE_NAME)) {
// //         db.createObjectStore(CONTACTS_STORE_NAME, { keyPath: "id", autoIncrement: true });
// //       }
// //     };

// //     request.onsuccess = () => resolve(request.result);
// //     request.onerror = () => reject(request.error);
// //   });
// // }

// // export async function performIndexedDBOperation(storeName, mode, operation) {
// //   try {
// //     const db = await openDB();
// //     const transaction = db.transaction(storeName, mode);
// //     const store = transaction.objectStore(storeName);
// //     return await operation(store);
// //   } catch (error) {
// //     console.error(`Error performing operation on ${storeName}:`, error);
// //     throw error;
// //   }
// // }

// export async function saveContactToIndexedDB(contact) {
//   return performIndexedDBOperation(CONTACTS_STORE_NAME, "readwrite", (store) => store.put(contact));
// }

// // Fetch contacts
// export async function getContactsFromIndexedDB() {
//   try {
//     const db = await openDB();
//     const transaction = db.transaction(CONTACTS_STORE_NAME, "readonly");
//     const store = transaction.objectStore(CONTACTS_STORE_NAME);

//     return new Promise((resolve, reject) => {
//       const request = store.getAll();
//       request.onsuccess = () => resolve(request.result || []); // Ensure an array is returned
//       request.onerror = () => reject(request.error);
//     });
//   } catch (error) {
//     console.error("Error fetching contacts from IndexedDB:", error);
//     return []; // Fallback to empty array
//   }
// }

// // export async function getContactsFromIndexedDB() {
// //   return performIndexedDBOperation(CONTACTS_STORE_NAME, "readonly", (store) =>
// //     store.getAll()
// //   );
// // }

// // Save message
// export async function saveMessageToIndexedDB(message) {
//   return performIndexedDBOperation(MESSAGES_STORE_NAME, "readwrite", (store) => store.put(message));
// }

// // Fetch messages by contactId

// export async function getMessagesFromIndexedDB(contactId) {
//   return performIndexedDBOperation(MESSAGES_STORE_NAME, "readonly", (store) => {
//     return new Promise((resolve, reject) => {
//       const request = store.getAll();
//       request.onsuccess = () => {
//         const messages = request.result.filter((msg) => msg.contact === contactId);
//         resolve(messages);
//       };
//       request.onerror = (event) => {
//         console.error("Error fetching messages from IndexedDB:", event);
//         reject(event.target.error);
//       };
//     });
//   });
// }

// // export async function getMessagesFromIndexedDB(contactId) {
// //   return performIndexedDBOperation(MESSAGES_STORE_NAME, "readonly", (store) =>
// //     store.getAll().then((messages) => messages.filter((msg) => msg.contact === contactId))
// //   );
// // }


// // // Add to your existing indexedDB.js utility file

// // /**
// //  * Save a contact to IndexedDB
// //  * @param {Object} contact - The contact object to save
// //  */
// // export async function saveContactToIndexedDB(contact) {
// //   try {
// //     const db = await openDB();
// //     const transaction = db.transaction('contacts', 'readwrite');
// //     const store = transaction.objectStore('contacts');
// //     store.put(contact); // Save the contact

// //     transaction.oncomplete = () => console.log("Contact saved to IndexedDB");
// //     transaction.onerror = () => console.error("Failed to save contact to IndexedDB");
// //   } catch (error) {
// //     console.error("Error saving contact to IndexedDB:", error);
// //   }
// // }


// // /**
// //  * Get all contacts from IndexedDB
// //  * @returns {Promise<Array>} - An array of contacts
// //  */
// // export async function getContactsFromIndexedDB() {
// //   try {
// //     const db = await openDB();
// //     const transaction = db.transaction(CONTACTS_STORE_NAME, "readonly");
// //     const store = transaction.objectStore(CONTACTS_STORE_NAME);

// //     return new Promise((resolve, reject) => {
// //       const request = store.getAll();

// //       request.onsuccess = () => resolve(request.result);
// //       request.onerror = () => reject(request.error);
// //     });
// //   } catch (error) {
// //     console.error("Error fetching contacts from IndexedDB:", error);
// //     return [];
// //   }
// // }

// // /**
// //  * Save a message to IndexedDB
// //  * @param {Object} message - The message object to save
// //  */
// // export async function saveMessageToIndexedDB(message) {
// //   try {
// //     const db = await openDB();
// //     const transaction = db.transaction(MESSAGES_STORE_NAME, "readwrite");
// //     const store = transaction.objectStore(MESSAGES_STORE_NAME);
// //     store.put(message);

// //     transaction.oncomplete = () => console.log("Message saved to IndexedDB");
// //     transaction.onerror = () => console.error("Failed to save message to IndexedDB");
// //   } catch (error) {
// //     console.error("Error saving message to IndexedDB:", error);
// //   }
// // }

// /**
//  * Get all messages for a specific contact from IndexedDB
//  * @param {string} contactId - The contact ID to filter messages by
//  * @returns {Promise<Array>} - An array of messages for the contact
//  */
// // export async function getMessagesFromIndexedDB(contactId) {
// //   try {
// //     const db = await openDB();
// //     const transaction = db.transaction(MESSAGES_STORE_NAME, "readonly");
// //     const store = transaction.objectStore(MESSAGES_STORE_NAME);

// //     return new Promise((resolve, reject) => {
// //       const request = store.getAll();

// //       request.onsuccess = () => {
// //         const messages = request.result.filter((msg) => msg.contact === contactId);
// //         resolve(messages);
// //       };

// //       request.onerror = () => reject(request.error);
// //     });
// //   } catch (error) {
// //     console.error("Error fetching messages from IndexedDB:", error);
// //     return [];
// //   }
// // }

// // /**
// //  * Delete a specific message from IndexedDB
// //  * @param {string} messageId - The ID of the message to delete
// //  */
// // export async function deleteMessageFromIndexedDB(messageId) {
// //   try {
// //     const db = await openDB();
// //     const transaction = db.transaction(MESSAGES_STORE_NAME, "readwrite");
// //     const store = transaction.objectStore(MESSAGES_STORE_NAME);
// //     store.delete(messageId);

// //     transaction.oncomplete = () => console.log("Message deleted from IndexedDB");
// //     transaction.onerror = () => console.error("Failed to delete message from IndexedDB");
// //   } catch (error) {
// //     console.error("Error deleting message from IndexedDB:", error);
// //   }
// // }

// /**
//  * Clear all messages from IndexedDB
//  */
// export async function clearMessagesFromIndexedDB() {
//   try {
//     const db = await openDB();
//     const transaction = db.transaction(MESSAGES_STORE_NAME, "readwrite");
//     const store = transaction.objectStore(MESSAGES_STORE_NAME);
//     store.clear();

//     transaction.oncomplete = () => console.log("All messages cleared from IndexedDB");
//     transaction.onerror = () => console.error("Failed to clear messages from IndexedDB");
//   } catch (error) {
//     console.error("Error clearing messages from IndexedDB:", error);
//   }
// }

// /**
//  * Delete a specific contact from IndexedDB
//  * @param {string} contactId - The ID of the contact to delete
//  */
// export async function deleteContactFromIndexedDB(contactId) {
//   try {
//     const db = await openDB();
//     const transaction = db.transaction(CONTACTS_STORE_NAME, "readwrite");
//     const store = transaction.objectStore(CONTACTS_STORE_NAME);
//     store.delete(contactId);

//     transaction.oncomplete = () => console.log("Contact deleted from IndexedDB");
//     transaction.onerror = () => console.error("Failed to delete contact from IndexedDB");
//   } catch (error) {
//     console.error("Error deleting contact from IndexedDB:", error);
//   }
// }

// /**
//  * Clear all contacts from IndexedDB
//  */
// export async function clearContactsFromIndexedDB() {
//   try {
//     const db = await openDB();
//     const transaction = db.transaction(CONTACTS_STORE_NAME, "readwrite");
//     const store = transaction.objectStore(CONTACTS_STORE_NAME);
//     store.clear();

//     transaction.oncomplete = () => console.log("All contacts cleared from IndexedDB");
//     transaction.onerror = () => console.error("Failed to clear contacts from IndexedDB");
//   } catch (error) {
//     console.error("Error clearing contacts from IndexedDB:", error);
//   }
// }
