"use client";

import { useMemo } from "react";
import Card from "components/Card";
import DataTable from "components/Table/DataTable";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Progress } from "components/ui/progress";
import { MapPin, Phone, Mail, DollarSign, Users, Award, Eye, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useGetSubGrantAwards, useGetSubGrantOverview } from "@/features/contracts-grants/controllers/multiAwardController";
import { LoadingSpinner } from "components/Loading";
import { ColumnDef } from "@tanstack/react-table";

interface AwardedPartnersViewProps {
  subGrantId: string;
}

interface IAwardDataDisplay {
  id: string;
  partner_name: string;
  coverage_location: string;
  award_amount_usd: number;
  award_amount_ngn: number;
  utilization_percentage: number;
  award_start_date: string;
  award_end_date: string;
  status: "ACTIVE" | "COMPLETED" | "TERMINATED" | "DRAFT";
  financial_summary?: {
    total_obligations: number;
    total_disbursements: number;
    total_expenditures: number;
    pending_obligations: number;
  };
  partner_contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };
}

export default function AwardedPartnersView({ subGrantId }: AwardedPartnersViewProps) {
  const { data: multiAwardData, isFetching: isLoadingAwards } = useGetSubGrantAwards(subGrantId);
  const { data: overviewData, isFetching: isLoadingOverview } = useGetSubGrantOverview(subGrantId);

  const awards = multiAwardData?.data?.awards || [];
  const overview = overviewData?.data;

  const columns: ColumnDef<IAwardDataDisplay>[] = useMemo(() => [
    {
      accessorKey: "partner_name",
      header: "Partner Organization",
      cell: ({ row }) => {
        const partner = row.original;
        return (
          <div className="space-y-1">
            <div className="font-medium text-gray-900">{partner.partner_name}</div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="h-3 w-3" />
              {partner.coverage_location}
            </div>
            <Badge
              variant={
                partner.status === "ACTIVE" ? "default" :
                partner.status === "COMPLETED" ? "secondary" :
                partner.status === "TERMINATED" ? "destructive" : "outline"
              }
              className="text-xs"
            >
              {partner.status}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "award_amount_usd",
      header: "Award Amount",
      cell: ({ row }) => {
        const partner = row.original;
        return (
          <div className="space-y-1">
            <div className="font-medium text-green-600">
              ${partner.award_amount_usd?.toLocaleString() || "0"}
            </div>
            <div className="text-sm text-gray-500">
              ₦{partner.award_amount_ngn?.toLocaleString() || "0"}
            </div>
            <div className="text-xs text-gray-400">
              {new Date(partner.award_start_date).toLocaleDateString()} -
              {new Date(partner.award_end_date).toLocaleDateString()}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "utilization_percentage",
      header: "Utilization",
      cell: ({ row }) => {
        const utilization = row.original.utilization_percentage || 0;
        const getUtilizationColor = (percentage: number) => {
          if (percentage >= 80) return "text-green-600";
          if (percentage >= 50) return "text-yellow-600";
          return "text-red-600";
        };

        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${getUtilizationColor(utilization)}`}>
                {utilization.toFixed(1)}%
              </span>
              <span className="text-xs text-gray-500">
                {row.original.financial_summary?.total_expenditures
                  ? `$${row.original.financial_summary.total_expenditures.toLocaleString()}`
                  : "No data"
                }
              </span>
            </div>
            <Progress value={utilization} className="w-24 h-2" />
          </div>
        );
      },
    },
    {
      accessorKey: "financial_summary",
      header: "Financial Status",
      cell: ({ row }) => {
        const financialSummary = row.original.financial_summary;

        if (!financialSummary) {
          return (
            <div className="text-xs text-gray-400 italic">
              No financial data
            </div>
          );
        }

        return (
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Obligations:</span>
              <span className="font-medium">
                ${financialSummary.total_obligations?.toLocaleString() || "0"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Disbursements:</span>
              <span className="font-medium text-blue-600">
                ${financialSummary.total_disbursements?.toLocaleString() || "0"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Expenditures:</span>
              <span className="font-medium text-green-600">
                ${financialSummary.total_expenditures?.toLocaleString() || "0"}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const partner = row.original;

        return (
          <div className="flex flex-col space-y-1">
            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs h-7"
              onClick={() => {
                window.location.href = `/dashboard/c-and-g/sub-grant/${subGrantId}/awards/${partner.id}`;
              }}
            >
              <Eye className="h-3 w-3 mr-1" />
              View Details
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs h-7"
              onClick={() => {
                window.location.href = `/dashboard/c-and-g/sub-grant/${subGrantId}/awards/${partner.id}/financial`;
              }}
            >
              <DollarSign className="h-3 w-3 mr-1" />
              Financial
            </Button>
          </div>
        );
      },
    },
  ], [subGrantId]);

  if (isLoadingAwards || isLoadingOverview) {
    return <LoadingSpinner />;
  }

  if (!awards || awards.length === 0) {
    return (
      <div className="text-center py-12">
        <Award className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No Awards Found</h3>
        <p className="mt-1 text-sm text-gray-500">
          This sub-grant has not been awarded to any partners yet.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* Overview Stats */}
      {overview && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-blue-600 mb-2">
                <Users className="w-5 h-5" />
                <span className="text-sm font-medium">Total Partners</span>
              </div>
              <p className="text-3xl font-bold text-blue-900">{overview.partner_count}</p>
              <p className="text-xs text-blue-600">
                {overview.active_partners} active • {overview.completed_partners} completed
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                <DollarSign className="w-5 h-5" />
                <span className="text-sm font-medium">Total Awarded</span>
              </div>
              <p className="text-3xl font-bold text-green-900">
                ${overview.total_award_amount_usd?.toLocaleString()}
              </p>
              <p className="text-xs text-green-600">
                ₦{overview.total_award_amount_ngn?.toLocaleString()}
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-orange-600 mb-2">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-medium">Avg Utilization</span>
              </div>
              <p className="text-3xl font-bold text-orange-900">
                {overview.avg_utilization_percentage?.toFixed(1)}%
              </p>
              <div className="mt-2 mx-auto w-24">
                <Progress value={overview.avg_utilization_percentage} className="h-2" />
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-purple-600 mb-2">
                <MapPin className="w-5 h-5" />
                <span className="text-sm font-medium">Coverage</span>
              </div>
              <p className="text-3xl font-bold text-purple-900">
                {overview.geographic_coverage?.length || 0}
              </p>
              <p className="text-xs text-purple-600">
                {overview.geographic_coverage?.slice(0, 2).join(", ")}
                {overview.geographic_coverage && overview.geographic_coverage.length > 2 &&
                  ` +${overview.geographic_coverage.length - 2} more`}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Partners Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Awarded Partners</h3>
            <p className="text-sm text-gray-600">
              Managing {awards.length} implementing partner{awards.length !== 1 ? 's' : ''} for this sub-grant
            </p>
          </div>
          <Link href={`/dashboard/c-and-g/sub-grant/awarded-beneficiaries`}>
            <Button variant="outline" size="sm">
              <Award className="w-4 h-4 mr-2" />
              View All Awards
            </Button>
          </Link>
        </div>

        <DataTable
          columns={columns}
          data={awards}
          isLoading={isLoadingAwards}
          pagination={{
            total: awards.length,
            pageSize: 10,
            onChange: () => {},
          }}
        />
      </Card>
    </section>
  );
}