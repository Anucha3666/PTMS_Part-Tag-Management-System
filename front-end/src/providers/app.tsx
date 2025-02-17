import { FC, ReactNode } from "react";

import "react-photo-view/dist/react-photo-view.css";
import { StoreProvider } from "./provider";

export type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider: FC<AppProviderProps> = ({ children }) => {
  return <StoreProvider>{children}</StoreProvider>;
};
