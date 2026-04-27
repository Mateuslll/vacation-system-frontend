"use client";

import { useState } from "react";
import { useCreateUser } from "@/hooks/users/useCreateUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, EyeOff, UserPlus, Plus } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api-errors";

interface CreateUserModalProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function CreateUserModal({ trigger, onSuccess }: CreateUserModalProps) {
  const { form, onSubmitRaw, errors, loading } = useCreateUser();
  const [showPassword, setShowPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      const result = await onSubmitRaw(data);
      if (result) {
        setIsOpen(false);
        form.reset();
        onSuccess?.();
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Usuário
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <UserPlus className="h-5 w-5 text-green-600" />
            Criar Novo Usuário
          </DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo para criar um novo utilizador no sistema.
          </DialogDescription>
          <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
            <strong>Próximo passo (férias):</strong> após criar o colaborador, um administrador deve abrir{" "}
            <strong>Utilizadores</strong>, entrar no <strong>detalhe</strong> do utilizador e{" "}
            <strong>atribuir um gestor</strong> (MANAGER ou ADMIN). Sem gestor, a API recusa novos pedidos de férias.
          </div>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium">
                Nome *
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="João"
                className="h-10"
                {...form.register("firstName")}
              />
              {errors.firstName && (
                <p className="text-xs text-red-500">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium">
                Sobrenome *
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Silva"
                className="h-10"
                {...form.register("lastName")}
              />
              {errors.lastName && (
                <p className="text-xs text-red-500">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="joao.silva@empresa.com"
              className="h-10"
              {...form.register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Senha Temporária *
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite uma senha temporária"
                className="h-10 pr-10"
                {...form.register("password")}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !form.formState.isValid}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Criando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Criar Usuário
                </div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}