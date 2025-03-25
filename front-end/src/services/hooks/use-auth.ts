import { useMutationWithNotification } from "@/hooks";
import { TChangePassword, TForgotPassword, TSignIn, TSignUp } from "@/types";
import { AuthService } from "../auth.service";

export const useAuth = () => {
  const { signIn, signUp, changePassword, forgotPassword } = new AuthService();

  const { mutateAsync: mutateSignIn } = useMutationWithNotification(
    async (req: TSignIn) => await signIn(req),
    "Sign in..."
  );

  const { mutateAsync: mutateSignUp } = useMutationWithNotification(
    async (req: TSignUp) => await signUp(req),
    "Sign up..."
  );

  const { mutateAsync: mutateChangePassword } = useMutationWithNotification(
    async (req: TChangePassword) => await changePassword(req),
    "Changing..."
  );

  const { mutateAsync: mutateForgotPassword } = useMutationWithNotification(
    async (req: TForgotPassword) => await forgotPassword(req),
    "Forgoting..."
  );

  return {
    mutateSignIn,
    mutateSignUp,
    mutateChangePassword,
    mutateForgotPassword,
  };
};
