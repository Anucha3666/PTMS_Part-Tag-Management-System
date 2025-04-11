import {
  SERVICE_CONFIG_ACCESS_KEY,
  SERVICE_CONFIG_DATA_USER,
  VITE_API_BASE_URL,
} from "@/constants/service";
import { TResponse } from "@/types/common";
import { setCookieCrypto } from "@/utils";
import { AxiosError } from "axios";
import {
  TAuth,
  TChangePassword,
  TForgotPassword,
  TSignIn,
  TSignUp,
} from "../types/auth";
import { APIService } from "./api.service";

export class AuthService extends APIService {
  constructor() {
    super(VITE_API_BASE_URL, {
      accessTokenKey: SERVICE_CONFIG_ACCESS_KEY,
      userIdKey: SERVICE_CONFIG_DATA_USER,
    });
  }

  signIn = async (req: TSignIn): Promise<TResponse<TAuth[]>> => {
    try {
      const { data } = await this.post<TResponse<TAuth[]>>(
        "/auth/sign-in",
        req
      );

      if (data?.status) {
        this?.setAccessToken(data?.data[0]?.token);
        this?.setDataUser(data?.data[0]);
        if (req?.remember) setCookieCrypto("auth_remember", req);
      }
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("SIGN_IN_ERROR", error.response);
        return {
          message:
            error.response?.data?.message ||
            "Failed to sign in due to an unknown error",
          status: "error",
          data: [] as TAuth[],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to sign in due to an unknown error",
          status: "error",
          data: [] as TAuth[],
        };
      }
    }
  };

  signUp = async (req: TSignUp): Promise<TResponse<[]>> => {
    try {
      const { data } = await this.post<TResponse<[]>>("/auth/sign-up", req);

      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("SIGN_UP_ERROR", error.response);
        return {
          message:
            error.response?.data?.message ||
            "Failed to sign up due to an unknown error",
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to sign up due to an unknown error",
          status: "error",
          data: [],
        };
      }
    }
  };

  signOut = async (): Promise<TResponse<[]>> => {
    try {
      this?.clearAuthCookies();
      return {
        status: "success",
        message: "Logged out successfully.",
        data: [],
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("SIGN_OUT_ERROR", error.response);
        return {
          message:
            error.response?.data?.message ||
            "Failed to sign out due to an unknown error",
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to sign out due to an unknown error",
          status: "error",
          data: [],
        };
      }
    }
  };

  forgotPassword = async (req: TForgotPassword): Promise<TResponse<[]>> => {
    try {
      const { data } = await this.post<TResponse<[]>>(
        `/auth/forgot-password`,
        req
      );

      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("FORGOT_PASSWORD_ERROR", error.response);
        return {
          message:
            error.response?.data?.message ||
            "Failed to forgot password due to an unknown error",
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to forgot password due to an unknown error",
          status: "error",
          data: [],
        };
      }
    }
  };

  changePassword = async (req: TChangePassword): Promise<TResponse<[]>> => {
    try {
      const { data } = await this.put<TResponse<[]>>(
        "/auth/change-password",
        req
      );

      this?.signOut();
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("CHANGE_PASSWORD_ERROR", error.response);
        return {
          message:
            error.response?.data?.message ||
            "Failed to change password due to an unknown error",
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to change password due to an unknown error",
          status: "error",
          data: [],
        };
      }
    }
  };
}
