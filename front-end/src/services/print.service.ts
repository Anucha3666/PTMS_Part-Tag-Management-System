import { AxiosError } from "axios";

import { SERVICE_CONFIG_ACCESS_KEY, VITE_API_BASE_URL } from "@/constants";
import { setPrintingHistorys } from "@/store/features/print.features";
import { useAppDispatch } from "@/store/hook";
import { TPrintTag, TResponse } from "@/types";
import { localStorageCryptoUtils } from "@/utils";
import { APIService } from "./api.service";

export class PrintService extends APIService {
  dispatch = useAppDispatch();

  constructor() {
    super(VITE_API_BASE_URL, {
      accessTokenKey: SERVICE_CONFIG_ACCESS_KEY,
    });
  }

  getPrintingHistorys = async (): Promise<TPrintTag[]> => {
    try {
      const data = (await (localStorageCryptoUtils?.get("DATA_PRINT") ??
        [])) as TPrintTag[];

      this.dispatch(setPrintingHistorys(data || []));
      return data || [];
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("GET_PRINTING_HISTORYS_ERROR", error.response);
        return [];
      } else {
        console.error("UNKNOWN_ERROR", error);
        return [];
      }
    }
  };

  print = async (data: TPrintTag): Promise<TResponse<TPrintTag[]>> => {
    try {
      const dataPrint = (await (localStorageCryptoUtils?.get("DATA_PRINT") ??
        [])) as TPrintTag[];

      const res = await dataPrint?.concat({
        ...data,
        create_at: new Date()?.toISOString(),
      });

      await localStorageCryptoUtils?.set("DATA_PRINT", res);

      return {
        status: "success",
        statusCode: 200,
        message: "Print successfully",
        data: res,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("PRINT_ERROR", error.response);
        return {
          message:
            error.response?.data?.message ||
            "Failed to print in due to an unknown error",
          statusCode: error.response?.status || 500,
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to print in due to an unknown error",
          statusCode: 500,
          status: "error",
          data: [],
        };
      }
    }
  };
}
