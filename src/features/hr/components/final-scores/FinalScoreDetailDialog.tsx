"use client";

import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetFinalScoreReport,
  useUpdateFinalScore,
} from "@/features/hr/controllers/finalScoreController";
import { Loading } from "@/components/Loading";
import { Trophy, FileText, Users, TrendingUp, Save } from "lucide-react";
import { RECOMMENDATION_LABELS } from "@/features/hr/types";

interface FinalScoreDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scoreId: string;
}

const FinalScoreDetailDialog = ({
  open,
  onOpenChange,
  scoreId,
}: FinalScoreDetailDialogProps) => {
  const { data: reportData, isLoading } = useGetFinalScoreReport(scoreId, open);
  const updateScore = useUpdateFinalScore(scoreId);

  const report = reportData?.data;

  const form = useForm({
    defaultValues: {
      recommendation: report?.recommendation || "",
      recommendation_notes: report?.recommendation_notes || "",
    },
  });

  const onSubmit = async (data: any) => {
    await updateScore.mutateAsync({
      recommendation: data.recommendation,
      recommendation_notes: data.recommendation_notes,
    });
    onOpenChange(false);
  };

  if (isLoading || !report) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <Loading />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Final Score Report - {report.applicant_name}</DialogTitle>
          <DialogDescription>
            Complete breakdown of test and interview performance
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="interviews">
              Interviewer Scores ({report.total_interviewers})
            </TabsTrigger>
            <TabsTrigger value="recommendation">Recommendation</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">Aptitude Test</span>
                </div>
                <p className="text-3xl font-bold">
                  {report.test_score?.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Weight: {report.test_weight}% → Contributes:{" "}
                  {report.test_contribution?.toFixed(1)}%
                </p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Interview Average</span>
                </div>
                <p className="text-3xl font-bold">
                  {report.interview_average?.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Weight: {report.interview_weight}% → Contributes:{" "}
                  {report.interview_contribution?.toFixed(1)}%
                </p>
              </Card>

              <Card className="p-4 border-2 border-green-500">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Trophy className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold">Final Score</span>
                </div>
                <p className="text-4xl font-bold text-green-600">
                  {report.final_score?.toFixed(1)}%
                </p>
                <Badge
                  className={
                    report.passed ? "bg-green-100 text-green-700 mt-2" : "bg-red-100 text-red-700 mt-2"
                  }
                >
                  {report.passed ? "PASSED" : "FAILED"}
                </Badge>
              </Card>
            </div>

            {/* Formula Explanation */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">
                Score Calculation Formula:
              </h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p>
                  Final Score = (Test Score × Test Weight) + (Interview Average ×
                  Interview Weight)
                </p>
                <p className="font-mono">
                  = ({report.test_score?.toFixed(1)}% × {report.test_weight}%) + (
                  {report.interview_average?.toFixed(1)}% × {report.interview_weight}%)
                </p>
                <p className="font-mono">
                  = {report.test_contribution?.toFixed(1)}% +{" "}
                  {report.interview_contribution?.toFixed(1)}%
                </p>
                <p className="font-mono text-lg font-bold">
                  = {report.final_score?.toFixed(1)}%
                </p>
              </div>
            </Card>

            {/* Candidate Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Candidate:</span>
                  <span className="text-sm">{report.applicant_name}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Position:</span>
                  <span className="text-sm">{report.position_applied}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Total Interviewers:</span>
                  <span className="text-sm">{report.total_interviewers}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Email:</span>
                  <span className="text-sm">{report.applicant_email}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Calculated By:</span>
                  <span className="text-sm">{report.calculated_by_name}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Calculated On:</span>
                  <span className="text-sm">
                    {new Date(report.calculated_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="interviews" className="space-y-4">
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Interviewer</TableHead>
                    <TableHead>Appearance (5%)</TableHead>
                    <TableHead>Communication (5%)</TableHead>
                    <TableHead>Teamwork (5%)</TableHead>
                    <TableHead>Ethics (5%)</TableHead>
                    <TableHead>Analytical (20%)</TableHead>
                    <TableHead>Technical (30%)</TableHead>
                    <TableHead>Knowledge (10%)</TableHead>
                    <TableHead>Experience (20%)</TableHead>
                    <TableHead>Weighted Score</TableHead>
                    <TableHead>Preferred</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.individual_interviewer_scores?.map((interviewer: any) => (
                    <TableRow key={interviewer.interviewer_email}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{interviewer.interviewer_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {interviewer.interviewer_email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {interviewer.appearance_rating}/5
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {interviewer.communication_rating}/5
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {interviewer.teamwork_rating}/5
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {interviewer.ethics_rating}/5
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {interviewer.analytical_rating}/5
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-purple-50">
                          {interviewer.technical_rating}/5
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {interviewer.knowledge_rating}/5
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {interviewer.experience_rating}/5
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-700">
                          {interviewer.weighted_score?.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {interviewer.preferred_candidate ? (
                          <Badge className="bg-green-100 text-green-700">Yes</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium mb-2">Interview Average Calculation:</p>
              <p className="text-sm text-muted-foreground">
                Average of all {report.total_interviewers} interviewer weighted scores:{" "}
                <span className="font-mono font-semibold">
                  {report.interview_average?.toFixed(1)}%
                </span>
              </p>
            </div>
          </TabsContent>

          <TabsContent value="recommendation">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Current Recommendation:</h3>
                {report.recommendation ? (
                  <Badge className="bg-green-100 text-green-700 text-lg px-4 py-2">
                    {
                      RECOMMENDATION_LABELS[
                        report.recommendation as keyof typeof RECOMMENDATION_LABELS
                      ]
                    }
                  </Badge>
                ) : (
                  <p className="text-muted-foreground">No recommendation set</p>
                )}
              </Card>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recommendation">Update Recommendation</Label>
                  <Select
                    value={form.watch("recommendation")}
                    onValueChange={(value) => form.setValue("recommendation", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select recommendation" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(RECOMMENDATION_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recommendation_notes">Recommendation Notes</Label>
                  <Textarea
                    id="recommendation_notes"
                    placeholder="Add notes about why you're making this recommendation..."
                    rows={4}
                    {...form.register("recommendation_notes")}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Close
                </Button>
                <Button type="submit" disabled={updateScore.isPending}>
                  <Save className="w-4 h-4 mr-2" />
                  {updateScore.isPending ? "Saving..." : "Save Recommendation"}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default FinalScoreDetailDialog;
