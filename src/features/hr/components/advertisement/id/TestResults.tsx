"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetAptitudeTests,
  useGetTestResults,
} from "@/features/hr/controllers/aptitudeTestController";
import { Loading } from "@/components/Loading";
import { Eye, FileText, TrendingUp, Users, CheckCircle2, XCircle } from "lucide-react";

interface TestResultsProps {
  id: string;
  title: string;
}

const TestResults = ({ id, title }: TestResultsProps) => {
  const [selectedResult, setSelectedResult] = useState<any>(null);

  // Get all tests for this advertisement
  const { data: testsData } = useGetAptitudeTests(id);
  // List endpoints return paginated response directly (not wrapped in data key)
  const tests = Array.isArray(testsData?.results)
    ? testsData.results
    : Array.isArray(testsData?.data?.results)
    ? testsData.data.results
    : Array.isArray(testsData?.data)
    ? testsData.data
    : Array.isArray(testsData)
    ? testsData
    : [];

  // Get all test results (we'll filter by advertisement through assignments)
  const { data: resultsData, isLoading } = useGetTestResults();

  // List endpoints return paginated response directly (not wrapped in data key)
  const allResults = Array.isArray(resultsData?.results)
    ? resultsData.results
    : Array.isArray(resultsData?.data?.results)
    ? resultsData.data.results
    : Array.isArray(resultsData?.data)
    ? resultsData.data
    : Array.isArray(resultsData)
    ? resultsData
    : [];

  // Filter results for this advertisement only
  const results = allResults.filter((result: any) => {
    // Get test ID from assignment_detail.test (UUID) or test_detail.id
    const testId = result.assignment_detail?.test || result.assignment_detail?.test_detail?.id;
    return tests.some((test: any) => test.id === testId);
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-gray-100 text-gray-700">Pending</Badge>;
      case "IN_PROGRESS":
        return <Badge className="bg-blue-100 text-blue-700">In Progress</Badge>;
      case "SUBMITTED":
        return <Badge className="bg-yellow-100 text-yellow-700">Submitted</Badge>;
      case "GRADED":
        return <Badge className="bg-green-100 text-green-700">Graded</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPassedBadge = (passed: boolean) => {
    return passed ? (
      <Badge className="bg-green-100 text-green-700">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Passed
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-700">
        <XCircle className="w-3 h-3 mr-1" />
        Failed
      </Badge>
    );
  };

  // Calculate stats
  const totalCompleted = results.filter(
    (r: any) => r.assignment_detail?.status === "GRADED"
  ).length;
  const passedCount = results.filter(
    (r: any) => r.passed && r.assignment_detail?.status === "GRADED"
  ).length;
  const averageScore =
    totalCompleted > 0
      ? results
          .filter((r: any) => r.assignment_detail?.status === "GRADED")
          .reduce((sum: number, r: any) => sum + (Number(r.final_score) || 0), 0) / totalCompleted
      : 0;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Test Results</h2>
          <p className="text-sm text-muted-foreground mt-1">
            View all aptitude test results for {title}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {results.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">Total Completed</span>
            </div>
            <p className="text-3xl font-bold">{totalCompleted}</p>
            <p className="text-xs text-muted-foreground mt-1">
              out of {results.length} assigned
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm">Passed</span>
            </div>
            <p className="text-3xl font-bold text-green-600">{passedCount}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {totalCompleted > 0
                ? ((passedCount / totalCompleted) * 100).toFixed(1)
                : 0}
              % pass rate
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Average Score</span>
            </div>
            <p className="text-3xl font-bold">{averageScore.toFixed(1)}%</p>
          </Card>
        </div>
      )}

      {/* Results Table */}
      {results.length === 0 ? (
        <div className="border rounded-lg p-12 text-center">
          <div className="text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">
              No test results available yet
            </p>
            <p className="text-sm mb-4">
              Test results will appear here once applicants complete their assigned tests
            </p>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Test Name</TableHead>
                <TableHead>Assignment Status</TableHead>
                <TableHead>Auto-graded Score</TableHead>
                <TableHead>Final Score</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result: any) => (
                <TableRow key={result.id}>
                  <TableCell className="font-medium">
                    {result.assignment_detail?.applicant_name || "N/A"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {result.assignment_detail?.applicant_email || "N/A"}
                  </TableCell>
                  <TableCell>
                    {result.test_detail?.title || result.assignment_detail?.test_title || "N/A"}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(result.assignment_detail?.status || "PENDING")}
                  </TableCell>
                  <TableCell>
                    {result.auto_graded_score !== null && result.auto_graded_score !== undefined ? (
                      <div>
                        <Badge variant="outline">
                          {Number(result.auto_graded_score).toFixed(0)}/{result.test_detail?.total_marks || 0}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {result.test_detail?.total_marks
                            ? ((Number(result.auto_graded_score) / Number(result.test_detail.total_marks)) * 100).toFixed(1)
                            : 0}%
                        </p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {result.final_score !== null && result.final_score !== undefined ? (
                      <Badge
                        className={
                          Number(result.final_score) >= 70
                            ? "bg-green-100 text-green-700"
                            : Number(result.final_score) >= 50
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }
                      >
                        {Number(result.final_score).toFixed(1)}%
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">Pending</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {result.assignment_detail?.status === "GRADED" ? (
                      getPassedBadge(result.passed)
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {result.submitted_at
                      ? new Date(result.submitted_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {result.assignment_detail?.status === "SUBMITTED" ||
                     result.assignment_detail?.status === "GRADED" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          // Navigate to detailed view or open dialog
                          window.open(
                            `/dashboard/hr/test-results/${result.id}`,
                            "_blank"
                          );
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">Not available</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default TestResults;
