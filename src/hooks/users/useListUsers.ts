import { apiPrivate } from "@/lib/api";
import { getErrorMessage } from "@/lib/api-errors";
import { UserListItem } from "@/types/user";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const useListUsers = () => {
  const [users, setUsers] = useState<UserListItem[] | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoadingUser(true);
      const response = await apiPrivate.get<UserListItem[]>("/users");
      setUsers(response.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoadingUser(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loadingUser,
    fetchUsers,
  };
};
