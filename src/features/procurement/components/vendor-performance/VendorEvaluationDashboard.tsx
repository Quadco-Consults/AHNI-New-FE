"use client";

import { useMemo } from "react";
import { useGetAllVendorEvaluations } from "@/features/procurement/controllers/vendorPerformanceEvaluationController";
import { useGetAllProcurementTrackers } from "@/features/procurement/controllers/procurementTrackerController";
import Card from "components/Card";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { AlertCircle, CheckCircle2, Clock, TrendingUp, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { cn } from "lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import { Loading } from "components/Loading";

interface VendorEvaluationSummary {
  vendor_id: string;
  vendor_name: string;
  po_count: number;
  last_po_date: string;
  days_since_last_po: number;
  evaluation_status: "OVERDUE" | "DUE_SOON" | "EVALUATED" | "PENDING";
  latest_evaluation?: any;
  priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW";
}

const VendorEvaluationDashboard = () => {
  const { data: evaluationsData, isLoading: evaluationsLoading } = useGetAllVendorEvaluations({
    page: 1,
    size: 100,
  });

  const { data: trackerData, isLoading: trackerLoading } = useGetAllProcurementTrackers({
    page: 1,
    size: 100,
  });

  // Calculate vendor evaluation summary
  const vendorSummary = useMemo(() => {
    if (!trackerData?.results) return [];

    const vendorMap = new Map<string, VendorEvaluationSummary>();
    const today = new Date();

    // Process procurement tracker data
    trackerData.results.forEach((item: any) => {
      const vendorName = item.purchase_order?.vendor || "Unknown";
      const poDate = item.purchase_order?.po_date || item.request_date;

      if (!vendorName || vendorName === "Unknown") return;

      if (!vendorMap.has(vendorName)) {
        vendorMap.set(vendorName, {
          vendor_id: item.purchase_order?.vendor_id || vendorName,
          vendor_name: vendorName,
          po_count: 0,
          last_po_date: poDate,
          days_since_last_po: 0,
          evaluation_status: "PENDING",
          priority: "LOW",
        });
      }

      const vendor = vendorMap.get(vendorName)!;
      vendor.po_count += 1;

      // Update last PO date if this one is more recent
      if (poDate && new Date(poDate) > new Date(vendor.last_po_date)) {
        vendor.last_po_date = poDate;
      }
    });

    // Process evaluations data
    const evaluations = evaluationsData?.data?.results || [];
    evaluations.forEach((evaluation: any) => {
      const vendorName = evaluation.vendor?.name;
      if (vendorName && vendorMap.has(vendorName)) {
        const vendor = vendorMap.get(vendorName)!;
        vendor.latest_evaluation = evaluation;

        if (evaluation.status === "COMPLETED") {
          vendor.evaluation_status = "EVALUATED";
        }
      }
    });

    // Calculate days since last PO and determine status/priority
    const summaries = Array.from(vendorMap.values()).map((vendor) => {
      const lastPoDate = new Date(vendor.last_po_date);
      const daysSince = Math.floor((today.getTime() - lastPoDate.getTime()) / (1000 * 60 * 60 * 24));
      vendor.days_since_last_po = daysSince;

      // Determine evaluation status and priority
      if (vendor.evaluation_status !== "EVALUATED") {
        if (daysSince > 30) {
          vendor.evaluation_status = "OVERDUE";
          vendor.priority = "URGENT";
        } else if (daysSince > 15) {
          vendor.evaluation_status = "DUE_SOON";
          vendor.priority = "HIGH";
        } else if (daysSince > 7) {
          vendor.priority = "MEDIUM";
        }
      }

      return vendor;
    });

    // Sort by priority (URGENT first) and days since last PO (descending)
    return summaries.sort((a, b) => {
      const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.days_since_last_po - a.days_since_last_po;
    });
  }, [trackerData, evaluationsData]);

  // Statistics
  const stats = useMemo(() => {
    const total = vendorSummary.length;
    const overdue = vendorSummary.filter((v) => v.evaluation_status === "OVERDUE").length;
    const dueSoon = vendorSummary.filter((v) => v.evaluation_status === "DUE_SOON").length;
    const evaluated = vendorSummary.filter((v) => v.evaluation_status === "EVALUATED").length;
    const pending = vendorSummary.filter((v) => v.evaluation_status === "PENDING").length;

    const coverage = total > 0 ? ((evaluated / total) * 100).toFixed(0) : 0;

    return { total, overdue, dueSoon, evaluated, pending, coverage };
  }, [vendorSummary]);

  const columns: ColumnDef<VendorEvaluationSummary>[] = [
    {
      header: "Priority",
      accessorKey: "priority",
      size: 100,
      cell: ({ row }) => {
        const priority = row.original.priority;
        return (
          <Badge
            className={cn(
              "px-2 py-1 rounded-lg font-semibold",
              priority === "URGENT" && "bg-red-100 text-red-800",
              priority === "HIGH" && "bg-orange-100 text-orange-800",
              priority === "MEDIUM" && "bg-yellow-100 text-yellow-800",
              priority === "LOW" && "bg-green-100 text-green-800"
            )}
          >
            {priority}
          </Badge>
        );
      },
    },
    {
      header: "Vendor Name",
      accessorKey: "vendor_name",
      size: 200,
      cell: ({ row }) => {
        return <div className="font-medium">{row.original.vendor_name}</div>;
      },
    },
    {
      header: "POs",
      accessorKey: "po_count",
      size: 80,
      cell: ({ row }) => {
        return <div className="text-center font-semibold">{row.original.po_count}</div>;
      },
    },
    {
      header: "Last PO Date",
      accessorKey: "last_po_date",
      size: 120,
      cell: ({ row }) => {
        const date = row.original.last_po_date;
        return <div className="text-sm">{date ? new Date(date).toLocaleDateString("en-US") : "N/A"}</div>;
      },
    },
    {
      header: "Days Since",
      accessorKey: "days_since_last_po",
      size: 100,
      cell: ({ row }) => {
        const days = row.original.days_since_last_po;
        return (
          <div className={cn(
            "text-sm font-medium",
            days > 30 && "text-red-600",
            days > 15 && days <= 30 && "text-orange-600",
            days > 7 && days <= 15 && "text-yellow-600"
          )}>
            {days} days
          </div>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "evaluation_status",
      size: 120,
      cell: ({ row }) => {
        const status = row.original.evaluation_status;
        return (
          <Badge
            className={cn(
              "px-3 py-1 rounded-lg",
              status === "OVERDUE" && "bg-red-200 text-red-800",
              status === "DUE_SOON" && "bg-yellow-200 text-yellow-800",
              status === "EVALUATED" && "bg-green-200 text-green-800",
              status === "PENDING" && "bg-blue-200 text-blue-800"
            )}
          >
            {status.replace("_", " ")}
          </Badge>
        );
      },
    },
    {
      header: "Latest Evaluation",
      accessorKey: "latest_evaluation",
      size: 150,
      cell: ({ row }) => {
        const evaluation = row.original.latest_evaluation;
        if (!evaluation) {
          return <div className="text-sm text-gray-500">No evaluation</div>;
        }

        const recommendation = evaluation.evaluator_recommendation || "PENDING";
        return (
          <Badge
            className={cn(
              "px-2 py-1 rounded-lg text-xs",
              recommendation === "RETAIN" && "bg-green-200 text-green-700",
              recommendation === "ON_PROBATION" && "bg-yellow-200 text-yellow-700",
              recommendation === "BARRED" && "bg-red-200 text-red-700",
              recommendation === "PENDING" && "bg-gray-200 text-gray-700"
            )}
          >
            {recommendation}
          </Badge>
        );
      },
    },
    {
      header: "Actions",
      id: "actions",
      size: 180,
      cell: ({ row }) => {
        const vendor = row.original;
        const hasEvaluation = !!vendor.latest_evaluation;

        return (
          <div className="flex gap-2">
            {hasEvaluation ? (
              <>
                <Link href={`/dashboard/procurement/vendor-performance/${vendor.latest_evaluation.id}`}>
                  <Button size="sm" variant="outline" className="text-xs">
                    View
                  </Button>
                </Link>
                <Link href={`/dashboard/procurement/vendor-performance/${vendor.latest_evaluation.id}/form`}>
                  <Button size="sm" variant="default" className="text-xs">
                    Re-evaluate
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/dashboard/procurement/vendor-performance/form">
                <Button size="sm" variant="default" className="text-xs">
                  Create Evaluation
                </Button>
              </Link>
            )}
          </div>
        );
      },
    },
  ];

  if (evaluationsLoading || trackerLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Vendors</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <TrendingUp className="text-blue-500" size={32} />
          </div>
        </Card>

        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Overdue</p>
              <p className="text-2xl font-bold text-red-700">{stats.overdue}</p>
            </div>
            <AlertCircle className="text-red-500" size={32} />
          </div>
        </Card>

        <Card className="p-4 border-orange-200 bg-orange-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Due Soon</p>
              <p className="text-2xl font-bold text-orange-700">{stats.dueSoon}</p>
            </div>
            <Clock className="text-orange-500" size={32} />
          </div>
        </Card>

        <Card className="p-4 border-green-200 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Evaluated</p>
              <p className="text-2xl font-bold text-green-700">{stats.evaluated}</p>
            </div>
            <CheckCircle2 className="text-green-500" size={32} />
          </div>
        </Card>

        <Card className="p-4 border-blue-200 bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Coverage</p>
              <p className="text-2xl font-bold text-blue-700">{stats.coverage}%</p>
            </div>
            <AlertTriangle className="text-blue-500" size={32} />
          </div>
        </Card>
      </div>

      {/* Alerts for Overdue/Due Soon */}
      {stats.overdue > 0 && (
        <Card className="p-4 border-red-300 bg-red-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-600 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-red-800">
                {stats.overdue} Vendor{stats.overdue > 1 ? "s" : ""} Require Immediate Evaluation
              </h3>
              <p className="text-sm text-red-700 mt-1">
                These vendors have purchase orders older than 30 days without evaluation. Please prioritize these evaluations.
              </p>
            </div>
          </div>
        </Card>
      )}

      {stats.dueSoon > 0 && (
        <Card className="p-4 border-orange-300 bg-orange-50">
          <div className="flex items-start gap-3">
            <Clock className="text-orange-600 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-orange-800">
                {stats.dueSoon} Vendor{stats.dueSoon > 1 ? "s" : ""} Due for Evaluation Soon
              </h3>
              <p className="text-sm text-orange-700 mt-1">
                These vendors should be evaluated within the next 15 days.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Vendor Evaluation Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Vendor Evaluation Status</h2>
          <Link href="/dashboard/procurement/vendor-performance/form">
            <Button>
              Create New Evaluation
            </Button>
          </Link>
        </div>
        <DataTable
          columns={columns}
          data={vendorSummary}
          isLoading={evaluationsLoading || trackerLoading}
        />
      </Card>
    </div>
  );
};

export default VendorEvaluationDashboard;
