import { apiPrivate } from "@/lib/api";
import { handleApiError, NotFoundError } from "@/lib/api-errors";
import { VacationRequest } from "@/types/vacation";
import { useCallback, useEffect, useState } from "react";

export const useVacationRequestDetails = (params: Promise<{ id: string }>) => {
  const [vacationRequest, setVacationRequest] = useState<VacationRequest | null>(null);
  const [loadingVacation, setLoadingVacation] = useState(false);
  const [errorVacation, setErrorVacation] = useState<string | null>(null);


  const fetchRequestVacation = useCallback(async (vacationId: string) => {
    try {
      setLoadingVacation(true);
      const response = await apiPrivate.get<VacationRequest>(`/vacation-requests/${vacationId}`);
      setVacationRequest(response.data);
    } catch (error) {
      try {
        handleApiError(error);
      } catch (apiError) {
        if (apiError instanceof NotFoundError) {
          setErrorVacation("Solicitação de férias não encontrada.");
        }
      }

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
        console.error("Error resolving params:", err);
        setErrorVacation("Erro ao carregar parâmetros");
        setLoadingVacation(false);
      }
    };

    loadVacation();
  }, [params]);

  return {
    vacationRequest,
    loadingVacation,
    errorVacation,
    setVacationRequest
  };
}