"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GitBranch,
  DollarSign,
  TrendingUp,
  Activity,
  ArrowRight,
  FileText,
  Receipt,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  FileSpreadsheet,
} from "lucide-react";

// Mock data - Replace with actual API data
const pipelineData = {
  // Stage 1: Budget
  totalBudget: 125000000,
  budgetByStatus: {
    approved: 125000000,
    draft: 0,
  },

  // Stage 2: Obligations (Budget Commitments)
  totalObligations: 95000000,
  obligationsByStatus: {
    active: 75000000,
    fully_liquidated: 20000000,
    draft: 0,
  },
  unliquidatedObligations: 55000000,

  // Stage 3: Disbursements (Payments Made)
  totalDisbursements: 40000000,
  disbursementsByStatus: {
    completed: 38000000,
    pending: 2000000,
  },

  // Stage 4: Expenditures (Recorded in Books)
  totalExpenditures: 38000000,
  expendituresByStatus: {
    posted: 35000000,
    pending_approval: 3000000,
  },

  // Pipeline Metrics
  obligationRate: 76.0, // Budget → Obligations
  liquidationRate: 42.1, // Obligations → Disbursements
  disbursementRate: 32.0, // Budget → Disbursements
  expenditureRate: 30.4, // Budget → Expenditures
  postingRate: 95.0, // Disbursements → Posted Expenditures

  // Available/Unspent
  availableBudget: 30000000, // Budget - Obligations
  pendingPayments: 55000000, // Obligations - Disbursements
  unpostedDisbursements: 2000000, // Disbursements - Posted Expenditures

  // Monthly Pipeline Flow
  monthlyPipeline: [
    {
      month: "Jan",
      budget: 10416667,
      obligations: 8000000,
      disbursements: 3500000,
      expenditures: 3300000,
    },
    {
      month: "Feb",
      budget: 10416667,
      obligations: 8500000,
      disbursements: 4000000,
      expenditures: 3800000,
    },
    {
      month: "Mar",
      budget: 10416667,
      obligations: 9000000,
      disbursements: 4500000,
      expenditures: 4200000,
    },
    {
      month: "Apr",
      budget: 10416667,
      obligations: 7500000,
      disbursements: 4200000,
      expenditures: 4000000,
    },
    {
      month: "May",
      budget: 10416667,
      obligations: 8200000,
      disbursements: 5000000,
      expenditures: 4800000,
    },
    {
      month: "Jun",
      budget: 10416667,
      obligations: 8800000,
      disbursements: 5300000,
      expenditures: 5100000,
    },
  ],

  // Pipeline Bottlenecks
  bottlenecks: [
    {
      stage: "Obligations → Disbursements",
      amount: 55000000,
      count: 42,
      severity: "high",
      description: "₦55M in obligations awaiting liquidation",
    },
    {
      stage: "Disbursements → Expenditures",
      amount: 2000000,
      count: 8,
      severity: "low",
      description: "₦2M in disbursements not yet posted",
    },
  ],

  // Top Projects in Pipeline
  topProjects: [
    {
      project: "Malaria Prevention Initiative",
      budget: 45000000,
      obligations: 35000000,
      disbursements: 15000000,
      expenditures: 14500000,
    },
    {
      project: "TB Control Program",
      budget: 35000000,
      obligations: 28000000,
      disbursements: 12000000,
      expenditures: 11500000,
    },
    {
      project: "HIV/AIDS Awareness",
      budget: 25000000,
      obligations: 20000000,
      disbursements: 8000000,
      expenditures: 7800000,
    },
  ],
};

export default function FinancialPipelineDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("2026");

  const formatCurrency = (amount: number): string => {
    return `₦${(amount / 1000000).toFixed(1)}M`;
  };

  const formatCurrencyFull = (amount: number): string => {
    return `₦${amount.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Pipeline Dashboard</h1>
          <p className="text-gray-600">
            Budget → Obligations → Disbursements → Expenditures flow analysis
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2026">2026</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export Pipeline
          </Button>
        </div>
      </div>

      {/* Pipeline Stages - Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Budget</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrencyFull(pipelineData.totalBudget)}
            </div>
            <p className="text-xs text-blue-700 mt-1">Stage 1: Approved budget</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Obligations</CardTitle>
            <GitBranch className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrencyFull(pipelineData.totalObligations)}
            </div>
            <p className="text-xs text-purple-700 mt-1">
              Stage 2: {pipelineData.obligationRate.toFixed(1)}% of budget
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Disbursements</CardTitle>
            <CreditCard className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrencyFull(pipelineData.totalDisbursements)}
            </div>
            <p className="text-xs text-green-700 mt-1">
              Stage 3: {pipelineData.disbursementRate.toFixed(1)}% of budget
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Expenditures</CardTitle>
            <Receipt className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrencyFull(pipelineData.totalExpenditures)}
            </div>
            <p className="text-xs text-orange-700 mt-1">
              Stage 4: {pipelineData.expenditureRate.toFixed(1)}% of budget
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Flow Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pipeline Flow & Conversion Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Stage Flow */}
            <div className="flex items-center justify-between">
              {/* Budget */}
              <div className="text-center flex-1">
                <div className="bg-blue-100 rounded-lg p-4">
                  <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-blue-900">
                    {formatCurrency(pipelineData.totalBudget)}
                  </div>
                  <div className="text-xs text-blue-700">Budget</div>
                </div>
              </div>

              <ArrowRight className="h-6 w-6 text-gray-400 mx-2" />

              {/* Obligations */}
              <div className="text-center flex-1">
                <div className="text-xs font-semibold text-purple-600 mb-1">
                  {pipelineData.obligationRate.toFixed(1)}%
                </div>
                <div className="bg-purple-100 rounded-lg p-4">
                  <GitBranch className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-purple-900">
                    {formatCurrency(pipelineData.totalObligations)}
                  </div>
                  <div className="text-xs text-purple-700">Obligations</div>
                </div>
              </div>

              <ArrowRight className="h-6 w-6 text-gray-400 mx-2" />

              {/* Disbursements */}
              <div className="text-center flex-1">
                <div className="text-xs font-semibold text-green-600 mb-1">
                  {pipelineData.liquidationRate.toFixed(1)}%
                </div>
                <div className="bg-green-100 rounded-lg p-4">
                  <CreditCard className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-green-900">
                    {formatCurrency(pipelineData.totalDisbursements)}
                  </div>
                  <div className="text-xs text-green-700">Disbursements</div>
                </div>
              </div>

              <ArrowRight className="h-6 w-6 text-gray-400 mx-2" />

              {/* Expenditures */}
              <div className="text-center flex-1">
                <div className="text-xs font-semibold text-orange-600 mb-1">
                  {pipelineData.postingRate.toFixed(1)}%
                </div>
                <div className="bg-orange-100 rounded-lg p-4">
                  <Receipt className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-orange-900">
                    {formatCurrency(pipelineData.totalExpenditures)}
                  </div>
                  <div className="text-xs text-orange-700">Expenditures</div>
                </div>
              </div>
            </div>

            {/* Conversion Metrics */}
            <div className="grid grid-cols-4 gap-4 pt-4 border-t">
              <div>
                <div className="text-xs text-gray-500 mb-1">Available Budget</div>
                <div className="font-bold text-blue-600">
                  {formatCurrencyFull(pipelineData.availableBudget)}
                </div>
                <div className="text-xs text-gray-500">
                  {((pipelineData.availableBudget / pipelineData.totalBudget) * 100).toFixed(1)}% unobligated
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-1">Pending Payments</div>
                <div className="font-bold text-purple-600">
                  {formatCurrencyFull(pipelineData.pendingPayments)}
                </div>
                <div className="text-xs text-gray-500">
                  {((pipelineData.pendingPayments / pipelineData.totalObligations) * 100).toFixed(1)}% unliquidated
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-1">Liquidation Rate</div>
                <div className="font-bold text-green-600">
                  {pipelineData.liquidationRate.toFixed(1)}%
                </div>
                <Progress value={pipelineData.liquidationRate} className="mt-1 h-1.5" />
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-1">Posting Rate</div>
                <div className="font-bold text-orange-600">
                  {pipelineData.postingRate.toFixed(1)}%
                </div>
                <Progress value={pipelineData.postingRate} className="mt-1 h-1.5" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Bottlenecks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span>Pipeline Bottlenecks & Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pipelineData.bottlenecks.map((bottleneck, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  bottleneck.severity === "high"
                    ? "bg-red-50 border-red-200"
                    : "bg-yellow-50 border-yellow-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle
                      className={`h-5 w-5 ${
                        bottleneck.severity === "high" ? "text-red-600" : "text-yellow-600"
                      }`}
                    />
                    <div>
                      <div className="font-semibold text-sm">{bottleneck.stage}</div>
                      <div className="text-xs text-gray-600">{bottleneck.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={bottleneck.severity === "high" ? "destructive" : "default"}
                      className={bottleneck.severity === "low" ? "bg-yellow-500" : ""}
                    >
                      {bottleneck.count} items
                    </Badge>
                    <div className="text-sm font-bold mt-1">
                      {formatCurrencyFull(bottleneck.amount)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Pipeline Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Monthly Pipeline Flow (2026)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pipelineData.monthlyPipeline.map((month) => (
              <div key={month.month} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{month.month}</span>
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="text-right">
                      <div className="text-gray-500">Budget</div>
                      <div className="font-semibold">{formatCurrency(month.budget)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-purple-600">Obligations</div>
                      <div className="font-semibold">{formatCurrency(month.obligations)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600">Disbursements</div>
                      <div className="font-semibold">{formatCurrency(month.disbursements)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-orange-600">Expenditures</div>
                      <div className="font-semibold">{formatCurrency(month.expenditures)}</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  <Progress
                    value={100}
                    className="h-2 bg-blue-200"
                  />
                  <Progress
                    value={(month.obligations / month.budget) * 100}
                    className="h-2 bg-purple-200"
                  />
                  <Progress
                    value={(month.disbursements / month.budget) * 100}
                    className="h-2 bg-green-200"
                  />
                  <Progress
                    value={(month.expenditures / month.budget) * 100}
                    className="h-2 bg-orange-200"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Projects Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top Projects - Pipeline Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pipelineData.topProjects.map((project, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="font-semibold mb-3">{project.project}</div>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Budget</div>
                    <div className="font-bold text-blue-600">
                      {formatCurrency(project.budget)}
                    </div>
                    <Progress value={100} className="mt-1 h-1 bg-blue-200" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Obligations</div>
                    <div className="font-bold text-purple-600">
                      {formatCurrency(project.obligations)}
                    </div>
                    <Progress
                      value={(project.obligations / project.budget) * 100}
                      className="mt-1 h-1 bg-purple-200"
                    />
                    <div className="text-xs text-gray-500 mt-0.5">
                      {((project.obligations / project.budget) * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Disbursements</div>
                    <div className="font-bold text-green-600">
                      {formatCurrency(project.disbursements)}
                    </div>
                    <Progress
                      value={(project.disbursements / project.budget) * 100}
                      className="mt-1 h-1 bg-green-200"
                    />
                    <div className="text-xs text-gray-500 mt-0.5">
                      {((project.disbursements / project.budget) * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Expenditures</div>
                    <div className="font-bold text-orange-600">
                      {formatCurrency(project.expenditures)}
                    </div>
                    <Progress
                      value={(project.expenditures / project.budget) * 100}
                      className="mt-1 h-1 bg-orange-200"
                    />
                    <div className="text-xs text-gray-500 mt-0.5">
                      {((project.expenditures / project.budget) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">About Financial Pipeline</h3>
              <p className="text-sm text-blue-700 mb-2">
                The Financial Pipeline tracks the flow of funds from budget approval through to actual expenditures,
                helping identify bottlenecks and improve financial execution rates.
              </p>
              <div className="text-xs text-blue-600 space-y-1">
                <div>• <strong>Budget</strong>: Approved project budgets</div>
                <div>• <strong>Obligations</strong>: Committed funds (purchase orders, contracts)</div>
                <div>• <strong>Disbursements</strong>: Actual payments made</div>
                <div>• <strong>Expenditures</strong>: Posted transactions in accounting books</div>
              </div>
              <p className="text-xs text-blue-600 mt-3">
                Backend API: <code className="bg-blue-100 px-2 py-0.5 rounded">
                  /api/v1/finance/dashboards/financial-pipeline/
                </code>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
