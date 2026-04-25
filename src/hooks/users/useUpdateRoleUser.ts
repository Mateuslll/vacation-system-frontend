import { apiPrivate } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";
import { BadRequestError, handleApiError } from "@/lib/api-errors";

export const useUpdateRoleUser = () => {
  const [loadingRoles, setLoadingRoles] = useState(false);

  const updateUserRoles = async (userId: string, roles: string) => {
    try {
      setLoadingRoles(true);


      const response = await apiPrivate.put(`/users/${userId}/roles`, {
        roleName: roles
      });

      if (!response) throw new Error("No response from server");

      toast.success("Permissões/papeis atualizadas com sucesso!");
      return response.data;

    } catch (error) {

      try {
        handleApiError(error);
      } catch (apiError) {
        if (apiError instanceof BadRequestError) {
          toast.error("Este usuario já possui essa permissão/papel.");
        }
      }

    } finally {
      setLoadingRoles(false);
    }
  };

  return {
    loadingRoles,
    updateUserRoles
  };
};