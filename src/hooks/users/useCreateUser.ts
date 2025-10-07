import { apiPublic } from "@/lib/api"
import { BadRequestError, handleApiError, NetworkError, UnauthorizedError } from "@/lib/api-errors"
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
          form.setError("email", { message: "E-mail já cadastrado ou dados inválidos." });
        } else if (apiError instanceof NetworkError) {
          toast.error("Erro de conexão. Verifique sua internet.");
        } else {
          toast.error("Erro ao criar usuário. Tente novamente.");
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