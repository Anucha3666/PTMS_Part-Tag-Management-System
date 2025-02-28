import { useMutationWithNotification } from "@/hooks";
import { TSignIn } from "@/types";
import { AuthService } from "../auth.service";

export const useAuth = () => {
  const { signIn } = new AuthService();

  const { mutateAsync: mutateSignIn } = useMutationWithNotification(
    async (data: TSignIn) => await signIn(data),
    "Logging in..."
  );

  return {
    mutateSignIn,
  };
};
