"use client";

import Card from "@/components/Card";
import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {  Upload, Clock, CheckCircle, FileText, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useGetMyDeliverables } from "@/features/contracts-grants/controllers/deliverableController";
import { ColumnDef } from "@tanstack/react-table";
import { IDeliverable } from "@/features/contracts-grants/types/contract-management/deliverable";
import { cn } from "@/lib/utils";
import SubmitDeliverableModal from "./SubmitDeliverableModal";
import ViewDeliverableModal from "./ViewDeliverableModal";

export default function MyDeliverablesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedDeliverable, setSelectedDeliverable] = useState<IDeliverable | null>(null);
  const [selectedDeliverableId, setSelectedDeliverableId] = useState<string | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Fetch my deliverables
  const { data, isFetching } = useGetMyDeliverables();

  const statistics = data?.data?.statistics || {
    total: 0,
    pending: 0,
    completed: 0,
    overdue: 0,
  };

  // Filter deliverables
  const filteredDeliverables = (data?.data?.deliverables || []).filter(
    (deliverable) => {
      const matchesSearch = deliverable.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus = !statusFilter || deliverable.status === statusFilter;
      return matchesSearch && matchesStatus;
    }
  );

  const handleSubmit = (deliverable: IDeliverable) => {
    setSelectedDeliverable(deliverable);
    setIsSubmitModalOpen(true);
  };

  const handleView = (deliverableId: string) => {
    setSelectedDeliverableId(deliverableId);
  };

  const columns: ColumnDef<IDeliverable>[] = [
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
      header: "Supervisor",
      id: "supervisor",
      accessorKey: "supervisor_name",
      size: 200,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span>{row.original.supervisor_name}</span>
          <span className="text-xs text-muted-foreground">
            {row.original.supervisor_email}
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
                  ? "Under Review"
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
        return <span className="font-medium">{count}</span>;
      },
    },
    {
      header: "Actions",
      id: "actions",
      size: 200,
      cell: ({ row }) => {
        const canSubmit =
          row.original.status === "pending" &&
          (!row.original.latest_submission ||
            row.original.latest_submission.review_status === "changes_requested");

        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleView(row.original.id)}
            >
              View
            </Button>
            {canSubmit && (
              <Button
                size="sm"
                onClick={() => handleSubmit(row.original)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Upload className="h-4 w-4" />
                Submit
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <section className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Deliverables</p>
              <h3 className="text-2xl font-bold mt-1">{statistics.total}</h3>
            </div>
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <h3 className="text-2xl font-bold mt-1 text-orange-600">
                {statistics.pending}
              </h3>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <h3 className="text-2xl font-bold mt-1 text-green-600">
                {statistics.completed}
              </h3>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overdue</p>
              <h3 className="text-2xl font-bold mt-1 text-red-600">
                {statistics.overdue}
              </h3>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={statusFilter === "" ? "default" : "outline"}
          onClick={() => setStatusFilter("")}
        >
          All
        </Button>
        <Button
          variant={statusFilter === "pending" ? "default" : "outline"}
          onClick={() => setStatusFilter("pending")}
        >
          Pending
        </Button>
        <Button
          variant={statusFilter === "completed" ? "default" : "outline"}
          onClick={() => setStatusFilter("completed")}
        >
          Completed
        </Button>
      </div>

      {/* Table */}
      <Card>
        <TableFilters searchValue={search} onSearchChange={setSearch}>
          <DataTable
            columns={columns}
            data={filteredDeliverables}
            isLoading={isFetching}
          />
        </TableFilters>
      </Card>

      {/* Modals */}
      <SubmitDeliverableModal
        deliverable={selectedDeliverable}
        open={isSubmitModalOpen}
        onClose={() => {
          setIsSubmitModalOpen(false);
          setSelectedDeliverable(null);
        }}
      />

      {selectedDeliverableId && (
        <ViewDeliverableModal
          deliverableId={selectedDeliverableId}
          open={!!selectedDeliverableId}
          onClose={() => setSelectedDeliverableId(null)}
        />
      )}
    </section>
  );
}
