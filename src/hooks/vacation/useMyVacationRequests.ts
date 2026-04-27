import { apiPrivate } from "@/lib/api";
import { getErrorMessage } from "@/lib/api-errors";
import { useState } from "react";
import { toast } from "sonner";

export const useMyVacationRequests = () => {
  const [myVacationsRequests, setMyVacationsRequests] = useState();
  const [loadingMyVacationRequests, setLoadingMyVacationRequests] = useState(false);

  const fetchMyVacationRequests = async () => {
    try {
      setLoadingMyVacationRequests(true);
      const response = await apiPrivate.get("/vacation-requests/my");

      if (!response) throw new Error("No response from server");

      setMyVacationsRequests(response.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoadingMyVacationRequests(false);
    }
  };

  return {
    myVacationsRequests,
    loadingMyVacationRequests,
    fetchMyVacationRequests,
  };
};
