import { apiPrivate } from "@/lib/api";
import { ForbiddenError, handleApiError, UnauthorizedError } from "@/lib/api-errors";
import { UserListItem } from "@/types/user";
import { useCallback, useEffect, useState } from "react";

export const useListManagersAndAdmins = () => {
  const [managersAndAdmins, setManagersAndAdmins] = useState<UserListItem[]>();
  const [loadingAdmins, setLoadingAdmins] = useState(false);

  const fetchManagersAndAdmins = useCallback(async () => {
    try {
      setLoadingAdmins(true);
      const response = await apiPrivate.get<UserListItem[]>("/users/managers-and-admins");

      if (!response) throw new Error("No response from server");

      setManagersAndAdmins(response.data);

    } catch (error) {
      try {
        handleApiError(error);
      } catch (apiError) {
        if (apiError instanceof UnauthorizedError) {
          console.error("Unauthorized access", apiError);
        } else if (apiError instanceof ForbiddenError) {
          console.error("Usuario sem permissão", apiError);
        }

      }

    } finally {
      setLoadingAdmins(false);
    }
  }, []);

  useEffect(() => {
    fetchManagersAndAdmins();
  }, [fetchManagersAndAdmins]);

  return {
    managersAndAdmins,
    loadingAdmins,
  }

}