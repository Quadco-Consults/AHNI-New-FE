"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Heart,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Calendar,
  Activity,
  FileText,
  Wallet,
  CreditCard,
  BarChart3,
  Target,
} from "lucide-react";

// Mock data - Replace with actual API data
const healthData = {
  // Overall Health Score (0-100)
  overallHealthScore: 78,
  previousHealthScore: 72,
  scoreChange: 6,
  scoreStatus: "good", // excellent, good, fair, poor, critical

  // Health Components (each out of 100)
  healthComponents: {
    budgetCompliance: 85,
    liquidityRatio: 72,
    executionRate: 68,
    grantCompliance: 90,
    financialReporting: 95,
  },

  // Financial Metrics
  cashOnHand: 35000000,
  monthlyBurnRate: 8500000,
  runway: 4.1, // months
  currentRatio: 0.64,
  quickRatio: 0.52,
  debtToAssetRatio: 0.35,
  operatingMargin: 8.5,

  // Risk Indicators
  riskIndicators: [
    {
      category: "Liquidity",
      severity: "medium",
      score: 72,
      description: "Cash reserves below recommended 6-month runway",
      recommendation: "Accelerate receivables collection or secure bridge funding",
    },
    {
      category: "Execution Rate",
      severity: "medium",
      score: 68,
      description: "Budget execution rate lower than target (68% vs 75% target)",
      recommendation: "Review project timelines and expedite pending disbursements",
    },
    {
      category: "Upcoming Obligations",
      severity: "low",
      score: 85,
      description: "₦15.5M in obligations due in next 30 days",
      recommendation: "Monitor cash flow to ensure sufficient liquidity",
    },
  ],

  // KPIs
  kpis: [
    {
      name: "Budget Utilization",
      value: 62.8,
      target: 75,
      unit: "%",
      trend: "up",
      status: "warning",
    },
    {
      name: "Grant Compliance",
      value: 90,
      target: 85,
      unit: "%",
      trend: "up",
      status: "excellent",
    },
    {
      name: "Payment Turnaround",
      value: 12,
      target: 15,
      unit: "days",
      trend: "down",
      status: "good",
    },
    {
      name: "Reporting Accuracy",
      value: 95,
      target: 90,
      unit: "%",
      trend: "up",
      status: "excellent",
    },
  ],

  // Upcoming Financial Events
  upcomingEvents: [
    {
      date: "2024-02-15",
      type: "Grant Report Due",
      description: "Q1 Financial Report - Gates Foundation Grant",
      priority: "high",
    },
    {
      date: "2024-02-20",
      type: "Obligation Payment",
      description: "₦5.2M payment due to vendor (Training Services)",
      priority: "high",
    },
    {
      date: "2024-02-25",
      type: "Budget Review",
      description: "Quarterly budget review meeting",
      priority: "medium",
    },
    {
      date: "2024-03-01",
      type: "Compliance Deadline",
      description: "Monthly financial compliance submission",
      priority: "medium",
    },
  ],

  // Health Score Trend (last 6 months)
  healthScoreTrend: [
    { month: "Sep", score: 65 },
    { month: "Oct", score: 68 },
    { month: "Nov", score: 70 },
    { month: "Dec", score: 72 },
    { month: "Jan", score: 75 },
    { month: "Feb", score: 78 },
  ],
};

export default function FinancialHealthDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("current");

  // Helper function to get health score color
  const getHealthColor = (score: number): string => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  // Helper function to get health status badge
  const getHealthStatusBadge = (score: number) => {
    if (score >= 80)
      return (
        <Badge className="bg-green-100 text-green-700">Excellent Health</Badge>
      );
    if (score >= 60)
      return <Badge className="bg-yellow-100 text-yellow-700">Fair Health</Badge>;
    return <Badge className="bg-red-100 text-red-700">At Risk</Badge>;
  };

  // Helper function to get severity badge
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge variant="destructive">High Risk</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-700">Medium Risk</Badge>;
      case "low":
        return <Badge className="bg-blue-100 text-blue-700">Low Risk</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  // Helper function to get KPI status color
  const getKpiStatusColor = (status: string): string => {
    switch (status) {
      case "excellent":
        return "text-green-600";
      case "good":
        return "text-blue-600";
      case "warning":
        return "text-yellow-600";
      case "critical":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Financial Health Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive organizational financial health monitoring
          </p>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Current Period</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="ytd">Year to Date</SelectItem>
            <SelectItem value="annual">Annual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overall Health Score */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <Heart className="h-12 w-12 text-blue-600" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Overall Financial Health
                  </h2>
                  <p className="text-sm text-gray-600">
                    Composite score across 5 key dimensions
                  </p>
                </div>
              </div>
              <div className="flex items-end gap-4">
                <div
                  className={`text-7xl font-bold ${getHealthColor(healthData.overallHealthScore)}`}
                >
                  {healthData.overallHealthScore}
                </div>
                <div className="flex flex-col gap-2 mb-2">
                  <div>{getHealthStatusBadge(healthData.overallHealthScore)}</div>
                  <div className="flex items-center gap-1">
                    {healthData.scoreChange > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span
                      className={`text-sm font-semibold ${
                        healthData.scoreChange > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {healthData.scoreChange > 0 ? "+" : ""}
                      {healthData.scoreChange} points from last period
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Score Trend Mini Chart */}
            <div className="w-64">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                6-Month Trend
              </h3>
              <div className="flex items-end justify-between h-24 gap-1">
                {healthData.healthScoreTrend.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-blue-500 rounded-t"
                      style={{ height: `${item.score}%` }}
                    />
                    <span className="text-xs text-gray-600 mt-1">
                      {item.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Components Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Health Component Scores</CardTitle>
          <p className="text-sm text-gray-600">
            Individual scores for each health dimension
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Budget Compliance */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Budget Compliance</span>
              </div>
              <span
                className={`text-lg font-bold ${getHealthColor(healthData.healthComponents.budgetCompliance)}`}
              >
                {healthData.healthComponents.budgetCompliance}/100
              </span>
            </div>
            <Progress
              value={healthData.healthComponents.budgetCompliance}
              className="h-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Budget utilization within targets, variance within acceptable limits
            </p>
          </div>

          {/* Liquidity Ratio */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-green-600" />
                <span className="font-medium">Liquidity Ratio</span>
              </div>
              <span
                className={`text-lg font-bold ${getHealthColor(healthData.healthComponents.liquidityRatio)}`}
              >
                {healthData.healthComponents.liquidityRatio}/100
              </span>
            </div>
            <Progress
              value={healthData.healthComponents.liquidityRatio}
              className="h-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Cash reserves and ability to meet short-term obligations
            </p>
          </div>

          {/* Execution Rate */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-purple-600" />
                <span className="font-medium">Execution Rate</span>
              </div>
              <span
                className={`text-lg font-bold ${getHealthColor(healthData.healthComponents.executionRate)}`}
              >
                {healthData.healthComponents.executionRate}/100
              </span>
            </div>
            <Progress
              value={healthData.healthComponents.executionRate}
              className="h-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Speed of converting budgets to obligations to expenditures
            </p>
          </div>

          {/* Grant Compliance */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-orange-600" />
                <span className="font-medium">Grant Compliance</span>
              </div>
              <span
                className={`text-lg font-bold ${getHealthColor(healthData.healthComponents.grantCompliance)}`}
              >
                {healthData.healthComponents.grantCompliance}/100
              </span>
            </div>
            <Progress
              value={healthData.healthComponents.grantCompliance}
              className="h-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Adherence to donor requirements and grant terms
            </p>
          </div>

          {/* Financial Reporting */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-red-600" />
                <span className="font-medium">Financial Reporting</span>
              </div>
              <span
                className={`text-lg font-bold ${getHealthColor(healthData.healthComponents.financialReporting)}`}
              >
                {healthData.healthComponents.financialReporting}/100
              </span>
            </div>
            <Progress
              value={healthData.healthComponents.financialReporting}
              className="h-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Timeliness and accuracy of financial reports
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Cash on Hand */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash on Hand</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₦{(healthData.cashOnHand / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-gray-600 mt-1">Available liquid funds</p>
          </CardContent>
        </Card>

        {/* Monthly Burn Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Burn Rate</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              ₦{(healthData.monthlyBurnRate / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-gray-600 mt-1">Average monthly spend</p>
          </CardContent>
        </Card>

        {/* Runway */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Runway</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {healthData.runway} months
            </div>
            <p className="text-xs text-gray-600 mt-1">At current burn rate</p>
            {healthData.runway < 6 && (
              <Badge variant="destructive" className="mt-2 text-xs">
                Below 6-month target
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Current Ratio */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Ratio</CardTitle>
            <CreditCard className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {healthData.currentRatio.toFixed(2)}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Assets/Liabilities (target ≥ 1.0)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Risk Assessment & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {healthData.riskIndicators.map((risk, index) => (
              <div
                key={index}
                className="border-l-4 border-gray-200 pl-4 py-2"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-800">
                      {risk.category}
                    </h4>
                    {getSeverityBadge(risk.severity)}
                  </div>
                  <span className={`font-bold ${getHealthColor(risk.score)}`}>
                    Score: {risk.score}/100
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{risk.description}</p>
                <div className="flex items-start gap-2 bg-blue-50 p-3 rounded">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800">
                    <strong>Recommendation:</strong> {risk.recommendation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* KPIs Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {healthData.kpis.map((kpi, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">{kpi.name}</h4>
                  {kpi.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <span
                    className={`text-3xl font-bold ${getKpiStatusColor(kpi.status)}`}
                  >
                    {kpi.value}
                    {kpi.unit}
                  </span>
                  <span className="text-sm text-gray-600 mb-1">
                    Target: {kpi.target}
                    {kpi.unit}
                  </span>
                </div>
                <Progress
                  value={(kpi.value / kpi.target) * 100}
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Financial Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Upcoming Financial Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {healthData.upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-start gap-4 border-l-4 border-gray-200 pl-4 py-2"
              >
                <div className="flex-shrink-0 w-20">
                  <div className="text-sm font-semibold text-blue-600">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-800">{event.type}</h4>
                    <Badge
                      variant={
                        event.priority === "high" ? "destructive" : "secondary"
                      }
                    >
                      {event.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Financial Ratios */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Ratios & Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                Quick Ratio
              </h4>
              <div className="text-3xl font-bold text-blue-600">
                {healthData.quickRatio.toFixed(2)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Liquid assets / Current liabilities
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                Debt-to-Asset Ratio
              </h4>
              <div className="text-3xl font-bold text-purple-600">
                {healthData.debtToAssetRatio.toFixed(2)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Total debt / Total assets
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                Operating Margin
              </h4>
              <div className="text-3xl font-bold text-green-600">
                {healthData.operatingMargin.toFixed(1)}%
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Operating income / Revenue
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
