import { apiPrivate } from "@/lib/api";
import { VacationRequest } from "@/types/vacation";
import { useState } from "react";

export const useListVacationsByTeam = () => {
  const [teamVacations, setTeamVacations] = useState<VacationRequest[] | null>(null);
  const [loadingTeamVacations, setLoadingTeamVacations] = useState(false);

  const fetchTeamVacations = async () => {
    try {
      setLoadingTeamVacations(true);
      const response = await apiPrivate.get<VacationRequest[]>(`/vacation-requests/team`);

      if (!response) throw new Error("No response from server");

      setTeamVacations(response.data);

    } catch (error) {
      console.error("Error fetching team vacations:", error);
    } finally {
      setLoadingTeamVacations(false);
    }
  }

  return {
    teamVacations,
    loadingTeamVacations,
    fetchTeamVacations
  }

}