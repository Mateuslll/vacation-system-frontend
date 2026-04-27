import { apiPrivate } from "@/lib/api";
import { getErrorMessage } from "@/lib/api-errors";
import { VacationRequest } from "@/types/vacation";
import { useState, useEffect } from "react";

export const useGetVacationRequests = (shouldFetch: boolean = false) => {
  const [vacationRequests, setVacationRequests] = useState<VacationRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVacationRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiPrivate.get<VacationRequest[]>("/vacation-requests");

      if (!response) throw new Error("No response from server");

      setVacationRequests(response.data);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shouldFetch) {
      fetchVacationRequests();
    }
  }, [shouldFetch]);

  return {
    vacationRequests,
    loading,
    error,
    refetch: fetchVacationRequests,
  };
};
