import { apiPrivate } from "@/lib/api";
import { getErrorMessage } from "@/lib/api-errors";
import type { UserListItem, UserListStatusFilter } from "@/types/user";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const useListUsers = (
  enabled: boolean = true,
  status: UserListStatusFilter = "ALL"
) => {
  const [users, setUsers] = useState<UserListItem[] | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoadingUser(true);
      const response = await apiPrivate.get<UserListItem[]>("/users", {
        params: { status },
      });
      setUsers(response.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoadingUser(false);
    }
  }, [status]);

  useEffect(() => {
    if (!enabled) return;
    fetchUsers();
  }, [enabled, status, fetchUsers]);

  return {
    users,
    loadingUser,
    fetchUsers,
  };
};
