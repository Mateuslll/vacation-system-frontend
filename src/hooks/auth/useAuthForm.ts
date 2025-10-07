import { apiPrivate, apiPublic } from "@/lib/api";
import { handleApiError, UnauthorizedError, BadRequestError, NetworkError } from "@/lib/api-errors";
import { signInSchema } from "@/lib/validations/schemas/sign-in.schema";
import { SignInFormData } from "@/types/forms";
import { SignInResponse } from "@/types/signIn";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Cookies from 'js-cookie'
import { UserStore } from "@/stores/user";
import { useRouter } from "next/navigation";

export const useAuthForm = () => {
  const setUser = UserStore(state => state.setUser);
  const router = useRouter();

  const form = useForm({
    mode: "onChange",
    resolver: yupResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    }

  })


  const onSubmit = async (data: SignInFormData) => {
    try {

      const result = await apiPublic.post<SignInResponse>("/auth/login", data);

      if (!result) throw new Error("No response from server");

      const { accessToken, refreshToken, expiresIn, user } = result.data;

      const permissionsResponse = await apiPrivate.get("auth/me", {
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      if (!permissionsResponse) throw new Error("No response from server");

      Cookies.set("Token", accessToken, { expires: expiresIn / 3600 });
      Cookies.set("RefreshToken", refreshToken, { expires: 7 });

      const newUser = {
        ...user,
        roles: permissionsResponse.data.roles,
      }

      setUser(newUser);

      toast.success("Login realizado com sucesso!");

      router.push("/dashboard");

      return result;

    } catch (error) {
      try {
        handleApiError(error);
      } catch (apiError) {
        if (apiError instanceof UnauthorizedError) {
          form.setError("password", { message: "Credenciais inválidas." });
        } else if (apiError instanceof BadRequestError) {
          form.setError("email", { message: "Dados inválidos. Verifique os campos." });
        } else if (apiError instanceof NetworkError) {
          toast.error("Erro de conexão. Verifique sua internet.");
        } else {
          toast.error("Erro inesperado. Tente novamente.");
        }
      }
    }
  }

  const loginDirectly = async (credentials: SignInFormData) => {
    return await onSubmit(credentials);
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    loginDirectly,
    errors: form.formState.errors,
    loading: form.formState.isSubmitting
  };
}