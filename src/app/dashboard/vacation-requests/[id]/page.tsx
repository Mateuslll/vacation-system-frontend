"use client";

import { useState } from "react";
import { useVacationRequestDetails } from "@/hooks/vacation/useVacationRequestDetails";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, User, FileText, CheckCircle, XCircle, Clock, AlertCircle, InfoIcon } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { UserStore } from "@/stores/user";
import { useActionsVacation } from "@/hooks/vacation/useActionsVacation";
import { RejectVacationFormData } from "@/types/forms";
import { RejectVacationModal } from "@/components/RejectVacationModal";
import StatusBadge from "@/components/StatusBadge";

interface VacationDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function VacationDetailsPage({ params }: VacationDetailPageProps) {
  const { vacationRequest, setVacationRequest, loadingVacation, errorVacation } = useVacationRequestDetails(params);
  const { form, approveVacation, rejectVacation, cancelVacation, loadingActionsVacation } = useActionsVacation();
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const currentUser = UserStore(state => state.user);
  const canApproveVacations = currentUser?.roles?.some(role =>
    role === "ADMIN" || role === "MANAGER"
  ) || false;


  const handleApprove = async () => {
    if (!vacationRequest) return;
    try {
      const updatedVacation = await approveVacation(vacationRequest.id);
      setVacationRequest(updatedVacation);
    } catch {
      /* erro já exibido em useActionsVacation */
    }
  };

  const handleReject = async (data: RejectVacationFormData) => {
    if (!vacationRequest) return;
    try {
      const updatedVacation = await rejectVacation(vacationRequest.id, data);
      if (updatedVacation) {
        setVacationRequest(updatedVacation);
        setIsRejectModalOpen(false);
        form.reset();
      }
    } catch {
      /* erro já exibido em useActionsVacation */
    }
  };

  const handleCancel = async () => {
    if (!vacationRequest) return;
    try {
      const updatedVacation = await cancelVacation(vacationRequest.id);
      if (updatedVacation) {
        setVacationRequest(updatedVacation);
      }
    } catch {
      /* erro já exibido em useActionsVacation */
    }
  };

  if (loadingVacation) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            <span>Carregando detalhes da solicitação...</span>
          </div>
        </div>
      </div>
    );
  }

  if (errorVacation || !vacationRequest) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {errorVacation || "Solicitação não encontrada"}
          </h1>
          <Link href="/dashboard/vacation-requests">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Solicitações
            </Button>
          </Link>
        </div>
      </div>
    );
  }



  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/vacation-requests">
            <Button variant="default" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              Detalhes da Solicitação de Férias
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações do Funcionário e Período
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Funcionário</label>
                  <p className="text-lg font-semibold text-gray-900">{vacationRequest.userName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">ID do Funcionário</label>
                  <p className="text-sm text-gray-700 font-mono">{vacationRequest.userId}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Data de Início</label>
                  <p className="text-lg font-semibold text-gray-900">{formatDate(vacationRequest.startDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Data de Término</label>
                  <p className="text-lg font-semibold text-gray-900">{formatDate(vacationRequest.endDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Total de Dias</label>
                  <p className="text-lg font-semibold text-blue-600">{vacationRequest.days} dias</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Motivo da Solicitação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900 leading-relaxed">
                  {vacationRequest.reason || "Nenhum motivo especificado."}
                </p>
              </div>
            </CardContent>
          </Card>

          {vacationRequest.status.toUpperCase() === "REJECTED" && vacationRequest.rejectionReason && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <XCircle className="h-5 w-5" />
                  Motivo da Rejeição
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-red-900 leading-relaxed">
                    {vacationRequest.rejectionReason}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status e Aprovação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Status Atual</label>
                <div className="mt-1">
                  <StatusBadge status={vacationRequest.status} />
                </div>
              </div>

              {vacationRequest.approvedBy && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-gray-600">Aprovado por</label>
                    <p className="text-sm font-medium text-gray-900">{vacationRequest.approvedByName}</p>
                    <p className="text-xs text-gray-500 font-mono">{vacationRequest.approvedBy}</p>
                  </div>
                </>
              )}
              {currentUser?.id == vacationRequest.userId && vacationRequest.status.toUpperCase() === "PENDING" && (
                <Button
                  className="w-full bg-yellow-500 hover:bg-yellow-700"
                  disabled={loadingActionsVacation}
                  onClick={handleCancel}
                >
                  <InfoIcon className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Linha do Tempo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Solicitado em</label>
                <p className="text-sm text-gray-900">{formatDate(vacationRequest.createdAt)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Última atualização</label>
                <p className="text-sm text-gray-900">{formatDate(vacationRequest.updatedAt)}</p>
              </div>

              {vacationRequest.processedAt && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Processado em</label>
                  <p className="text-sm text-gray-900">{formatDate(vacationRequest.processedAt)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {(canApproveVacations && vacationRequest.status.toUpperCase() === "PENDING") && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  className="w-full bg-green-500 hover:bg-green-700"
                  disabled={loadingActionsVacation}
                  onClick={handleApprove}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Aprovar
                </Button>


                <Button
                  variant="outline"
                  className="w-full border-red-300 text-red-700 hover:bg-red-50"
                  disabled={loadingActionsVacation}
                  onClick={() => setIsRejectModalOpen(true)}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Rejeitar
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <RejectVacationModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        form={form}
        onSubmit={handleReject}
        loading={loadingActionsVacation}
      />
    </div>
  );
}