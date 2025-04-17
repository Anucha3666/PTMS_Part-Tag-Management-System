import { GET_CUSTOMERS } from "@/constants";
import { useMutationWithNotification } from "@/hooks";
import { TCreateUpdateCustomer, TCustomer } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { CustomerService } from "../customer.service";

export const useCustomer = () => {
  const { getCustomers, createCustomer, updateCustomer, deleteCustomer } =
    new CustomerService();

  const useGetCustomers = () => {
    return useQuery({
      queryKey: [GET_CUSTOMERS],
      queryFn: async (): Promise<TCustomer[]> => await getCustomers(),
      refetchInterval: 300000,
    });
  };

  const { mutateAsync: mutateCreateCustomer } = useMutationWithNotification(
    async (req: TCreateUpdateCustomer) => await createCustomer(req),
    "Creating...",
    [GET_CUSTOMERS]
  );

  const { mutateAsync: mutateUpdateCustomer } = useMutationWithNotification(
    async (req: TCreateUpdateCustomer) => await updateCustomer(req),
    "Updating...",
    [GET_CUSTOMERS]
  );

  const { mutateAsync: mutateDeleteCustomer } = useMutationWithNotification(
    async (customer_id: string) => await deleteCustomer(customer_id),
    "Deleting...",
    [GET_CUSTOMERS]
  );

  return {
    useGetCustomers,
    mutateCreateCustomer,
    mutateUpdateCustomer,
    mutateDeleteCustomer,
  };
};
