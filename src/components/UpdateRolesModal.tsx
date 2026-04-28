"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const { updateUserRoles, loadingRoles } = useUpdateRoleUser();

  useEffect(() => {
    if (isOpen) {
      setSelectedRoles(currentRoles || []);
    }
  }, [isOpen, currentRoles]);

  const handleSave = async () => {
    if (!selectedRoles || selectedRoles.length === 0) {
      toast.error("Selecione pelo menos uma role");
      return;
    }

    await updateUserRoles(userId, selectedRoles);
    onSuccess?.();
    onClose();

  };

  const handleCancel = () => {
    setSelectedRoles(currentRoles || []);
    onClose();
  };

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) => {
      const exists = prev.includes(role);
      if (exists) return prev.filter((r) => r !== role);
      return [...prev, role];
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Atualizar Role do Usuário</DialogTitle>
          <DialogDescription>
            Selecione as roles que o usuário deve ter. Esta ação irá substituir as roles atuais.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Roles</Label>
            <div className="flex flex-wrap gap-2">
              {availableRoles.map((role) => {
                const isSelected = selectedRoles.includes(role.value);
                return (
                  <Button
                    key={role.value}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => toggleRole(role.value)}
                    disabled={loadingRoles}
                    className="h-9"
                  >
                    {role.label}
                    {isSelected && (
                      <Badge variant="secondary" className="ml-2 bg-white/20 text-white border-0">
                        selecionado
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </div>
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
            disabled={loadingRoles || selectedRoles.length === 0}
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