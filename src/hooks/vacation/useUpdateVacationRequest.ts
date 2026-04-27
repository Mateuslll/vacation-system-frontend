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
import type { VacationRequest } from "@/types/vacation";
import { yupResolver } from "@hookform/resolvers/yup";
import { parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function formatDateForApi(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export type UpdateVacationRequestOptions = {
  onSuccess?: (updated: VacationRequest) => void;
};

export const useUpdateVacationRequest = (
  vacation: VacationRequest | null,
  options?: UpdateVacationRequestOptions
) => {
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

  useEffect(() => {
    if (!vacation) return;
    form.reset({
      startDate: parseISO(vacation.startDate),
      endDate: parseISO(vacation.endDate),
      reason: vacation.reason ?? "",
    });
  }, [vacation?.id, vacation?.startDate, vacation?.endDate, vacation?.reason, form]);

  const onSubmit = async (data: NewVacationRequestFormData) => {
    if (!vacation) return;
    try {
      setLoading(true);
      const payload = {
        startDate: formatDateForApi(data.startDate),
        endDate: formatDateForApi(data.endDate),
        reason: data.reason.trim(),
      };
      const response = await apiPrivate.put<VacationRequest>(
        `/vacation-requests/${vacation.id}`,
        payload
      );
      if (!response?.data) throw new Error("No response from server");
      toast.success("Solicitação atualizada com sucesso!");
      options?.onSuccess?.(response.data);
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
