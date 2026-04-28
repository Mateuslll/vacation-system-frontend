"use client";

import { XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { RejectVacationFormData } from "@/types/forms";

interface RejectVacationModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: UseFormReturn<RejectVacationFormData>;
  onSubmit: (data: RejectVacationFormData) => void;
  loading: boolean;
}

export function RejectVacationModal({
  isOpen,
  onClose,
  form,
  onSubmit,
  loading
}: RejectVacationModalProps) {
  const handleClose = () => {
    onClose();
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-700">
            <XCircle className="h-5 w-5" />
            Rejeitar Solicitação de Férias
          </DialogTitle>
          <DialogDescription>
            Informe o motivo da rejeição desta solicitação. Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo da Rejeição *</Label>
            <Textarea
              id="reason"
              {...form.register("rejectionReason")}
              placeholder="Descreva o motivo da rejeição da solicitação de férias..."
              className="min-h-[100px] resize-none"
              disabled={loading}
            />
            {form.formState.errors.rejectionReason && (
              <p className="text-sm text-red-600">
                {form.formState.errors.rejectionReason.message}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={loading || !form.formState.isValid}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Processando...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Rejeitar Solicitação
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}