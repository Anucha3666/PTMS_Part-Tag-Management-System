import { AxiosError } from "axios";

import { SERVICE_CONFIG_ACCESS_KEY, VITE_API_BASE_URL } from "@/constants";
import { setParts } from "@/store/features/part.features";
import { useAppDispatch } from "@/store/hook";
import {
  TCreatePart,
  TPart,
  TPartChangeHistory,
  TPartDetails,
  TResponse,
  TUpdatePart,
} from "@/types";
import { APIService } from "./api.service";

export class PartService extends APIService {
  dispatch = useAppDispatch();

  constructor() {
    super(VITE_API_BASE_URL, {
      accessTokenKey: SERVICE_CONFIG_ACCESS_KEY,
    });
  }

  getParts = async (): Promise<TPart[]> => {
    try {
      const { data } = await this.get<TResponse<TPart[]>>(`/parts`);
      this?.dispatch(setParts(data?.data));
      return data?.data;
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

  getPartDetails = async (part_id: string): Promise<TPartDetails> => {
    try {
      const { data } = await this.get<TResponse<TPartDetails[]>>(
        `/part/${part_id}/details`
      );
      return (data?.data[0] ?? {}) as TPartDetails;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("GET_PART_DETAILS_ERROR", error.response);
        return {} as TPartDetails;
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {} as TPartDetails;
      }
    }
  };

  getPartChangeHistorys = async (
    part_id: string
  ): Promise<TPartChangeHistory[]> => {
    try {
      const { data } = await this.get<TResponse<TPartChangeHistory[]>>(
        `/part/${part_id}/change-history`
      );
      return data?.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("GET_PART_HISTORY_ERROR", error.response);
        return [];
      } else {
        console.error("UNKNOWN_ERROR", error);
        return [];
      }
    }
  };

  createPart = async (req: TCreatePart): Promise<TResponse<[]>> => {
    try {
      const { data } = await this.post<TResponse<[]>>(`/part`, req);
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("CREATE_PART_ERROR", error.response);
        return {
          message:
            error.response?.data?.message ||
            "Failed to create part due to an unknown error",
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to create part due to an unknown error",
          status: "error",
          data: [],
        };
      }
    }
  };

  updatePart = async (req: TUpdatePart): Promise<TResponse<[]>> => {
    try {
      const { data } = await this.put<TResponse<[]>>(
        `/part/${req?.part_id}`,
        req
      );

      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("UPDATE_PART_ERROR", error.response);
        return {
          message:
            error.response?.data?.message ||
            "Failed to update part due to an unknown error",
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to update part due to an unknown error",
          status: "error",
          data: [],
        };
      }
    }
  };

  deletePart = async (part_id: string): Promise<TResponse<[]>> => {
    try {
      const { data } = await this.delete<TResponse<[]>>(`/part/${part_id}`);

      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("DELETE_PART_ERROR", error.response);
        return {
          message:
            error.response?.data?.message ||
            "Failed to delete part due to an unknown error",
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to delete part due to an unknown error",
          status: "error",
          data: [],
        };
      }
    }
  };
}
