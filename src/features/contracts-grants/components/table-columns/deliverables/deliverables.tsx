"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IDeliverable } from "@/features/contracts-grants/types/contract-management/deliverable";
import { AlertCircle, CheckCircle, Clock, Eye } from "lucide-react";

interface DeliverableColumnsProps {
  onReview?: (submissionId: string) => void;
}

export const deliverableColumns = ({
  onReview,
}: DeliverableColumnsProps): ColumnDef<IDeliverable>[] => [
  {
    header: "Title",
    id: "title",
    accessorKey: "title",
    size: 250,
    cell: ({ row }) => {
      const isOverdue = row.original.is_overdue;
      return (
        <div className="flex flex-col gap-1">
          <span className={cn("font-medium", isOverdue && "text-red-600")}>
            {row.original.title}
          </span>
          {isOverdue && (
            <div className="flex items-center gap-1 text-xs text-red-600">
              <AlertCircle className="h-3 w-3" />
              <span>Overdue</span>
            </div>
          )}
        </div>
      );
    },
  },

  {
    header: "Consultant",
    id: "consultant",
    accessorKey: "consultant_name",
    size: 200,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span>{row.original.consultant_name}</span>
        <span className="text-xs text-muted-foreground">
          {row.original.consultant_email}
        </span>
      </div>
    ),
  },

  {
    header: "Deadline",
    id: "deadline",
    accessorKey: "deadline",
    size: 150,
    cell: ({ row }) => {
      const deadline = new Date(row.original.deadline);
      const daysUntilDue = row.original.days_until_due;
      const isOverdue = row.original.is_overdue;

      return (
        <div className="flex flex-col gap-1">
          <span>{deadline.toLocaleDateString()}</span>
          {daysUntilDue !== null && (
            <span
              className={cn(
                "text-xs",
                isOverdue
                  ? "text-red-600"
                  : daysUntilDue <= 7
                  ? "text-orange-600"
                  : "text-muted-foreground"
              )}
            >
              {isOverdue
                ? `${Math.abs(daysUntilDue)} days overdue`
                : daysUntilDue === 0
                ? "Due today"
                : `${daysUntilDue} days left`}
            </span>
          )}
        </div>
      );
    },
  },

  {
    header: "Status",
    id: "status",
    accessorKey: "status",
    size: 150,
    cell: ({ getValue, row }) => {
      const status = getValue() as string;
      const latestSubmission = row.original.latest_submission;

      return (
        <div className="flex flex-col gap-1">
          <Badge
            variant="default"
            className={cn(
              "p-1 rounded-lg w-fit",
              status === "pending" && "bg-orange-200 text-orange-700",
              status === "completed" && "bg-green-200 text-green-700"
            )}
          >
            <div className="flex items-center gap-1">
              {status === "pending" ? (
                <Clock className="h-3 w-3" />
              ) : (
                <CheckCircle className="h-3 w-3" />
              )}
              <span className="capitalize">{status}</span>
            </div>
          </Badge>

          {latestSubmission && (
            <Badge
              variant="secondary"
              className={cn(
                "text-xs w-fit",
                latestSubmission.review_status === "pending_review" &&
                  "bg-blue-100 text-blue-700",
                latestSubmission.review_status === "approved" &&
                  "bg-green-100 text-green-700",
                latestSubmission.review_status === "changes_requested" &&
                  "bg-orange-100 text-orange-700"
              )}
            >
              {latestSubmission.review_status === "pending_review"
                ? "Awaiting Review"
                : latestSubmission.review_status === "approved"
                ? "Approved"
                : "Changes Requested"}
            </Badge>
          )}
        </div>
      );
    },
  },

  {
    header: "Submissions",
    id: "submissions",
    accessorKey: "submission_count",
    size: 120,
    cell: ({ row }) => {
      const count = row.original.submission_count;
      const hasAttachment = row.original.latest_submission?.has_attachment;

      return (
        <div className="flex items-center gap-2">
          <span className="font-medium">{count}</span>
          {hasAttachment && (
            <Badge variant="outline" className="text-xs">
              Has File
            </Badge>
          )}
        </div>
      );
    },
  },

  {
    header: "Actions",
    id: "actions",
    size: 150,
    cell: ({ row }) => {
      const latestSubmission = row.original.latest_submission;
      const needsReview =
        latestSubmission?.review_status === "pending_review";

      return (
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4" />
            View
          </Button>
          {needsReview && onReview && latestSubmission && (
            <Button
              size="sm"
              onClick={() => onReview(latestSubmission.id)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Review
            </Button>
          )}
        </div>
      );
    },
  },
];
