import { AxiosError } from "axios";

import { TAuth, TSignIn } from "../types/auth";
import {
  SERVICE_CONFIG_ACCESS_KEY,
  SERVICE_CONFIG_DATA_USER,
} from "@/constants/service";
import { TResponse } from "@/types/common";
import { APIService } from "./api.service";

export class AuthService extends APIService {
  constructor() {
    super("https://checklist-rooms.sncformer.com", {
      accessTokenKey: SERVICE_CONFIG_ACCESS_KEY,
      userIdKey: SERVICE_CONFIG_DATA_USER,
    });
  }

  signIn = async (data: TSignIn): Promise<TResponse<TAuth[]>> => {
    try {
      const { data: res } = await this.post<{
        err: boolean;
        msg: string;
        token: string;
        username: string;
        name: string;
        OU: string;
        position: string;
      }>("/login_ad/api", {
        router: "login",
        ...data,
      });

      const newRes: TResponse<TAuth[]> = {
        status: res?.err ? "error" : "success",
        statusCode: 0,
        message: res?.msg,
        data: [
          {
            user_id: res?.username,
            username: res?.username,
            role: "admin",
            full_name: res?.name,
            position: res?.position,
            external_auth: "",
            token: res?.token,
          },
        ],
      };

      if (newRes.status === "success") {
        this.setAccessToken(newRes.data[0].token);
        this.setDataUser(newRes.data[0]);
      }

      return newRes;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("SIGN_IN_ERROR", error.response);
        return {
          message:
            error.response?.data?.message ||
            "Failed to sign in due to an unknown error",
          statusCode: error.response?.status || 500,
          status: "error",
          data: [] as TAuth[],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to sign in due to an unknown error",
          statusCode: 500,
          status: "error",
          data: [] as TAuth[],
        };
      }
    }
  };
}
