import { apiPrivate } from "@/lib/api";
import { getErrorMessage } from "@/lib/api-errors";
import { VacationRequest } from "@/types/vacation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export const useMyVacationRequests = () => {
  const [myVacationsRequests, setMyVacationsRequests] = useState<VacationRequest[] | undefined>();
  const [loadingMyVacationRequests, setLoadingMyVacationRequests] = useState(false);

  const fetchMyVacationRequests = useCallback(async () => {
    try {
      setLoadingMyVacationRequests(true);
      const response = await apiPrivate.get<VacationRequest[]>("/vacation-requests/my");

      if (!response) throw new Error("No response from server");

      setMyVacationsRequests(response.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoadingMyVacationRequests(false);
    }
  }, []);

  return {
    myVacationsRequests,
    loadingMyVacationRequests,
    fetchMyVacationRequests,
  };
};
