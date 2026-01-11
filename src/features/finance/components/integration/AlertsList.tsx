"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, XCircle, Clock } from "lucide-react";
import { AlertData } from "../../types/integration.types";
import { cn } from "@/lib/utils";

interface AlertsListProps {
  alerts: AlertData[];
  loading?: boolean;
}

const alertIcons = {
  ERROR: XCircle,
  WARNING: AlertTriangle,
  INFO: Info,
};

const alertColors = {
  ERROR: "text-red-500",
  WARNING: "text-orange-500",
  INFO: "text-blue-500",
};

export default function AlertsList({ alerts, loading }: AlertsListProps) {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-32" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start space-x-3 p-3 rounded-lg border">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-48" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-32" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Recent Alerts</h3>
            <p className="text-sm text-gray-600">Integration issues and notifications</p>
          </div>
          <Badge variant="outline">
            {alerts.filter(a => !a.is_resolved).length} active
          </Badge>
        </div>

        <div className="space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Info className="w-8 h-8 mx-auto mb-2" />
              <p>No alerts to display</p>
            </div>
          ) : (
            alerts.slice(0, 10).map((alert) => {
              const IconComponent = alertIcons[alert.type];
              return (
                <div
                  key={alert.id}
                  className={cn(
                    "flex items-start space-x-3 p-3 rounded-lg border transition-colors",
                    alert.is_resolved
                      ? "bg-gray-50 opacity-75"
                      : "bg-white hover:bg-gray-50"
                  )}
                >
                  <IconComponent
                    className={cn("w-5 h-5 mt-0.5", alertColors[alert.type])}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{alert.title}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {alert.message}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(alert.timestamp).toLocaleString()}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {alert.module}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {alert.is_resolved ? (
                          <Badge variant="outline" className="text-xs">
                            Resolved
                          </Badge>
                        ) : (
                          <Button variant="outline" size="sm" className="text-xs">
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {alerts.length > 10 && (
          <div className="pt-4 border-t">
            <Button variant="outline" size="sm" className="w-full">
              View All Alerts ({alerts.length})
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}