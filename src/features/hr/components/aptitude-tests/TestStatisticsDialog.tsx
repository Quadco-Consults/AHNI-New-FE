"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetTestStatistics } from "@/features/hr/controllers/aptitudeTestController";
import { Loading } from "@/components/Loading";
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Target,
} from "lucide-react";

interface TestStatisticsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testId: string;
}

const TestStatisticsDialog = ({
  open,
  onOpenChange,
  testId,
}: TestStatisticsDialogProps) => {
  const { data: statsData, isLoading } = useGetTestStatistics(testId, open);

  const stats = statsData?.data || {};

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
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Submitted
          </Badge>
        );
      case "GRADED":
        return (
          <Badge className="bg-purple-100 text-purple-700">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Graded
          </Badge>
        );
      case "EXPIRED":
        return (
          <Badge className="bg-red-100 text-red-700">
            <XCircle className="w-3 h-3 mr-1" />
            Expired
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Test Statistics</DialogTitle>
          <DialogDescription>
            Overview of test performance and completion rates
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <Loading />
        ) : (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Total Assigned</span>
                </div>
                <p className="text-3xl font-bold">
                  {stats.total_assignments || 0}
                </p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm">Completed</span>
                </div>
                <p className="text-3xl font-bold text-green-600">
                  {stats.completed_count || 0}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.completion_rate || 0}% completion rate
                </p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">Average Score</span>
                </div>
                <p className="text-3xl font-bold">
                  {stats.average_score?.toFixed(1) || 0}%
                </p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Target className="w-4 h-4" />
                  <span className="text-sm">Pass Rate</span>
                </div>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.pass_rate?.toFixed(1) || 0}%
                </p>
              </Card>
            </div>

            {/* Status Breakdown */}
            <div>
              <h3 className="font-semibold mb-3">Status Breakdown</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {stats.status_breakdown?.map((item: any) => (
                  <Card key={item.status} className="p-3">
                    <div className="text-center">
                      {getStatusBadge(item.status)}
                      <p className="text-2xl font-bold mt-2">{item.count}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Top Performers */}
            {stats.top_performers && stats.top_performers.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Top Performers</h3>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>Candidate Name</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Time Taken</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats.top_performers.map((performer: any, index: number) => (
                        <TableRow key={performer.applicant_id}>
                          <TableCell>
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 font-bold">
                              {index + 1}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {performer.applicant_name}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                performer.percentage_score >= 70
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }
                            >
                              {performer.percentage_score.toFixed(1)}%
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {Math.floor(performer.time_spent_seconds / 60)} mins
                          </TableCell>
                          <TableCell>{getStatusBadge(performer.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Score Distribution */}
            {stats.score_distribution && stats.score_distribution.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Score Distribution</h3>
                <div className="grid grid-cols-5 gap-3">
                  {stats.score_distribution.map((range: any) => (
                    <Card key={range.range} className="p-3">
                      <p className="text-sm text-muted-foreground mb-1">
                        {range.range}
                      </p>
                      <p className="text-2xl font-bold">{range.count}</p>
                      <p className="text-xs text-muted-foreground">
                        {((range.count / stats.total_assignments) * 100).toFixed(
                          0
                        )}
                        %
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TestStatisticsDialog;
