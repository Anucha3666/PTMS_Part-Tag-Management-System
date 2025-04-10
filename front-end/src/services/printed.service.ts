import { SERVICE_CONFIG_ACCESS_KEY, VITE_API_BASE_URL } from "@/constants";
import { setPrinted } from "@/store/features/printed.features";
import { useAppDispatch } from "@/store/hook";
import { TPrintedTag, TResponse } from "@/types";
import { AxiosError } from "axios";
import { APIService } from "./api.service";

export class PrintedService extends APIService {
  dispatch = useAppDispatch();

  constructor() {
    super(VITE_API_BASE_URL, {
      accessTokenKey: SERVICE_CONFIG_ACCESS_KEY,
    });
  }

  getPrinteds = async (): Promise<TPrintedTag[]> => {
    try {
      const { data } = await this.get<TResponse<TPrintedTag[]>>(`/printeds`);
      this?.dispatch(setPrinted(data?.data));

      return data?.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("GET_PRINTEDS_ERROR", error.response);
        return [];
      } else {
        console.error("UNKNOWN_ERROR", error);
        return [];
      }
    }
  };
}
