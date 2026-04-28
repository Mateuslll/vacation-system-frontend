"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Home, LogOut } from "lucide-react";
import { UserStore } from "@/stores/user";
import { useState } from "react";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useTranslations } from "@/lib/i18n";

const navigationItems = [
  {
    key: "dashboard",
    href: "/dashboard",
    icon: Home,
    roles: ["USER", "MANAGER", "ADMIN"],
  },
  {
    key: "users",
    href: "/dashboard/users",
    icon: Users,
    roles: ["MANAGER", "ADMIN"],
  },
  {
    key: "vacationRequests",
    href: "/dashboard/vacation-requests",
    icon: Calendar,
    roles: ["USER", "MANAGER", "ADMIN"],
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentUser = UserStore((state) => state.user);
  const clearUser = UserStore((state) => state.clearUser);

  const handleLogout = () => {
    clearUser();
    router.push("/sign-in");
  };

  const getFilteredNavigationItems = () => {
    if (!currentUser?.roles) return [];

    return navigationItems.filter((item) => {
      return item.roles.some(role => currentUser.roles?.includes(role));
    });
  };

  const filteredNavigationItems = getFilteredNavigationItems();

  return (
    <div className="flex h-screen bg-background text-foreground">
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border shadow-sm transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex items-center justify-center h-16 px-4 border-b border-border">
          <div className="text-center leading-tight">
            <h1 className="text-xl font-bold text-foreground">{t("nav.appName")}</h1>
            <p className="text-xs text-muted-foreground">{t("nav.appSubtitle")}</p>
          </div>
        </div>

        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {filteredNavigationItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link key={item.key} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start ${isActive
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {t(`nav.${item.key}`)}
                  </Button>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-border bg-card">
          <div className="mb-3 flex items-center justify-between">
            <LanguageToggle />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {currentUser?.name?.charAt(0).toUpperCase() || "?"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {currentUser?.name || "Usuário"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {currentUser?.email || "email@exemplo.com"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
              aria-label={t("nav.logout")}
              title={t("nav.logout")}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background pt-16 lg:pt-0">
          {children}
        </main>
      </div>
    </div>
  );
}