import { SERVICE_CONFIG_DATA_USER } from "@/constants";
import { setDataUser } from "@/store/features/utils.features";
import { useAppDispatch } from "@/store/hook";
import { TAuth } from "@/types";
import { cookieCryptoUtils } from "@/utils";
import { FC, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount, usePart, usePrinted, useTag } from "../hooks";

export type TAppWrapperProps = {
  children: ReactNode;
};

export const AppWrapper: FC<TAppWrapperProps> = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { useGetAccounts } = useAccount();
  const { useGetParts } = usePart();
  const { useGetPrinteds } = usePrinted();
  const { useGetTags } = useTag();

  useGetAccounts();
  useGetParts();
  useGetPrinteds();
  useGetTags();

  useEffect(() => {
    const dataUser = cookieCryptoUtils?.get(SERVICE_CONFIG_DATA_USER) as TAuth;
    console.log("cookieCryptoUtils", dataUser);

    if ((dataUser?.token ?? "") === "" || (dataUser?.role ?? "") === "") {
      navigate("/login");
    }

    dispatch(setDataUser(dataUser));
  }, [dispatch, navigate]);

  return <>{children}</>;
};
