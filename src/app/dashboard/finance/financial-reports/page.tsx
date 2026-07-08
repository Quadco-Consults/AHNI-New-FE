"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  FileText,
  TrendingUp,
  Users,
  BarChart3,
  FileBarChart,
  Calculator,
  DollarSign,
  ArrowRight,
} from "lucide-react";

export default function FinancialReportsPage() {
  const router = useRouter();

  const reports = [
    {
      title: "Balance Sheet",
      description: "Statement of Financial Position showing assets, liabilities, and net assets",
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      path: "/dashboard/finance/reports/balance-sheet",
      color: "bg-blue-50 hover:bg-blue-100",
      features: ["Interactive charts", "PDF export", "Print-friendly", "Project filtering"],
    },
    {
      title: "Income Statement",
      description: "Statement of Comprehensive Income showing revenue and expenses",
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      path: "/dashboard/finance/reports/income-statement",
      color: "bg-green-50 hover:bg-green-100",
      features: ["Revenue breakdown", "Expense analysis", "Net surplus calculation", "Date range filtering"],
    },
    {
      title: "Donor Financial Report",
      description: "Project-specific financial summaries for donor reporting",
      icon: <Users className="w-8 h-8 text-purple-600" />,
      path: "/dashboard/finance/reports/donor-report",
      color: "bg-purple-50 hover:bg-purple-100",
      features: ["Executive summary", "Key metrics", "Project health assessment", "Monthly reporting"],
    },
    {
      title: "Trial Balance",
      description: "Detailed listing of all account balances",
      icon: <Calculator className="w-8 h-8 text-orange-600" />,
      path: "/dashboard/finance/reports/trial-balance",
      color: "bg-orange-50 hover:bg-orange-100",
      features: ["Account balances", "Debit/Credit totals", "Period comparison"],
    },
    {
      title: "General Ledger",
      description: "Complete record of all financial transactions",
      icon: <FileBarChart className="w-8 h-8 text-indigo-600" />,
      path: "/dashboard/finance/reports/general-ledger",
      color: "bg-indigo-50 hover:bg-indigo-100",
      features: ["Transaction history", "Account details", "Journal entries"],
    },
    {
      title: "Budget Variance",
      description: "Compare actual performance against budgeted amounts",
      icon: <BarChart3 className="w-8 h-8 text-red-600" />,
      path: "/dashboard/finance/reports/budget-variance",
      color: "bg-red-50 hover:bg-red-100",
      features: ["Budget vs Actuals", "Variance analysis", "Performance tracking"],
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <DollarSign className="w-8 h-8" />
          Financial Reports
        </h1>
        <p className="text-gray-600 mt-2">
          Access comprehensive financial statements and analysis reports
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Available Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Real-time financial data
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Data Source
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Live API</div>
            <p className="text-xs text-muted-foreground mt-1">
              Connected to backend
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Export Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PDF & Print</div>
            <p className="text-xs text-muted-foreground mt-1">
              Professional formats
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <Card
            key={report.path}
            className={`${report.color} border-2 transition-all duration-200 cursor-pointer`}
          >
            <CardHeader onClick={() => router.push(report.path)}>
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-lg bg-white shadow-sm">
                  {report.icon}
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
              <CardTitle className="mt-4">{report.title}</CardTitle>
              <CardDescription className="text-sm">
                {report.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2" onClick={() => router.push(report.path)}>
                <p className="text-xs font-medium text-gray-600 mb-2">Features:</p>
                {report.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    {feature}
                  </div>
                ))}
              </div>
              <Button
                className="w-full mt-4"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(report.path);
                }}
              >
                View Report
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg">About Financial Reports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-700">
          <p>
            <strong>Real-time Data:</strong> All reports are connected to live backend APIs and display current financial data from your accounting system.
          </p>
          <p>
            <strong>IFRS Compliant:</strong> Financial statements follow International Financial Reporting Standards for NGO accounting.
          </p>
          <p>
            <strong>Automatic Revenue Recognition:</strong> Grant revenue is automatically recognized as expenses are incurred, ensuring accurate financial reporting.
          </p>
          <p>
            <strong>Export Options:</strong> Download professional PDF reports or print directly from your browser with optimized layouts.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
