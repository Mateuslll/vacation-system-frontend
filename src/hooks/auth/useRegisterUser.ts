import { apiPrivate, apiPublic } from "@/lib/api"
import { ApiError, BadRequestError, handleApiError, NetworkError, UnauthorizedError } from "@/lib/api-errors"
import { signUpSchema } from "@/lib/validations/schemas"
import { SignUpFormData } from "@/types/forms"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import Cookies from 'js-cookie'
import { UserStore } from "@/stores/user";
import { useRouter } from "next/navigation";
import { buildSessionUser } from "@/lib/auth-user";


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

      const permissionsResponse = await apiPrivate.get<{ roles: string[] }>("auth/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!permissionsResponse) throw new Error("No response from server");

      setUser(
        buildSessionUser(user, permissionsResponse.data.roles as string[])
      );

      toast.success("Usuário criado com sucesso!");

      router.push("/dashboard");

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
    }

  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    errors: form.formState.errors,
    loading: form.formState.isSubmitting
  }
}