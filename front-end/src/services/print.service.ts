import { AxiosError } from "axios";

import { SERVICE_CONFIG_ACCESS_KEY, VITE_API_BASE_URL } from "@/constants";
import { setPrintingHistorys } from "@/store/features/print.features";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { TPrintingHistorys, TPrintTag, TResponse } from "@/types";
import { localStorageCryptoUtils } from "@/utils";
import { APIService } from "./api.service";

export class PrintService extends APIService {
  dispatch = useAppDispatch();
  utils = useAppSelector((store) => store?.utils);

  constructor() {
    super(VITE_API_BASE_URL, {
      accessTokenKey: SERVICE_CONFIG_ACCESS_KEY,
    });
  }

  getPrintingHistorys = async (): Promise<TPrintingHistorys[]> => {
    try {
      const data = (await (localStorageCryptoUtils?.get("DATA_PRINT") ??
        [])) as TPrintingHistorys[];

      console.log("data", data);

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

  print = async (
    data: TPrintTag[]
  ): Promise<TResponse<TPrintingHistorys[]>> => {
    try {
      const dataPrint = (await (localStorageCryptoUtils?.get("DATA_PRINT") ??
        [])) as TPrintingHistorys[];

      const res = await [
        {
          _id: Math.floor(Date.now() / 1000).toString(),
          data: data,
          printed_by: this?.utils?.dataUser?.full_name,
          create_at: new Date()?.toISOString(),
        },
      ]?.concat(dataPrint);

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
