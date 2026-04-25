import { apiPrivate } from "@/lib/api";
import { VacationRequest } from "@/types/vacation";
import { useState, useEffect } from "react";
import { handleApiError } from "@/lib/api-errors";

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
      console.error("Error fetching vacation requests:", error);
      handleApiError(error);
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
    refetch: fetchVacationRequests
  };
};