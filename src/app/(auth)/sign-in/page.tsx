"use client";

import { useAuthForm } from "@/hooks/auth/useAuthForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, LogIn, Building2, UserCog } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useQuickSignIn } from "@/hooks/auth/useQuickSignIn";

export default function SignIn() {
  const { form, onSubmit, errors, loading } = useAuthForm();
  const { quickSignInAdmin, quickSignInUser, loadingQuickLogin } = useQuickSignIn();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">

        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg mx-auto mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Sistema de Gerenciamento
          </h1>
          <p className="text-gray-600 mt-2">
            Entre com suas credenciais para acessar
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center text-gray-800">
              Entrar
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Digite seu email e senha para acessar sua conta
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={onSubmit} className="space-y-4">

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="h-11 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  {...form.register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    className="h-11 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10"
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
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              {errors.root && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {errors.root.message}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !form.formState.isValid || loadingQuickLogin}
                className="w-full h-11 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Entrando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Entrar
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


            <Link
              href="/sign-up"
              className="w-full flex items-center justify-center rounded-md h-11 bg-green-600 hover:bg-green-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Criar conta
            </Link>
            <div className="relative">
              <Separator className="my-6" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white px-2 text-xs text-gray-500">
                  Login rapido
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">

              <Button
                type="button"
                onClick={quickSignInAdmin}
                disabled={loadingQuickLogin}
                className="w-full h-11 bg-red-500 hover:bg-red-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <UserCog className="w-4 h-4" />
                Administrador
              </Button>

              <Button
                type="button"
                onClick={quickSignInUser}
                disabled={loadingQuickLogin}
                className="w-full h-11 bg-yellow-500 hover:bg-yellow-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <UserCog className="w-4 h-4" />
                Funcionario
              </Button>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}