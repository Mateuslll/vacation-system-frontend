"use client";

import {useRouter} from "next/navigation";
import {Controller} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Separator} from "@/components/ui/separator";
import {AlertCircle, ArrowLeft, Calendar, CheckCircle, Clock, FileText} from "lucide-react";
import Link from "next/link";
import {DatePicker} from "@/components/DatePicker";
import {useCreateVacationRequest} from "@/hooks/vacation/useCreateVacationRequest";
import {useListVacationApproved} from "@/hooks/vacation/useListVacationApproved";
import {addDays, isSameDay, startOfDay} from "date-fns";
import { useTranslations } from "@/lib/i18n";

export default function NewVacationRequestPage() {
  const { t, locale } = useTranslations();
  const router = useRouter();
  const { form, onSubmit, loading, errors } = useCreateVacationRequest({
    onSuccess: () => router.push("/dashboard/vacation-requests"),
  });
  const { blockedDates } = useListVacationApproved();

  const startDate = form.watch('startDate');
  const endDate = form.watch('endDate');

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    const tomorrow = addDays(startOfDay(today), 1);

    if (startOfDay(date) < tomorrow) return true;

    return blockedDates ? blockedDates.some(blockedDate => isSameDay(date, blockedDate)) : false;
  };

  const isEndDateDisabled = (date: Date) => {
    const today = new Date();
    const tomorrow = addDays(startOfDay(today), 1);

    if (startOfDay(date) < tomorrow) return true;
    if (startDate && date < startDate) return true;

    if (startDate) {
      const minimumEndDate = addDays(startDate, 4);
      if (date < minimumEndDate) return true;

      const maximumEndDate = addDays(startDate, 29);
      if (date > maximumEndDate) return true;
    }

    return blockedDates ? blockedDates.some(blockedDate => isSameDay(date, blockedDate)) : false;
  };


  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/vacation-requests">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("common.back")}
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              {t("vacations.newRequestTitle")}
            </h1>
            <p className="text-gray-600 mt-1">
              {t("vacations.newRequestSubtitle")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t("vacations.requestData")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Data de Início *</Label>
                    <Controller
                      name="startDate"
                      control={form.control}
                      render={({ field }) => (
                        <DatePicker
                          date={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            if (endDate && date && endDate < date) {
                              form.setValue('endDate', date);
                            }
                          }}
                          placeholder="Selecione a data de início"
                          disabledDates={isDateDisabled}
                          disabled={loading}
                        />
                      )}
                    />
                    {errors.startDate && (
                      <p className="text-xs text-red-500">{errors.startDate.message}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      {t("vacations.blockedDatesHint")}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">Data de Término *</Label>
                    <Controller
                      name="endDate"
                      control={form.control}
                      render={({ field }) => (
                        <DatePicker
                          date={field.value}
                          onSelect={field.onChange}
                          placeholder="Selecione a data de término"
                          disabledDates={isEndDateDisabled}
                          disabled={loading || !startDate}
                        />
                      )}
                    />
                    {errors.endDate && (
                      <p className="text-xs text-red-500">{errors.endDate.message}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      {t("vacations.endDateHint")}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="reason">{t("vacations.reasonLabel")}</Label>
                  <Textarea
                    id="reason"
                    {...form.register('reason')}
                    placeholder={t("vacations.reasonPlaceholder")}
                    className="min-h-[120px] resize-none"
                    disabled={loading}
                    maxLength={500}
                  />
                  {errors.reason && (
                    <p className="text-xs text-red-500">{errors.reason.message}</p>
                  )}
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                    disabled={loading}
                    className="flex-1"
                  >
                    {t("common.clearForm")}
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || !form.formState.isValid}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        {t("vacations.sending")}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {t("vacations.submitRequest")}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {t("vacations.requestSummary")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">{t("vacations.selectedPeriod")}</Label>
                {startDate && endDate ? (
                  <div className="mt-1">
                    <p className="text-sm font-medium">
                      {startDate.toLocaleDateString(locale === "pt" ? "pt-PT" : "en-US")} - {endDate.toLocaleDateString(locale === "pt" ? "pt-PT" : "en-US")}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mt-1">{t("vacations.selectDates")}</p>
                )}
              </div>

            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-0">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-2">
                    {t("vacations.importantTips")}
                  </h4>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• <strong>{t("vacations.minDaysTip")}</strong></li>
                    <li>• {t("vacations.blockedDatesTip")}</li>
                    <li>• {t("vacations.minReasonTip")}</li>
                    <li>• {t("vacations.noPastDatesTip")}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}