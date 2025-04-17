import { AxiosError } from "axios";

import {
  SERVICE_CONFIG_ACCESS_KEY,
  SERVICE_CONFIG_DATA_USER,
  VITE_API_BASE_URL,
} from "@/constants/service";
import { setAccounts } from "@/store/features/account.features";
import { useAppDispatch } from "@/store/hook";
import { TAccount, TChangeRole, TCreateAccount, TUpdateAccount } from "@/types";
import { TResponse } from "@/types/common";
import { APIService } from "./api.service";

export class ProcessesService extends APIService {
  dispatch = useAppDispatch();

  constructor() {
    super(VITE_API_BASE_URL, {
      accessTokenKey: SERVICE_CONFIG_ACCESS_KEY,
      userIdKey: SERVICE_CONFIG_DATA_USER,
    });
  }

  getAccounts = async (): Promise<TAccount[]> => {
    try {
      const { data } = await this.get<TResponse<TAccount[]>>(`/accounts`);
      this?.dispatch(setAccounts(data?.data));
      return data?.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("GET_ACCOUNTS_ERROR", error.response);
        return [];
      } else {
        console.error("UNKNOWN_ERROR", error);
        return [];
      }
    }
  };

  createAccount = async (req: TCreateAccount): Promise<TResponse<[]>> => {
    try {
      const formData = new FormData();

      formData.append("employee_number", req?.employee_number);
      formData.append("first_name", req?.first_name);
      formData.append("last_name", req?.last_name);
      formData.append("position", req?.position ?? "");
      if (req?.profile_picture) {
        formData.append("profile_picture", req.profile_picture);
      }
      formData.append("username", req?.username);
      formData.append("password", req?.password);
      formData.append("role", req?.role ?? "");

      const { data } = await this.post<TResponse<[]>>(`/account`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("CREATE_ACCOUNT_ERROR", error.response);
        return {
          message:
            error.response?.data?.message ||
            "Failed to create account due to an unknown error",
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to create account due to an unknown error",
          status: "error",
          data: [],
        };
      }
    }
  };

  approveAccount = async (account_id: string): Promise<TResponse<[]>> => {
    try {
      const { data } = await this.patch<TResponse<[]>>(
        `/account/${account_id}/approve`
      );
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("APPROVE_ACCOUNT_ERROR", error.response);
        return {
          message:
            error.response?.data?.message ||
            "Failed to approve account due to an unknown error",
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to approve account due to an unknown error",
          status: "error",
          data: [],
        };
      }
    }
  };

  rejectAccount = async (account_id: string): Promise<TResponse<[]>> => {
    try {
      const { data } = await this.patch<TResponse<[]>>(
        `/account/${account_id}/reject`
      );
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("REJECT_ACCOUNT_ERROR", error.response);
        return {
          message:
            error.response?.data?.message ||
            "Failed to reject account due to an unknown error",
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to reject account due to an unknown error",
          status: "error",
          data: [],
        };
      }
    }
  };

  changeRole = async (req: TChangeRole): Promise<TResponse<[]>> => {
    try {
      const { data } = await this.patch<TResponse<[]>>(
        `/account/${req?.account_id}/role`,
        {
          role: req?.role ?? "",
        }
      );
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("CHANGE_ROLE_ERROR", error.response);
        return {
          message:
            error.response?.data?.message ||
            "Failed to change role due to an unknown error",
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to change role due to an unknown error",
          status: "error",
          data: [],
        };
      }
    }
  };

  resetPassword = async (account_id: string): Promise<TResponse<[]>> => {
    try {
      const { data } = await this.patch<TResponse<[]>>(
        `/account/${account_id}/reset-password`
      );
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("RESET_PASSWORD_ERROR", error.response);
        return {
          message:
            error.response?.data?.message ||
            "Failed to reset password due to an unknown error",
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to reset password due to an unknown error",
          status: "error",
          data: [],
        };
      }
    }
  };

  updateAccount = async (req: TUpdateAccount): Promise<TResponse<[]>> => {
    try {
      const formData = new FormData();

      formData.append("first_name", req?.first_name);
      formData.append("last_name", req?.last_name);
      formData.append("position", req?.position ?? "");
      formData.append("profile_picture", req.profile_picture ?? "");

      const { data } = await this.put<TResponse<[]>>(`/account`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("UPDATE_ACCOUNT_ERROR", error.response);
        return {
          message:
            error.response?.data?.message ||
            "Failed to update account due to an unknown error",
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to update account due to an unknown error",
          status: "error",
          data: [],
        };
      }
    }
  };

  deleteAccount = async (account_id: string): Promise<TResponse<[]>> => {
    try {
      const { data } = await this.delete<TResponse<[]>>(
        `/account/${account_id}`
      );

      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("DELETE_ACCOUNT_ERROR", error.response);
        return {
          message:
            error.response?.data?.message ||
            "Failed to delete account due to an unknown error",
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to delete account due to an unknown error",
          status: "error",
          data: [],
        };
      }
    }
  };
}
