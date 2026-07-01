/**
 * Procurement Dashboard Statistics Widget
 * Shows real-time counts of PRs in each workflow
 */

"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useProcurementDashboardStats } from "@/hooks/usePRFiltering";
import {
  Package,
  FileText,
  Users,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ProcurementDashboardStats() {
  const { data, isLoading, error } = useProcurementDashboardStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load procurement statistics.
        </AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return null;
  }

  const stats = [
    {
      title: "RFQs to Create",
      description: "Physical goods needing quotations",
      value: data.rfq_eligible,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      href: "/dashboard/procurement/solicitation-management/rfq",
    },
    {
      title: "Service Orders",
      description: "Recurring services with known vendors",
      value: data.service_order_eligible,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-100",
      href: "/dashboard/procurement/service-orders",
    },
    {
      title: "Payment Requests",
      description: "Personnel costs & allowances",
      value: data.payment_request_eligible,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      href: "/dashboard/procurement/payment-requests",
      breakdown: data.payment_breakdown,
    },
    {
      title: "Total Approved PRs",
      description: "All approved purchase requests",
      value: data.total_approved_prs,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      href: "/dashboard/procurement/purchase-requests",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Procurement Workflows</h2>
          <p className="text-muted-foreground">
            Smart-filtered PRs for each procurement method
          </p>
        </div>
        <Badge variant="outline" className="gap-1">
          <TrendingUp className="h-3 w-3" />
          Live Updates
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>

                {stat.breakdown && stat.value > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Consultants:</span>{" "}
                        <span className="font-medium">{stat.breakdown.consultant}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Adhoc:</span>{" "}
                        <span className="font-medium">{stat.breakdown.adhoc}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Facilitators:</span>{" "}
                        <span className="font-medium">{stat.breakdown.facilitator}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Other:</span>{" "}
                        <span className="font-medium">{stat.breakdown.other}</span>
                      </div>
                    </div>
                  </div>
                )}

                {stat.value > 0 && stat.href && (
                  <Link href={stat.href} className="block mt-3">
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      View Details
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Compact version for smaller dashboards
 */
export function ProcurementDashboardStatsCompact() {
  const { data, isLoading } = useProcurementDashboardStats();

  if (isLoading || !data) {
    return <Skeleton className="h-20" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Procurement Workflows</CardTitle>
        <CardDescription>PRs ready for processing</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-around text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {data.rfq_eligible}
            </div>
            <div className="text-xs text-muted-foreground">RFQs</div>
          </div>
          <div className="h-12 w-px bg-border" />
          <div>
            <div className="text-2xl font-bold text-green-600">
              {data.service_order_eligible}
            </div>
            <div className="text-xs text-muted-foreground">Services</div>
          </div>
          <div className="h-12 w-px bg-border" />
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {data.payment_request_eligible}
            </div>
            <div className="text-xs text-muted-foreground">Payments</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
