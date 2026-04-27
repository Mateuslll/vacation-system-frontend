import { apiPublic } from "@/lib/api"
import { ApiError, BadRequestError, handleApiError, NetworkError, UnauthorizedError } from "@/lib/api-errors"
import { signUpSchema } from "@/lib/validations/schemas"
import { SignUpFormData } from "@/types/forms"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { UserStore } from "@/stores/user";


export const useCreateUser = () => {

  const setUser = UserStore(state => state.setUser);

  const form = useForm({
    mode: "onChange",
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    }
  })


  const onSubmit = async (data: SignUpFormData) => {
    try {
      const response = await apiPublic.post("auth/register", data);

      if (!response) throw new Error("No response from server");

      toast.success("Usuário criado com sucesso!");

      return response;

    } catch (error) {
      try {
        handleApiError(error);
      } catch (apiError) {
        if (apiError instanceof BadRequestError) {
          form.setError("email", { message: apiError.message });
        } else if (apiError instanceof UnauthorizedError) {
          toast.error(apiError.message);
        } else if (apiError instanceof NetworkError) {
          toast.error(apiError.message);
        } else if (apiError instanceof ApiError) {
          toast.error(apiError.message);
        } else {
          toast.error("Erro inesperado. Tente novamente.");
        }
      }
      throw error;
    }

  }


  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    onSubmitRaw: onSubmit,
    errors: form.formState.errors,
    loading: form.formState.isSubmitting
  }
}