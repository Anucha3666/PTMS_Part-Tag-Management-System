import { GET_PRINTEDS } from "@/constants";
import { TPrintedTag } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { PrintedService } from "../printed.service";

export const usePrinted = () => {
  const { getPrinteds } = new PrintedService();

  const useGetPrinteds = () => {
    return useQuery({
      queryKey: [GET_PRINTEDS],
      queryFn: async (): Promise<TPrintedTag[]> => await getPrinteds(),
      refetchInterval: 300000,
    });
  };
  return {
    useGetPrinteds,
  };
};
