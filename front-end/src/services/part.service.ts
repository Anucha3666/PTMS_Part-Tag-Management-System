import { AxiosError } from "axios";

import { useAppDispatch } from "@/store/hook";
import { SERVICE_CONFIG_ACCESS_KEY, VITE_API_BASE_URL } from "@/constants";
import { APIService } from "./api.service";
import { TPart, TResponse } from "@/types";
import { localStorageCryptoUtils } from "@/utils";
import { setParts } from "@/store/features/parts.features";

export class PartService extends APIService {
  dispatch = useAppDispatch();

  constructor() {
    super(VITE_API_BASE_URL, {
      accessTokenKey: SERVICE_CONFIG_ACCESS_KEY,
    });
  }

  getParts = async (): Promise<TPart[]> => {
    try {
      const data = (await (localStorageCryptoUtils?.get("DATA_PART") ??
        [])) as TPart[];

      this.dispatch(setParts(data || []));
      return data || [];
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("GET_PARTS_ERROR", error.response);
        return [];
      } else {
        console.error("UNKNOWN_ERROR", error);
        return [];
      }
    }
  };

  createPart = async (data: TPart): Promise<TResponse<TPart[]>> => {
    try {
      const dataPart = (await (localStorageCryptoUtils?.get("DATA_PART") ??
        [])) as TPart[];

      const res = await dataPart?.concat({
        ...data,
        part_id: Math.floor(Date.now() / 1000).toString(),
        create_at: new Date()?.toISOString(),
        update_at: new Date()?.toISOString(),
      });

      await localStorageCryptoUtils?.set("DATA_PART", res);

      return {
        status: "success",
        statusCode: 200,
        message: "Create part successfully",
        data: res,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("CREATE_PART_ERROR", error.response);
        return {
          message:
            error.response?.data?.message ||
            "Failed to create part in due to an unknown error",
          statusCode: error.response?.status || 500,
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to create part in due to an unknown error",
          statusCode: 500,
          status: "error",
          data: [],
        };
      }
    }
  };

  updatePart = async (data: TPart): Promise<TResponse<TPart[]>> => {
    try {
      const dataPart = (await (localStorageCryptoUtils?.get("DATA_PART") ??
        [])) as TPart[];

      const res = await dataPart?.map((item) =>
        item?.part_id === data?.part_id
          ? { ...data, update_at: new Date()?.toISOString() }
          : item
      );

      await localStorageCryptoUtils?.set("DATA_PART", res);

      return {
        status: "success",
        statusCode: 200,
        message: "Update part successfully",
        data: res,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("UPDATE_PART_ERROR", error.response);
        return {
          message:
            error.response?.data?.message ||
            "Failed to update part in due to an unknown error",
          statusCode: error.response?.status || 500,
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to update part in due to an unknown error",
          statusCode: 500,
          status: "error",
          data: [],
        };
      }
    }
  };

  deletePart = async (part_id: string): Promise<TResponse<TPart[]>> => {
    try {
      const dataPart = (await (localStorageCryptoUtils?.get("DATA_PART") ??
        [])) as TPart[];

      const res = await dataPart?.filter((item) => item?.part_id !== part_id);

      await localStorageCryptoUtils?.set("DATA_PART", res);

      return {
        status: "success",
        statusCode: 200,
        message: "Delete part successfully",
        data: res,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("DELETE_PART_ERROR", error.response);
        return {
          message:
            error.response?.data?.message ||
            "Failed to delete part in due to an unknown error",
          statusCode: error.response?.status || 500,
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to delete part in due to an unknown error",
          statusCode: 500,
          status: "error",
          data: [],
        };
      }
    }
  };
}
