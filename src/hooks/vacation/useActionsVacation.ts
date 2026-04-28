import { apiPrivate } from "@/lib/api";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  parseApiFailure,
} from "@/lib/api-errors";
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
    },
  });

  const approveVacation = async (id: string) => {
    try {
      setLoadingActionsVacation(true);

      const response = await apiPrivate.put(`/vacation-requests/${id}/approve`);
      if (!response) throw new Error("No response from server");
      toast.success("Solicitação aprovada com sucesso!");

      return response.data;
    } catch (error) {
      const apiError = parseApiFailure(error);
      if (apiError instanceof ForbiddenError) {
        toast.error(apiError.message);
      } else if (apiError instanceof NotFoundError) {
        toast.error(apiError.message);
      } else if (apiError instanceof ConflictError) {
        toast.error(apiError.message);
      } else {
        toast.error(apiError.message);
      }
      throw apiError;
    } finally {
      setLoadingActionsVacation(false);
    }
  };

  const rejectVacation = async (id: string, data: RejectVacationFormData) => {
    try {
      setLoadingActionsVacation(true);
      const response = await apiPrivate.put(`/vacation-requests/${id}/reject`, data);
      if (!response) throw new Error("No response from server");

      toast.success("Solicitação rejeitada com sucesso!");
      return response.data;
    } catch (error) {
      const apiError = parseApiFailure(error);
      if (apiError instanceof BadRequestError) {
        form.setError("rejectionReason", { message: apiError.message });
      } else if (apiError instanceof ForbiddenError) {
        toast.error(apiError.message);
      } else if (apiError instanceof NotFoundError) {
        toast.error(apiError.message);
      } else if (apiError instanceof ConflictError) {
        toast.error(apiError.message);
      } else {
        toast.error(apiError.message);
      }
      throw apiError;
    } finally {
      setLoadingActionsVacation(false);
    }
  };

  const cancelVacation = async (id: string) => {
    try {
      setLoadingActionsVacation(true);
      const response = await apiPrivate.put(`/vacation-requests/${id}/cancel`);
      if (!response) throw new Error("No response from server");
      toast.success("Solicitação cancelada com sucesso!");
      return response.data;
    } catch (error) {
      const apiError = parseApiFailure(error);
      if (apiError instanceof ForbiddenError) {
        toast.error(apiError.message);
      } else if (apiError instanceof NotFoundError) {
        toast.error(apiError.message);
      } else if (apiError instanceof ConflictError) {
        toast.error(apiError.message);
      } else {
        toast.error(apiError.message);
      }
      throw apiError;
    } finally {
      setLoadingActionsVacation(false);
    }
  };

  return {
    form,
    approveVacation,
    rejectVacation,
    cancelVacation,
    loadingActionsVacation,
  };
};
