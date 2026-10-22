"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  usePublishTest,
} from "@/features/hr/controllers/aptitudeTestController";
import { Loading } from "@/components/Loading";
import { Plus, Eye, Edit, Users, BarChart3, Send, GraduationCap } from "lucide-react";
import { AptitudeTest } from "@/features/hr/types";
import CreateTestDialog from "../../aptitude-tests/CreateTestDialog";
import ViewTestDialog from "../../aptitude-tests/ViewTestDialog";
import AssignTestDialog from "../../aptitude-tests/AssignTestDialog";
import TestStatisticsDialog from "../../aptitude-tests/TestStatisticsDialog";
import TestResultsDialog from "../../aptitude-tests/TestResultsDialog";

interface AptitudeTestsProps {
  id: string;
  title: string;
}

const AptitudeTests = ({ id, title }: AptitudeTestsProps) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTest, setSelectedTest] = useState<AptitudeTest | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [showResultsDialog, setShowResultsDialog] = useState(false);

  const { data: testsData, isLoading } = useGetAptitudeTests(id);
  const publishTest = usePublishTest(selectedTest?.id || "");

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT":
        return <Badge className="bg-gray-100 text-gray-700">Draft</Badge>;
      case "PUBLISHED":
        return <Badge className="bg-green-100 text-green-700">Published</Badge>;
      case "CLOSED":
        return <Badge className="bg-red-100 text-red-700">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handlePublish = async (test: AptitudeTest) => {
    if (confirm(`Are you sure you want to publish "${test.title}"? Once published, the test cannot be edited.`)) {
      await publishTest.mutateAsync();
    }
  };

  const handleViewTest = (test: AptitudeTest) => {
    setSelectedTest(test);
    setShowViewDialog(true);
  };

  const handleAssignTest = (test: AptitudeTest) => {
    setSelectedTest(test);
    setShowAssignDialog(true);
  };

  const handleViewStats = (test: AptitudeTest) => {
    setSelectedTest(test);
    setShowStatsDialog(true);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Aptitude Tests</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage aptitude tests for {title}
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Test
        </Button>
      </div>

      {/* Tests Table */}
      {tests.length === 0 ? (
        <div className="border rounded-lg p-12 text-center">
          <div className="text-muted-foreground">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No aptitude tests created yet</p>
            <p className="text-sm mb-4">
              Create your first test to assess candidates&apos; technical and analytical skills
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Test
            </Button>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Passing Score</TableHead>
                <TableHead>Total Marks</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tests.map((test: AptitudeTest) => (
                <TableRow key={test.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{test.title}</p>
                      {test.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {test.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(test.status)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {test.question_count || 0} questions
                    </Badge>
                  </TableCell>
                  <TableCell>{test.duration_minutes} mins</TableCell>
                  <TableCell>{test.passing_score}%</TableCell>
                  <TableCell>{test.total_marks} marks</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewTest(test)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {test.status === "DRAFT" && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedTest(test);
                              setShowViewDialog(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePublish(test)}
                          >
                            <Send className="w-4 h-4 mr-1" />
                            Publish
                          </Button>
                        </>
                      )}
                      {test.status === "PUBLISHED" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAssignTest(test)}
                          >
                            <Users className="w-4 h-4 mr-1" />
                            Assign
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedTest(test);
                              setShowResultsDialog(true);
                            }}
                          >
                            <GraduationCap className="w-4 h-4 mr-1" />
                            Grade
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewStats(test)}
                          >
                            <BarChart3 className="w-4 h-4 mr-1" />
                            Statistics
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Dialogs */}
      <CreateTestDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        advertisementId={id}
      />

      {selectedTest && (
        <>
          <ViewTestDialog
            open={showViewDialog}
            onOpenChange={setShowViewDialog}
            test={selectedTest}
          />
          <AssignTestDialog
            open={showAssignDialog}
            onOpenChange={setShowAssignDialog}
            test={selectedTest}
            advertisementId={id}
          />
          <TestStatisticsDialog
            open={showStatsDialog}
            onOpenChange={setShowStatsDialog}
            testId={selectedTest.id}
          />
          <TestResultsDialog
            open={showResultsDialog}
            onOpenChange={setShowResultsDialog}
            testId={selectedTest.id}
          />
        </>
      )}
    </div>
  );
};

export default AptitudeTests;
