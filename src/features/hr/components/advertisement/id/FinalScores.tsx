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
  useGetFinalScores,
  useBulkCalculateFinalScores,
} from "@/features/hr/controllers/finalScoreController";
import { Loading } from "@/components/Loading";
import { Calculator, Eye, Trophy, TrendingUp, Users } from "lucide-react";
import FinalScoreDetailDialog from "../../final-scores/FinalScoreDetailDialog";
import { RECOMMENDATION_LABELS } from "@/features/hr/types";

interface FinalScoresProps {
  id: string;
  title: string;
}

const FinalScores = ({ id, title }: FinalScoresProps) => {
  const [selectedScore, setSelectedScore] = useState<any>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const { data: scoresData, isLoading } = useGetFinalScores({
    advertisement: id,
  });
  const bulkCalculate = useBulkCalculateFinalScores();

  // Ensure scores is always an array
  const scores = Array.isArray(scoresData?.data)
    ? scoresData.data
    : Array.isArray(scoresData)
    ? scoresData
    : [];

  const handleBulkCalculate = async () => {
    if (
      confirm(
        "This will calculate final scores for all candidates who have completed both the test and interview. Continue?"
      )
    ) {
      await bulkCalculate.mutateAsync({
        advertisement_id: id,
      });
    }
  };

  const getRecommendationBadge = (recommendation: string) => {
    const colors: Record<string, string> = {
      RECOMMEND_HIRE: "bg-green-100 text-green-700",
      KIV: "bg-yellow-100 text-yellow-700",
      REJECT: "bg-red-100 text-red-700",
      HOLD: "bg-blue-100 text-blue-700",
      REFER_TO_POSITION: "bg-purple-100 text-purple-700",
      SCHEDULE_FOLLOW_UP: "bg-orange-100 text-orange-700",
    };

    return (
      <Badge className={colors[recommendation] || "bg-gray-100 text-gray-700"}>
        {RECOMMENDATION_LABELS[recommendation as keyof typeof RECOMMENDATION_LABELS] ||
          recommendation}
      </Badge>
    );
  };

  const getPassedBadge = (passed: boolean) => {
    return passed ? (
      <Badge className="bg-green-100 text-green-700">Passed</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-700">Failed</Badge>
    );
  };

  // Calculate stats
  const totalEvaluated = scores.length;
  const passedCount = scores.filter((s: any) => s.passed).length;
  const averageScore =
    totalEvaluated > 0
      ? scores.reduce((sum: number, s: any) => sum + s.final_score, 0) /
        totalEvaluated
      : 0;
  const recommendedForHire = scores.filter(
    (s: any) => s.recommendation === "RECOMMEND_HIRE" || s.auto_recommendation === "RECOMMEND_HIRE"
  ).length;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Final Applicant Scores</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Combined scores from aptitude tests (60%) and interviews (40%) for {title}
          </p>
        </div>
        <Button onClick={handleBulkCalculate} disabled={bulkCalculate.isPending}>
          <Calculator className="w-4 h-4 mr-2" />
          {bulkCalculate.isPending ? "Calculating..." : "Bulk Calculate Scores"}
        </Button>
      </div>

      {/* Stats Cards */}
      {scores.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">Total Evaluated</span>
            </div>
            <p className="text-3xl font-bold">{totalEvaluated}</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Trophy className="w-4 h-4" />
              <span className="text-sm">Passed</span>
            </div>
            <p className="text-3xl font-bold text-green-600">{passedCount}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {totalEvaluated > 0
                ? ((passedCount / totalEvaluated) * 100).toFixed(1)
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

          <Card className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Trophy className="w-4 h-4 text-green-600" />
              <span className="text-sm">Recommended for Hire</span>
            </div>
            <p className="text-3xl font-bold text-green-600">
              {recommendedForHire}
            </p>
          </Card>
        </div>
      )}

      {/* Scores Table */}
      {scores.length === 0 ? (
        <div className="border rounded-lg p-12 text-center">
          <div className="text-muted-foreground">
            <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">
              No final scores calculated yet
            </p>
            <p className="text-sm mb-4">
              Calculate final scores for candidates who have completed both tests and interviews
            </p>
            <Button onClick={handleBulkCalculate}>
              <Calculator className="w-4 h-4 mr-2" />
              Calculate Scores Now
            </Button>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant Name</TableHead>
                <TableHead>Appearance</TableHead>
                <TableHead>Communication</TableHead>
                <TableHead>Teamwork</TableHead>
                <TableHead>Ethics</TableHead>
                <TableHead>Analytical</TableHead>
                <TableHead>Technical</TableHead>
                <TableHead>Knowledge</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Written Test</TableHead>
                <TableHead>Interview Avg</TableHead>
                <TableHead>Final Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recommendation</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scores.map((score: any) => (
                <TableRow key={score.id}>
                  <TableCell className="font-medium">
                    {score.applicant_name}
                  </TableCell>
                  {/* Interview Rating Categories */}
                  <TableCell>
                    <Badge variant="outline" className="w-12 justify-center">
                      {score.appearance_rating?.toFixed(1) || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="w-12 justify-center">
                      {score.communication_rating?.toFixed(1) || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="w-12 justify-center">
                      {score.teamwork_rating?.toFixed(1) || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="w-12 justify-center">
                      {score.ethics_rating?.toFixed(1) || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="w-12 justify-center">
                      {score.analytical_rating?.toFixed(1) || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="w-12 justify-center bg-purple-50 text-purple-700 border-purple-300">
                      {score.technical_rating?.toFixed(1) || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="w-12 justify-center">
                      {score.knowledge_rating?.toFixed(1) || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="w-12 justify-center">
                      {score.experience_rating?.toFixed(1) || "N/A"}
                    </Badge>
                  </TableCell>
                  {/* Written Test (Aptitude Test) */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        (score.aptitude_test_score || 0) >= 70
                          ? "bg-green-50 text-green-700 border-green-300"
                          : (score.aptitude_test_score || 0) >= 50
                          ? "bg-yellow-50 text-yellow-700 border-yellow-300"
                          : "bg-red-50 text-red-700 border-red-300"
                      }
                    >
                      {score.aptitude_test_score?.toFixed(1)}%
                    </Badge>
                  </TableCell>
                  {/* Interview Average */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        (score.interview_average_score || 0) >= 70
                          ? "bg-blue-50 text-blue-700 border-blue-300"
                          : (score.interview_average_score || 0) >= 50
                          ? "bg-yellow-50 text-yellow-700 border-yellow-300"
                          : "bg-red-50 text-red-700 border-red-300"
                      }
                    >
                      {score.interview_average_score?.toFixed(1)}%
                    </Badge>
                  </TableCell>
                  {/* Final Score */}
                  <TableCell>
                    <Badge
                      className={
                        score.final_score >= 70
                          ? "bg-green-100 text-green-700"
                          : score.final_score >= 50
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }
                    >
                      {score.final_score?.toFixed(1)}%
                    </Badge>
                  </TableCell>
                  <TableCell>{getPassedBadge(score.passed)}</TableCell>
                  <TableCell>
                    {score.recommendation
                      ? getRecommendationBadge(score.recommendation)
                      : score.auto_recommendation
                      ? getRecommendationBadge(score.auto_recommendation)
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedScore(score);
                        setShowDetailDialog(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Detail Dialog */}
      {selectedScore && (
        <FinalScoreDetailDialog
          open={showDetailDialog}
          onOpenChange={setShowDetailDialog}
          scoreId={selectedScore.id}
        />
      )}
    </div>
  );
};

export default FinalScores;
