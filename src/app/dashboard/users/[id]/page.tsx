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
import { getErrorMessage } from "@/lib/api-errors";

interface UserDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const { user, loadingUser, error, fetchUser } = useGetUser(params);
  const { deactivateUser, activateUser, isToggling } = useToggleUser();
  const { managersAndAdmins, loadingAdmins } = useListManagersAndAdmins();
  const { changeManager, loading: loadingChangeManager } = useChangeManager();
  const currentUser = UserStore(state => state.user);
  const [isUpdateRolesModalOpen, setIsUpdateRolesModalOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState<string>("");

  const canToggleUsers = currentUser?.roles?.some(role =>
    role === "ADMIN" || role === "MANAGER"
  ) || false;

  useEffect(() => {
    if (user && !selectedManager) {
      setSelectedManager(user.managerId || "");
    }
  }, [user, selectedManager]);

  const handleUpdateManager = async () => {
    if (!user) return;

    try {
      let result;

      if (selectedManager && selectedManager !== "") {
        result = await changeManager(user.id, selectedManager);
      }
      if (result) {
        await fetchUser(user.id);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (loadingUser) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            <span>Carregando usuário...</span>
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
            {error || "Usuário não encontrado"}
          </h1>
          <Link href="/dashboard">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Dashboard
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
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-red-100 text-red-800">
        Inativo
      </Badge>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Detalhes do Usuário</h1>
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
                  <strong>Status:</strong> {getStatusBadge(user.status)}
                </p>
                <div className="text-gray-600">
                  <strong>Roles:</strong>
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
                    Desativar Usuário
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
                    Ativar Usuário
                  </Button>
                )
              )}
              {currentUser?.roles?.includes("ADMIN") && (
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-yellow-500 hover:bg-yellow-700 !text-white justify-start"
                  onClick={() => setIsUpdateRolesModalOpen(true)}
                >
                  <ShieldUser className="h-4 w-4" />
                  Atualizar Roles
                </Button>
              )}
            </div>
          </div>
        </div>

        {currentUser?.roles?.includes("ADMIN") && (
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Atribuição de Gerente</h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="manager-select" className="text-sm font-medium">
                    Selecionar Gerente/Administrador
                  </Label>
                  <Select
                    value={selectedManager || "none"}
                    onValueChange={(value) => setSelectedManager(value === "none" ? "" : value)}
                    disabled={loadingAdmins}
                  >
                    <SelectTrigger id="manager-select" className="w-full">
                      <SelectValue placeholder={loadingAdmins ? "Carregando..." : "Selecione um gerente"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum gerente atribuído</SelectItem>
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
                        Atualizando...
                      </div>
                    ) : (
                      "Atualizar Gerente"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Informações de Atividade</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Último Login</p>
              <p className="font-medium">{user.lastLogin ? formatDate(user.lastLogin) : "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Criado em</p>
              <p className="font-medium">{formatDate(user.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Atualizado em</p>
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