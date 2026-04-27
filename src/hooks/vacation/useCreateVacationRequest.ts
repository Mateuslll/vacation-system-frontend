import { apiPrivate } from "@/lib/api";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  parseApiFailure,
  UnprocessableEntityError,
} from "@/lib/api-errors";
import { newVacationRequestSchema } from "@/lib/validations/schemas";
import { NewVacationRequestFormData } from "@/types/forms";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export type CreateVacationRequestOptions = {
  onSuccess?: () => void;
};

export const useCreateVacationRequest = (options?: CreateVacationRequestOptions) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<NewVacationRequestFormData>({
    mode: "onChange",
    resolver: yupResolver(newVacationRequestSchema),
    defaultValues: {
      startDate: undefined,
      endDate: undefined,
      reason: "",
    },
  });

  const onSubmit = async (data: NewVacationRequestFormData) => {
    try {
      setLoading(true);

      const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const payload = {
        startDate: formatDate(data.startDate),
        endDate: formatDate(data.endDate),
        reason: data.reason.trim(),
      };

      const response = await apiPrivate.post("/vacation-requests", payload);

      if (!response) throw new Error("No response from server");

      toast.success("Solicitação de férias criada com sucesso!");
      form.reset();
      options?.onSuccess?.();
      return response.data;
    } catch (error) {
      const apiError = parseApiFailure(error);
      if (apiError instanceof ForbiddenError) {
        toast.error(apiError.message);
      } else if (apiError instanceof BadRequestError) {
        toast.error(apiError.message);
      } else if (apiError instanceof NotFoundError) {
        toast.error(apiError.message);
      } else if (apiError instanceof ConflictError) {
        toast.error(apiError.message);
      } else if (apiError instanceof UnprocessableEntityError) {
        toast.error(apiError.message);
      } else {
        toast.error(apiError.message);
      }
      throw apiError;
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    errors: form.formState.errors,
    loading,
  };
};
