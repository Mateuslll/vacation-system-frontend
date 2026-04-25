import { apiPrivate } from "@/lib/api";
import { UserListItem } from "@/types/user";
import { useCallback, useEffect, useState } from "react";

export const useListUsers = () => {
  const [users, setUsers] = useState<UserListItem[] | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);


  const fetchUsers = useCallback(async () => {

    try {
      setLoadingUser(true);
      const response = await apiPrivate.get<UserListItem[]>("/users");
      setUsers(response.data);

    } catch (error) {
      console.error("Error fetching users:", error);
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
    fetchUsers
  };
}