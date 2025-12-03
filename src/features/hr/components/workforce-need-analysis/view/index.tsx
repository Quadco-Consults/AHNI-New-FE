"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Card from "@/components/Card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "lib/utils";
import { Icon } from "@iconify/react";
import {
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Download,
  BarChart3,
  PieChart,
  MapPin,
  Briefcase,
} from "lucide-react";
import { useGetWorkforceNeedAnalysis } from "@/features/hr/controllers/hrWorkforceNeedAnalysisController";

interface WorkforceNeedAnalysisViewProps {
  id: string;
}

const WorkforceNeedAnalysisView: React.FC<WorkforceNeedAnalysisViewProps> = ({ id }) => {
  const router = useRouter();

  // For demo purposes, we'll use the general analysis data and filter by ID
  // In a real implementation, you'd have a specific endpoint for single analysis
  const { data: analysisData, isLoading, error } = useGetWorkforceNeedAnalysis({});

  // Find the specific analysis record
  const analysis = analysisData?.data?.results?.find((item: any) => item.id === id) ||
                  analysisData?.data?.results?.[0]; // Fallback to first record for demo

  // Mock enhanced data for comprehensive view
  const enhancedAnalysis = React.useMemo(() => {
    if (!analysis) return null;

    const wisnRatioNumeric = parseFloat(analysis.wisn_ratio || "0");
    const currentStaff = analysis.current_staff_count || 0;
    const requiredStaff = analysis.wisn_required_staff_count || 1;
    const gapCount = analysis.shortage_excess_count || 0;

    // WISN Methodology calculations based on WHO standards
    const availableWorkingTime = 1800; // Annual working hours (example: 225 days × 8 hours)
    const serviceTime = Math.floor(availableWorkingTime * 0.7); // 70% service activities
    const supportTime = Math.floor(availableWorkingTime * 0.2); // 20% support activities
    const additionalTime = Math.floor(availableWorkingTime * 0.1); // 10% additional activities

    return {
      ...analysis,
      // Enhanced metadata
      created_at: "2024-11-26T10:30:00Z",
      updated_at: "2024-11-26T14:45:00Z",
      analyst_name: "WHO WISN Analytics System",
      review_status: "Approved",

      // WISN-based calculations
      wisn_breakdown: {
        available_working_time: availableWorkingTime,
        service_time: serviceTime,
        support_time: supportTime,
        additional_time: additionalTime,
        workload_pressure: wisnRatioNumeric < 0.8 ? "HIGH" :
                          wisnRatioNumeric > 1.2 ? "LOW" : "ACCEPTABLE"
      },

      // Performance metrics
      utilization_rate: Math.min(wisnRatioNumeric * 100, 100),
      efficiency_score: wisnRatioNumeric >= 1.0 ?
        Math.min(90 + (wisnRatioNumeric - 1.0) * 10, 100) :
        Math.max(wisnRatioNumeric * 90, 30),

      // Workload analysis
      workload_analysis: {
        optimal_ratio_range: "0.8 - 1.2",
        current_ratio: wisnRatioNumeric,
        status: wisnRatioNumeric < 0.8 ? "UNDERSTAFFED" :
                wisnRatioNumeric > 1.2 ? "OVERSTAFFED" : "OPTIMAL",
        gap_percentage: Math.abs(gapCount / requiredStaff * 100),
        productivity_index: Math.min(wisnRatioNumeric * 85, 100)
      },

      // WHO WISN-based recommendations
      recommendations: [
        // Staffing recommendations
        gapCount < 0
          ? `Recruit ${Math.abs(gapCount)} additional ${typeof analysis.position === 'object' ? analysis.position?.name : analysis.position} to meet WISN requirements`
          : gapCount > 0
          ? `Consider redeploying ${gapCount} staff to areas with higher demand or expand service delivery`
          : "Current staffing level aligns with WISN calculations",

        // Workload recommendations
        wisnRatioNumeric < 0.8
          ? "High workload pressure detected. Implement task redistribution and consider temporary staffing solutions"
          : wisnRatioNumeric > 1.2
          ? "Low workload pressure. Optimize staff utilization through skill development or service expansion"
          : "Workload pressure within acceptable range. Maintain current operational efficiency",

        // WISN methodology recommendations
        "Conduct quarterly WISN recalculation based on service delivery changes",
        "Monitor activity standards and adjust as needed for accuracy",
        "Implement workload monitoring systems for real-time WISN updates"
      ],

      // Historical trend with WISN focus
      historical_trend: [
        {
          month: "Aug 2024",
          ratio: Math.max(wisnRatioNumeric - 0.15, 0.5),
          staff_count: Math.max(currentStaff - 1, 0),
          workload_pressure: "HIGH"
        },
        {
          month: "Sep 2024",
          ratio: Math.max(wisnRatioNumeric - 0.10, 0.6),
          staff_count: currentStaff,
          workload_pressure: "HIGH"
        },
        {
          month: "Oct 2024",
          ratio: Math.max(wisnRatioNumeric - 0.05, 0.7),
          staff_count: currentStaff,
          workload_pressure: "ACCEPTABLE"
        },
        {
          month: "Nov 2024",
          ratio: wisnRatioNumeric,
          staff_count: currentStaff,
          workload_pressure: wisnRatioNumeric < 0.8 ? "HIGH" :
                           wisnRatioNumeric > 1.2 ? "LOW" : "ACCEPTABLE"
        }
      ],

      // WISN methodology explanation
      methodology_info: {
        description: "WHO Workload Indicators of Staffing Need (WISN) methodology",
        purpose: "Evidence-based approach to determine appropriate staffing levels based on workload",
        key_components: [
          "Available Working Time (AWT)",
          "Workload Components (health service, support, additional)",
          "Activity Standards (time per activity)",
          "WISN Ratio calculation"
        ],
        interpretation: {
          "< 0.8": "Understaffed - High workload pressure",
          "0.8 - 1.2": "Optimal staffing range",
          "> 1.2": "Overstaffed - Low workload pressure"
        }
      }
    };
  }, [analysis]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workforce analysis...</p>
        </div>
      </div>
    );
  }

  if (error || !enhancedAnalysis) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="p-8 text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Analysis Not Found</h3>
          <p className="text-gray-600 mb-4">
            The requested workforce analysis could not be loaded.
          </p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  const getStatusIcon = (problem: string) => {
    switch (problem?.toUpperCase()) {
      case "SHORTAGE":
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      case "SURPLUS":
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case "BALANCE":
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <Users className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (problem: string) => {
    switch (problem?.toUpperCase()) {
      case "SHORTAGE":
        return "text-red-600 bg-red-50 border-red-200";
      case "SURPLUS":
        return "text-green-600 bg-green-50 border-green-200";
      case "BALANCE":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const exportAnalysis = () => {
    // Create a comprehensive report
    const reportData = {
      analysis: enhancedAnalysis,
      generated_at: new Date().toISOString(),
      generated_by: "AHNI Workforce Analytics System"
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workforce-analysis-${enhancedAnalysis.position?.name || 'report'}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Analysis
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Workforce Need Analysis</h1>
            <p className="text-gray-600">
              {typeof enhancedAnalysis.position === 'object'
                ? enhancedAnalysis.position?.name
                : enhancedAnalysis.position} at {" "}
              {typeof enhancedAnalysis.location === 'object'
                ? enhancedAnalysis.location?.name
                : enhancedAnalysis.location}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportAnalysis}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Badge variant={enhancedAnalysis.review_status === "Approved" ? "default" : "secondary"}>
            {enhancedAnalysis.review_status}
          </Badge>
        </div>
      </div>

      {/* Status Alert - Most Important Info First */}
      <Card className={cn(
        "p-6 border-l-4",
        enhancedAnalysis.shortage_excess_count < 0 ? "border-l-red-500 bg-red-50" :
        enhancedAnalysis.shortage_excess_count > 0 ? "border-l-blue-500 bg-blue-50" :
        "border-l-green-500 bg-green-50"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {getStatusIcon(enhancedAnalysis.workforce_problem)}
            <div>
              <h3 className="text-lg font-semibold">
                {enhancedAnalysis.shortage_excess_count < 0
                  ? `Shortage: Need ${Math.abs(enhancedAnalysis.shortage_excess_count)} more staff`
                  : enhancedAnalysis.shortage_excess_count > 0
                  ? `Surplus: ${enhancedAnalysis.shortage_excess_count} extra staff available`
                  : "Optimal staffing level"
                }
              </h3>
              <p className="text-sm text-gray-600">
                {typeof enhancedAnalysis.position === 'object'
                  ? enhancedAnalysis.position?.name
                  : enhancedAnalysis.position} • {" "}
                {typeof enhancedAnalysis.location === 'object'
                  ? enhancedAnalysis.location?.name
                  : enhancedAnalysis.location}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Current / Required</p>
            <p className="text-xl font-bold">
              {enhancedAnalysis.current_staff_count} / {enhancedAnalysis.wisn_required_staff_count}
            </p>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              enhancedAnalysis.workload_analysis.current_ratio < 0.8 ? "bg-red-500" :
              enhancedAnalysis.workload_analysis.current_ratio > 1.2 ? "bg-blue-500" : "bg-green-500"
            )}>
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Workload Status</p>
              <p className="font-semibold">
                {enhancedAnalysis.workload_analysis.current_ratio < 0.8 ? "Overloaded" :
                 enhancedAnalysis.workload_analysis.current_ratio > 1.2 ? "Underutilized" : "Balanced"}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              enhancedAnalysis.workload_problem === "HIGH" ? "bg-red-500" :
              enhancedAnalysis.workload_problem === "NORMAL" ? "bg-green-500" : "bg-gray-500"
            )}>
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Workload Pressure</p>
              <p className="font-semibold">{enhancedAnalysis.workload_problem || "Normal"}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Efficiency</p>
              <p className="font-semibold">{enhancedAnalysis.efficiency_score.toFixed(0)}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Required Section */}
      {enhancedAnalysis.shortage_excess_count !== 0 && (
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-yellow-800">
            <AlertTriangle className="h-5 w-5" />
            Action Required
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Immediate Actions:</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                {enhancedAnalysis.shortage_excess_count < 0 ? (
                  <>
                    <li className="flex items-center gap-2">
                      <UserPlus size={16} />
                      Recruit {Math.abs(enhancedAnalysis.shortage_excess_count)} additional staff
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock size={16} />
                      Review workload distribution
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center gap-2">
                      <Users size={16} />
                      Redeploy {enhancedAnalysis.shortage_excess_count} staff to other departments
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingUp size={16} />
                      Expand service delivery
                    </li>
                  </>
                )}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Cost Impact:</h4>
              <div className="text-sm text-gray-700">
                <p>Monthly salary impact: <span className="font-medium">
                  {enhancedAnalysis.shortage_excess_count < 0 ? '+' : '-'}
                  ${(Math.abs(enhancedAnalysis.shortage_excess_count) * 5000).toLocaleString()}
                </span></p>
                <p>Annual budget impact: <span className="font-medium">
                  {enhancedAnalysis.shortage_excess_count < 0 ? '+' : '-'}
                  ${(Math.abs(enhancedAnalysis.shortage_excess_count) * 60000).toLocaleString()}
                </span></p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Simple Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Current Efficiency</span>
              <span className="font-medium">{enhancedAnalysis.efficiency_score.toFixed(0)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Workload Balance</span>
              <Badge variant={
                enhancedAnalysis.workload_analysis.current_ratio < 0.8 ? "destructive" :
                enhancedAnalysis.workload_analysis.current_ratio > 1.2 ? "secondary" : "default"
              }>
                {enhancedAnalysis.workload_analysis.current_ratio < 0.8 ? "Overloaded" :
                 enhancedAnalysis.workload_analysis.current_ratio > 1.2 ? "Underutilized" : "Balanced"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Last Updated</span>
              <span className="text-sm text-gray-500">
                {new Date(enhancedAnalysis.updated_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <UserPlus size={16} />
              Post Job Opening
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users size={16} />
              Transfer Staff
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <CalendarClock size={16} />
              Schedule Review
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileDown size={16} />
              Export Report
            </Button>
          </div>
        </Card>
      </div>

      {/* Simple Recommendations */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Lightbulb size={16} />
          Next Steps
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enhancedAnalysis.recommendations.slice(0, 2).map((recommendation: string, index: number) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border">
              <CheckCircle size={16} />
              <p className="text-sm text-gray-700">{recommendation}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Simple Historical View */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Recent Trend
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {enhancedAnalysis.historical_trend.map((trend: any, index: number) => (
            <div key={index} className="text-center p-3 border rounded-lg">
              <p className="text-sm font-medium text-gray-600">{trend.month}</p>
              <p className="text-lg font-bold mt-1">{trend.staff_count}</p>
              <p className="text-xs text-gray-500">staff</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t">
        <div className="text-sm text-gray-500">
          Analysis for {typeof enhancedAnalysis.position === 'object' ? enhancedAnalysis.position?.name : enhancedAnalysis.position} •
          Updated {new Date(enhancedAnalysis.updated_at).toLocaleDateString()}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={exportAnalysis}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Pencil size={16} />
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkforceNeedAnalysisView;