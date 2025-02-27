import { encrypt, decrypt } from "./crypto";

/**
 * The function `setLocalStorageCrypto` encrypts a value and stores it in the local storage using a
 * specified key.
 * @param {string} key - The `key` parameter in the `setLocalStorageCrypto` function is a string that
 * represents the key under which the encrypted value will be stored in the Local Storage.
 * @param {unknown} value - The `value` parameter in the `setLocalStorageCrypto` function is the data
 * that you want to store in the local storage. This data can be of any type (string, number, object,
 * array, etc.) as it will be converted to a string using `JSON.stringify` before being encrypted
 */
export const setLocalStorageCrypto = (key: string, value: unknown): void => {
  try {
    const encryptedValue = encrypt(JSON.stringify(value));
    localStorage.setItem(key, encryptedValue);
  } catch (error) {
    console.error("Error encrypting and setting item in Local Storage:", error);
  }
};

/**
 * The function `getLocalStorageCrypto` retrieves and decrypts a value from local storage using a
 * specified key.
 * @param {string} key - The `key` parameter in the `getLocalStorageCrypto` function is a string that
 * represents the key under which the encrypted value is stored in the Local Storage.
 * @returns The `getLocalStorageCrypto` function returns the decrypted and parsed value stored in the
 * Local Storage corresponding to the provided key. If there is an error during decryption or parsing,
 * it returns `null`.
 */
export const getLocalStorageCrypto = (key: string): unknown | null => {
  try {
    const encryptedValue = localStorage.getItem(key);
    if (!encryptedValue) return null;

    const decryptedValue = decrypt(encryptedValue);
    return JSON.parse(decryptedValue);
  } catch (error) {
    console.error(
      "Error decrypting or parsing item from Local Storage:",
      error
    );
    return null;
  }
};

/**
 * The function `removeLocalStorageCrypto` removes an item from local storage using the provided key.
 * @param {string} key - The `key` parameter in the `removeLocalStorageCrypto` function is a string
 * that represents the key of the item you want to remove from the Local Storage.
 */
export const removeLocalStorageCrypto = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing item from Local Storage:", error);
  }
};

/* The code snippet `export const localStorageCryptoUtils = { set: setLocalStorageCrypto, get:
getLocalStorageCrypto, remove: removeLocalStorageCrypto };` is creating an object named
`localStorageCryptoUtils` that contains references to the three functions defined earlier:
`setLocalStorageCrypto`, `getLocalStorageCrypto`, and `removeLocalStorageCrypto`. */
export const localStorageCryptoUtils = {
  set: setLocalStorageCrypto,
  get: getLocalStorageCrypto,
  remove: removeLocalStorageCrypto,
};
