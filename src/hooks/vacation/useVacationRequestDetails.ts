import { apiPrivate } from "@/lib/api";
import { getErrorMessage } from "@/lib/api-errors";
import { VacationRequest } from "@/types/vacation";
import { useCallback, useEffect, useState } from "react";

export const useVacationRequestDetails = (params: Promise<{ id: string }>) => {
  const [vacationRequest, setVacationRequest] = useState<VacationRequest | null>(null);
  const [loadingVacation, setLoadingVacation] = useState(false);
  const [errorVacation, setErrorVacation] = useState<string | null>(null);

  const fetchRequestVacation = useCallback(async (vacationId: string) => {
    try {
      setLoadingVacation(true);
      setErrorVacation(null);
      const response = await apiPrivate.get<VacationRequest>(`/vacation-requests/${vacationId}`);
      setVacationRequest(response.data);
    } catch (error) {
      setErrorVacation(getErrorMessage(error));
    } finally {
      setLoadingVacation(false);
    }
  }, []);

  useEffect(() => {
    const loadVacation = async () => {
      try {
        const resolvedParams = await params;
        await fetchRequestVacation(resolvedParams.id);
      } catch (err) {
        setErrorVacation(getErrorMessage(err));
        setLoadingVacation(false);
      }
    };

    loadVacation();
  }, [params, fetchRequestVacation]);

  return {
    vacationRequest,
    loadingVacation,
    errorVacation,
    setVacationRequest,
  };
};
