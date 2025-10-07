import { apiPrivate } from "@/lib/api";
import { UserListItem } from "@/types/user";
import { useState, useEffect } from "react";

export const useGetUser = (params: Promise<{ id: string }>) => {
  const [user, setUser] = useState<UserListItem | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async (userId: string) => {
    try {
      setLoadingUser(true);
      setError(null);
      const response = await apiPrivate.get<UserListItem>(`/users/${userId}`);

      if (!response) throw new Error("No response from server");

      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("Erro ao carregar usuário");
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const resolvedParams = await params;
        await fetchUser(resolvedParams.id);
      } catch (err) {
        console.error("Error resolving params:", err);
        setError("Erro ao carregar parâmetros");
        setLoadingUser(false);
      }
    };

    loadUser();
  }, [params]);

  return { user, loadingUser, error, fetchUser };
}