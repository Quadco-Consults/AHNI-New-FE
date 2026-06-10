"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  DollarSign,
  Clock,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  ClipboardList,
  Plane
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ConsultantAuthUtils, useConsultantLogout } from "../controllers/consultantAuthController";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ConsultantSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    path: "/consultant-portal/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Travel Requests",
    path: "/consultant-portal/travel-requests",
    icon: Plane,
  },
  {
    name: "Reports",
    path: "/consultant-portal/reports",
    icon: ClipboardList,
  },
  {
    name: "Timesheets",
    path: "/consultant-portal/timesheets",
    icon: Clock,
  },
  {
    name: "Payment Requests",
    path: "/consultant-portal/payment-requests",
    icon: DollarSign,
  },
  {
    name: "Deliverables",
    path: "/consultant-portal/deliverables",
    icon: FileText,
  },
  {
    name: "Profile",
    path: "/consultant-portal/profile",
    icon: User,
  },
];

export default function ConsultantSidebar({ collapsed = false, onToggle }: ConsultantSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const logoutMutation = useConsultantLogout();
  const consultantData = ConsultantAuthUtils.getConsultantData();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success("Logged out successfully");
      router.push("/consultant-portal/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <img src="/imgs/logo.png" alt="AHNI Logo" className="h-8" />
            <div>
              <h2 className="text-sm font-bold text-gray-800">AHNI</h2>
              <p className="text-xs text-gray-500">Consultant Portal</p>
            </div>
          </div>
        )}
        {collapsed && (
          <img src="/imgs/logo.png" alt="AHNI Logo" className="h-8 mx-auto" />
        )}

        {onToggle && (
          <button
            onClick={onToggle}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            )}
          </button>
        )}
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <User className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {consultantData.full_name || "Consultant"}
              </p>
              <p className="text-xs text-gray-500 truncate">{consultantData.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto h-[calc(100vh-240px)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || pathname?.startsWith(item.path + "/");

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-green-50 text-green-700 font-medium"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
              title={collapsed ? item.name : undefined}
            >
              <Icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-green-600")} />
              {!collapsed && <span className="text-sm">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <Button
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          variant="ghost"
          className={cn(
            "w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </aside>
  );
}
