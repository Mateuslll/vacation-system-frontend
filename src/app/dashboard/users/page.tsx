"use client";

import { UsersTable } from "@/components/UsersTable";
import { CreateUserModal } from "@/components/CreateUserModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Users, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useListUsers } from "@/hooks/users/useListUsers";
import { useListManagersAndAdmins } from "@/hooks/users/useListManagersAndAdmins";
import { useListUserByCollaborators } from "@/hooks/users/useListUserByCollaborators";
import { UserStore } from "@/stores/user";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const router = useRouter();
  const { users, fetchUsers } = useListUsers();
  const { managersAndAdmins, loadingAdmins } = useListManagersAndAdmins();
  const { usersFiltered, loading: loadingFiltered, fetchUsersByCollaborators } = useListUserByCollaborators();
  const currentUser = UserStore(state => state.user);

  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [displayUsers, setDisplayUsers] = useState(users);

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

  return (
    <div className="flex flex-col h-full">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Users className="mr-2 h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              Gerenciamento de Usuários
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Usuários</h2>
            <p className="text-muted-foreground">
              Gerencie os utilizadores do sistema. Para colaboradores pedirem férias, atribua um gestor no detalhe
              do utilizador.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {currentUser?.roles?.includes("ADMIN") && (
              <CreateUserModal
                onSuccess={() => {
                  fetchUsers();
                }}
              />
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar usuários..."
              className="pl-8 w-[300px]"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">
                  Lista de Usuários {displayUsers?.length || 0}
                </h3>
                {selectedFilter !== "all" && (
                  <p className="text-sm text-gray-600 mt-1">
                    Exibindo colaboradores de: {managersAndAdmins?.find(m => m.id === selectedFilter)?.name}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="user-filter" className="text-sm font-medium">
                    Selecione o filtro:
                  </Label>
                </div>

                <Select
                  value={selectedFilter}
                  onValueChange={handleFilterChange}
                  disabled={loadingAdmins || loadingFiltered}
                >
                  <SelectTrigger id="user-filter" className="w-[250px]">
                    <SelectValue placeholder={loadingAdmins ? "Carregando..." : "Selecione um filtro"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os usuários</SelectItem>
                    {managersAndAdmins?.map((manager) => (
                      <SelectItem key={manager.id} value={manager.id}>
                        <div className="flex items-center gap-2">
                          <span>{manager.name}</span>
                          <div className="flex gap-1">
                            {manager.roles.map((role) => (
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

                {loadingFiltered && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                    Filtrando...
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