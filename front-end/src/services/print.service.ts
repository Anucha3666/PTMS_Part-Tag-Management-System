import { SERVICE_CONFIG_ACCESS_KEY, VITE_API_BASE_URL } from "@/constants";
import { useAppDispatch } from "@/store/hook";
import { TPrintTag, TResponse } from "@/types";
import { TPrintedTag } from "@/types/printed";
import { AxiosError } from "axios";
import { APIService } from "./api.service";

export class PrintService extends APIService {
  dispatch = useAppDispatch();

  constructor() {
    super(VITE_API_BASE_URL, {
      accessTokenKey: SERVICE_CONFIG_ACCESS_KEY,
    });
  }

  printTags = async (req: TPrintTag[]): Promise<TResponse<TPrintedTag[]>> => {
    try {
      const { data } = await this.post<TResponse<TPrintedTag[]>>(
        `/print/tags`,
        { parts: req }
      );
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("PART_TAGS_ERROR", error.response);
        return {
          message:
            error.response?.data?.message ||
            "Failed to print tags due to an unknown error",
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to print tags due to an unknown error",
          status: "error",
          data: [],
        };
      }
    }
  };
}
