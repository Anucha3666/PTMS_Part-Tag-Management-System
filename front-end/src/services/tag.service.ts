import { SERVICE_CONFIG_ACCESS_KEY, VITE_API_BASE_URL } from "@/constants";
import { setTags } from "@/store/features/tag.features";
import { useAppDispatch } from "@/store/hook";
import { TResponse, TTag, TTagView, TValidationTag } from "@/types";
import { AxiosError } from "axios";
import { APIService } from "./api.service";

export class TagService extends APIService {
  dispatch = useAppDispatch();

  constructor() {
    super(VITE_API_BASE_URL, {
      accessTokenKey: SERVICE_CONFIG_ACCESS_KEY,
    });
  }

  getTag = async (tag_no: string, tag_id: string): Promise<TTagView> => {
    try {
      const { data } = await this.get<TResponse<TTagView[]>>(
        `/tag/${tag_no}/${tag_id}`
      );
      return (data?.data[0] ?? {}) as TTagView;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("GET_TAG_ERROR", error.response);
        return {} as TTagView;
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {} as TTagView;
      }
    }
  };

  getTags = async (): Promise<TTag[]> => {
    try {
      const { data } = await this.get<TResponse<TTag[]>>(`/tags`);
      this?.dispatch(setTags(data?.data));

      return data?.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("GET_TAGS_ERROR", error.response);
        return [];
      } else {
        console.error("UNKNOWN_ERROR", error);
        return [];
      }
    }
  };

  validationTag = async (req: TValidationTag): Promise<TResponse<[]>> => {
    try {
      const { data } = await this.patch<TResponse<[]>>(
        `/tag/${req?.tag_no}/validation`,
        req
      );
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("VALIDATION_TAG_ERROR", error.response);
        return {
          message:
            error.response?.data?.message ||
            "Failed to validation tag due to an unknown error",
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to validation tag due to an unknown error",
          status: "error",
          data: [],
        };
      }
    }
  };
}
