"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Users, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";
import { UserStore } from "@/stores/user";
import { canManageUsers, isAdmin } from "@/lib/auth-user";
import { useListUsers } from "@/hooks/users/useListUsers";
import { useGetVacationRequests } from "@/hooks/vacation/useGetVacationRequests";
import { useMyVacationRequests } from "@/hooks/vacation/useMyVacationRequests";
import { useListVacationsByTeam } from "@/hooks/vacation/useListVacationsByTeam";
import { useTranslations } from "@/lib/i18n";
import { apiPrivate } from "@/lib/api";
import { getErrorMessage } from "@/lib/api-errors";
import type { UserListItem } from "@/types/user";
import { toast } from "sonner";

export default function DashboardPage() {
  const { t } = useTranslations();
  const currentUser = UserStore((s) => s.user);
  const isStaff = canManageUsers(currentUser?.roles);
  const admin = isAdmin(currentUser?.roles);
  const userId = currentUser?.id ?? "";
  const rolesKey = (currentUser?.roles ?? []).join(",");

  const { users, loadingUser } = useListUsers(admin);
  const [collaborators, setCollaborators] = useState<UserListItem[] | null>(null);
  const [loadingCollaborators, setLoadingCollaborators] = useState(false);
  const { vacationRequests, loading: loadingAllVacations } = useGetVacationRequests(admin);
  const {
    teamVacations,
    fetchTeamVacations,
    loadingTeamVacations,
  } = useListVacationsByTeam();
  const {
    myVacationsRequests,
    fetchMyVacationRequests,
    loadingMyVacationRequests,
  } = useMyVacationRequests();

  useEffect(() => {
    if (!userId) return;
    const roles = rolesKey.length > 0 ? rolesKey.split(",") : [];
    if (!canManageUsers(roles)) {
      void fetchMyVacationRequests();
    } else if (!isAdmin(roles)) {
      void fetchTeamVacations();
    }
  }, [userId, rolesKey, fetchMyVacationRequests, fetchTeamVacations]);

  useEffect(() => {
    if (!userId || admin || !isStaff) {
      setCollaborators(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setLoadingCollaborators(true);
        const res = await apiPrivate.get<UserListItem[]>(
          `/users/manager/${userId}/collaborators`
        );
        if (!cancelled) {
          setCollaborators(res.data);
        }
      } catch (e) {
        if (!cancelled) {
          toast.error(getErrorMessage(e));
          setCollaborators([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingCollaborators(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, admin, isStaff]);

  const vacationList = admin
    ? vacationRequests
    : isStaff
      ? (teamVacations ?? [])
      : (myVacationsRequests ?? []);
  const vacLoading = admin
    ? loadingAllVacations
    : isStaff
      ? loadingTeamVacations
      : loadingMyVacationRequests;

  const countStatus = (status: string) =>
    vacLoading ? null : vacationList.filter((v) => v.status === status).length;

  const pending = countStatus("PENDING");
  const approved = countStatus("APPROVED");
  const rejected = countStatus("REJECTED");

  const formatStat = (value: number | null) => (value === null ? "—" : String(value));

  const showTeamUserCount = isStaff;
  const totalUsersLoading = admin ? loadingUser : loadingCollaborators;
  const totalUsersDisplay = (() => {
    if (!showTeamUserCount) return "—";
    if (admin) {
      if (loadingUser || users === null) return "—";
      return String(users.length);
    }
    if (totalUsersLoading || collaborators === null) return "—";
    return String(collaborators.length);
  })();

  return (
    <div className="container mx-auto space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{t("dashboard.title")}</h1>
      </div>

      <div
        className={`grid grid-cols-1 gap-6 ${admin ? "md:grid-cols-2" : "md:grid-cols-1"}`}
      >
        {admin && (
          <Link href="/dashboard/users">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{t("nav.users")}</h3>
                  <p className="text-sm text-gray-600">{t("dashboard.usersDescription")}</p>
                </div>
              </div>
            </Card>
          </Link>
        )}

        <Link href="/dashboard/vacation-requests">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{t("dashboard.vacationsTitle")}</h3>
                <p className="text-sm text-gray-600">{t("dashboard.vacationsDescription")}</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      <div
        className={`grid grid-cols-1 gap-4 ${showTeamUserCount ? "md:grid-cols-4" : "md:grid-cols-3"}`}
      >
        {showTeamUserCount && (
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t("dashboard.totalUsers")}</p>
                <p className="text-2xl font-bold text-gray-900">{totalUsersDisplay}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </Card>
        )}

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t("dashboard.pendingVacations")}</p>
              <p className="text-2xl font-bold text-yellow-600">{formatStat(pending)}</p>
            </div>
            <Calendar className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t("dashboard.approvedVacations")}</p>
              <p className="text-2xl font-bold text-green-600">{formatStat(approved)}</p>
            </div>
            <Calendar className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t("dashboard.rejectedVacations")}</p>
              <p className="text-2xl font-bold text-red-600">{formatStat(rejected)}</p>
            </div>
            <Calendar className="h-8 w-8 text-red-600" />
          </div>
        </Card>
      </div>
    </div>
  );
}
