"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VacationRequestsTable } from "@/components/VacationRequestsTable";
import { useGetVacationRequests } from "@/hooks/vacation/useGetVacationRequests";
import { Calendar, Plus, Filter, RefreshCw } from "lucide-react";
import { useMyVacationRequests } from "@/hooks/vacation/useMyVacationRequests";
import { useListVacationsByTeam } from "@/hooks/vacation/useListVacationsByTeam";
import { useState, useEffect, Suspense } from "react";
import { UserStore } from "@/stores/user";
import { useSearchParams } from "next/navigation";
import { canManageUsers, isAdmin } from "@/lib/auth-user";
import { useTranslations } from "@/lib/i18n";

function VacationRequestsContent() {
  const { t } = useTranslations();
  const currentUser = UserStore(state => state.user);
  const searchParams = useSearchParams();

  const isVacationStaff = canManageUsers(currentUser?.roles);
  const userIsAdmin = isAdmin(currentUser?.roles);
  const { vacationRequests, loading, error, refetch } = useGetVacationRequests(userIsAdmin);
  const { myVacationsRequests, loadingMyVacationRequests, fetchMyVacationRequests } = useMyVacationRequests();
  const { teamVacations, loadingTeamVacations, fetchTeamVacations } = useListVacationsByTeam();

  const getInitialFilter = (): "all" | "mine" | "myteam" => {
    const url = searchParams.get("filter");
    if (url === "mine") return "mine";
    if (url === "myteam") return "myteam";
    if (!currentUser?.roles?.length) return "mine";
    if (isAdmin(currentUser.roles)) return "all";
    if (canManageUsers(currentUser.roles)) return "myteam";
    return "mine";
  };

  const [filterType, setFilterType] = useState<'all' | 'mine' | 'myteam'>(getInitialFilter());

  const urlFilter = searchParams.get("filter");
  const userId = currentUser?.id ?? "";
  const rolesKey = (currentUser?.roles ?? []).join(",");

  useEffect(() => {
    if (!userId) return;

    const roles = rolesKey.length > 0 ? rolesKey.split(",") : [];
    if (urlFilter === "mine" || !canManageUsers(roles)) {
      setFilterType("mine");
      void fetchMyVacationRequests();
    } else if (isAdmin(roles)) {
      setFilterType("all");
    } else {
      setFilterType("myteam");
      void fetchTeamVacations();
    }
  }, [userId, rolesKey, urlFilter, fetchMyVacationRequests, fetchTeamVacations]);

  const getCurrentRequests = () => {
    if (filterType === 'mine') {
      return myVacationsRequests || [];
    } else if (filterType === 'myteam') {
      return teamVacations || [];
    }
    if (filterType === "all" && userIsAdmin) {
      return vacationRequests || [];
    }
    return [];
  };

  const currentRequests = getCurrentRequests();
  const currentLoading = filterType === 'mine' ? loadingMyVacationRequests :
    filterType === 'myteam' ? loadingTeamVacations :
      (userIsAdmin ? loading : false);

  const getStatsCards = () => {
    const requests = currentRequests;
    const pending = requests.filter(req => req.status.toUpperCase() === "PENDING").length;
    const approved = requests.filter(req => req.status.toUpperCase() === "APPROVED").length;
    const rejected = requests.filter(req => req.status.toUpperCase() === "REJECTED").length;

    return { pending, approved, rejected, total: requests.length };
  };

  const stats = getStatsCards();

  const handleFilterChange = (value: string) => {
    setFilterType(value as 'all' | 'mine' | 'myteam');
    if (value === 'mine' && !myVacationsRequests) {
      fetchMyVacationRequests();
    } else if (value === 'myteam' && !teamVacations) {
      fetchTeamVacations();
    }
  };

  if (error && userIsAdmin && filterType === 'all') {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {error}
          </h1>
          <Button onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {t("common.retry")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-8 w-8 text-blue-600" />
            {t("vacations.title")}
          </h1>
          <p className="text-gray-600 mt-1">
            {t("vacations.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <a href="/dashboard/vacation-requests/new">
              <Plus className="mr-2 h-4 w-4" />
              {t("vacations.newRequest")}
            </a>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t("vacations.total")}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t("vacations.pending")}</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                {stats.pending}
              </Badge>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t("vacations.approved")}</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {stats.approved}
              </Badge>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t("vacations.rejected")}</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                {stats.rejected}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              {filterType === 'mine' ? t("vacations.myRequests") :
                filterType === 'myteam' ? t("vacations.myTeamRequests") :
                  t("vacations.allRequests")}
            </h2>
            <p className="text-sm text-gray-600">
              {currentLoading ? t("common.loading") : `${stats.total} ${t("vacations.requestsFound")}`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={filterType} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t("vacations.filterBy")} />
              </SelectTrigger>
              <SelectContent>
                {userIsAdmin ? (
                  <>
                    <SelectItem value="all">{t("vacations.allRequestsFilter")}</SelectItem>
                    <SelectItem value="mine">{t("vacations.myRequestsFilter")}</SelectItem>
                    <SelectItem value="myteam">{t("vacations.myTeamFilter")}</SelectItem>
                  </>
                ) : isVacationStaff ? (
                  <>
                    <SelectItem value="mine">{t("vacations.myRequestsFilter")}</SelectItem>
                    <SelectItem value="myteam">{t("vacations.myTeamFilter")}</SelectItem>
                  </>
                ) : (
                  <SelectItem value="mine">{t("vacations.myRequestsFilter")}</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

        </div>

        <div className="p-6">
          <VacationRequestsTable
            requests={currentRequests}
            loading={currentLoading}
          />
        </div>
      </div>
    </div>
  );
}

function VacationRequestsLoading() {
  const { t } = useTranslations();
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-8 w-8 text-blue-600" />
            {t("vacations.title")}
          </h1>
          <p className="text-gray-600 mt-1">
            {t("common.loading")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VacationRequestsPage() {
  return (
    <Suspense fallback={<VacationRequestsLoading />}>
      <VacationRequestsContent />
    </Suspense>
  );
}