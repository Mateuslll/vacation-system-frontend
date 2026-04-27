import { apiPrivate } from "@/lib/api";
import { getErrorMessage } from "@/lib/api-errors";
import { UserListItem } from "@/types/user";
import { useState } from "react";
import { toast } from "sonner";

export const useListUserByCollaborators = () => {
  const [usersFiltered, setUsersFiltered] = useState<UserListItem[] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUsersByCollaborators = async (collaboratorId: string) => {
    try {
      setLoading(true);
      const response = await apiPrivate.get<UserListItem[]>(`/users/manager/${collaboratorId}/collaborators`);

      if (!response) throw new Error("No response from server");

      setUsersFiltered(response.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return {
    usersFiltered,
    loading,
    fetchUsersByCollaborators,
  };
};
