import { GET_PROCESSES } from "@/constants";
import { useMutationWithNotification } from "@/hooks";
import { TCreateUpdateProcess, TProcess } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ProcessService } from "../process.service";

export const useProcess = () => {
  const { getProcesses, createProcess, updateProcess, deleteProcess } =
    new ProcessService();

  const useGetProcesses = () => {
    return useQuery({
      queryKey: [GET_PROCESSES],
      queryFn: async (): Promise<TProcess[]> => await getProcesses(),
      refetchInterval: 300000,
    });
  };

  const { mutateAsync: mutateCreateProcess } = useMutationWithNotification(
    async (req: TCreateUpdateProcess) => await createProcess(req),
    "Creating...",
    [GET_PROCESSES]
  );

  const { mutateAsync: mutateUpdateProcess } = useMutationWithNotification(
    async (req: TCreateUpdateProcess) => await updateProcess(req),
    "Updating...",
    [GET_PROCESSES]
  );

  const { mutateAsync: mutateDeleteProcess } = useMutationWithNotification(
    async (process_id: string) => await deleteProcess(process_id),
    "Deleting...",
    [GET_PROCESSES]
  );

  return {
    useGetProcesses,
    mutateCreateProcess,
    mutateUpdateProcess,
    mutateDeleteProcess,
  };
};
