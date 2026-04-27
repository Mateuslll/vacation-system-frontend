"use client";

import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Users, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";
import { UserStore } from "@/stores/user";
import { canManageUsers } from "@/lib/auth-user";
import { useListUsers } from "@/hooks/users/useListUsers";
import { useGetVacationRequests } from "@/hooks/vacation/useGetVacationRequests";
import { useMyVacationRequests } from "@/hooks/vacation/useMyVacationRequests";

export default function DashboardPage() {
  const currentUser = UserStore((s) => s.user);
  const isStaff = canManageUsers(currentUser?.roles);

  const { users, loadingUser } = useListUsers(!!isStaff);
  const { vacationRequests, loading: loadingAllVacations } = useGetVacationRequests(!!isStaff);
  const {
    myVacationsRequests,
    fetchMyVacationRequests,
    loadingMyVacationRequests,
  } = useMyVacationRequests();

  useEffect(() => {
    if (!isStaff) {
      void fetchMyVacationRequests();
    }
  }, [isStaff, fetchMyVacationRequests]);

  const vacationList = isStaff ? vacationRequests : (myVacationsRequests ?? []);
  const vacLoading = isStaff ? loadingAllVacations : loadingMyVacationRequests;

  const countStatus = (status: string) =>
    vacLoading ? null : vacationList.filter((v) => v.status === status).length;

  const pending = countStatus("PENDING");
  const approved = countStatus("APPROVED");
  const rejected = countStatus("REJECTED");

  const formatStat = (value: number | null) => (value === null ? "—" : String(value));

  const totalUsersDisplay =
    !isStaff ? "—" : loadingUser || users === null ? "—" : String(users.length);

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <div
        className={`grid grid-cols-1 gap-6 ${isStaff ? "md:grid-cols-2" : "md:grid-cols-1"}`}
      >
        {isStaff && (
          <Link href="/dashboard/users">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Usuários</h3>
                  <p className="text-sm text-gray-600">Gerenciar usuários do sistema</p>
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
                <h3 className="text-lg font-semibold text-gray-900">Férias</h3>
                <p className="text-sm text-gray-600">Solicitações de férias</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      <div
        className={`grid grid-cols-1 gap-4 ${isStaff ? "md:grid-cols-4" : "md:grid-cols-3"}`}
      >
        {isStaff && (
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Usuários</p>
                <p className="text-2xl font-bold text-gray-900">{totalUsersDisplay}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </Card>
        )}

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Férias Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">{formatStat(pending)}</p>
            </div>
            <Calendar className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aprovadas</p>
              <p className="text-2xl font-bold text-green-600">{formatStat(approved)}</p>
            </div>
            <Calendar className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejeitadas</p>
              <p className="text-2xl font-bold text-red-600">{formatStat(rejected)}</p>
            </div>
            <Calendar className="h-8 w-8 text-red-600" />
          </div>
        </Card>
      </div>
    </div>
  );
}
