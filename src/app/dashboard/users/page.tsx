"use client";

import { UsersTable } from "@/components/UsersTable";
import { CreateUserModal } from "@/components/CreateUserModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Users, Search, Filter, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useListUsers } from "@/hooks/users/useListUsers";
import { useListManagersAndAdmins } from "@/hooks/users/useListManagersAndAdmins";
import { useListUserByCollaborators } from "@/hooks/users/useListUserByCollaborators";
import { UserStore } from "@/stores/user";
import { useState, useEffect, useMemo } from "react";
import { canManageUsers, normalizeRoleName } from "@/lib/auth-user";
import type { UserListStatusFilter } from "@/types/user";
import { useTranslations } from "@/lib/i18n";

export default function UsersListPage() {
  const { t } = useTranslations();
  const router = useRouter();
  const currentUser = UserStore((state) => state.user);
  const canAccess = canManageUsers(currentUser?.roles);

  const [listStatus, setListStatus] = useState<UserListStatusFilter>("ALL");
  const { users, fetchUsers, loadingUser } = useListUsers(canAccess, listStatus);
  const { managersAndAdmins, loadingAdmins } = useListManagersAndAdmins(canAccess);
  const { usersFiltered, loading: loadingFiltered, fetchUsersByCollaborators } = useListUserByCollaborators();

  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [displayUsers, setDisplayUsers] = useState(users);
  const teamFilterOptions = useMemo(() => {
    const merged = [...(users ?? []), ...(managersAndAdmins ?? [])];
    const byId = new Map<string, typeof merged[number]>();

    for (const user of merged) {
      if (!byId.has(user.id)) {
        byId.set(user.id, user);
      }
    }

    return Array.from(byId.values());
  }, [users, managersAndAdmins]);

  useEffect(() => {
    if (currentUser && !canManageUsers(currentUser.roles)) {
      router.replace("/dashboard/vacation-requests");
    }
  }, [currentUser, router]);

  useEffect(() => {
    if (selectedFilter === "all") {
      setDisplayUsers(users);
    }
  }, [users, selectedFilter]);

  useEffect(() => {
    if (selectedFilter === "all") {
      setDisplayUsers(users);
    } else {
      setDisplayUsers(usersFiltered);
    }
  }, [selectedFilter, users, usersFiltered]);

  const handleFilterChange = async (value: string) => {
    setSelectedFilter(value);

    if (value !== "all") {
      await fetchUsersByCollaborators(value);
    }
  };

  const handleViewUser = (userId: string) => {
    router.push(`/dashboard/users/${userId}`);
  };

  if (currentUser == null) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-muted-foreground">
        {t("common.loadingSession")}
      </div>
    );
  }

  if (!canAccess) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-muted-foreground">
        {t("common.redirecting")}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="shrink-0">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("common.back")}
            </Link>
          </Button>
          <div className="mr-4 flex">
            <Users className="mr-2 h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              {t("users.managementTitle")}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 p-4 pt-6 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t("users.title")}</h2>
            <p className="text-muted-foreground">
              {t("users.subtitle")}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {currentUser?.roles?.some((r) => normalizeRoleName(r) === "ADMIN") && (
              <CreateUserModal
                onSuccess={() => {
                  fetchUsers();
                }}
              />
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("users.searchPlaceholder")}
              className="w-full pl-8"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">
                  {t("users.usersList")} {displayUsers?.length || 0}
                </h3>
                {selectedFilter !== "all" && (
                  <p className="text-sm text-gray-600 mt-1">
                    {t("users.showingTeam")} {teamFilterOptions.find((u) => u.id === selectedFilter)?.name}
                  </p>
                )}
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="user-status" className="text-sm font-medium whitespace-nowrap">
                    {t("users.listStatus")}
                  </Label>
                  <Select
                    value={listStatus}
                    onValueChange={(v) => setListStatus(v as UserListStatusFilter)}
                    disabled={loadingUser}
                  >
                    <SelectTrigger id="user-status" className="w-full sm:w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">{t("users.all")}</SelectItem>
                      <SelectItem value="ACTIVE">{t("users.active")}</SelectItem>
                      <SelectItem value="INACTIVE">{t("users.inactive")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Label htmlFor="user-filter" className="text-sm font-medium whitespace-nowrap">
                    {t("users.byTeam")}
                  </Label>
                  <Select
                    value={selectedFilter}
                    onValueChange={handleFilterChange}
                    disabled={loadingAdmins || loadingFiltered}
                  >
                    <SelectTrigger id="user-filter" className="w-full sm:w-[250px]">
                      <SelectValue placeholder={loadingAdmins ? t("users.loadingFilter") : t("users.selectFilter")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("users.allUsers")}</SelectItem>
                      {teamFilterOptions.map((userOption) => (
                        <SelectItem key={userOption.id} value={userOption.id}>
                          <div className="flex items-center gap-2">
                            <span>{userOption.name}</span>
                            <div className="flex gap-1">
                              {userOption.roles.map((role) => (
                                <span key={role} className="text-xs bg-blue-100 text-blue-800 px-1 rounded">
                                  {role}
                                </span>
                              ))}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {loadingFiltered && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                    {t("users.filtering")}
                  </div>
                )}
              </div>
            </div>
            <UsersTable
              users={displayUsers}
              onViewUser={handleViewUser}
            />
          </div>
        </div>
      </div>
    </div>
  );
}