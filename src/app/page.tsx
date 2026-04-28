"use client"
import { UserStore } from "@/stores/user";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Calendar,
  Users,
  LogIn,
  LogOut,
  Settings,
  ArrowRight,
  CheckCircle,
  Clock,
  Shield
} from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useTranslations } from "@/lib/i18n";

export default function Home() {
  const { t } = useTranslations();
  const user = UserStore(state => state.user);
  const clearUser = UserStore(state => state.clearUser);
  const router = useRouter();

  const handleLogout = () => {
    clearUser();
  };

  const features = [
    {
      icon: Calendar,
      title: t("home.featureVacationsTitle"),
      description: t("home.featureVacationsDescription"),
    },
    {
      icon: Users,
      title: t("home.featureUsersTitle"),
      description: t("home.featureUsersDescription"),
    },
    {
      icon: Settings,
      title: t("home.featureSettingsTitle"),
      description: t("home.featureSettingsDescription"),
    }
  ];

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  return (
    <div className="bg-gradient-to-br from-slate-100 via-white to-blue-50 h-full">
      <div className="fixed right-4 top-4 z-20 rounded-lg border bg-white/80 px-1 py-1 shadow-sm backdrop-blur">
        <LanguageToggle />
      </div>
      <div className="px-4 py-12">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl shadow-xl mx-auto mb-8">
            <Building2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            {t("home.brandName")}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">
              {t("home.brandSubtitle")}
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t("home.subtitle")}
          </p>
          <Link href="/sign-in">
            <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200">
              <LogIn className="mr-2 h-5 w-5" />
              {t("home.loginButton")}
            </Button>
          </Link>
        </div>

        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-8 text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
