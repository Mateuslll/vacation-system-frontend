import { apiPrivate } from "@/lib/api";
import { ForbiddenError, handleApiError, UnauthorizedError } from "@/lib/api-errors";
import { useState } from "react";

export const useMyVacationRequests = () => {
  const [myVacationsRequests, setMyVacationsRequests] = useState()
  const [loadingMyVacationRequests, setLoadingMyVacationRequests] = useState(false)


  const fetchMyVacationRequests = async () => {
    try {
      setLoadingMyVacationRequests(true);
      const response = await apiPrivate.get("/vacation-requests/my");

      if (!response) throw new Error("No response from server");

      setMyVacationsRequests(response.data);


    } catch (error) {
      try {
        handleApiError(error)
      } catch (apiError) {
        if (apiError instanceof UnauthorizedError) {
          console.error("User is not authorized", apiError)
        } else if (apiError instanceof ForbiddenError) {
          console.error("Invalid Token or expired", apiError)
        }
      }
    }
    finally {
      setLoadingMyVacationRequests(false);
    }

  }

  return {
    myVacationsRequests,
    loadingMyVacationRequests,
    fetchMyVacationRequests
  };
}