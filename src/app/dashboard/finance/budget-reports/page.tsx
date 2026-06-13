"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, Download, TrendingUp, TrendingDown, DollarSign, Calendar, FileText, AlertTriangle, CheckCircle } from "lucide-react";
import DataTable from "@/components/DataTable";

const BudgetReportsPage = () => {
  const [selectedProject, setSelectedProject] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("current-year");

  // Budget data based on AHNI's actual structure
  const budgetData = {
    totalBudget: 194000000.00,
    cumulativeExpenses: 36536127.57,
    currentMonthExpenses: 2359181.29,
    remainingBudget: 155104691.14,
    annualWorkplan: 61000000.00,
    annualExpenditure: 38895308.86,
    remainingForYear: 22104691.14,
    utilizationPercentage: 18.8,
    workplanUtilization: 63.7,
  };

  const budgetCategories = [
    {
      id: "1",
      category: "Personnel Cost",
      cdcApprovedBudget: 75667440.00,
      cumulativeExpenses: 14812087.03,
      currentMonthExpenses: 1924680.22,
      remainingBalance: 58930672.75,
      annualWorkplan: 31416860.00,
      annualExpenditure: 16736767.25,
      remainingForYear: 14680092.75,
      utilizationRate: 19.6,
      status: "On Track",
    },
    {
      id: "2",
      category: "Fringe",
      cdcApprovedBudget: 10961760.00,
      cumulativeExpenses: 1853641.99,
      currentMonthExpenses: 303333.55,
      remainingBalance: 8804784.46,
      annualWorkplan: 2740440.00,
      annualExpenditure: 2156975.54,
      remainingForYear: 583464.46,
      utilizationRate: 16.9,
      status: "On Track",
    },
    {
      id: "3",
      category: "Travels",
      cdcApprovedBudget: 6205350.00,
      cumulativeExpenses: 898235.49,
      currentMonthExpenses: 0.00,
      remainingBalance: 5307114.51,
      annualWorkplan: 1551350.00,
      annualExpenditure: 898235.49,
      remainingForYear: 653114.51,
      utilizationRate: 14.5,
      status: "Under Budget",
    },
    {
      id: "4",
      category: "Equipment",
      cdcApprovedBudget: 0.00,
      cumulativeExpenses: 0.00,
      currentMonthExpenses: 0.00,
      remainingBalance: 0.00,
      annualWorkplan: 0.00,
      annualExpenditure: 0.00,
      remainingForYear: 0.00,
      utilizationRate: 0.0,
      status: "Not Applicable",
    },
    {
      id: "5",
      category: "Supplies",
      cdcApprovedBudget: 20487290.00,
      cumulativeExpenses: 4995699.20,
      currentMonthExpenses: 41500.51,
      remainingBalance: 15450090.29,
      annualWorkplan: 5121822.50,
      annualExpenditure: 5037199.71,
      remainingForYear: 84622.79,
      utilizationRate: 24.4,
      status: "High Utilization",
    },
    {
      id: "6",
      category: "Consultant",
      cdcApprovedBudget: 0.00,
      cumulativeExpenses: 0.00,
      currentMonthExpenses: 0.00,
      remainingBalance: 0.00,
      annualWorkplan: 0.00,
      annualExpenditure: 0.00,
      remainingForYear: 0.00,
      utilizationRate: 0.0,
      status: "Not Applicable",
    },
    {
      id: "7",
      category: "Contractual",
      cdcApprovedBudget: 0.00,
      cumulativeExpenses: 0.00,
      currentMonthExpenses: 0.00,
      remainingBalance: 0.00,
      annualWorkplan: 0.00,
      annualExpenditure: 0.00,
      remainingForYear: 0.00,
      utilizationRate: 0.0,
      status: "Not Applicable",
    },
    {
      id: "8",
      category: "Other Direct Cost",
      cdcApprovedBudget: 80678160.00,
      cumulativeExpenses: 13976463.86,
      currentMonthExpenses: 89667.01,
      remainingBalance: 66612029.13,
      annualWorkplan: 20169527.50,
      annualExpenditure: 14066130.87,
      remainingForYear: 6103396.63,
      utilizationRate: 17.3,
      status: "On Track",
    },
    {
      id: "9",
      category: "Indirect Cost",
      cdcApprovedBudget: 0.00,
      cumulativeExpenses: 0.00,
      currentMonthExpenses: 0.00,
      remainingBalance: 0.00,
      annualWorkplan: 0.00,
      annualExpenditure: 0.00,
      remainingForYear: 0.00,
      utilizationRate: 0.0,
      status: "Not Applicable",
    },
  ];

  const budgetColumns = [
    {
      accessorKey: "category",
      header: "Budget Cost Category",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.getValue("category")}
        </div>
      ),
    },
    {
      accessorKey: "cdcApprovedBudget",
      header: "CDC Approved Budget (₦)",
      cell: ({ row }) => (
        <div className="text-right font-mono">
          ₦{row.getValue("cdcApprovedBudget").toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "cumulativeExpenses",
      header: "Cumulative Expenses (₦)",
      cell: ({ row }) => (
        <div className="text-right font-mono">
          ₦{row.getValue("cumulativeExpenses").toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "currentMonthExpenses",
      header: "Current Month (₦)",
      cell: ({ row }) => (
        <div className="text-right font-mono">
          ₦{row.getValue("currentMonthExpenses").toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "remainingBalance",
      header: "Remaining Balance (₦)",
      cell: ({ row }) => (
        <div className="text-right font-mono text-green-600">
          ₦{row.getValue("remainingBalance").toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "utilizationRate",
      header: "Utilization %",
      cell: ({ row }) => {
        const rate = row.getValue("utilizationRate");
        return (
          <div className="text-center">
            <Badge
              variant={rate > 25 ? "destructive" : rate > 15 ? "secondary" : "default"}
            >
              {rate}%
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        const getStatusIcon = () => {
          switch (status) {
            case "On Track":
              return <CheckCircle className="h-4 w-4" />;
            case "High Utilization":
              return <AlertTriangle className="h-4 w-4" />;
            default:
              return <CheckCircle className="h-4 w-4" />;
          }
        };
        return (
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <Badge
              variant={
                status === "High Utilization"
                  ? "destructive"
                  : status === "On Track"
                  ? "default"
                  : "secondary"
              }
            >
              {status}
            </Badge>
          </div>
        );
      },
    },
  ];

  const workplanColumns = [
    {
      accessorKey: "category",
      header: "Budget Category",
    },
    {
      accessorKey: "annualWorkplan",
      header: "Annual Workplan (₦)",
      cell: ({ row }) => (
        <div className="text-right font-mono">
          ₦{row.getValue("annualWorkplan").toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "annualExpenditure",
      header: "Annual Expenditure (₦)",
      cell: ({ row }) => (
        <div className="text-right font-mono">
          ₦{row.getValue("annualExpenditure").toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "remainingForYear",
      header: "Remaining for Year (₦)",
      cell: ({ row }) => (
        <div className="text-right font-mono text-blue-600">
          ₦{row.getValue("remainingForYear").toLocaleString()}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budget Reports</h1>
          <p className="text-muted-foreground">
            CDC approved budget tracking and utilization analysis
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            <SelectItem value="cdc-sharp">CDC SHARP+</SelectItem>
            <SelectItem value="global-fund">Global Fund</SelectItem>
            <SelectItem value="sidhas">SIDHAS</SelectItem>
            <SelectItem value="acebay">ACEBAY</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current-year">Current Year</SelectItem>
            <SelectItem value="current-quarter">Current Quarter</SelectItem>
            <SelectItem value="current-month">Current Month</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{budgetData.totalBudget.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              CDC Approved Budget
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cumulative Expenses</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{budgetData.cumulativeExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {budgetData.utilizationPercentage}% of total budget
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining Budget</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₦{budgetData.remainingBudget.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Available for expenditure
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workplan Utilization</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {budgetData.workplanUtilization}%
            </div>
            <p className="text-xs text-muted-foreground">
              Of annual workplan
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="budget-utilization" className="space-y-4">
        <TabsList>
          <TabsTrigger value="budget-utilization">Budget Utilization</TabsTrigger>
          <TabsTrigger value="workplan-tracking">Workplan Tracking</TabsTrigger>
          <TabsTrigger value="variance-analysis">Variance Analysis</TabsTrigger>
          <TabsTrigger value="forecasting">Budget Forecasting</TabsTrigger>
        </TabsList>

        <TabsContent value="budget-utilization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Utilization by Category</CardTitle>
              <CardDescription>
                Detailed breakdown of CDC approved budget vs actual expenses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={budgetColumns} data={budgetCategories} />

              {/* Total Row */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-7 gap-4 text-sm font-bold">
                  <div>TOTAL</div>
                  <div className="text-right">₦194,000,000.00</div>
                  <div className="text-right">₦36,536,127.57</div>
                  <div className="text-right">₦2,359,181.29</div>
                  <div className="text-right text-green-600">₦155,104,691.14</div>
                  <div className="text-center">18.8%</div>
                  <div>Overall Status</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workplan-tracking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Annual Workplan vs Expenditure</CardTitle>
              <CardDescription>
                Compare annual workplan allocations with actual expenditures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={workplanColumns} data={budgetCategories.filter((cat: any) => cat.annualWorkplan > 0)} />

              {/* Workplan Summary */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Annual Workplan</div>
                  <div className="text-2xl font-bold text-blue-700">
                    ₦{budgetData.annualWorkplan.toLocaleString()}
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">Annual Expenditure</div>
                  <div className="text-2xl font-bold text-green-700">
                    ₦{budgetData.annualExpenditure.toLocaleString()}
                  </div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-sm text-orange-600 font-medium">Remaining for Year</div>
                  <div className="text-2xl font-bold text-orange-700">
                    ₦{budgetData.remainingForYear.toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variance-analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Variance Analysis</CardTitle>
              <CardDescription>
                Identify significant variances between planned and actual spending
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetCategories.filter((cat: any) => cat.cdcApprovedBudget > 0).map((category) => {
                  const variance = category.cumulativeExpenses - (category.cdcApprovedBudget * 0.25); // Expected 25% utilization
                  const variancePercent = (variance / (category.cdcApprovedBudget * 0.25)) * 100;

                  return (
                    <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{category.category}</div>
                        <div className="text-sm text-gray-600">
                          Expected: ₦{(category.cdcApprovedBudget * 0.25).toLocaleString()} |
                          Actual: ₦{category.cumulativeExpenses.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${variance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {variance > 0 ? '+' : ''}₦{Math.abs(variance).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          {variancePercent > 0 ? '+' : ''}{variancePercent.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Forecasting</CardTitle>
              <CardDescription>
                Projected spending and budget exhaustion timelines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Spending Trend Analysis</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Current monthly burn rate:</span>
                      <span className="font-medium">₦{budgetData.currentMonthExpenses.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Projected annual spending:</span>
                      <span className="font-medium">₦{(budgetData.currentMonthExpenses * 12).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Budget exhaustion timeline:</span>
                      <span className="font-medium text-green-600">
                        {Math.round(budgetData.remainingBudget / budgetData.currentMonthExpenses)} months
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Recommendations</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Personnel costs are within expected range</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <span>Monitor supplies spending closely</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Travel budget has room for increased activity</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BudgetReportsPage;