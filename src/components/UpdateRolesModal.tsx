"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { UserRole } from "@/types/user";
import { toast } from "sonner";
import { useUpdateRoleUser } from "@/hooks/users/useUpdateRoleUser";

interface UpdateRolesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  currentRoles: string[];
  onSuccess?: () => void;
}

const availableRoles: { value: UserRole; label: string }[] = [
  { value: "USER", label: "Usuário" },
  { value: "MANAGER", label: "Gerente" },
  { value: "ADMIN", label: "Administrador" },
];

export function UpdateRolesModal({
  isOpen,
  onClose,
  userId,
  currentRoles,
  onSuccess
}: UpdateRolesModalProps) {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const { updateUserRoles, loadingRoles } = useUpdateRoleUser();

  const handleSave = async () => {
    if (!selectedRole) {
      toast.error("Selecione uma role");
      return;
    }


    await updateUserRoles(userId, selectedRole);
    onSuccess?.();
    onClose();

  };

  const handleCancel = () => {
    setSelectedRole(currentRoles[0] || "");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Atualizar Role do Usuário</DialogTitle>
          <DialogDescription>
            Selecione a nova role para o usuário. Esta ação irá sobrescrever as roles atuais.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="role-select">Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger id="role-select">
                <SelectValue placeholder="Selecione uma role..." />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={loadingRoles}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={loadingRoles || !selectedRole}
          >
            {loadingRoles ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Salvando...
              </>
            ) : (
              "Salvar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}