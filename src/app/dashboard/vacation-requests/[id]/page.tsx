"use client";

import { useState } from "react";
import { Controller } from "react-hook-form";
import { useVacationRequestDetails } from "@/hooks/vacation/useVacationRequestDetails";
import { useUpdateVacationRequest } from "@/hooks/vacation/useUpdateVacationRequest";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/DatePicker";
import { ArrowLeft, Calendar, User, FileText, CheckCircle, XCircle, InfoIcon, Pencil } from "lucide-react";
import Link from "next/link";
import { formatDate, formatDateOnly } from "@/lib/utils";
import { UserStore } from "@/stores/user";
import { useActionsVacation } from "@/hooks/vacation/useActionsVacation";
import { RejectVacationFormData } from "@/types/forms";
import { RejectVacationModal } from "@/components/RejectVacationModal";
import StatusBadge from "@/components/StatusBadge";
import { parseISO } from "date-fns";
import { canManageUsers, normalizeRoleName } from "@/lib/auth-user";
import { useTranslations } from "@/lib/i18n";

interface VacationDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function VacationDetailsPage({ params }: VacationDetailPageProps) {
  const { t } = useTranslations();
  const currentUser = UserStore((state) => state.user);
  const { vacationRequest, setVacationRequest, loadingVacation, errorVacation } = useVacationRequestDetails(params);
  const { form, approveVacation, rejectVacation, cancelVacation, loadingActionsVacation } = useActionsVacation();
  const { form: editForm, onSubmit: submitEditForm, errors: editErrors, loading: loadingEdit } =
    useUpdateVacationRequest(vacationRequest, {
      onSuccess: (updated) => {
        setVacationRequest(updated);
        setEditingVacation(false);
      },
    });
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [editingVacation, setEditingVacation] = useState(false);
  const canApproveVacations = canManageUsers(currentUser?.roles);
  const isAdmin = currentUser?.roles?.some((r) => normalizeRoleName(r) === "ADMIN") ?? false;
  const canEditVacation =
    !!vacationRequest &&
    vacationRequest.status.toUpperCase() === "PENDING" &&
    (vacationRequest.userId === currentUser?.id ||
      isAdmin);


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

  const handleCancelEdit = () => {
    if (!vacationRequest) return;
    editForm.reset({
      startDate: parseISO(vacationRequest.startDate),
      endDate: parseISO(vacationRequest.endDate),
      reason: vacationRequest.reason ?? "",
    });
    setEditingVacation(false);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitEditForm(e);
    } catch {
      /* erro já exibido em useUpdateVacationRequest */
    }
  };

  if (loadingVacation) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            <span>{t("vacations.loadingDetails")}</span>
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
            {errorVacation || t("vacations.requestNotFound")}
          </h1>
          <Link href="/dashboard/vacation-requests">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("vacations.backToRequests")}
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
              {t("common.back")}
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              {t("vacations.detailsTitle")}
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t("vacations.employeeInfoPeriod")}
              </CardTitle>
              {canEditVacation && !editingVacation && (
                <Button type="button" variant="outline" size="sm" onClick={() => setEditingVacation(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  {t("vacations.edit")}
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">{t("vacations.employee")}</label>
                  <p className="text-lg font-semibold text-gray-900">{vacationRequest.userName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">{t("users.employeeId")}</label>
                  <p className="text-sm text-gray-700 font-mono">{vacationRequest.userId}</p>
                </div>
              </div>

              <Separator />

              {editingVacation ? (
                <form onSubmit={handleSaveEdit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t("vacations.startDate")}</Label>
                      <Controller
                        name="startDate"
                        control={editForm.control}
                        render={({ field }) => (
                          <DatePicker
                            date={field.value}
                            onSelect={field.onChange}
                            placeholder={t("vacations.startDate")}
                            disabled={loadingEdit}
                          />
                        )}
                      />
                      {editErrors.startDate && (
                        <p className="text-xs text-red-500">{editErrors.startDate.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>{t("vacations.endDate")}</Label>
                      <Controller
                        name="endDate"
                        control={editForm.control}
                        render={({ field }) => (
                          <DatePicker
                            date={field.value}
                            onSelect={field.onChange}
                            placeholder={t("vacations.endDate")}
                            disabled={loadingEdit}
                          />
                        )}
                      />
                      {editErrors.endDate && (
                        <p className="text-xs text-red-500">{editErrors.endDate.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("vacations.requestReason")}</Label>
                    <Textarea
                      {...editForm.register("reason")}
                      className="min-h-[100px] resize-none"
                      disabled={loadingEdit}
                      maxLength={500}
                    />
                    {editErrors.reason && (
                      <p className="text-xs text-red-500">{editErrors.reason.message}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button type="submit" disabled={loadingEdit || !editForm.formState.isValid}>
                      {loadingEdit ? t("vacations.saving") : t("common.save")}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCancelEdit} disabled={loadingEdit}>
                      {t("vacations.editCancel")}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">{t("vacations.startDate")}</label>
                    <p className="text-lg font-semibold text-gray-900">{formatDateOnly(vacationRequest.startDate)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">{t("vacations.endDate")}</label>
                    <p className="text-lg font-semibold text-gray-900">{formatDateOnly(vacationRequest.endDate)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">{t("vacations.totalDays")}</label>
                    <p className="text-lg font-semibold text-blue-600">{vacationRequest.days} {t("vacations.days")}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {!editingVacation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t("vacations.requestReason")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900 leading-relaxed">
                    {vacationRequest.reason || t("vacations.noReason")}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {vacationRequest.status.toUpperCase() === "REJECTED" && vacationRequest.rejectionReason && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <XCircle className="h-5 w-5" />
                  {t("vacations.rejectionReason")}
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
              <CardTitle className="text-lg">{t("vacations.statusApproval")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">{t("vacations.currentStatus")}</label>
                <div className="mt-1">
                  <StatusBadge status={vacationRequest.status} />
                </div>
              </div>

              {vacationRequest.approvedBy && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-gray-600">{t("vacations.approvedBy")}</label>
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
                  {t("common.cancel")}
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("vacations.timeline")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">{t("vacations.requestedAt")}</label>
                <p className="text-sm text-gray-900">{formatDate(vacationRequest.createdAt)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">{t("vacations.lastUpdate")}</label>
                <p className="text-sm text-gray-900">{formatDate(vacationRequest.updatedAt)}</p>
              </div>

              {vacationRequest.processedAt && (
                <div>
                  <label className="text-sm font-medium text-gray-600">{t("vacations.processedAt")}</label>
                  <p className="text-sm text-gray-900">{formatDate(vacationRequest.processedAt)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {(canApproveVacations && vacationRequest.status.toUpperCase() === "PENDING") && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("vacations.actions")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  className="w-full bg-green-500 hover:bg-green-700"
                  disabled={loadingActionsVacation}
                  onClick={handleApprove}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {t("vacations.approve")}
                </Button>


                <Button
                  variant="outline"
                  className="w-full border-red-300 text-red-700 hover:bg-red-50"
                  disabled={loadingActionsVacation}
                  onClick={() => setIsRejectModalOpen(true)}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  {t("vacations.reject")}
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