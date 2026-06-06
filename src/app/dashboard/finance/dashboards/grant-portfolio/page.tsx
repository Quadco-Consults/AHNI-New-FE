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
  Briefcase,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Calendar,
  Users,
  PieChart,
  BarChart3,
  Download,
  FileSpreadsheet,
} from "lucide-react";

// Mock data - Replace with actual API data
const portfolioData = {
  totalProjects: 12,
  activeProjects: 8,
  completedProjects: 3,
  onHoldProjects: 1,
  totalBudget: 125000000,
  totalSpent: 78500000,
  totalCommitted: 35000000,
  availableBudget: 11500000,
  budgetUtilization: 62.8,

  grantsByStatus: [
    { status: "Active", count: 8, amount: 95000000, color: "bg-green-500" },
    { status: "Completed", count: 3, amount: 25000000, color: "bg-blue-500" },
    { status: "On Hold", count: 1, amount: 5000000, color: "bg-yellow-500" },
  ],

  grantsByDonor: [
    { donor: "Bill & Melinda Gates Foundation", grants: 3, amount: 45000000 },
    { donor: "USAID", grants: 2, amount: 35000000 },
    { donor: "Global Fund", grants: 2, amount: 25000000 },
    { donor: "World Health Organization", grants: 2, amount: 15000000 },
    { donor: "Others", grants: 3, amount: 5000000 },
  ],

  topProjects: [
    {
      id: "1",
      title: "Malaria Prevention Initiative",
      budget: 45000000,
      spent: 32500000,
      committed: 8000000,
      available: 4500000,
      utilization: 72.2,
      donor: "Gates Foundation",
      endDate: "2026-12-31",
      status: "Active",
    },
    {
      id: "2",
      title: "TB Control Program",
      budget: 35000000,
      spent: 18500000,
      committed: 12000000,
      available: 4500000,
      utilization: 52.9,
      donor: "USAID",
      endDate: "2027-06-30",
      status: "Active",
    },
    {
      id: "3",
      title: "HIV/AIDS Awareness Campaign",
      budget: 25000000,
      spent: 16500000,
      committed: 6000000,
      available: 2500000,
      utilization: 66.0,
      donor: "Global Fund",
      endDate: "2026-09-30",
      status: "Active",
    },
    {
      id: "4",
      title: "Maternal Health Services",
      budget: 15000000,
      spent: 9000000,
      committed: 4000000,
      available: 2000000,
      utilization: 60.0,
      donor: "WHO",
      endDate: "2026-11-30",
      status: "Active",
    },
  ],

  monthlySpending: [
    { month: "Jan", spent: 6500000, budget: 10416667 },
    { month: "Feb", spent: 7200000, budget: 10416667 },
    { month: "Mar", spent: 8100000, budget: 10416667 },
    { month: "Apr", spent: 7800000, budget: 10416667 },
    { month: "May", spent: 8500000, budget: 10416667 },
    { month: "Jun", spent: 9200000, budget: 10416667 },
  ],
};

export default function GrantPortfolioDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("2026");

  const formatCurrency = (amount: number): string => {
    return `₦${amount.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; className: string }> = {
      Active: { variant: "default", className: "bg-green-500" },
      Completed: { variant: "default", className: "bg-blue-500" },
      "On Hold": { variant: "default", className: "bg-yellow-500" },
    };

    const config = variants[status] || { variant: "default", className: "" };

    return (
      <Badge className={`${config.className} text-white`}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Grant Portfolio Overview</h1>
          <p className="text-gray-600">
            Portfolio-wide financial overview across all grants and projects
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
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Grants</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{portfolioData.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {portfolioData.activeProjects} active, {portfolioData.completedProjects} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(portfolioData.totalBudget)}
            </div>
            <p className="text-xs text-muted-foreground">Combined budget</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {portfolioData.budgetUtilization.toFixed(1)}%
            </div>
            <Progress value={portfolioData.budgetUtilization} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Average across grants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Budget</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(portfolioData.availableBudget)}
            </div>
            <p className="text-xs text-muted-foreground">
              {((portfolioData.availableBudget / portfolioData.totalBudget) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Financial Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Budget:</span>
              <span className="font-bold">{formatCurrency(portfolioData.totalBudget)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-green-600">Spent:</span>
              <span className="font-bold text-green-600">
                {formatCurrency(portfolioData.totalSpent)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-yellow-600">Committed:</span>
              <span className="font-bold text-yellow-600">
                {formatCurrency(portfolioData.totalCommitted)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm font-medium text-orange-600">Available:</span>
              <span className="font-bold text-orange-600">
                {formatCurrency(portfolioData.availableBudget)}
              </span>
            </div>

            {/* Visual representation */}
            <div className="space-y-2 pt-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Spent</span>
                  <span>{((portfolioData.totalSpent / portfolioData.totalBudget) * 100).toFixed(1)}%</span>
                </div>
                <Progress
                  value={(portfolioData.totalSpent / portfolioData.totalBudget) * 100}
                  className="h-2 bg-green-100"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Committed</span>
                  <span>{((portfolioData.totalCommitted / portfolioData.totalBudget) * 100).toFixed(1)}%</span>
                </div>
                <Progress
                  value={(portfolioData.totalCommitted / portfolioData.totalBudget) * 100}
                  className="h-2 bg-yellow-100"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Grant Distribution by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {portfolioData.grantsByStatus.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm font-medium">{item.status}</span>
                    <Badge variant="outline" className="text-xs">
                      {item.count} {item.count === 1 ? "grant" : "grants"}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(item.amount)}</div>
                    <div className="text-xs text-gray-500">
                      {((item.amount / portfolioData.totalBudget) * 100).toFixed(1)}% of portfolio
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grants by Donor */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Portfolio Distribution by Donor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {portfolioData.grantsByDonor.map((donor, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">{donor.donor}</span>
                    <Badge variant="outline" className="text-xs">
                      {donor.grants} {donor.grants === 1 ? "grant" : "grants"}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(donor.amount)}</div>
                    <div className="text-xs text-gray-500">
                      {((donor.amount / portfolioData.totalBudget) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
                <Progress
                  value={(donor.amount / portfolioData.totalBudget) * 100}
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top Grants by Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Grant</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Donor</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">Budget</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">Spent</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">Available</th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-gray-600">Utilization</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">End Date</th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {portfolioData.topProjects.map((project) => (
                  <tr key={project.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <div className="font-medium text-sm">{project.title}</div>
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-600">{project.donor}</td>
                    <td className="py-3 px-2 text-right text-sm font-medium">
                      {formatCurrency(project.budget)}
                    </td>
                    <td className="py-3 px-2 text-right text-sm text-green-600">
                      {formatCurrency(project.spent)}
                    </td>
                    <td className="py-3 px-2 text-right text-sm text-orange-600">
                      {formatCurrency(project.available)}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-medium mb-1">
                          {project.utilization.toFixed(1)}%
                        </span>
                        <Progress value={project.utilization} className="w-20 h-1.5" />
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{project.endDate}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      {getStatusBadge(project.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Spending Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Monthly Spending Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {portfolioData.monthlySpending.map((month) => (
              <div key={month.month} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{month.month} 2026</span>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Spent</div>
                      <div className="text-sm font-semibold text-green-600">
                        {formatCurrency(month.spent)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Budget</div>
                      <div className="text-sm font-semibold">
                        {formatCurrency(month.budget)}
                      </div>
                    </div>
                    <div className="text-right min-w-[60px]">
                      <div className="text-xs font-semibold">
                        {((month.spent / month.budget) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <div className="flex-1">
                    <Progress
                      value={(month.spent / month.budget) * 100}
                      className="h-2"
                    />
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
            <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Dashboard Data Source</h3>
              <p className="text-sm text-blue-700">
                This dashboard aggregates data from the Projects module and Finance transactions.
                Backend API endpoint: <code className="bg-blue-100 px-2 py-0.5 rounded text-xs">
                  /api/v1/finance/dashboards/grant-portfolio/
                </code>
              </p>
              <p className="text-xs text-blue-600 mt-2">
                Data is updated in real-time as transactions are posted and budgets are modified.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
