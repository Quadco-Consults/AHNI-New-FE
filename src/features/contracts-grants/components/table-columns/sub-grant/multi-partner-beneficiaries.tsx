"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Progress } from "components/ui/progress";
import { Eye, DollarSign, MapPin, Phone, Mail } from "lucide-react";
import { IAwardedPartner } from "../../types/multi-award";

export const multiPartnerBeneficiariesColumns: ColumnDef<IAwardedPartner>[] = [
  {
    accessorKey: "subgrant",
    header: "SubGrant & Project",
    cell: ({ row }) => {
      const subgrant = row.original.subgrant;
      return (
        <div className="space-y-1">
          <div className="font-medium text-gray-900 max-w-48 truncate">
            {subgrant?.title || "N/A"}
          </div>
          <div className="text-sm text-gray-500 max-w-48 truncate">
            Project: {subgrant?.parent_project?.name || "N/A"}
          </div>
          <div className="text-xs text-blue-600">
            {subgrant?.parent_project?.funding_source || "N/A"}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "partner_name",
    header: "Partner Organization",
    cell: ({ row }) => {
      const partner = row.original;
      return (
        <div className="space-y-1">
          <div className="font-medium text-gray-900">
            {partner.partner_name}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <MapPin className="h-3 w-3" />
            {partner.coverage_location}
          </div>
          <Badge
            variant={
              partner.status === "ACTIVE" ? "default" :
              partner.status === "COMPLETED" ? "secondary" :
              partner.status === "TERMINATED" ? "destructive" :
              "outline"
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
            {partner.award_start_date ? new Date(partner.award_start_date).toLocaleDateString() : "N/A"} -
            {partner.award_end_date ? new Date(partner.award_end_date).toLocaleDateString() : "N/A"}
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
    accessorKey: "partner_contact",
    header: "Contact Information",
    cell: ({ row }) => {
      const partner = row.original;
      return (
        <div className="space-y-1 text-xs">
          {partner.partner_email && (
            <div className="flex items-center gap-1 text-gray-600">
              <Mail className="h-3 w-3" />
              <span className="truncate max-w-32">{partner.partner_email}</span>
            </div>
          )}
          {partner.partner_phone && (
            <div className="flex items-center gap-1 text-gray-600">
              <Phone className="h-3 w-3" />
              <span>{partner.partner_phone}</span>
            </div>
          )}
          {partner.partner_address && (
            <div className="text-gray-500 truncate max-w-36">
              {partner.partner_address}
            </div>
          )}
          {!partner.partner_email && !partner.partner_phone && !partner.partner_address && (
            <span className="text-gray-400 italic">No contact info</span>
          )}
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
          {financialSummary.pending_obligations && financialSummary.pending_obligations > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Pending:</span>
              <span className="font-medium text-orange-600">
                ${financialSummary.pending_obligations.toLocaleString()}
              </span>
            </div>
          )}
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
              // Navigate to partner details view
              window.location.href = `/dashboard/c-and-g/sub-grant/${partner.subgrant.id}/awards/${partner.id}`;
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
              // Navigate to financial summary
              window.location.href = `/dashboard/c-and-g/sub-grant/${partner.subgrant.id}/awards/${partner.id}/financial`;
            }}
          >
            <DollarSign className="h-3 w-3 mr-1" />
            Financial
          </Button>
        </div>
      );
    },
  },
];

// Optional: Column definition for a more compact view
export const compactMultiPartnerBeneficiariesColumns: ColumnDef<IAwardedPartner>[] = [
  {
    accessorKey: "partner_name",
    header: "Partner & Location",
    cell: ({ row }) => {
      const partner = row.original;
      return (
        <div>
          <div className="font-medium">{partner.partner_name}</div>
          <div className="text-sm text-gray-500">{partner.coverage_location}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "subgrant",
    header: "SubGrant",
    cell: ({ row }) => {
      const subgrant = row.original.subgrant;
      return (
        <div>
          <div className="font-medium truncate max-w-32">{subgrant?.title}</div>
          <div className="text-sm text-gray-500 truncate max-w-32">
            {subgrant?.parent_project?.name}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "award_amount_usd",
    header: "Award Amount",
    cell: ({ row }) => {
      return (
        <div>
          <div className="font-medium text-green-600">
            ${row.original.award_amount_usd?.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">
            {row.original.utilization_percentage?.toFixed(1)}% utilized
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const partner = row.original;
      return (
        <div>
          <Badge
            variant={
              partner.status === "ACTIVE" ? "default" :
              partner.status === "COMPLETED" ? "secondary" :
              partner.status === "TERMINATED" ? "destructive" :
              "outline"
            }
          >
            {partner.status}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const partner = row.original;

      return (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            window.location.href = `/dashboard/c-and-g/sub-grant/${partner.subgrant.id}/awards/${partner.id}`;
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
      );
    },
  },
];