import { apiPrivate } from "@/lib/api";
import { BadRequestError, ConflictError, handleApiError, NotFoundError } from "@/lib/api-errors";
import { newVacationRequestSchema } from "@/lib/validations/schemas";
import { NewVacationRequestFormData } from "@/types/forms";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const useCreateVacationRequest = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm<NewVacationRequestFormData>({
    mode: "onChange",
    resolver: yupResolver(newVacationRequestSchema),
    defaultValues: {
      startDate: undefined,
      endDate: undefined,
      reason: "",
    }
  });

  const onSubmit = async (data: NewVacationRequestFormData) => {
    try {
      setLoading(true);
      const payload = {
        startDate: data.startDate.toISOString().split('T')[0],
        endDate: data.endDate.toISOString().split('T')[0],
        reason: data.reason.trim(),
      };

      const response = await apiPrivate.post("/vacation-requests", payload);

      if (!response) throw new Error("No response from server");

      toast.success("Solicitação de férias criada com sucesso!");
      form.reset();
      return response.data;

    } catch (error) {
      console.error("Error creating vacation request:", error);
      try {
        handleApiError(error);
      } catch (apiError) {
        if (apiError instanceof BadRequestError) {
          toast.error("Dados inválidos. Verifique os campos.");
        } else if (apiError instanceof NotFoundError) {
          toast.error("Recurso não encontrado.");
        } else if (apiError instanceof ConflictError) {
          toast.error("Sobreposição de período com outra solicitação.");
        }
      }
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