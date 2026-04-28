"use client";

import { useRegisterUser } from "@/hooks/auth/useRegisterUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, UserPlus, Building2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { getPasswordRules } from "@/lib/password-rules";
import { useTranslations } from "@/lib/i18n";

export default function SignUp() {
  const { t } = useTranslations();
  const { form, onSubmit, errors, loading } = useRegisterUser();
  const [showPassword, setShowPassword] = useState(false);
  const passwordValue = form.watch("password");
  const passwordRules = getPasswordRules(passwordValue);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-100 p-4 py-8">
      <div className="w-full max-w-md space-y-4">

        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg mx-auto mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("auth.signUpTitle")}
          </h1>
          <p className="text-gray-600 mt-2">
            {t("auth.signUpSubtitle")}
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center text-gray-800">
              {t("auth.signUp")}
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              {t("auth.signUpDescription")}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-2">
            <form onSubmit={onSubmit} className="space-y-2" autoComplete="off">

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    {t("auth.firstName")}
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="João"
                    className="h-11 bg-white/50 border-gray-200 focus:border-green-500 focus:ring-green-500"
                    {...form.register("firstName")}
                  />
                  {errors.firstName && (
                    <p className="text-xs  text-red-500">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    {t("auth.lastName")}
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Silva"
                    className="h-11 bg-white/50 border-gray-200 focus:border-green-500 focus:ring-green-500"
                    {...form.register("lastName")}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-500">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="joao.silva@exemplo.com"
                  autoComplete="off"
                  className="h-11 bg-white/50 border-gray-200 focus:border-green-500 focus:ring-green-500"
                  {...form.register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  {t("auth.password")}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite uma senha segura"
                    className="h-11 bg-white/50 border-gray-200 focus:border-green-500 focus:ring-green-500 pr-10"
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

                {passwordRules.map((rule) => (
                  <p
                    key={rule.key}
                    className={`text-xs ${rule.isValid ? "text-green-500" : "text-red-500"
                      }`}
                  >
                    {rule.label}
                  </p>
                ))}
              </div>

              {errors.root && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {errors.root.message}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !form.formState.isValid}
                className="w-full h-11 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t("auth.creatingAccount")}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    {t("auth.createAccount")}
                  </div>
                )}
              </Button>
            </form>

            <div className="relative">
              <Separator className="my-6" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white px-2 text-xs text-gray-500">
                  ou
                </span>
              </div>
            </div>

            <div className="space-y-3 text-center">
              <Button
                variant="outline"
                className="w-full h-11 border-gray-200 hover:bg-gray-50"
                asChild
              >
                <Link href="/sign-in">
                  {t("auth.haveAccount")}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
