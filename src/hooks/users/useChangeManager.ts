import { apiPrivate } from "@/lib/api";
import { BadRequestError, ForbiddenError, handleApiError, NotFoundError, UnauthorizedError } from "@/lib/api-errors";
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

      toast.success("Gerente alterado com sucesso!");
      return response.data;

    } catch (error) {
      try {
        handleApiError(error);
      } catch (apiError) {
        if (apiError instanceof BadRequestError) {
          toast.error("Dados inválidos. Verifique os parâmetros.");
        } else if (apiError instanceof UnauthorizedError) {
          toast.error("Você não tem permissão para realizar esta ação.");
        } else if (apiError instanceof ForbiddenError) {
          toast.error("Acesso negado. Permissões insuficientes.");
        } else if (apiError instanceof NotFoundError) {
          toast.error("Usuário ou gerente não encontrado.");
        } else {
          toast.error("Erro ao alterar gerente. Tente novamente.");
        }
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    changeManager,
    loading,
  };
};