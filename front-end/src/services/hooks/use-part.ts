import { GET_PARTS } from "@/constants";
import { useMutationWithNotification } from "@/hooks";
import { TPart } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { PartService } from "../part.service";

export const usePart = () => {
  const { getParts, createPart, updatePart, deletePart } = new PartService();

  const useGetParts = () => {
    return useQuery({
      queryKey: [GET_PARTS],
      queryFn: async (): Promise<TPart[]> => await getParts(),
      refetchInterval: 300000,
    });
  };

  const { mutateAsync: mutateCreatePart } = useMutationWithNotification(
    async (data: TPart) => await createPart(data),
    "Creating...",
    [GET_PARTS]
  );

  const { mutateAsync: mutateUpdatePart } = useMutationWithNotification(
    async (data: TPart) => await updatePart(data),
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
    mutateCreatePart,
    mutateUpdatePart,
    mutateDeletePart,
  };
};
