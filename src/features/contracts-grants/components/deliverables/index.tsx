"use client";

import Card from "@/components/Card";
import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, AlertCircle, Clock, CheckCircle, FileText } from "lucide-react";
import { useState } from "react";
import {
  useGetAllDeliverables,
  useGetDeliverablesOverview,
} from "@/features/contracts-grants/controllers/deliverableController";
import { deliverableColumns } from "../table-columns/deliverables/deliverables";
import CreateDeliverableModal from "./CreateDeliverableModal";
import ReviewSubmissionModal from "./ReviewSubmissionModal";

export default function DeliverablesIndex() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);

  // Fetch deliverables
  const { data, isFetching } = useGetAllDeliverables({
    page,
    size: 10,
    search,
    status: statusFilter,
  });

  // Fetch overview stats
  const { data: overviewData } = useGetDeliverablesOverview();

  const statistics = data?.data?.statistics || overviewData?.data?.statistics || {
    total: 0,
    pending: 0,
    completed: 0,
    overdue: 0,
    pending_reviews: 0,
  };

  const handleReviewSubmission = (submissionId: string) => {
    setSelectedSubmissionId(submissionId);
  };

  return (
    <section className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Reviews</p>
              <h3 className="text-2xl font-bold mt-1 text-blue-600">
                {statistics.pending_reviews || 0}
              </h3>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
      </div>

      {/* Pending Reviews Section */}
      {overviewData?.data?.pending_reviews &&
        overviewData.data.pending_reviews.length > 0 && (
          <Card>
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Pending Reviews</h3>
              <p className="text-sm text-muted-foreground">
                Submissions awaiting your review
              </p>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {overviewData.data.pending_reviews.slice(0, 5).map((review) => (
                  <div
                    key={review.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{review.deliverable_title}</p>
                      <p className="text-sm text-muted-foreground">
                        Submitted by {review.consultant_name} •{" "}
                        {new Date(review.submitted_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {review.has_attachment && (
                        <Badge variant="secondary">Has Attachment</Badge>
                      )}
                      <Button
                        size="sm"
                        onClick={() => handleReviewSubmission(review.id)}
                      >
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

      {/* Actions and Table */}
      <div className="flex justify-between items-center">
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
        <Button size="lg" onClick={() => setIsCreateModalOpen(true)}>
          <PlusIcon />
          Assign Deliverable
        </Button>
      </div>

      <Card>
        <TableFilters searchValue={search} onSearchChange={setSearch}>
          <DataTable
            columns={deliverableColumns({ onReview: handleReviewSubmission })}
            data={data?.data?.deliverables || []}
            isLoading={isFetching}
            pagination={{
              total: statistics.total,
              pageSize: 10,
              onChange: (page: number) => setPage(page),
            }}
          />
        </TableFilters>
      </Card>

      {/* Modals */}
      <CreateDeliverableModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {selectedSubmissionId && (
        <ReviewSubmissionModal
          submissionId={selectedSubmissionId}
          open={!!selectedSubmissionId}
          onClose={() => setSelectedSubmissionId(null)}
        />
      )}
    </section>
  );
}
