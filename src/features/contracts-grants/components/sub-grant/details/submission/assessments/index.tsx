"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Eye, FileText, Filter } from "lucide-react";
import { useGetAllAssessments } from "@/features/contracts-grants/controllers/assessmentController";
import Pagination from "@/components/Pagination";
import { format } from "date-fns";

export default function AssessmentsList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);

  const params = useParams();
  const submissionId = params?.id as string;

  const { data, isLoading } = useGetAllAssessments({
    page,
    size: 10,
    search,
    submission: submissionId,
    status: statusFilter,
  });

  const assessments = data?.data?.results || [];
  const totalCount = data?.data?.paginator?.count || 0;
  const pageSize = data?.data?.paginator?.page_size || 10;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { variant: "outline" as const, color: "text-gray-600 bg-gray-50 border-gray-200" },
      SUBMITTED: { variant: "outline" as const, color: "text-blue-600 bg-blue-50 border-blue-200" },
      REVIEWED: { variant: "outline" as const, color: "text-purple-600 bg-purple-50 border-purple-200" },
      APPROVED: { variant: "outline" as const, color: "text-green-600 bg-green-50 border-green-200" },
      REJECTED: { variant: "outline" as const, color: "text-red-600 bg-red-50 border-red-200" },
    };

    return statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
  };

  const getRecommendationBadge = (recommendation: string) => {
    const recommendationConfig = {
      APPROVE: { variant: "outline" as const, color: "text-green-600 bg-green-50 border-green-200" },
      CONDITIONALLY_APPROVE: { variant: "outline" as const, color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
      NEEDS_REVISION: { variant: "outline" as const, color: "text-orange-600 bg-orange-50 border-orange-200" },
      REJECT: { variant: "outline" as const, color: "text-red-600 bg-red-50 border-red-200" },
    };

    return recommendationConfig[recommendation as keyof typeof recommendationConfig] || recommendationConfig.APPROVE;
  };

  const getScoreColor = (score: number, maxScore: number) => {
    if (!maxScore) return "text-gray-500";
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-y-6 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Assessments</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading assessments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-y-6 p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Assessments</h1>
        <Link href={`/dashboard/c-and-g/sub-grant/awards/submission/${submissionId}/assessment`}>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            New Assessment
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search assessments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value === "all" ? undefined : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="SUBMITTED">Submitted</SelectItem>
                    <SelectItem value="REVIEWED">Reviewed</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Assessments List */}
      <div className="space-y-4">
        {assessments.length > 0 ? (
          <>
            {assessments.map((assessment) => (
              <Card key={assessment.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">
                        {assessment.submission.organization_name}
                      </h3>
                      <Badge className={getStatusBadge(assessment.status).color}>
                        {assessment.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Assessor</p>
                        <p className="font-medium">{assessment.assessor_name}</p>
                      </div>

                      {assessment.total_score !== null && assessment.max_possible_score !== null && (
                        <div>
                          <p className="text-sm text-gray-500">Score</p>
                          <p className={`font-semibold ${getScoreColor(assessment.total_score, assessment.max_possible_score)}`}>
                            {assessment.total_score} / {assessment.max_possible_score}
                            {assessment.percentage_score && (
                              <span className="text-sm ml-1">
                                ({assessment.percentage_score.toFixed(1)}%)
                              </span>
                            )}
                          </p>
                        </div>
                      )}

                      <div>
                        <p className="text-sm text-gray-500">Recommendation</p>
                        <Badge className={getRecommendationBadge(assessment.recommendation).color}>
                          {assessment.recommendation.replace('_', ' ')}
                        </Badge>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Last Updated</p>
                        <p className="text-sm">
                          {format(new Date(assessment.updated_datetime), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>

                    {assessment.submission.project_title && (
                      <div>
                        <p className="text-sm text-gray-500">Project Title</p>
                        <p className="text-sm">{assessment.submission.project_title}</p>
                      </div>
                    )}

                    {assessment.submission.total_budget_requested && (
                      <div>
                        <p className="text-sm text-gray-500">Budget Requested</p>
                        <p className="text-sm font-medium">
                          ${assessment.submission.total_budget_requested.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Link href={`/dashboard/c-and-g/sub-grant/awards/submission/${assessment.submission.id}/assessment/${assessment.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}

            <Pagination
              total={totalCount}
              itemsPerPage={pageSize}
              onChange={setPage}
            />
          </>
        ) : (
          <Card className="p-8">
            <div className="text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments found</h3>
              <p className="text-gray-500 mb-4">
                {search || statusFilter
                  ? "Try adjusting your search or filters"
                  : "No assessments have been created yet"}
              </p>
              <Link href={`/dashboard/c-and-g/sub-grant/awards/submission/${submissionId}/assessment`}>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Assessment
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}