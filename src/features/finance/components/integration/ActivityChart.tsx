"use client";

import { Card } from "components/ui/card";
import { Badge } from "components/ui/badge";
import { Progress } from "components/ui/progress";
import { ModuleIntegrationStats } from "../../types/integration.types";

interface ActivityChartProps {
  moduleStats: ModuleIntegrationStats[];
  loading?: boolean;
}

export default function ActivityChart({ moduleStats, loading }: ActivityChartProps) {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-48" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
              </div>
              <div className="h-2 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const maxTransactions = Math.max(...moduleStats.map(m => m.transaction_count));

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold">Module Activity</h3>
          <p className="text-sm text-gray-600">Transaction volume by module</p>
        </div>

        <div className="space-y-4">
          {moduleStats.map((module) => (
            <div key={module.module_name} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{module.module_name}</span>
                  <Badge
                    variant={module.success_rate >= 90 ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {module.success_rate.toFixed(1)}%
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="font-medium">{module.transaction_count}</div>
                  <div className="text-xs text-gray-500">
                    ${module.total_amount.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <Progress
                  value={(module.transaction_count / maxTransactions) * 100}
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{module.success_count} successful</span>
                  <span>{module.failure_count} failed</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <div className="text-sm text-gray-600">
            Total: {moduleStats.reduce((sum, m) => sum + m.transaction_count, 0)} transactions
          </div>
        </div>
      </div>
    </Card>
  );
}