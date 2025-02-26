/* eslint-disable @typescript-eslint/no-explicit-any */

import { decrypt, encrypt } from "./crypto";

/**
 * The setCookieCrypto function encrypts a value, sets it as a cookie with an optional expiration date.
 * @param {string} name - The `name` parameter is a string representing the name of the cookie that
 * will be set in the browser.
 * @param {any} value - The `value` parameter in the `setCookieCrypto` function is the data that you
 * want to store in the cookie. It can be of any type, as it will be converted to a string using
 * `JSON.stringify` before being encrypted and stored in the cookie.
 * @param {number} [days] - The `days` parameter in the `setCookieCrypto` function is an optional
 * parameter that specifies the number of days until the cookie expires. If this parameter is provided,
 * the cookie will be set with an expiration date based on the current date plus the number of days
 * specified. If the `days`
 */
export const setCookieCrypto = (
  name: string,
  value: any,
  days?: number
): void => {
  const encryptedValue = encrypt(JSON.stringify(value));
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${encodeURIComponent(
    encryptedValue
  )}${expires}; path=/`;
};

/**
 * The function `getCookieCrypto` retrieves and decrypts a cookie value by name in a TypeScript React
 * application.
 * @param {string} name - The `name` parameter in the `getCookieCrypto` function is a string that
 * represents the name of the cookie you want to retrieve and decrypt.
 * @returns The `getCookieCrypto` function returns the decrypted and parsed value of the cookie with
 * the specified name if it exists and can be successfully decrypted and parsed. If there is an error
 * during decryption or parsing, it logs an error message and returns `null`. If the cookie with the
 * specified name is not found, it also returns `null`.
 */
export const getCookieCrypto = (name: string): any | null => {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    if (cookie.startsWith(nameEQ)) {
      const encryptedValue = decodeURIComponent(
        cookie.substring(nameEQ.length)
      );

      try {
        const decryptedValue = decrypt(encryptedValue);
        return JSON.parse(decryptedValue);
      } catch (error) {
        console.error("Error decrypting or parsing cookie:", error);
        return null;
      }
    }
  }
  return null;
};

/**
 * The function `deleteCookieCrypto` is used to delete a cookie by setting its Max-Age to a negative value.
 * @param {string} name - The `name` parameter in the `deleteCookieCrypto` function represents the name of
 * the cookie that you want to delete from the browser's cookies.
 */
export const deleteCookieCrypto = (name: string): void => {
  document.cookie = `${name}=; Max-Age=-99999999; path=/`;
};

/* The `export const cookieCryptoUtils` statement is creating an object named `cookieCryptoUtils` that
contains references to the `setCookieCrypto`, `getCookieCrypto`, and `deleteCookieCrypto` functions.
By exporting this object, these functions can be accessed and used outside of the module where they
are defined. This allows other parts of the codebase to easily interact with the cookie-related
functions by importing `cookieCryptoUtils` and using its properties (`set`, `get`, `delete`) to call
the respective functions. */
export const cookieCryptoUtils = {
  set: setCookieCrypto,
  get: getCookieCrypto,
  delete: deleteCookieCrypto,
};
