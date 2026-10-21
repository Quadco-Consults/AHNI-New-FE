"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetTestResults } from "@/features/hr/controllers/aptitudeTestController";
import { Loading } from "@/components/Loading";
import { CheckCircle2, Clock, AlertCircle, GraduationCap } from "lucide-react";
import GradeTestDialog from "./GradeTestDialog";

interface TestResultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testId: string;
}

const TestResultsDialog = ({
  open,
  onOpenChange,
  testId,
}: TestResultsDialogProps) => {
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [showGradeDialog, setShowGradeDialog] = useState(false);

  const { data: resultsData, isLoading } = useGetTestResults(testId, open);

  const results = resultsData?.data || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-700">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "IN_PROGRESS":
        return (
          <Badge className="bg-blue-100 text-blue-700">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
      case "SUBMITTED":
        return (
          <Badge className="bg-orange-100 text-orange-700">
            <AlertCircle className="w-3 h-3 mr-1" />
            Needs Grading
          </Badge>
        );
      case "GRADED":
        return (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Graded
          </Badge>
        );
      case "EXPIRED":
        return (
          <Badge className="bg-red-100 text-red-700">
            <AlertCircle className="w-3 h-3 mr-1" />
            Expired
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const needsManualGrading = (result: any) => {
    return result.assignment?.status === "SUBMITTED" && !result.graded_at;
  };

  const handleGradeTest = (result: any) => {
    setSelectedResult(result);
    setShowGradeDialog(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Test Results & Grading</DialogTitle>
            <DialogDescription>
              View all test submissions and manually grade essay/short answer questions
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <Loading />
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList>
                <TabsTrigger value="all">
                  All Results ({results.length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Needs Grading (
                  {results.filter((r: any) => needsManualGrading(r)).length})
                </TabsTrigger>
                <TabsTrigger value="graded">
                  Graded (
                  {results.filter((r: any) => r.assignment?.status === "GRADED").length}
                  )
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {results.length === 0 ? (
                  <div className="border rounded-lg p-12 text-center">
                    <p className="text-muted-foreground">
                      No test submissions yet
                    </p>
                  </div>
                ) : (
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Candidate</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Auto Score</TableHead>
                          <TableHead>Manual Score</TableHead>
                          <TableHead>Final Score</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.map((result: any) => (
                          <TableRow key={result.id}>
                            <TableCell className="font-medium">
                              {result.applicant_name}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(result.assignment?.status)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {result.auto_graded_score || 0} pts
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {result.manual_graded_score || 0} pts
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-blue-100 text-blue-700">
                                {result.final_score || 0} / {result.total_marks}
                              </Badge>
                              <span className="text-xs text-muted-foreground ml-2">
                                ({result.percentage_score?.toFixed(1) || 0}%)
                              </span>
                            </TableCell>
                            <TableCell>
                              {result.assignment?.submitted_at
                                ? new Date(
                                    result.assignment.submitted_at
                                  ).toLocaleString()
                                : "-"}
                            </TableCell>
                            <TableCell className="text-right">
                              {result.assignment?.status === "SUBMITTED" ||
                              result.assignment?.status === "GRADED" ? (
                                <Button
                                  size="sm"
                                  variant={
                                    needsManualGrading(result)
                                      ? "default"
                                      : "outline"
                                  }
                                  onClick={() => handleGradeTest(result)}
                                >
                                  <GraduationCap className="w-4 h-4 mr-1" />
                                  {needsManualGrading(result)
                                    ? "Grade Now"
                                    : "View/Edit"}
                                </Button>
                              ) : (
                                <span className="text-sm text-muted-foreground">
                                  Not submitted
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="pending" className="space-y-4">
                {results.filter((r: any) => needsManualGrading(r)).length === 0 ? (
                  <div className="border rounded-lg p-12 text-center">
                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">
                      All tests have been graded!
                    </p>
                    <p className="text-muted-foreground">
                      There are no pending tests that require manual grading.
                    </p>
                  </div>
                ) : (
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Candidate</TableHead>
                          <TableHead>Auto Score</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results
                          .filter((r: any) => needsManualGrading(r))
                          .map((result: any) => (
                            <TableRow key={result.id}>
                              <TableCell className="font-medium">
                                {result.applicant_name}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {result.auto_graded_score || 0} pts
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {new Date(
                                  result.assignment.submitted_at
                                ).toLocaleString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  size="sm"
                                  onClick={() => handleGradeTest(result)}
                                >
                                  <GraduationCap className="w-4 h-4 mr-1" />
                                  Grade Now
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="graded" className="space-y-4">
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Candidate</TableHead>
                        <TableHead>Final Score</TableHead>
                        <TableHead>Percentage</TableHead>
                        <TableHead>Graded By</TableHead>
                        <TableHead>Graded At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results
                        .filter((r: any) => r.assignment?.status === "GRADED")
                        .map((result: any) => (
                          <TableRow key={result.id}>
                            <TableCell className="font-medium">
                              {result.applicant_name}
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-blue-100 text-blue-700">
                                {result.final_score} / {result.total_marks}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  result.percentage_score >= result.passing_score
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }
                              >
                                {result.percentage_score?.toFixed(1)}%
                              </Badge>
                            </TableCell>
                            <TableCell>{result.graded_by_name || "-"}</TableCell>
                            <TableCell>
                              {result.graded_at
                                ? new Date(result.graded_at).toLocaleString()
                                : "-"}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleGradeTest(result)}
                              >
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {selectedResult && (
        <GradeTestDialog
          open={showGradeDialog}
          onOpenChange={setShowGradeDialog}
          result={selectedResult}
        />
      )}
    </>
  );
};

export default TestResultsDialog;
