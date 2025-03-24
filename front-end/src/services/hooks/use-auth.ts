import { useMutationWithNotification } from "@/hooks";
import { TSignIn, TSignUp } from "@/types";
import { AuthService } from "../auth.service";

export const useAuth = () => {
  const { signIn, signUp } = new AuthService();

  const { mutateAsync: mutateSignIn } = useMutationWithNotification(
    async (data: TSignIn) => await signIn(data),
    "Sign in..."
  );

  const { mutateAsync: mutateSignUp } = useMutationWithNotification(
    async (data: TSignUp) => await signUp(data),
    "Sign up..."
  );

  return {
    mutateSignIn,
    mutateSignUp,
  };
};
