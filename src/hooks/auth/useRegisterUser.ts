import { apiPublic } from "@/lib/api"
import { BadRequestError, handleApiError, NetworkError, UnauthorizedError } from "@/lib/api-errors"
import { signUpSchema } from "@/lib/validations/schemas"
import { SignUpFormData } from "@/types/forms"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import Cookies from 'js-cookie'
import { UserStore } from "@/stores/user";
import { useRouter } from "next/navigation";


export const useRegisterUser = () => {

  const setUser = UserStore(state => state.setUser);
  const router = useRouter();

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

      const { accessToken, refreshToken, expiresIn, user } = response.data;

      Cookies.set("Token", accessToken, { expires: expiresIn / 3600 });
      Cookies.set("RefreshToken", refreshToken, { expires: 7 });

      setUser(user);

      toast.success("Usuário criado com sucesso!");

      router.push("/dashboard");

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
    }

  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    errors: form.formState.errors,
    loading: form.formState.isSubmitting
  }
}