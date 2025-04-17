import { AxiosError } from "axios";

import {
  SERVICE_CONFIG_ACCESS_KEY,
  SERVICE_CONFIG_DATA_USER,
  VITE_API_BASE_URL,
} from "@/constants/service";
import { setCustomers } from "@/store/features/customer.features";
import { useAppDispatch } from "@/store/hook";
import { TCreateUpdateCustomer, TCustomer } from "@/types";
import { TResponse } from "@/types/common";
import { APIService } from "./api.service";

export class CustomerService extends APIService {
  dispatch = useAppDispatch();

  constructor() {
    super(VITE_API_BASE_URL, {
      accessTokenKey: SERVICE_CONFIG_ACCESS_KEY,
      userIdKey: SERVICE_CONFIG_DATA_USER,
    });
  }

  getCustomers = async (): Promise<TCustomer[]> => {
    try {
      const { data } = await this.get<TResponse<TCustomer[]>>(`/customers`);
      this?.dispatch(setCustomers(data?.data));
      return data?.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("GET_CUSTOMERS_ERROR", error.response);
        return [];
      } else {
        console.error("UNKNOWN_ERROR", error);
        return [];
      }
    }
  };

  createCustomer = async (
    req: TCreateUpdateCustomer
  ): Promise<TResponse<[]>> => {
    try {
      const formData = new FormData();

      formData.append("customer_name", req?.customer_name);
      formData.append("customer_description", req?.customer_description);
      if (req?.logo) {
        formData.append("logo", req.logo);
      }

      const { data } = await this.post<TResponse<[]>>(`/customer`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("CREATE_CUSTOMER_ERROR", error.response);
        return {
          message:
            error.response?.data?.message ||
            "Failed to create customer due to an unknown error",
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to create customer due to an unknown error",
          status: "error",
          data: [],
        };
      }
    }
  };

  updateCustomer = async (
    req: TCreateUpdateCustomer
  ): Promise<TResponse<[]>> => {
    try {
      const formData = new FormData();

      formData.append("customer_name", req?.customer_name);
      formData.append("customer_description", req?.customer_description);
      formData.append("logo", req.logo ?? "");

      const { data } = await this.put<TResponse<[]>>(`/customer`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("UPDATE_CUSTOMER_ERROR", error.response);
        return {
          message:
            error.response?.data?.message ||
            "Failed to update customer due to an unknown error",
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to update customer due to an unknown error",
          status: "error",
          data: [],
        };
      }
    }
  };

  deleteCustomer = async (customer_id: string): Promise<TResponse<[]>> => {
    try {
      const { data } = await this.delete<TResponse<[]>>(
        `/customer/${customer_id}`
      );

      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("DELETE_CUSTOMER_ERROR", error.response);
        return {
          message:
            error.response?.data?.message ||
            "Failed to delete customer due to an unknown error",
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to delete customer due to an unknown error",
          status: "error",
          data: [],
        };
      }
    }
  };
}
