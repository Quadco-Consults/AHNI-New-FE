"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Plus,
  PlayCircle,
  CheckCircle,
  Clock,
  Calendar,
  MapPin,
  Users,
  FileText,
  ClipboardList,
  BarChart
} from "lucide-react";
import { formatDate } from "@/utils/date";
import { TSiteVisitPaginatedData, SiteVisitTypeLabels, SiteVisitType } from "@/features/programs/types/site-visit";

// Extended interface for site visits with evaluation status
interface SiteVisitForEvaluation extends TSiteVisitPaginatedData {
  hasEvaluation: boolean;
  evaluationStatus?: string;
  evaluationId?: string;
  visit_type_display?: string;
  status_display?: string;
}

interface SiteVisitEvaluationColumnsProps {
  onCreateEvaluation: (siteVisitId: string) => void;
  onViewEvaluation: (siteVisitId: string) => void;
  onViewSiteVisit: (siteVisitId: string) => void;
  onViewReport: (evaluationId: string) => void;
}

export const createSiteVisitEvaluationColumns = ({
  onCreateEvaluation,
  onViewEvaluation,
  onViewSiteVisit,
  onViewReport,
}: SiteVisitEvaluationColumnsProps): ColumnDef<SiteVisitForEvaluation>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Site Visit Title",
    cell: ({ row }) => {
      const siteVisit = row.original;
      return (
        <div className="flex flex-col gap-1">
          <div className="font-medium text-sm">{siteVisit.title}</div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {siteVisit.full_visit_number || "SV-" + siteVisit.id.slice(-6)}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "visit_type",
    header: "Visit Type",
    cell: ({ row }) => {
      const visitType = row.getValue("visit_type") as string;
      const visitTypeDisplay = (row.original as any).visit_type_display;

      // Use display value if available, otherwise try enum lookup, then fallback to raw value
      const displayType = visitTypeDisplay ||
                         SiteVisitTypeLabels[visitType as SiteVisitType] ||
                         visitType ||
                         "Not specified";

      return (
        <Badge variant="secondary" className="text-xs">
          {displayType}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "location_name",
    header: "Location",
    cell: ({ row }) => {
      const siteVisit = row.original;
      return (
        <div className="flex items-center gap-1 text-sm">
          <MapPin className="h-3 w-3 text-gray-400" />
          <span>{siteVisit.location_name || "N/A"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "start_date",
    header: "Visit Period",
    cell: ({ row }) => {
      const startDate = row.getValue("start_date") as string;
      const endDate = row.original.end_date;

      return (
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="h-3 w-3 text-gray-400" />
          <span>
            {formatDate(startDate)}
            {endDate && endDate !== startDate && (
              <> - {formatDate(endDate)}</>
            )}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "team_members_count",
    header: "Team",
    cell: ({ row }) => {
      const count = row.getValue("team_members_count") as number;
      return (
        <div className="flex items-center gap-1 text-sm">
          <Users className="h-3 w-3 text-gray-400" />
          <span>{count || 0} members</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Visit Status",
    cell: ({ row }) => {
      const siteVisit = row.original;
      const status = siteVisit.status_display || siteVisit.status;

      const getStatusColor = (status: string) => {
        const statusUpper = status.toUpperCase();
        if (statusUpper.includes('AUTHORIZED') || statusUpper.includes('APPROVED')) {
          return "border-green-200 text-green-700 bg-green-50";
        }
        if (statusUpper.includes('EA_GENERATED') || statusUpper.includes('GENERATED')) {
          return "border-blue-200 text-blue-700 bg-blue-50";
        }
        return "border-gray-200 text-gray-700 bg-gray-50";
      };

      return (
        <Badge variant="outline" className={getStatusColor(status)}>
          {status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      const siteVisit = row.original;
      const status = siteVisit.status_display || siteVisit.status;
      return value.includes(status);
    },
  },
  {
    accessorKey: "hasEvaluation",
    header: "Evaluation Status",
    cell: ({ row }) => {
      const siteVisit = row.original;

      if (!siteVisit.hasEvaluation) {
        return (
          <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      }

      const status = siteVisit.evaluationStatus || 'PENDING';

      if (status === 'COMPLETED') {
        return (
          <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      } else if (status === 'IN_PROGRESS') {
        return (
          <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
            <PlayCircle className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        );
      } else {
        return (
          <Badge variant="outline" className="border-gray-200 text-gray-700 bg-gray-50">
            <Clock className="h-3 w-3 mr-1" />
            Created
          </Badge>
        );
      }
    },
    filterFn: (row, id, value) => {
      const siteVisit = row.original;
      if (value.includes("pending") && !siteVisit.hasEvaluation) return true;
      if (value.includes("created") && siteVisit.hasEvaluation && siteVisit.evaluationStatus === 'PENDING') return true;
      if (value.includes("in_progress") && siteVisit.evaluationStatus === 'IN_PROGRESS') return true;
      if (value.includes("completed") && siteVisit.evaluationStatus === 'COMPLETED') return true;
      return false;
    },
  },
  {
    accessorKey: "created_datetime",
    header: "Created",
    cell: ({ row }) => {
      const date = row.getValue("created_datetime") as string;
      return (
        <div className="text-sm text-gray-500">
          {formatDate(date)}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const siteVisit = row.original;

      const handleViewSiteVisit = () => {
        onViewSiteVisit(siteVisit.id);
      };

      const handleCreateEvaluation = () => {
        onCreateEvaluation(siteVisit.id);
      };

      const handleViewEvaluation = () => {
        onViewEvaluation(siteVisit.id);
      };

      const handleViewReport = () => {
        if (siteVisit.evaluationId) {
          onViewReport(siteVisit.evaluationId);
        }
      };

      return (
        <div className="flex items-center gap-2">
          {!siteVisit.hasEvaluation ? (
            <Button
              size="sm"
              onClick={handleCreateEvaluation}
              className="flex items-center gap-1"
            >
              <Plus className="h-3 w-3" />
              Create
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={handleViewEvaluation}
              className="flex items-center gap-1"
            >
              {siteVisit.evaluationStatus === 'COMPLETED' ? (
                <>
                  <Eye className="h-3 w-3" />
                  View
                </>
              ) : (
                <>
                  <PlayCircle className="h-3 w-3" />
                  Continue
                </>
              )}
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              {!siteVisit.hasEvaluation ? (
                <DropdownMenuItem onClick={handleCreateEvaluation}>
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Create Evaluation
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem onClick={handleViewEvaluation}>
                    {siteVisit.evaluationStatus === 'COMPLETED' ? (
                      <>
                        <Eye className="mr-2 h-4 w-4" />
                        Conduct Evaluation (View)
                      </>
                    ) : (
                      <>
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Conduct Evaluation (Continue)
                      </>
                    )}
                  </DropdownMenuItem>
                  {siteVisit.evaluationStatus === 'COMPLETED' && (
                    <DropdownMenuItem onClick={handleViewReport}>
                      <BarChart className="mr-2 h-4 w-4" />
                      View Report
                    </DropdownMenuItem>
                  )}
                </>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={handleViewSiteVisit}>
                <FileText className="mr-2 h-4 w-4" />
                View Site Visit Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];