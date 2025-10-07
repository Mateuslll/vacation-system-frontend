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

function VacationRequestsContent() {
  const currentUser = UserStore(state => state.user);
  const searchParams = useSearchParams();

  const isAdminOrManager = currentUser?.roles?.includes("ADMIN") || currentUser?.roles?.includes("MANAGER");
  const { vacationRequests, loading, error, refetch } = useGetVacationRequests(isAdminOrManager);
  const { myVacationsRequests, loadingMyVacationRequests, fetchMyVacationRequests } = useMyVacationRequests();
  const { teamVacations, loadingTeamVacations, fetchTeamVacations } = useListVacationsByTeam();

  const getInitialFilter = () => {
    const urlFilter = searchParams.get('filter');
    if (urlFilter === 'mine') return 'mine';
    if (currentUser && (currentUser.roles?.includes("ADMIN") || currentUser.roles?.includes("MANAGER"))) {
      return 'all';
    }
    return 'mine';
  };

  const [filterType, setFilterType] = useState<'all' | 'mine' | 'myteam'>(getInitialFilter());

  useEffect(() => {
    const urlFilter = searchParams.get('filter');

    if (urlFilter === 'mine' || (!currentUser?.roles?.includes("ADMIN") && !currentUser?.roles?.includes("MANAGER"))) {
      setFilterType('mine');
      fetchMyVacationRequests();
    } else if (currentUser && (currentUser.roles?.includes("ADMIN") || currentUser.roles?.includes("MANAGER"))) {
      setFilterType('all');
    }
  }, [currentUser, searchParams]);

  const getCurrentRequests = () => {
    if (filterType === 'mine') {
      return myVacationsRequests || [];
    } else if (filterType === 'myteam') {
      return teamVacations || [];
    }
    return isAdminOrManager ? (vacationRequests || []) : [];
  };

  const currentRequests = getCurrentRequests();
  const currentLoading = filterType === 'mine' ? loadingMyVacationRequests :
    filterType === 'myteam' ? loadingTeamVacations :
      (isAdminOrManager ? loading : false);

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

  if (error && isAdminOrManager && filterType === 'all') {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {error}
          </h1>
          <Button onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar Novamente
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
            Solicitações de Férias
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie todas as solicitações de férias dos funcionários
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <a href="/dashboard/vacation-requests/new">
              <Plus className="mr-2 h-4 w-4" />
              Nova Solicitação
            </a>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
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
              <p className="text-sm font-medium text-gray-600">Pendentes</p>
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
              <p className="text-sm font-medium text-gray-600">Aprovadas</p>
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
              <p className="text-sm font-medium text-gray-600">Rejeitadas</p>
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
              {filterType === 'mine' ? 'Minhas Solicitações' :
                filterType === 'myteam' ? 'Solicitações do Meu Time' :
                  'Todas as Solicitações'}
            </h2>
            <p className="text-sm text-gray-600">
              {currentLoading ? "Carregando..." : `${stats.total} solicitações encontradas`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={filterType} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por..." />
              </SelectTrigger>
              <SelectContent>
                {currentUser?.roles?.includes("ADMIN") || currentUser?.roles?.includes("MANAGER") ? (
                  <>
                    <SelectItem value="all">Todas as solicitações</SelectItem>
                    <SelectItem value="mine">Minhas solicitações</SelectItem>
                    <SelectItem value="myteam">Meu time</SelectItem>
                  </>
                ) : (
                  <SelectItem value="mine">Minhas solicitações</SelectItem>
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
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-8 w-8 text-blue-600" />
            Solicitações de Férias
          </h1>
          <p className="text-gray-600 mt-1">
            Carregando...
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