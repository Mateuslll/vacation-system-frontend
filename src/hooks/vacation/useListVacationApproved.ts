import { VacationRequestListItem } from "@/types/vacation";
import { useEffect, useState } from "react";
import { parseISO, eachDayOfInterval } from "date-fns";
import { apiPrivate } from "@/lib/api";

export const useListVacationApproved = () => {
  const [vacationApprovedList, setVacationApprovedList] = useState<VacationRequestListItem[]>()
  const [loadingListVacationApproved, setLoadingListVacationApproved] = useState(false)
  const [blockedDates, setBlockedDates] = useState<Date[]>()


  const fetchVacationApproved = async () => {
    try {
      setLoadingListVacationApproved(true);
      const response = await apiPrivate.get<VacationRequestListItem[]>("/vacation-requests/approved");

      if (!response) throw new Error("No response from server");

      response.data.forEach(vacation => {
        const startDate = parseISO(vacation.startDate)
        const endDate = parseISO(vacation.endDate)

        const datesInRange = eachDayOfInterval({
          start: startDate,
          end: endDate
        })
        setBlockedDates(prevDates => [...(prevDates || []), ...datesInRange])
      })

      setVacationApprovedList(response.data);
    } catch (error) {
      console.error("Error fetching approved vacations:", error);
    } finally {
      setLoadingListVacationApproved(false);
    }
  };

  useEffect(() => {
    fetchVacationApproved()
  }, [])


  return {
    loadingListVacationApproved,
    vacationApprovedList,
    blockedDates
  }
}
