import {
  GET_PART_CHANGE_HISTORYS,
  GET_PART_DETAILS,
  GET_PARTS,
} from "@/constants";
import { useMutationWithNotification } from "@/hooks";
import {
  TCreatePart,
  TPart,
  TPartChangeHistory,
  TPartDetails,
  TUpdatePart,
} from "@/types";
import { useQuery } from "@tanstack/react-query";
import { PartService } from "../part.service";

export const usePart = () => {
  const {
    getParts,
    getPartDetails,
    getPartChangeHistorys,
    createPart,
    updatePart,
    deletePart,
  } = new PartService();

  const useGetParts = () => {
    return useQuery({
      queryKey: [GET_PARTS],
      queryFn: async (): Promise<TPart[]> => await getParts(),
      refetchInterval: 300000,
    });
  };

  const useGetPartDetails = (part_id: string) => {
    return useQuery({
      queryKey: [GET_PART_DETAILS, part_id],
      queryFn: async (): Promise<TPartDetails> => await getPartDetails(part_id),
    });
  };

  const useGetPartChangeHistorys = (part_id: string) => {
    return useQuery({
      queryKey: [GET_PART_CHANGE_HISTORYS, part_id],
      queryFn: async (): Promise<TPartChangeHistory[]> =>
        await getPartChangeHistorys(part_id),
    });
  };

  const { mutateAsync: mutateCreatePart } = useMutationWithNotification(
    async (data: TCreatePart) => await createPart(data),
    "Creating...",
    [GET_PARTS]
  );

  const { mutateAsync: mutateUpdatePart } = useMutationWithNotification(
    async (data: TUpdatePart) => await updatePart(data),
    "Updating...",
    [GET_PARTS]
  );

  const { mutateAsync: mutateDeletePart } = useMutationWithNotification(
    async (part_id: string) => await deletePart(part_id),
    "Deleting...",
    [GET_PARTS]
  );

  return {
    useGetParts,
    useGetPartDetails,
    useGetPartChangeHistorys,
    mutateCreatePart,
    mutateUpdatePart,
    mutateDeletePart,
  };
};
