import { TResponse } from "@/types/common";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

export const useMutationWithNotification = <TData>(
  action: (data: TData) => Promise<TResponse<unknown>>,
  loadingMessage: string,
  revalidateKey?: string[]
) => {
  const isDarkMode = false;
  const queryClient = useQueryClient();

  // Set Swal theme based on dark mode
  const swalTheme = isDarkMode
    ? {
        background: "#121212",
        color: "#ffffff",
        confirmButtonColor: "#007bff",
        cancelButtonColor: "#d33",
      }
    : {
        background: "#ffffff",
        color: "#000000",
        confirmButtonColor: "#007bff",
        cancelButtonColor: "#d33",
      };

  const mutationFn = async (data: TData) => {
    // Show loading alert
    Swal.fire({
      title: loadingMessage,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      background: swalTheme.background,
      color: swalTheme.color,
    });

    try {
      const res = await action(data);

      // Close the loading alert and show result based on the response status
      Swal.close();
      if (res.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Successfully",
          text: res.message,
          showConfirmButton: false,
          timer: 1500,
          background: swalTheme.background,
          color: swalTheme.color,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: res.message,
          confirmButtonColor: swalTheme.cancelButtonColor,
          confirmButtonText: "Close",
          background: swalTheme.background,
          color: swalTheme.color,
        });
      }

      if (revalidateKey) {
        queryClient.invalidateQueries({
          queryKey: revalidateKey,
        });
      }

      return res;
    } catch (error: unknown) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Error",
        text: (error as Error).message,
        background: swalTheme.background,
        color: swalTheme.color,
      });
      throw error;
    }
  };

  const { mutateAsync } = useMutation<TResponse<unknown>, Error, TData>({
    mutationFn,
  });

  return { mutateAsync };
};
