"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Checkbox } from "components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  PlayCircle,
  CheckCircle,
  Clock,
  Calendar,
  MapPin,
  Users,
  FileText
} from "lucide-react";
import { formatDate } from "utils/date";
import { ISupervisionEvaluation, SupervisionEvaluationStatus } from "@/features/programs/types/supervision-evaluation";

export const supervisionEvaluationColumns: ColumnDef<ISupervisionEvaluation>[] = [
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
    header: "Evaluation Title",
    cell: ({ row }) => {
      const evaluation = row.original;
      return (
        <div className="flex flex-col gap-1">
          <div className="font-medium text-sm">{evaluation.title}</div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {evaluation.site_visit_title || "Site Visit"}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "location_name",
    header: "Location",
    cell: ({ row }) => {
      const evaluation = row.original;
      return (
        <div className="flex items-center gap-1 text-sm">
          <MapPin className="h-3 w-3 text-gray-400" />
          <span>{evaluation.location_name || "N/A"}</span>
          {evaluation.facility_name && (
            <div className="text-xs text-gray-500 ml-2">
              at {evaluation.facility_name}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "evaluation_date",
    header: "Evaluation Date",
    cell: ({ row }) => {
      const date = row.getValue("evaluation_date") as string;
      return (
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="h-3 w-3 text-gray-400" />
          {formatDate(date)}
        </div>
      );
    },
  },
  {
    accessorKey: "evaluator_name",
    header: "Evaluator",
    cell: ({ row }) => {
      const evaluatorName = row.getValue("evaluator_name") as string;
      return (
        <div className="flex items-center gap-1 text-sm">
          <Users className="h-3 w-3 text-gray-400" />
          {evaluatorName || "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as SupervisionEvaluationStatus;

      const getStatusConfig = (status: SupervisionEvaluationStatus) => {
        switch (status) {
          case SupervisionEvaluationStatus.PENDING:
            return {
              label: "Pending",
              variant: "outline" as const,
              className: "border-orange-200 text-orange-700 bg-orange-50",
              icon: Clock
            };
          case SupervisionEvaluationStatus.IN_PROGRESS:
            return {
              label: "In Progress",
              variant: "secondary" as const,
              className: "border-blue-200 text-blue-700 bg-blue-50",
              icon: PlayCircle
            };
          case SupervisionEvaluationStatus.COMPLETED:
            return {
              label: "Completed",
              variant: "default" as const,
              className: "border-green-200 text-green-700 bg-green-50",
              icon: CheckCircle
            };
          case SupervisionEvaluationStatus.CANCELLED:
            return {
              label: "Cancelled",
              variant: "destructive" as const,
              className: "border-red-200 text-red-700 bg-red-50",
              icon: Trash2
            };
          default:
            return {
              label: "Unknown",
              variant: "outline" as const,
              className: "border-gray-200 text-gray-700 bg-gray-50",
              icon: Clock
            };
        }
      };

      const config = getStatusConfig(status);
      const IconComponent = config.icon;

      return (
        <Badge variant={config.variant} className={config.className}>
          <IconComponent className="h-3 w-3 mr-1" />
          {config.label}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "overall_score",
    header: "Score",
    cell: ({ row }) => {
      const score = row.getValue("overall_score") as number;
      if (score === undefined || score === null) {
        return <span className="text-gray-400 text-sm">N/A</span>;
      }

      const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
        if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
        return "text-red-600 bg-red-50 border-red-200";
      };

      return (
        <Badge variant="outline" className={getScoreColor(score)}>
          {score.toFixed(1)}%
        </Badge>
      );
    },
  },
  {
    accessorKey: "follow_up_required",
    header: "Follow-up",
    cell: ({ row }) => {
      const followUpRequired = row.getValue("follow_up_required") as boolean;
      const followUpDate = row.original.follow_up_date;

      if (!followUpRequired) {
        return <span className="text-gray-400 text-sm">None</span>;
      }

      return (
        <div className="flex flex-col gap-1">
          <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50 w-fit">
            Required
          </Badge>
          {followUpDate && (
            <div className="text-xs text-gray-500">
              Due: {formatDate(followUpDate)}
            </div>
          )}
        </div>
      );
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
    enableHiding: false,
    cell: ({ row }) => {
      const evaluation = row.original;

      const handleView = () => {
        // Navigate to evaluation details/conduct page
        console.log("View evaluation:", evaluation.id);
        // router.push(`/dashboard/programs/plan/supervision-evaluation/${evaluation.id}`);
      };

      const handleEdit = () => {
        console.log("Edit evaluation:", evaluation.id);
      };

      const handleDelete = () => {
        console.log("Delete evaluation:", evaluation.id);
      };

      const handleDownloadReport = () => {
        console.log("Download evaluation report:", evaluation.id);
      };

      const handleContinueEvaluation = () => {
        console.log("Continue evaluation:", evaluation.id);
      };

      const canEdit = evaluation.status === SupervisionEvaluationStatus.PENDING ||
                      evaluation.status === SupervisionEvaluationStatus.IN_PROGRESS;
      const canDelete = evaluation.status === SupervisionEvaluationStatus.PENDING;
      const canContinue = evaluation.status === SupervisionEvaluationStatus.IN_PROGRESS;
      const canDownload = evaluation.status === SupervisionEvaluationStatus.COMPLETED;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuItem onClick={handleView}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>

            {canContinue && (
              <DropdownMenuItem onClick={handleContinueEvaluation}>
                <PlayCircle className="mr-2 h-4 w-4" />
                Continue Evaluation
              </DropdownMenuItem>
            )}

            {canDownload && (
              <DropdownMenuItem onClick={handleDownloadReport}>
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            {canEdit && (
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            )}

            {canDelete && (
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];