"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Settings,
  FileText,
  Users,
  Shield,
  Calendar,
  ClipboardList,
  ArrowRight,
  Plus
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GoBack from "@/components/GoBack";
import { useGetConfigurationStats } from "../../controllers/leaveConfigurationController";

const LeaveConfiguration = () => {
  const router = useRouter();

  // Fetch configuration statistics from backend
  const { data: stats, isLoading: loadingStats } = useGetConfigurationStats();

  const configurationSections = [
    {
      id: "leave-types",
      title: "Leave Types",
      description: "Manage different types of leave (Annual, Sick, Emergency, etc.)",
      icon: FileText,
      color: "bg-blue-100 text-blue-600",
      href: "/dashboard/hr/leave-management/leave-types",
      actions: [
        { label: "View All Types", href: "/dashboard/hr/leave-management/leave-types" },
        { label: "Create New Type", href: "/dashboard/hr/leave-management/leave-types/create" }
      ]
    },
    {
      id: "entitlements",
      title: "Employee Entitlements",
      description: "Assign leave packages and balances to employees",
      icon: Users,
      color: "bg-green-100 text-green-600",
      href: "/dashboard/hr/leave-management/entitlements",
      actions: [
        { label: "View Entitlements", href: "/dashboard/hr/leave-management/entitlements" },
        { label: "Assign to Employee", href: "/dashboard/hr/leave-management/entitlements/assign" }
      ]
    },
    {
      id: "policies",
      title: "Leave Policies",
      description: "Configure leave rules, approval workflows, and restrictions",
      icon: Shield,
      color: "bg-purple-100 text-purple-600",
      href: "/dashboard/hr/leave-management/policies",
      actions: [
        { label: "View Policies", href: "/dashboard/hr/leave-management/policies" },
        { label: "Create Policy", href: "/dashboard/hr/leave-management/policies/create" }
      ]
    },
    {
      id: "holidays",
      title: "Public Holidays",
      description: "Manage public holidays and non-working days",
      icon: Calendar,
      color: "bg-amber-100 text-amber-600",
      href: "/dashboard/hr/leave-management/holidays",
      actions: [
        { label: "View Holidays", href: "/dashboard/hr/leave-management/holidays" },
        { label: "Add Holiday", href: "/dashboard/hr/leave-management/holidays/create" }
      ]
    },
    {
      id: "workflows",
      title: "Approval Workflows",
      description: "Configure multi-level approval processes for leave requests",
      icon: ClipboardList,
      color: "bg-red-100 text-red-600",
      href: "/dashboard/hr/leave-management/workflows",
      actions: [
        { label: "View Workflows", href: "/dashboard/hr/leave-management/workflows" },
        { label: "Create Workflow", href: "/dashboard/hr/leave-management/workflows/create" }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <GoBack />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Leave Management Configuration
          </h1>
          <p className="text-gray-600 mt-1">
            Configure leave types, entitlements, policies, and workflows
          </p>
        </div>
      </div>

      {/* Configuration Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {configurationSections.map((section) => {
          const IconComponent = section.icon;

          return (
            <Card key={section.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${section.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{section.title}</h3>
                    <p className="text-sm text-gray-600">{section.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                {section.actions.map((action, index) => (
                  <Link key={index} href={action.href}>
                    <Button
                      variant={index === 0 ? "default" : "outline"}
                      className="w-full justify-between"
                      size="sm"
                    >
                      {action.label}
                      {index === 1 ? <Plus className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    </Button>
                  </Link>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <Card className="p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Quick Overview</h3>
        {loadingStats ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
            <span className="ml-2">Loading statistics...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {stats?.totalLeaveTypes ?? 0}
              </p>
              <p className="text-sm text-gray-600">Active Leave Types</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {stats?.employeesWithEntitlements ?? 0}
              </p>
              <p className="text-sm text-gray-600">Employees with Entitlements</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {stats?.activePolicies ?? '-'}
              </p>
              <p className="text-sm text-gray-600">Active Policies</p>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <p className="text-2xl font-bold text-amber-600">
                {stats?.upcomingHolidays ?? '-'}
              </p>
              <p className="text-sm text-gray-600">Upcoming Holidays</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default LeaveConfiguration;
