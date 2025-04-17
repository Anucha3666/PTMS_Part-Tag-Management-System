import { AxiosError } from "axios";

import {
  SERVICE_CONFIG_ACCESS_KEY,
  SERVICE_CONFIG_DATA_USER,
  VITE_API_BASE_URL,
} from "@/constants/service";
import { setProcesses } from "@/store/features/process.features";
import { useAppDispatch } from "@/store/hook";
import { TResponse } from "@/types/common";
import { TCreateUpdateProcess, TProcess } from "@/types/process";
import { APIService } from "./api.service";

export class ProcessService extends APIService {
  dispatch = useAppDispatch();

  constructor() {
    super(VITE_API_BASE_URL, {
      accessTokenKey: SERVICE_CONFIG_ACCESS_KEY,
      userIdKey: SERVICE_CONFIG_DATA_USER,
    });
  }

  getProcesses = async (): Promise<TProcess[]> => {
    try {
      const { data } = await this.get<TResponse<TProcess[]>>(`/processes`);
      this?.dispatch(setProcesses(data?.data));
      return data?.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("GET_PROCESSES_ERROR", error.response);
        return [];
      } else {
        console.error("UNKNOWN_ERROR", error);
        return [];
      }
    }
  };

  createProcess = async (req: TCreateUpdateProcess): Promise<TResponse<[]>> => {
    try {
      const { data } = await this.post<TResponse<[]>>(`/process`, req);
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("CREATE_PROCESS_ERROR", error.response);
        return {
          message:
            error.response?.data?.message ||
            "Failed to create process due to an unknown error",
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to create process due to an unknown error",
          status: "error",
          data: [],
        };
      }
    }
  };

  updateProcess = async (req: TCreateUpdateProcess): Promise<TResponse<[]>> => {
    try {
      const { data } = await this.put<TResponse<[]>>(
        `/process/${req?.process_id}`,
        req
      );
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("UPDATE_PROCESS_ERROR", error.response);
        return {
          message:
            error.response?.data?.message ||
            "Failed to update process due to an unknown error",
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to update process due to an unknown error",
          status: "error",
          data: [],
        };
      }
    }
  };

  deleteProcess = async (process_id: string): Promise<TResponse<[]>> => {
    try {
      const { data } = await this.delete<TResponse<[]>>(
        `/process/${process_id}`
      );

      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("DELETE_PROCESS_ERROR", error.response);
        return {
          message:
            error.response?.data?.message ||
            "Failed to delete process due to an unknown error",
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to delete process due to an unknown error",
          status: "error",
          data: [],
        };
      }
    }
  };
}
