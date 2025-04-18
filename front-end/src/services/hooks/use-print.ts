import { GET_PRINTEDS } from "@/constants";
import { useMutationWithNotification } from "@/hooks";
import { PrintService } from "../print.service";
import { TPrintTag } from "@/types";

export const usePrint = () => {
  const { printTags } = new PrintService();

  const { mutateAsync: mutatePrintTags } = useMutationWithNotification(
    async (data: TPrintTag) => await printTags(data),
    "Printing...",
    [GET_PRINTEDS]
  );

  return {
    mutatePrintTags,
  };
};
