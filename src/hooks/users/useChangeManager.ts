import { apiPrivate } from "@/lib/api";
import { parseApiFailure } from "@/lib/api-errors";
import { UserListItem } from "@/types/user";
import { useState } from "react";
import { toast } from "sonner";

export const useChangeManager = () => {
  const [loading, setLoading] = useState(false);

  const changeManager = async (userId: string, managerId: string) => {
    try {
      setLoading(true);

      const response = await apiPrivate.put<UserListItem>(`/users/${userId}/manager/${managerId}`);

      if (!response) throw new Error("No response from server");

      toast.success("Gestor atualizado com sucesso.");
      return response.data;
    } catch (error) {
      const apiError = parseApiFailure(error);
      toast.error(apiError.message);
      throw apiError;
    } finally {
      setLoading(false);
    }
  };

  return {
    changeManager,
    loading,
  };
};
