import { apiPrivate, apiPublic } from "@/lib/api";
import { ApiError, handleApiError, UnauthorizedError, BadRequestError, NetworkError } from "@/lib/api-errors";
import { signInSchema } from "@/lib/validations/schemas/sign-in.schema";
import { SignInFormData } from "@/types/forms";
import { AuthMeResponse, LoginTokensResponse } from "@/types/signIn";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Cookies from 'js-cookie'
import { UserStore } from "@/stores/user";
import { useRouter } from "next/navigation";
import { buildSessionUser } from "@/lib/auth-user";

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

      const result = await apiPublic.post<LoginTokensResponse>("/auth/login", data);

      if (!result) throw new Error("No response from server");

      const { accessToken, refreshToken, expiresIn } = result.data;

      const permissionsResponse = await apiPrivate.get<AuthMeResponse>("auth/me", {
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      if (!permissionsResponse) throw new Error("No response from server");

      const me = permissionsResponse.data;
      const roles = Array.isArray(me.roles) ? me.roles : [];
      if (!me.userId || !me.email) {
        throw new Error("Resposta auth/me inválida (userId ou email em falta).");
      }

      const nameParts = (me.name ?? "").trim().split(/\s+/).filter(Boolean);
      const firstName = nameParts[0] ?? me.email.split("@")[0] ?? "";
      const lastName = nameParts.slice(1).join(" ") || "";

      Cookies.set("Token", accessToken, { expires: expiresIn / 3600 });
      Cookies.set("RefreshToken", refreshToken, { expires: 7 });

      setUser(
        buildSessionUser(
          {
            id: me.userId,
            email: me.email,
            firstName,
            lastName,
            status: "ACTIVE",
          },
          roles
        )
      );

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
          form.setError("email", { message: apiError.message });
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