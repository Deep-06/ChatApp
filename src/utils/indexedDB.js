const DB_NAME = "ChatAppDB";
const DB_VERSION = 1;
const MESSAGES_STORE_NAME = "messages";
const CONTACTS_STORE_NAME = "contacts";

/**
 * Open or create an IndexedDB instance
 */
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    // Handle database upgrades (create object stores if they don't exist)
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(MESSAGES_STORE_NAME)) {
        db.createObjectStore(MESSAGES_STORE_NAME, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(CONTACTS_STORE_NAME)) {
        db.createObjectStore(CONTACTS_STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Add to your existing indexedDB.js utility file

/**
 * Save a contact to IndexedDB
 * @param {Object} contact - The contact object to save
 */
export async function saveContactToIndexedDB(contact) {
  try {
    const db = await openDB();
    const transaction = db.transaction('contacts', 'readwrite');
    const store = transaction.objectStore('contacts');
    store.put(contact); // Save the contact

    transaction.oncomplete = () => console.log("Contact saved to IndexedDB");
    transaction.onerror = () => console.error("Failed to save contact to IndexedDB");
  } catch (error) {
    console.error("Error saving contact to IndexedDB:", error);
  }
}


/**
 * Get all contacts from IndexedDB
 * @returns {Promise<Array>} - An array of contacts
 */
export async function getContactsFromIndexedDB() {
  try {
    const db = await openDB();
    const transaction = db.transaction(CONTACTS_STORE_NAME, "readonly");
    const store = transaction.objectStore(CONTACTS_STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Error fetching contacts from IndexedDB:", error);
    return [];
  }
}

/**
 * Save a message to IndexedDB
 * @param {Object} message - The message object to save
 */
export async function saveMessageToIndexedDB(message) {
  try {
    const db = await openDB();
    const transaction = db.transaction(MESSAGES_STORE_NAME, "readwrite");
    const store = transaction.objectStore(MESSAGES_STORE_NAME);
    store.put(message);

    transaction.oncomplete = () => console.log("Message saved to IndexedDB");
    transaction.onerror = () => console.error("Failed to save message to IndexedDB");
  } catch (error) {
    console.error("Error saving message to IndexedDB:", error);
  }
}

/**
 * Get all messages for a specific contact from IndexedDB
 * @param {string} contactId - The contact ID to filter messages by
 * @returns {Promise<Array>} - An array of messages for the contact
 */
export async function getMessagesFromIndexedDB(contactId) {
  try {
    const db = await openDB();
    const transaction = db.transaction(MESSAGES_STORE_NAME, "readonly");
    const store = transaction.objectStore(MESSAGES_STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.getAll();

      request.onsuccess = () => {
        const messages = request.result.filter((msg) => msg.contact === contactId);
        resolve(messages);
      };

      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Error fetching messages from IndexedDB:", error);
    return [];
  }
}

/**
 * Delete a specific message from IndexedDB
 * @param {string} messageId - The ID of the message to delete
 */
export async function deleteMessageFromIndexedDB(messageId) {
  try {
    const db = await openDB();
    const transaction = db.transaction(MESSAGES_STORE_NAME, "readwrite");
    const store = transaction.objectStore(MESSAGES_STORE_NAME);
    store.delete(messageId);

    transaction.oncomplete = () => console.log("Message deleted from IndexedDB");
    transaction.onerror = () => console.error("Failed to delete message from IndexedDB");
  } catch (error) {
    console.error("Error deleting message from IndexedDB:", error);
  }
}

/**
 * Clear all messages from IndexedDB
 */
export async function clearMessagesFromIndexedDB() {
  try {
    const db = await openDB();
    const transaction = db.transaction(MESSAGES_STORE_NAME, "readwrite");
    const store = transaction.objectStore(MESSAGES_STORE_NAME);
    store.clear();

    transaction.oncomplete = () => console.log("All messages cleared from IndexedDB");
    transaction.onerror = () => console.error("Failed to clear messages from IndexedDB");
  } catch (error) {
    console.error("Error clearing messages from IndexedDB:", error);
  }
}

/**
 * Delete a specific contact from IndexedDB
 * @param {string} contactId - The ID of the contact to delete
 */
export async function deleteContactFromIndexedDB(contactId) {
  try {
    const db = await openDB();
    const transaction = db.transaction(CONTACTS_STORE_NAME, "readwrite");
    const store = transaction.objectStore(CONTACTS_STORE_NAME);
    store.delete(contactId);

    transaction.oncomplete = () => console.log("Contact deleted from IndexedDB");
    transaction.onerror = () => console.error("Failed to delete contact from IndexedDB");
  } catch (error) {
    console.error("Error deleting contact from IndexedDB:", error);
  }
}

/**
 * Clear all contacts from IndexedDB
 */
export async function clearContactsFromIndexedDB() {
  try {
    const db = await openDB();
    const transaction = db.transaction(CONTACTS_STORE_NAME, "readwrite");
    const store = transaction.objectStore(CONTACTS_STORE_NAME);
    store.clear();

    transaction.oncomplete = () => console.log("All contacts cleared from IndexedDB");
    transaction.onerror = () => console.error("Failed to clear contacts from IndexedDB");
  } catch (error) {
    console.error("Error clearing contacts from IndexedDB:", error);
  }
}
