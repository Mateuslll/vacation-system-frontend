import { apiPrivate } from "@/lib/api";
import { BadRequestError, ConflictError, ForbiddenError, handleApiError, NotFoundError } from "@/lib/api-errors";
import { rejectVacationSchema } from "@/lib/validations/schemas";
import { RejectVacationFormData } from "@/types/forms";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const useActionsVacation = () => {
  const [loadingActionsVacation, setLoadingActionsVacation] = useState(false);

  const form = useForm({
    mode: "onChange",
    resolver: yupResolver(rejectVacationSchema),
    defaultValues: {
      rejectionReason: "",
    }
  });



  const approveVacation = async (id: string) => {

    try {
      setLoadingActionsVacation(true);

      const response = await apiPrivate.put(`/vacation-requests/${id}/approve`);
      if (!response) throw new Error("No response from server");
      toast.success("Solicitação aprovada com sucesso!");

      return response.data;

    } catch (error) {
      try {
        handleApiError(error);
      } catch (apiError) {
        if (apiError instanceof ForbiddenError) {
          toast.error("Você não tem permissão para aprovar esta solicitação.");
        } else if (apiError instanceof NotFoundError) {
          toast.error("Solicitação de férias não encontrada.");
        } else if (apiError instanceof ConflictError) {
          toast.error("Solicitação já foi processada.");
        }
      }
      throw error;
    } finally {
      setLoadingActionsVacation(false);
    }
  }


  const rejectVacation = async (id: string, data: RejectVacationFormData) => {
    try {
      setLoadingActionsVacation(true);
      const response = await apiPrivate.put(`/vacation-requests/${id}/reject`, data);
      if (!response) throw new Error("No response from server");

      toast.success("Solicitação rejeitada com sucesso!");
      return response.data;

    } catch (error) {
      try {
        handleApiError(error);
      } catch (apiError) {
        if (apiError instanceof BadRequestError) {
          form.setError("rejectionReason", { message: "Motivo de rejeição é obrigatório." });
        }
        else if (apiError instanceof ForbiddenError) {
          toast.error("Você não tem permissão para rejeitar esta solicitação.");
        } else if (apiError instanceof NotFoundError) {
          toast.error("Solicitação de férias ou gerente não encontrada.");
        } else if (apiError instanceof ConflictError) {
          toast.error("Solicitação já foi processada.");
        }
      }
      throw error;
    } finally {
      setLoadingActionsVacation(false);
    }
  }

  const cancelVacation = async (id: string) => {
    try {
      setLoadingActionsVacation(true);
      const response = await apiPrivate.put(`/vacation-requests/${id}/cancel`);
      if (!response) throw new Error("No response from server");
      toast.success("Solicitação cancelada com sucesso!");
      return response.data;
    } catch (error) {
      try {
        handleApiError(error);
      } catch (apiError) {
        if (apiError instanceof ForbiddenError) {
          toast.error("Você não tem permissão para cancelar esta solicitação.");
        } else if (apiError instanceof NotFoundError) {
          toast.error("Solicitação de férias não encontrada.");
        } else if (apiError instanceof ConflictError) {
          toast.error("Solicitação já foi processada ou cancelada.");
        }
      }
    } finally {
      setLoadingActionsVacation(false);
    }
  }

  return {
    form,
    approveVacation,
    rejectVacation,
    cancelVacation,
    loadingActionsVacation
  }
};