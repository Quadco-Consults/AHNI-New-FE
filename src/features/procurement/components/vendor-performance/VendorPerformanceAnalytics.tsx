"use client";

import { useMemo } from "react";
import { useGetAllVendorEvaluations } from "@/features/procurement/controllers/vendorPerformanceEvaluationController";
import { useGetAllProcurementTrackers } from "@/features/procurement/controllers/procurementTrackerController";
import Card from "components/Card";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Award,
  AlertTriangle,
  BarChart3,
  PieChart,
  Calendar,
} from "lucide-react";
import { Loading } from "components/Loading";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";

interface VendorPerformanceStats {
  vendorName: string;
  totalEvaluations: number;
  averageScore: number;
  latestScore: number;
  latestRecommendation: string;
  trend: "IMPROVING" | "DECLINING" | "STABLE";
  evaluationDates: string[];
  scores: number[];
}

const VendorPerformanceAnalytics = () => {
  const { data: evaluationsData, isLoading: evaluationsLoading } =
    useGetAllVendorEvaluations({
      page: 1,
      size: 1000,
    });

  const { data: trackerData, isLoading: trackerLoading } =
    useGetAllProcurementTrackers({
      page: 1,
      size: 1000,
    });

  // Calculate vendor performance analytics
  const vendorPerformance = useMemo(() => {
    if (!evaluationsData?.data?.results) return [];

    const vendorMap = new Map<string, VendorPerformanceStats>();

    evaluationsData.data.results.forEach((evaluation: any) => {
      const vendorName = evaluation.vendor?.name || "Unknown";
      const score = evaluation.total_score || 0;
      const recommendation = evaluation.evaluator_recommendation || "PENDING";
      const evaluationDate = evaluation.reviewed_period_end || evaluation.created_at;

      if (!vendorMap.has(vendorName)) {
        vendorMap.set(vendorName, {
          vendorName,
          totalEvaluations: 0,
          averageScore: 0,
          latestScore: 0,
          latestRecommendation: "PENDING",
          trend: "STABLE",
          evaluationDates: [],
          scores: [],
        });
      }

      const stats = vendorMap.get(vendorName)!;
      stats.totalEvaluations += 1;
      stats.scores.push(score);
      stats.evaluationDates.push(evaluationDate);

      // Keep track of latest evaluation
      if (
        !stats.latestScore ||
        new Date(evaluationDate) >
          new Date(stats.evaluationDates[stats.evaluationDates.length - 1])
      ) {
        stats.latestScore = score;
        stats.latestRecommendation = recommendation;
      }
    });

    // Calculate averages and trends
    Array.from(vendorMap.values()).forEach((stats) => {
      stats.averageScore =
        stats.scores.reduce((sum, score) => sum + score, 0) / stats.scores.length;

      // Calculate trend (comparing last 2 evaluations if available)
      if (stats.scores.length >= 2) {
        const recent = stats.scores[stats.scores.length - 1];
        const previous = stats.scores[stats.scores.length - 2];
        const diff = recent - previous;

        if (diff > 2) stats.trend = "IMPROVING";
        else if (diff < -2) stats.trend = "DECLINING";
        else stats.trend = "STABLE";
      }
    });

    return Array.from(vendorMap.values()).sort(
      (a, b) => b.averageScore - a.averageScore
    );
  }, [evaluationsData]);

  // Overall statistics
  const overallStats = useMemo(() => {
    const totalEvaluations = vendorPerformance.reduce(
      (sum, v) => sum + v.totalEvaluations,
      0
    );
    const avgScore =
      vendorPerformance.length > 0
        ? vendorPerformance.reduce((sum, v) => sum + v.averageScore, 0) /
          vendorPerformance.length
        : 0;

    const topPerformers = vendorPerformance.filter((v) => v.averageScore >= 20).length;
    const needsImprovement = vendorPerformance.filter(
      (v) => v.averageScore < 15
    ).length;
    const improving = vendorPerformance.filter((v) => v.trend === "IMPROVING").length;
    const declining = vendorPerformance.filter((v) => v.trend === "DECLINING").length;

    const recommendations = {
      RETAIN: vendorPerformance.filter((v) => v.latestRecommendation === "RETAIN")
        .length,
      ON_PROBATION: vendorPerformance.filter(
        (v) => v.latestRecommendation === "ON_PROBATION"
      ).length,
      BARRED: vendorPerformance.filter((v) => v.latestRecommendation === "BARRED")
        .length,
    };

    return {
      totalEvaluations,
      avgScore: avgScore.toFixed(1),
      topPerformers,
      needsImprovement,
      improving,
      declining,
      recommendations,
    };
  }, [vendorPerformance]);

  const columns: ColumnDef<VendorPerformanceStats>[] = [
    {
      header: "Vendor Name",
      accessorKey: "vendorName",
      size: 200,
      cell: ({ row }) => {
        return <div className="font-medium">{row.original.vendorName}</div>;
      },
    },
    {
      header: "Evaluations",
      accessorKey: "totalEvaluations",
      size: 100,
      cell: ({ row }) => {
        return (
          <div className="text-center font-semibold">
            {row.original.totalEvaluations}
          </div>
        );
      },
    },
    {
      header: "Avg Score",
      accessorKey: "averageScore",
      size: 120,
      cell: ({ row }) => {
        const score = row.original.averageScore;
        return (
          <div className="flex items-center gap-2">
            <span className="font-semibold">{score.toFixed(1)}</span>
            <span className="text-xs text-gray-500">/ 25</span>
            <div
              className={cn(
                "h-2 w-16 rounded-full overflow-hidden bg-gray-200"
              )}
            >
              <div
                className={cn(
                  "h-full",
                  score >= 20 && "bg-green-500",
                  score >= 15 && score < 20 && "bg-blue-500",
                  score >= 10 && score < 15 && "bg-yellow-500",
                  score < 10 && "bg-red-500"
                )}
                style={{ width: `${(score / 25) * 100}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      header: "Latest Score",
      accessorKey: "latestScore",
      size: 120,
      cell: ({ row }) => {
        const score = row.original.latestScore;
        return (
          <div className="font-medium">
            {score} / 25{" "}
            <span className="text-xs text-gray-500">
              ({((score / 25) * 100).toFixed(0)}%)
            </span>
          </div>
        );
      },
    },
    {
      header: "Recommendation",
      accessorKey: "latestRecommendation",
      size: 150,
      cell: ({ row }) => {
        const recommendation = row.original.latestRecommendation;
        return (
          <Badge
            className={cn(
              "px-3 py-1",
              recommendation === "RETAIN" && "bg-green-200 text-green-800",
              recommendation === "ON_PROBATION" &&
                "bg-yellow-200 text-yellow-800",
              recommendation === "BARRED" && "bg-red-200 text-red-800",
              recommendation === "PENDING" && "bg-gray-200 text-gray-800"
            )}
          >
            {recommendation.replace("_", " ")}
          </Badge>
        );
      },
    },
    {
      header: "Trend",
      accessorKey: "trend",
      size: 120,
      cell: ({ row }) => {
        const trend = row.original.trend;
        return (
          <div className="flex items-center gap-2">
            {trend === "IMPROVING" && (
              <>
                <TrendingUp className="text-green-500" size={18} />
                <span className="text-green-700 text-sm font-medium">
                  Improving
                </span>
              </>
            )}
            {trend === "DECLINING" && (
              <>
                <TrendingDown className="text-red-500" size={18} />
                <span className="text-red-700 text-sm font-medium">
                  Declining
                </span>
              </>
            )}
            {trend === "STABLE" && (
              <span className="text-gray-600 text-sm">Stable</span>
            )}
          </div>
        );
      },
    },
  ];

  if (evaluationsLoading || trackerLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Evaluations</p>
              <p className="text-2xl font-bold">{overallStats.totalEvaluations}</p>
            </div>
            <Calendar className="text-blue-500" size={32} />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Score</p>
              <p className="text-2xl font-bold">{overallStats.avgScore} / 25</p>
            </div>
            <BarChart3 className="text-purple-500" size={32} />
          </div>
        </Card>

        <Card className="p-4 border-green-200 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Top Performers</p>
              <p className="text-2xl font-bold text-green-700">
                {overallStats.topPerformers}
              </p>
            </div>
            <Award className="text-green-500" size={32} />
          </div>
        </Card>

        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">
                Needs Improvement
              </p>
              <p className="text-2xl font-bold text-red-700">
                {overallStats.needsImprovement}
              </p>
            </div>
            <AlertTriangle className="text-red-500" size={32} />
          </div>
        </Card>
      </div>

      {/* Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={20} />
            Performance Trends
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-green-600" size={18} />
                <span className="font-medium">Improving</span>
              </div>
              <Badge className="bg-green-200 text-green-800">
                {overallStats.improving} vendors
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingDown className="text-red-600" size={18} />
                <span className="font-medium">Declining</span>
              </div>
              <Badge className="bg-red-200 text-red-800">
                {overallStats.declining} vendors
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PieChart size={20} />
            Recommendations Distribution
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="font-medium">RETAIN</span>
              <Badge className="bg-green-200 text-green-800">
                {overallStats.recommendations.RETAIN} vendors
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="font-medium">ON PROBATION</span>
              <Badge className="bg-yellow-200 text-yellow-800">
                {overallStats.recommendations.ON_PROBATION} vendors
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="font-medium">BARRED</span>
              <Badge className="bg-red-200 text-red-800">
                {overallStats.recommendations.BARRED} vendors
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Vendor Performance Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Vendor Performance Details</h3>
        <DataTable
          columns={columns}
          data={vendorPerformance}
          isLoading={evaluationsLoading || trackerLoading}
        />
      </Card>
    </div>
  );
};

export default VendorPerformanceAnalytics;
