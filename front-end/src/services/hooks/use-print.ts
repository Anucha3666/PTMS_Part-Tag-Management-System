import { GET_PRINTING_HISTORYS } from "@/constants";
import { useMutationWithNotification } from "@/hooks";
import { TPrintingHistorys, TPrintTag } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { PrintService } from "../print.service";

export const usePrint = () => {
  const { getPrintingHistorys, print } = new PrintService();

  const useGetPrintingHistorys = () => {
    return useQuery({
      queryKey: [GET_PRINTING_HISTORYS],
      queryFn: async (): Promise<TPrintingHistorys[]> =>
        await getPrintingHistorys(),
      refetchInterval: 300000,
    });
  };

  const { mutateAsync: mutatePrint } = useMutationWithNotification(
    async (data: TPrintTag[]) => await print(data),
    "Printing...",
    [GET_PRINTING_HISTORYS]
  );

  return {
    useGetPrintingHistorys,
    mutatePrint,
  };
};
