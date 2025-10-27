"use client";

import { Card } from "components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "blue" | "green" | "red" | "orange" | "purple" | "indigo";
  loading?: boolean;
}

const colorClasses = {
  blue: "text-blue-600 bg-blue-100",
  green: "text-green-600 bg-green-100",
  red: "text-red-600 bg-red-100",
  orange: "text-orange-600 bg-orange-100",
  purple: "text-purple-600 bg-purple-100",
  indigo: "text-indigo-600 bg-indigo-100",
};

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  color = "blue",
  loading = false,
}: StatCardProps) {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <div className="p-2 rounded-lg bg-gray-100 animate-pulse">
            <div className="w-6 h-6 bg-gray-300 rounded" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 bg-gray-200 rounded animate-pulse w-20" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-32" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <div className={cn("p-2 rounded-lg", colorClasses[color])}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <div className="flex items-center space-x-2 mt-1">
            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
            {trend && (
              <span
                className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full",
                  trend.isPositive
                    ? "text-green-700 bg-green-100"
                    : "text-red-700 bg-red-100"
                )}
              >
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}