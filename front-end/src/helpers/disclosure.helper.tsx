import { useState } from "react";

export type TUseDisclosureProps = boolean;
/**
 * The `useDisclosure` custom hook in TypeScript React manages the state of a disclosure component with
 * open, close, and default value functionality.
 * @param {TUseDisclosureProps}  - The `useDisclosure` function takes in an object as a parameter with
 * an optional property `defaultValue` set to `false`. This function returns an object with three
 * properties:
 * @returns The `useDisclosure` function returns an object with three properties:
 * - `isOpen`: a boolean value indicating whether the disclosure is open or closed
 * - `onOpen`: a function that sets the `isOpen` state to `true`, opening the disclosure
 * - `onClose`: a function that sets the `isOpen` state to `false`, closing the disclosure
 */
export const useDisclosure = (defaultValue = false) => {
  const [isOpen, setIsOpen] = useState(defaultValue);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return { isOpen, onOpen, onClose };
};
