import { useMutationWithNotification } from "@/hooks";
import { TChangePassword, TForgotPassword, TSignIn, TSignUp } from "@/types";
import { AuthService } from "../auth.service";

export const useAuth = () => {
  const { signIn, signUp, signOut, changePassword, forgotPassword } =
    new AuthService();

  const { mutateAsync: mutateSignIn } = useMutationWithNotification(
    async (req: TSignIn) => await signIn(req),
    "Sign in..."
  );

  const { mutateAsync: mutateSignUp } = useMutationWithNotification(
    async (req: TSignUp) => await signUp(req),
    "Sign up..."
  );

  const { mutateAsync: mutateSignOut } = useMutationWithNotification(
    async () => await signOut(),
    "Sign outing..."
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
    mutateSignOut,
    mutateChangePassword,
    mutateForgotPassword,
  };
};
