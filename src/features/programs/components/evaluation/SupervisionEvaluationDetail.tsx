"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, FileText, MapPin, User, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import { useGetSupervisionEvaluationById } from "../../controllers/supervisionEvaluationController";
import { SupervisionEvaluationStatusLabels } from "../../types/supervision-evaluation";
import { formatDate, formatDateTime } from "@/utils/date";
import { LoadingSpinner } from "@/components/Loading";

interface SupervisionEvaluationDetailProps {
  evaluationId: string;
}

export default function SupervisionEvaluationDetail({ evaluationId }: SupervisionEvaluationDetailProps) {
  const router = useRouter();
  const { data: evaluation, isLoading, error } = useGetSupervisionEvaluationById(evaluationId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !evaluation?.data) {
    return (
      <div className="text-center py-8 text-red-600">
        <AlertCircle className="h-12 w-12 mx-auto mb-4" />
        <p className="text-lg font-semibold">Error loading evaluation</p>
        <p className="text-sm mt-1">Please try again later</p>
        <Button className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  const evaluationData = evaluation.data;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{evaluationData.title}</h1>
            <p className="text-gray-600">Supervision Evaluation Details</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/programs/plan/supervision-evaluation/${evaluationId}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Status and Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <Badge
                  variant={
                    evaluationData.status === "COMPLETED"
                      ? "default"
                      : evaluationData.status === "IN_PROGRESS"
                      ? "secondary"
                      : "outline"
                  }
                  className="mt-2"
                >
                  {SupervisionEvaluationStatusLabels[evaluationData.status]}
                </Badge>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Evaluation Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDate(evaluationData.evaluation_date)}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Score</p>
                <p className="text-lg font-semibold text-gray-900">
                  {evaluationData.overall_score ? `${Math.round(evaluationData.overall_score * 10) / 10}/5` : 'N/A'}
                </p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Description</label>
              <p className="mt-1 text-gray-900">
                {evaluationData.description || 'No description provided'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Created</label>
              <p className="mt-1 text-gray-900">
                {formatDateTime(evaluationData.created_datetime)}
              </p>
            </div>
            {evaluationData.completed_date && (
              <div>
                <label className="text-sm font-medium text-gray-600">Completed</label>
                <p className="mt-1 text-gray-900">
                  {formatDate(evaluationData.completed_date)}
                </p>
              </div>
            )}
            {evaluationData.follow_up_required && (
              <div>
                <Badge variant="outline" className="text-orange-600">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Follow-up Required
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Location and Evaluator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location & Evaluator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Location</label>
              <p className="mt-1 text-gray-900">
                {evaluationData.location_name}
              </p>
              {evaluationData.facility_name && (
                <p className="text-sm text-gray-600">
                  Facility: {evaluationData.facility_name}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Evaluator</label>
              <div className="flex items-center gap-2 mt-1">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900">{evaluationData.evaluator_name}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories */}
      {evaluationData.selected_categories && evaluationData.selected_categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Evaluation Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {evaluationData.selected_categories.map((categoryId, index) => (
                <Badge key={categoryId} variant="secondary">
                  Category {index + 1}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments/Notes */}
      {evaluationData.comments && (
        <Card>
          <CardHeader>
            <CardTitle>Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-900">{evaluationData.comments}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}