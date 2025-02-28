import { FC, ReactNode, useEffect } from "react";
import { usePart } from "../hooks";
import { useAppDispatch } from "@/store/hook";
import { setDataUser } from "@/store/features/utils.features";
import { cookieCryptoUtils } from "@/utils";
import { TAuth } from "@/types";
import { useNavigate } from "react-router-dom";
import { SERVICE_CONFIG_DATA_USER } from "@/constants";

export type TAppWrapperProps = {
  children: ReactNode;
};

export const AppWrapper: FC<TAppWrapperProps> = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { useGetParts } = usePart();

  useGetParts();

  useEffect(() => {
    const dataUser = cookieCryptoUtils?.get(SERVICE_CONFIG_DATA_USER) as TAuth;

    if ((dataUser?.token ?? "") === "" || dataUser?.role !== "admin") {
      navigate("/login");
    }

    dispatch(setDataUser(dataUser));
  }, [dispatch, navigate]);
  return <>{children}</>;
};
