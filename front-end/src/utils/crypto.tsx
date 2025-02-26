import CryptoJS from "crypto-js";

const secretKey = import.meta.env.VITE_SECRET_KEY || "secretKey";

/**
 * The `encrypt` function in TypeScript React encrypts a given text using a secret key using the AES
 * encryption algorithm.
 * @param {string} text - The `text` parameter is the string that you want to encrypt using the AES
 * encryption algorithm.
 * @param {string} secretKey - The `secretKey` parameter is a string that is used as a secret key for
 * encrypting the `text` parameter using the AES encryption algorithm. It is essential for securing the
 * encryption process and ensuring that only authorized parties can decrypt the encrypted text.
 * @returns The `encrypt` function is returning the encrypted text as a string using the AES encryption
 * algorithm with the provided secret key.
 */
export const encrypt = (text: string): string => {
  return CryptoJS.AES.encrypt(text, secretKey).toString();
};

/**
 * The `decrypt` function takes a cipher text as input, decrypts it using a secret key, and returns the
 * decrypted text in UTF-8 format.
 * @param {string} cipherText - The `cipherText` parameter is the encrypted text that you want to
 * decrypt using the AES algorithm with a specific secret key.
 * @returns The decrypt function is returning the decrypted plaintext string after decrypting the input
 * cipherText using the secretKey with AES encryption algorithm.
 */
export const decrypt = (cipherText: string): string => {
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

/**
 * The hash function takes a string input, computes its SHA256 hash, and returns the result encoded in
 * Base64.
 * @param {string} text - The `hash` function takes a `text` parameter of type string and calculates
 * the SHA256 hash of the input text. The resulting hash is then encoded in Base64 format before being
 * returned as a string.
 * @returns The hash of the input text using the SHA256 algorithm encoded in Base64 format is being
 * returned.
 */
export const hash = (text: string): string => {
  return CryptoJS.SHA256(text).toString(CryptoJS.enc.Base64);
};

/**
 * The function `saltedHash` takes a text and a salt as input, combines them, hashes the result using
 * SHA256 algorithm, and returns the hashed value encoded in Base64.
 * @param {string} text - The `text` parameter is a string that represents the text you want to hash
 * along with the salt.
 * @param {string} salt - A salt is a random string of characters that is added to the input text
 * before hashing to increase security and prevent rainbow table attacks. It is typically a unique
 * value that is stored separately from the hashed value.
 * @returns The function `saltedHash` is returning a salted hash of the input `text` using the SHA256
 * algorithm. The input `text` is concatenated with the `salt` before being hashed, and the resulting
 * hash is then encoded in Base64 format before being returned as a string.
 */
export const saltedHash = (text: string, salt: string): string => {
  return CryptoJS.SHA256(text + salt).toString(CryptoJS.enc.Base64);
};
