import { AxiosError } from "axios";

import { SERVICE_CONFIG_ACCESS_KEY, VITE_API_BASE_URL } from "@/constants";
import { setParts } from "@/store/features/part.features";
import { useAppDispatch } from "@/store/hook";
import {
  TCreatePart,
  TPart,
  TPartChangeHistory,
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

  getPart = async (part_id: string): Promise<TPart> => {
    try {
      const { data } = await this.get<TResponse<TPart[]>>(`/part/${part_id}`);
      return (data?.data[0] ?? {}) as TPart;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("GET_PART_DETAILS_ERROR", error.response);
        return {} as TPart;
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {} as TPart;
      }
    }
  };

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
      const formData = new FormData();

      formData.append("part_no", req?.part_no);
      formData.append("part_name", req?.part_name);
      formData.append("packing_std", String(req?.packing_std));
      if (req?.picture_std) {
        formData.append("picture_std", req.picture_std);
      }
      if (req?.q_point) {
        formData.append("q_point", req.q_point);
      }
      if (req?.packing) {
        formData.append("packing", req.packing);
      }
      if ((req?.more_pictures?.length ?? 0) > 0) {
        for (const more_picture of req?.more_pictures ?? []) {
          formData.append("more_pictures", more_picture);
        }
      }

      const { data } = await this.post<TResponse<[]>>(`/part`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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
      const formData = new FormData();

      formData.append("part_name", req?.part_name);
      formData.append("packing_std", String(req?.packing_std));
      formData.append("picture_std", req.picture_std);
      formData.append("q_point", req.q_point);
      formData.append("packing", req.packing);
      if ((req?.more_pictures?.length ?? 0) > 0) {
        for (const more_picture of req?.more_pictures ?? []) {
          formData.append("more_pictures", more_picture);
        }
      }

      const { data } = await this.put<TResponse<[]>>(
        `/part/${req?.part_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
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
