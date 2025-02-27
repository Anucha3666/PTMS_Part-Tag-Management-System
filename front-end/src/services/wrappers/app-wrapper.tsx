import { FC, ReactNode } from "react";
import { usePart } from "../hooks";

export type TAppWrapperProps = {
  children: ReactNode;
};

export const AppWrapper: FC<TAppWrapperProps> = ({ children }) => {
  const { useGetParts } = usePart();

  useGetParts();
  return <>{children}</>;
};
