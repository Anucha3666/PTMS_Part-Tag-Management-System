import { GET_ACCOUNTS } from "@/constants";
import { useMutationWithNotification } from "@/hooks";
import { TAccount, TChangeRole, TCreateAccount, TUpdateAccount } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { AccountService } from "../account.service";

export const useAccount = () => {
  const {
    getAccounts,
    createAccount,
    changeRole,
    approveAccount,
    rejectAccount,
    updateAccount,
    resetPassword,
    deleteAccount,
  } = new AccountService();

  const useGetAccounts = () => {
    return useQuery({
      queryKey: [GET_ACCOUNTS],
      queryFn: async (): Promise<TAccount[]> => await getAccounts(),
      refetchInterval: 300000,
    });
  };

  const { mutateAsync: mutateCreateAccount } = useMutationWithNotification(
    async (req: TCreateAccount) => await createAccount(req),
    "Creating...",
    [GET_ACCOUNTS]
  );

  const { mutateAsync: mutateApproveAccount } = useMutationWithNotification(
    async (account_id: string) => await approveAccount(account_id),
    "Approving...",
    [GET_ACCOUNTS]
  );

  const { mutateAsync: mutateRejectAccount } = useMutationWithNotification(
    async (account_id: string) => await rejectAccount(account_id),
    "Rejecting...",
    [GET_ACCOUNTS]
  );

  const { mutateAsync: mutateChangeRole } = useMutationWithNotification(
    async (req: TChangeRole) => await changeRole(req),
    "Changing...",
    [GET_ACCOUNTS]
  );

  const { mutateAsync: mutateUpdateAccount } = useMutationWithNotification(
    async (req: TUpdateAccount) => await updateAccount(req),
    "Updating...",
    [GET_ACCOUNTS]
  );

  const { mutateAsync: mutateResetPassword } = useMutationWithNotification(
    async (account_id: string) => await resetPassword(account_id),
    "Resetting...",
    [GET_ACCOUNTS]
  );

  const { mutateAsync: mutateDeleteAccount } = useMutationWithNotification(
    async (account_id: string) => await deleteAccount(account_id),
    "Deleting...",
    [GET_ACCOUNTS]
  );

  return {
    useGetAccounts,
    mutateCreateAccount,
    mutateApproveAccount,
    mutateRejectAccount,
    mutateChangeRole,
    mutateUpdateAccount,
    mutateResetPassword,
    mutateDeleteAccount,
  };
};
