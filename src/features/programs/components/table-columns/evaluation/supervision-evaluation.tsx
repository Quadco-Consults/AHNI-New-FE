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

interface SupervisionEvaluationColumnsProps {
  onViewDetails: (evaluationId: string) => void;
  onEdit?: (evaluationId: string) => void;
  onDelete?: (evaluationId: string) => void;
  onDownloadReport?: (evaluationId: string) => void;
}

export const createSupervisionEvaluationColumns = ({
  onViewDetails,
  onEdit,
  onDelete,
  onDownloadReport,
}: SupervisionEvaluationColumnsProps): ColumnDef<ISupervisionEvaluation>[] => [
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

      // Try multiple possible location sources with fallbacks
      const locationName = evaluation.location_name ||
                          evaluation.location?.name ||
                          evaluation.site_visit?.location_name ||
                          evaluation.site_visit_location ||
                          evaluation.facility_name ||
                          evaluation.facility?.name;

      const facilityName = evaluation.facility_name ||
                          evaluation.facility?.name ||
                          evaluation.site_visit?.facility_name;

      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-sm">
            <MapPin className="h-3 w-3 text-gray-400" />
            <span className="font-medium">{locationName || "Unknown Location"}</span>
          </div>
          {facilityName && facilityName !== locationName && (
            <div className="text-xs text-gray-500 ml-4">
              at {facilityName}
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
      const evaluation = row.original;

      // Try multiple possible evaluator name sources with fallbacks
      const getFullName = (evaluator: any) => {
        if (!evaluator) return null;
        if (evaluator.first_name && evaluator.last_name) {
          return `${evaluator.first_name} ${evaluator.last_name}`;
        }
        return evaluator.first_name || evaluator.last_name || null;
      };

      const evaluatorName = evaluation.evaluator_name ||
                           evaluation.evaluator?.name ||
                           evaluation.evaluator?.full_name ||
                           getFullName(evaluation.evaluator) ||
                           evaluation.created_by_name ||
                           evaluation.created_by?.name ||
                           getFullName(evaluation.created_by) ||
                           "Unknown Evaluator";

      return (
        <div className="flex items-center gap-1 text-sm">
          <Users className="h-3 w-3 text-gray-400" />
          <span className="font-medium">{evaluatorName}</span>
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
      const evaluation = row.original;

      // Try multiple possible score sources with fallbacks
      const score = evaluation.overall_score ||
                   evaluation.score ||
                   evaluation.total_score ||
                   evaluation.percentage_score;

      // Check if evaluation is completed and calculate a temporary score if needed
      const isCompleted = evaluation.status === SupervisionEvaluationStatus.COMPLETED;

      // If no score but it's completed, try to calculate from category scores
      let calculatedScore = null;
      if (!score && isCompleted && evaluation.category_scores?.length > 0) {
        const totalScore = evaluation.category_scores.reduce((sum, cat) => sum + (cat.percentage_score || 0), 0);
        const avgScore = totalScore / evaluation.category_scores.length;
        calculatedScore = avgScore;
      }

      const finalScore = score || calculatedScore;

      if (finalScore === undefined || finalScore === null) {
        // Show different messages based on status
        if (evaluation.status === SupervisionEvaluationStatus.PENDING) {
          return <span className="text-gray-400 text-sm">Pending</span>;
        } else if (evaluation.status === SupervisionEvaluationStatus.IN_PROGRESS) {
          return <span className="text-blue-500 text-sm">In Progress</span>;
        } else {
          return <span className="text-gray-400 text-sm">Not Calculated</span>;
        }
      }

      const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
        if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
        return "text-red-600 bg-red-50 border-red-200";
      };

      return (
        <Badge variant="outline" className={getScoreColor(finalScore)}>
          {finalScore.toFixed(1)}%
        </Badge>
      );
    },
  },
  {
    accessorKey: "follow_up_required",
    header: "Follow-up",
    cell: ({ row }) => {
      const evaluation = row.original;

      // Debug: Log the evaluation data for follow-up investigation
      console.log(`🔍 Follow-up Debug for evaluation ${evaluation.id}:`, {
        evaluation,
        follow_up_required: evaluation.follow_up_required,
        follow_up_date: evaluation.follow_up_date,
        follow_up_notes: evaluation.follow_up_notes,
        action_items: evaluation.action_items,
        recommendations: evaluation.recommendations,
        status: evaluation.status,
        availableFields: Object.keys(evaluation)
      });

      // Try multiple possible follow-up sources with fallbacks
      const followUpRequired = evaluation.follow_up_required ||
                              (evaluation as any).followup_required ||
                              (evaluation as any).requires_followup ||
                              false;

      const followUpDate = evaluation.follow_up_date ||
                          (evaluation as any).followup_date ||
                          (evaluation as any).follow_up_due_date;

      // For completed evaluations, check if there are action items or recommendations
      const hasActionItems = evaluation.action_items && evaluation.action_items.length > 0;
      const hasRecommendations = evaluation.recommendations && evaluation.recommendations.trim() !== '';

      // Determine if follow-up is implicitly needed based on content
      const implicitFollowUp = hasActionItems || hasRecommendations;

      if (!followUpRequired && !implicitFollowUp) {
        // Check status to provide more context
        if (evaluation.status === SupervisionEvaluationStatus.PENDING) {
          return <span className="text-gray-400 text-sm">TBD</span>;
        } else if (evaluation.status === SupervisionEvaluationStatus.IN_PROGRESS) {
          return <span className="text-blue-500 text-sm">Pending</span>;
        } else {
          return <span className="text-gray-400 text-sm">None Required</span>;
        }
      }

      const isRequired = followUpRequired || implicitFollowUp;

      return (
        <div className="flex flex-col gap-1">
          <Badge
            variant="outline"
            className={isRequired ?
              "border-orange-200 text-orange-700 bg-orange-50 w-fit" :
              "border-blue-200 text-blue-700 bg-blue-50 w-fit"}
          >
            {followUpRequired ? "Required" : "Recommended"}
          </Badge>
          {followUpDate && (
            <div className="text-xs text-gray-500">
              Due: {formatDate(followUpDate)}
            </div>
          )}
          {(hasActionItems || hasRecommendations) && !followUpDate && (
            <div className="text-xs text-gray-500">
              {hasActionItems ? `${evaluation.action_items?.length || 0} action items` : 'Recommendations available'}
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
        onViewDetails(evaluation.id);
      };

      const handleEdit = () => {
        if (onEdit) {
          onEdit(evaluation.id);
        } else {
          console.log("Edit evaluation:", evaluation.id);
        }
      };

      const handleDelete = () => {
        if (onDelete) {
          onDelete(evaluation.id);
        } else {
          console.log("Delete evaluation:", evaluation.id);
        }
      };

      const handleDownloadReport = () => {
        if (onDownloadReport) {
          onDownloadReport(evaluation.id);
        } else {
          console.log("Download evaluation report:", evaluation.id);
        }
      };

      const handleContinueEvaluation = () => {
        onViewDetails(evaluation.id);
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

// Default export for backward compatibility
export const supervisionEvaluationColumns = createSupervisionEvaluationColumns({
  onViewDetails: (evaluationId: string) => {
    console.log("View evaluation details:", evaluationId);
  },
  onEdit: (evaluationId: string) => {
    console.log("Edit evaluation:", evaluationId);
  },
  onDelete: (evaluationId: string) => {
    console.log("Delete evaluation:", evaluationId);
  },
  onDownloadReport: (evaluationId: string) => {
    console.log("Download evaluation report:", evaluationId);
  },
});