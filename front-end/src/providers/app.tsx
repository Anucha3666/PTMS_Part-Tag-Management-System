import { FC, ReactNode } from "react";

import "react-photo-view/dist/react-photo-view.css";
import { StoreProvider } from "./provider";
import { ReactQueryProvider } from "./react-query";

export type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider: FC<AppProviderProps> = ({ children }) => {
  return (
    <StoreProvider>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </StoreProvider>
  );
};
