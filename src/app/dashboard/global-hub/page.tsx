"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import { globalHubLinks, globalHubCategories } from "@/utils/sidebarItems";
import { useDepartmentFeatures } from "@/hooks/useDepartmentFeatures";
import { usePermissions } from "@/hooks/usePermissions";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  FileBarChart,
  MapPin,
  Clock,
  ChevronRight,
  Building2
} from "lucide-react";

export default function GlobalHubPage() {
  const authState = useAppSelector((state) => state.auth);
  const { user } = authState;
  const [isHydrated, setIsHydrated] = useState(false);

  const { hasPermission, hasAnyPermission, user: currentUser } = usePermissions();
  const {
    canAccessAdminFeatures,
    canAccessProcurementFeatures,
    canAccessFinanceFeatures,
    canAccessContractsGrantsFeatures,
    canAccessProgramsFeatures
  } = useDepartmentFeatures();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Filter Global Hub items based on user permissions
  const getAccessibleItems = () => {
    if (!isHydrated) return [];

    return globalHubLinks.filter((item: any) => {
      // Universal access items (no permissions required)
      if (!item.permissions || item.permissions.length === 0) {
        return true;
      }

      // For staff users and superusers, grant access to everything
      if (user?.is_staff || user?.is_superuser) {
        return true;
      }

      // Check item-specific permissions
      // Since we don't have hasPermissionByCodename, we'll use a simpler check
      // This allows all authenticated users to see Global Hub items for now
      // TODO: Implement proper granular permission checking if needed
      const hasItemPermission = item.permissions.length === 0 || user !== null;

      return hasItemPermission;
    });
  };

  // Group items by category
  const getGroupedItems = () => {
    const accessibleItems = getAccessibleItems();
    const grouped: { [key: string]: any[] } = {};

    accessibleItems.forEach((item: any) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });

    return grouped;
  };

  const groupedItems = getGroupedItems();
  const currentTime = new Date().toLocaleString();

  // Quick stats
  const totalAccessibleItems = getAccessibleItems().length;
  const categoryCount = Object.keys(groupedItems).length;

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Global Hub</h1>
            <p className="text-gray-600 mt-1">
              Your centralized portal for all AHNI systems and services
            </p>
          </div>
        </div>

        {/* Welcome message */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Welcome back, {user?.first_name || user?.username}!
                </h2>
                <p className="text-gray-600 mt-1">
                  Access all your tools and services from one place
                </p>
              </div>
              <div className="text-right text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{currentTime}</span>
                </div>
                <div className="mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {totalAccessibleItems} services available
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/dashboard/global-hub/announcements">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <FileBarChart className="h-8 w-8 text-blue-500" />
                <div>
                  <h3 className="font-semibold">Latest Announcements</h3>
                  <p className="text-sm text-gray-600">Stay updated</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/global-hub/calendar">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Calendar className="h-8 w-8 text-green-500" />
                <div>
                  <h3 className="font-semibold">Calendar</h3>
                  <p className="text-sm text-gray-600">Events & meetings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/global-hub/directory">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-purple-500" />
                <div>
                  <h3 className="font-semibold">Directory</h3>
                  <p className="text-sm text-gray-600">Find colleagues</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Services by Category */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">All Services</h2>

        {Object.entries(groupedItems).map(([categoryKey, items]) => {
          const category = globalHubCategories[categoryKey as keyof typeof globalHubCategories];

          if (!category || items.length === 0) return null;

          return (
            <Card key={categoryKey}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  {category.icon}
                  <span>{category.label}</span>
                  <Badge variant="outline">{items.length}</Badge>
                </CardTitle>
                <CardDescription>
                  {categoryKey === 'communication' && "Stay connected with company-wide updates and announcements"}
                  {categoryKey === 'organization' && "Access organizational information and directories"}
                  {categoryKey === 'programs' && "Manage and track program activities"}
                  {categoryKey === 'procurement' && "Handle purchasing and procurement processes"}
                  {categoryKey === 'inventory' && "Manage inventory and asset tracking"}
                  {categoryKey === 'fleet' && "Vehicle and transportation management"}
                  {categoryKey === 'maintenance' && "Facility and asset maintenance requests"}
                  {categoryKey === 'financial' && "Financial services and expense management"}
                  {categoryKey === 'contracts' && "Contract management and reporting"}
                  {categoryKey === 'hr' && "Human resources and self-service tools"}
                  {categoryKey === 'support' && "Technical support and help desk services"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item, index) => (
                    <Link key={index} href={item.path}>
                      <Button
                        variant="ghost"
                        className="w-full justify-between h-auto p-4 hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-3">
                          {item.icon}
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* User Info */}
      <div className="pt-6 border-t border-gray-200">
        <div className="text-center text-sm text-gray-500 space-y-1">
          <p>
            You have access to <strong>{totalAccessibleItems} services</strong> across{" "}
            <strong>{categoryCount} categories</strong>
          </p>
          <p>
            Your role: <Badge variant="secondary">{user?.is_superuser ? 'Super Admin' : user?.is_staff ? 'Staff' : 'Employee'}</Badge>
          </p>
          {user?.employee?.department?.name && (
            <p>
              Department: <Badge variant="outline">{user.employee.department.name}</Badge>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}