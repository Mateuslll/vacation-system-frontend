"use client"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CircleXIcon, Edit, ShieldUser, Trash, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { formatDate, getUserInitials } from "@/lib/utils";
import { useGetUser } from "@/hooks/users/useGetUser";
import { useToggleUser } from "@/hooks/users/useToggleUser";
import { useListManagersAndAdmins } from "@/hooks/users/useListManagersAndAdmins";
import { useChangeManager } from "@/hooks/users/useChangeManager";
import { UserStore } from "@/stores/user";
import { UpdateRolesModal } from "@/components/UpdateRolesModal";
import { toast } from "sonner";
import { canManageUsers, normalizeRoleName } from "@/lib/auth-user";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/lib/i18n";

interface UserDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const { t } = useTranslations();
  const router = useRouter();
  const { user, loadingUser, error, fetchUser } = useGetUser(params);
  const { deactivateUser, activateUser, isToggling } = useToggleUser();
  const currentUser = UserStore((state) => state.user);
  const canAccess = canManageUsers(currentUser?.roles);
  const { managersAndAdmins, loadingAdmins } = useListManagersAndAdmins(canAccess);
  const { changeManager, loading: loadingChangeManager } = useChangeManager();
  const [isUpdateRolesModalOpen, setIsUpdateRolesModalOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState<string>("");

  const canToggleUsers = canManageUsers(currentUser?.roles);

  useEffect(() => {
    if (currentUser && !canManageUsers(currentUser.roles)) {
      router.replace("/dashboard/vacation-requests");
    }
  }, [currentUser, router]);

  useEffect(() => {
    if (!user) return;
    setSelectedManager(user.managerId || "");
  }, [user?.id, user?.managerId]);

  const handleUpdateManager = async () => {
    if (!user) return;

    try {
      if (!selectedManager || selectedManager === "") {
        toast.error(t("users.managerRequiredError"));
        return;
      }
      await changeManager(user.id, selectedManager);
      await fetchUser(user.id);
    } catch {
      /* mensagem já exibida em useChangeManager */
    }
  };

  if (currentUser == null) {
    return (
      <div className="container mx-auto flex flex-1 items-center justify-center py-16 text-muted-foreground">
        {t("common.loadingSession")}
      </div>
    );
  }

  if (!canAccess) {
    return (
      <div className="container mx-auto flex flex-1 items-center justify-center py-16 text-muted-foreground">
        {t("common.redirecting")}
      </div>
    );
  }

  if (loadingUser) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            <span>{t("common.loading")}</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {error || t("users.userNotFound")}
          </h1>
          <Link href="/dashboard">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("users.backToDashboard")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    return status === "ACTIVE" ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        Ativo
        {t("users.activeStatus")}
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-red-100 text-red-800">
        {t("users.inactiveStatus")}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/users">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("common.back")}
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{t("users.detailsTitle")}</h1>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-lg">
                {getUserInitials(user.name.split(" ")[0], user.name.split(" ")[1])}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">
                {user.name}
              </h2>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <strong>Email:</strong> {user.email}
                </p>
                <p className="text-gray-600">
                  <strong>{t("users.status")}:</strong> {getStatusBadge(user.status)}
                </p>
                <div className="text-gray-600">
                  <strong>{t("users.roles")}:</strong>
                  <div className="flex gap-1 mt-1">
                    {user.roles.map((role) => (
                      <Badge key={role} variant="outline" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {canToggleUsers && (
                user.status === "ACTIVE" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-red-500 hover:bg-red-700 !text-white"
                    disabled={isToggling}
                    onClick={() => deactivateUser(user.id)}
                  >
                    <CircleXIcon className="h-4 w-4" />
                    {t("users.deactivateUser")}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-500 hover:bg-green-700 !text-white"
                    disabled={isToggling}
                    onClick={() => activateUser(user.id)}
                  >
                    <CircleXIcon className="h-4 w-4" />
                    {t("users.activateUser")}
                  </Button>
                )
              )}
              {currentUser?.roles?.some((r) => normalizeRoleName(r) === "ADMIN") && (
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-yellow-500 hover:bg-yellow-700 !text-white justify-start"
                  onClick={() => setIsUpdateRolesModalOpen(true)}
                >
                  <ShieldUser className="h-4 w-4" />
                  {t("users.updateRoles")}
                </Button>
              )}
            </div>
          </div>
        </div>

        {currentUser?.roles?.some((r) => normalizeRoleName(r) === "ADMIN") && (
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">{t("users.managerAssignment")}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {t("users.managerAssignmentHelp")}
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="manager-select" className="text-sm font-medium">
                    {t("users.selectManager")}
                  </Label>
                  <Select
                    value={selectedManager || "none"}
                    onValueChange={(value) => setSelectedManager(value === "none" ? "" : value)}
                    disabled={loadingAdmins}
                  >
                    <SelectTrigger id="manager-select" className="w-full">
                      <SelectValue placeholder={loadingAdmins ? t("users.loadingFilter") : t("users.selectManagerPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">{t("users.noManager")}</SelectItem>
                      {managersAndAdmins?.map((manager) => (
                        <SelectItem key={manager.id} value={manager.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{manager.name}</span>
                            <div className="flex gap-1 ml-2">
                              {manager.roles.map((role) => (
                                <Badge key={role} variant="outline" className="text-xs">
                                  {role}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    className="w-full md:w-auto"
                    disabled={loadingAdmins || loadingChangeManager || selectedManager === (user?.managerId || "")}
                    onClick={handleUpdateManager}
                  >
                    {loadingChangeManager ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                        {t("users.updating")}
                      </div>
                    ) : (
                      t("users.updateManager")
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">{t("users.activityInfo")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">{t("users.lastLogin")}</p>
              <p className="font-medium">{user.lastLogin ? formatDate(user.lastLogin) : "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t("users.createdAt")}</p>
              <p className="font-medium">{formatDate(user.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t("users.updatedAt")}</p>
              <p className="font-medium">{formatDate(user.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>

      <UpdateRolesModal
        isOpen={isUpdateRolesModalOpen}
        onClose={() => setIsUpdateRolesModalOpen(false)}
        userId={user.id}
        currentRoles={user.roles}
        onSuccess={async () => {
          setIsUpdateRolesModalOpen(false);
          await fetchUser(user.id);
        }}
      />
    </div>
  );
}