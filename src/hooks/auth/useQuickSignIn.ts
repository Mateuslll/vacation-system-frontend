import { apiPublic } from "@/lib/api";
import {
  ApiError,
  BadRequestError,
  ConflictError,
  handleApiError,
  InternalServerError,
  NetworkError,
  UnauthorizedError,
} from "@/lib/api-errors";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useAuthForm } from "./useAuthForm";


export const useQuickSignIn = () => {
  const [loadingQuickLogin, setLoadingQuickLogin] = useState(false);
  const { loginDirectly } = useAuthForm()

  const quickSignInAdmin = useCallback(async () => {
    const adminCredentials = {
      firstName: "Admin",
      lastName: "Sistema",
      email: "admin@taskflow.com",
      password: "Admin@123"
    }
    const adminLogin = {
      email: adminCredentials.email,
      password: adminCredentials.password
    }

    try {
      setLoadingQuickLogin(true);

      const response = await apiPublic.post('/api/v1/bootstrap/create-admin', adminCredentials)

      if (!response) throw new Error('No response from server')

      toast.success('Admin criado com sucesso!')

      await loginDirectly(adminLogin);

    } catch (error) {

      try {
        handleApiError(error)
      } catch (apiError) {
        if (apiError instanceof UnauthorizedError) {
          toast.error("Credenciais inválidas.");
        } else if (apiError instanceof ConflictError) {
          await loginDirectly(adminLogin);
        } else if (apiError instanceof BadRequestError) {
          toast.error(apiError.message);
        } else if (apiError instanceof NetworkError) {
          toast.error(apiError.message);
        }
        else if (apiError instanceof InternalServerError) {
          toast.error(apiError.message);
        } else if (apiError instanceof ApiError) {
          toast.error(apiError.message);
        } else {
          toast.error("Erro inesperado. Tente novamente.");
        }

      }
    } finally {
      setLoadingQuickLogin(false)
    }
  }, [loginDirectly]);

  return {
    quickSignInAdmin,
    loadingQuickLogin
  };

}