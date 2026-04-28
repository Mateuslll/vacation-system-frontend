"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserListItem } from "@/types/user";
import { Eye, Edit } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { formatDate, getUserInitials } from "@/lib/utils";

interface UsersTableProps {
  users: UserListItem[] | null;
  loading?: boolean;
  onViewUser?: (userId: string) => void;
}

export function UsersTable({ users, onViewUser }: UsersTableProps) {

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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuário</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Roles</TableHead>
            <TableHead>Último Login</TableHead>
            <TableHead className="text-right">Criado em</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!users ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center">
                <Skeleton className="h-12 w-full" />
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8">
                <div className="text-gray-500">Nenhum usuário encontrado</div>
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {getUserInitials(user.name.split(" ")[0], user.name.split(" ")[1])}
                      </AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>

                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {user.roles.map((role) => (
                      <Badge key={role} variant="outline" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </TableCell>


                <TableCell>{user.lastLogin ? formatDate(user.lastLogin) : "-"}</TableCell>
                <TableCell className="text-right">
                  {formatDate(user?.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewUser?.(user.id)}
                      className="h-8 w-8 p-0"
                      title="Visualizar usuário"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}