import { apiPublic } from "@/lib/api";
import { BadRequestError, ConflictError, handleApiError, InternalServerError, NetworkError, UnauthorizedError } from "@/lib/api-errors";
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
          toast.error("Dados inválidos. Verifique os campos.");
        } else if (apiError instanceof NetworkError) {
          toast.error("Erro de conexão. Verifique sua internet.");
        }
        else if (apiError instanceof InternalServerError) {
          toast.error("Erro interno no servidor. Tente novamente mais tarde.")
        } else {
          toast.error("Erro inesperado. Tente novamente.");
        }

      }
    } finally {
      setLoadingQuickLogin(false)
    }
  }, []);

  const quickSignInUser = async () => {
    const userCredentials = {
      firstName: "User",
      lastName: "Example",
      email: "user@taskflow.com",
      password: "User@123"
    }

    try {
      setLoadingQuickLogin(true);

      const response = await apiPublic.post('/auth/register', userCredentials);
      if (!response) throw new Error('No response from server');

      toast.success('Usuário criado com sucesso!');

      const userLogin = {
        email: userCredentials.email,
        password: userCredentials.password
      }

      await loginDirectly(userLogin);

    } catch (error) {
      try {
        handleApiError(error);
      } catch (apiError) {
        if (apiError instanceof UnauthorizedError) {
          toast.error("Credenciais inválidas.");
        } else if (apiError instanceof BadRequestError) {
          toast.error("Dados inválidos. Verifique os campos.");
        } else if (apiError instanceof NetworkError) {
          toast.error("Erro de conexão. Verifique sua internet.");
        } else if (apiError instanceof InternalServerError) {
          toast.error("Erro interno no servidor. Tente novamente mais tarde.");
        } else {
          toast.error("Erro inesperado. Tente novamente.");
        }
      }
    } finally {
      setLoadingQuickLogin(false);
    }
  }



  return {
    quickSignInAdmin,
    quickSignInUser,
    loadingQuickLogin
  };

}