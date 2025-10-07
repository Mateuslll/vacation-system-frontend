import { apiPrivate } from "@/lib/api";
import { ConflictError, handleApiError, NotFoundError } from "@/lib/api-errors";
import { UserStore } from "@/stores/user";
import { useState } from "react";
import { toast } from "sonner";

export const useToggleUser = (onSuccess?: () => void) => {
  const [isToggling, setIsToggling] = useState(false);

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
      return;
    }

    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };



  const deactivateUser = async (userId: string) => {
    try {
      setIsToggling(true);
      const response = await apiPrivate.put(`/users/${userId}/deactivate`);

      if (!response) throw new Error("No response from server");


      toast.success("Usuário desativado com sucesso!");
      handleSuccess();

    } catch (error) {
      try {
        handleApiError(error);
      } catch (apiError) {
        if (apiError instanceof NotFoundError) {
          toast.error("Usuário não encontrado.");
        } else if (apiError instanceof ConflictError) {
          toast.error("Este usuario já está desativado.");
        }
      }
    } finally {
      setIsToggling(false);
    }
  };


  const activateUser = async (userId: string) => {
    try {
      setIsToggling(true);
      const response = await apiPrivate.put(`/users/${userId}/activate`);
      if (!response) throw new Error("No response from server");

      toast.success("Usuário ativado com sucesso!");
      handleSuccess();

    } catch (error) {
      try {
        handleApiError(error);
      } catch (apiError) {
        if (apiError instanceof NotFoundError) {
          toast.error("Usuário não encontrado.");
        } else if (apiError instanceof ConflictError) {
          toast.error("Este usuario já está ativado.");
        }
      }
    } finally {
      setIsToggling(false);
    }
  };

  return {
    deactivateUser,
    activateUser,
    isToggling
  };
}