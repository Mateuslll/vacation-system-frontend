import { apiPrivate } from "@/lib/api";
import { getErrorMessage } from "@/lib/api-errors";
import { VacationRequest } from "@/types/vacation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export const useListVacationsByTeam = () => {
  const [teamVacations, setTeamVacations] = useState<VacationRequest[] | null>(null);
  const [loadingTeamVacations, setLoadingTeamVacations] = useState(false);

  const fetchTeamVacations = useCallback(async () => {
    try {
      setLoadingTeamVacations(true);
      const response = await apiPrivate.get<VacationRequest[]>(`/vacation-requests/team`);

      if (!response) throw new Error("No response from server");

      setTeamVacations(response.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoadingTeamVacations(false);
    }
  }, []);

  return {
    teamVacations,
    loadingTeamVacations,
    fetchTeamVacations,
  };
};
