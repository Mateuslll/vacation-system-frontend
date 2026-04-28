import { apiPrivate } from "@/lib/api";
import { getErrorMessage } from "@/lib/api-errors";
import { UserListItem } from "@/types/user";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const useListManagersAndAdmins = (enabled: boolean = true) => {
  const [managersAndAdmins, setManagersAndAdmins] = useState<UserListItem[]>();
  const [loadingAdmins, setLoadingAdmins] = useState(false);

  const fetchManagersAndAdmins = useCallback(async () => {
    try {
      setLoadingAdmins(true);
      const response = await apiPrivate.get<UserListItem[]>("/users/managers-and-admins");

      if (!response) throw new Error("No response from server");

      setManagersAndAdmins(response.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoadingAdmins(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    fetchManagersAndAdmins();
  }, [enabled, fetchManagersAndAdmins]);

  return {
    managersAndAdmins,
    loadingAdmins,
  };
};
