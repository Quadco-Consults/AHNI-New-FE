"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, PieChart as PieChartIcon } from "lucide-react";

const COLORS = {
  assets: "#2563eb",      // Blue
  liabilities: "#dc2626", // Red
  equity: "#16a34a",      // Green
  revenue: "#16a34a",     // Green
  expenses: "#dc2626",    // Red
};

const ACCOUNT_COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
  "#ec4899", "#14b8a6", "#f97316", "#06b6d4", "#84cc16",
];

interface ChartAccount {
  account_code: string;
  account_name: string;
  balance?: number;
  amount?: number;
}

interface BalanceSheetData {
  assets?: { accounts: ChartAccount[] };
  liabilities?: { accounts: ChartAccount[] };
  equity?: { accounts: ChartAccount[] };
  total_assets?: number;
  total_liabilities?: number;
  total_equity?: number;
}

interface IncomeStatementData {
  revenue?: { accounts: ChartAccount[] };
  expenses?: { accounts: ChartAccount[] };
  total_revenue?: number;
  total_expenses?: number;
}

export function BalanceSheetPieChart({ data }: { data: BalanceSheetData }) {
  const chartData = [
    {
      name: "Assets",
      value: data.total_assets || 0,
      color: COLORS.assets,
    },
    {
      name: "Liabilities",
      value: data.total_liabilities || 0,
      color: COLORS.liabilities,
    },
    {
      name: "Net Assets",
      value: data.total_equity || 0,
      color: COLORS.equity,
    },
  ].filter(item => item.value > 0);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="w-5 h-5" />
            Balance Sheet Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">No data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="w-5 h-5" />
          Balance Sheet Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(1)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) =>
                `₦${Number(value).toLocaleString("en-NG", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              }
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function AssetsBreakdownChart({ data }: { data: BalanceSheetData }) {
  const chartData =
    data.assets?.accounts
      .map((account, index) => ({
        name: account.account_name.length > 20
          ? account.account_name.substring(0, 20) + "..."
          : account.account_name,
        value: account.balance || 0,
        color: ACCOUNT_COLORS[index % ACCOUNT_COLORS.length],
      }))
      .filter(item => item.value > 0)
      .slice(0, 10) || []; // Top 10 accounts

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Card className="print:hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Top Assets by Value
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis
              tickFormatter={(value) =>
                `₦${(value / 1000000).toFixed(1)}M`
              }
            />
            <Tooltip
              formatter={(value) =>
                `₦${Number(value).toLocaleString("en-NG", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              }
            />
            <Bar dataKey="value" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function LiabilitiesEquityChart({ data }: { data: BalanceSheetData }) {
  const liabilitiesData =
    data.liabilities?.accounts.map((account, index) => ({
      name: account.account_name.length > 20
        ? account.account_name.substring(0, 20) + "..."
        : account.account_name,
      value: account.balance || 0,
      type: "Liability",
      color: COLORS.liabilities,
    })) || [];

  const equityData =
    data.equity?.accounts.map((account, index) => ({
      name: account.account_name.length > 20
        ? account.account_name.substring(0, 20) + "..."
        : account.account_name,
      value: account.balance || 0,
      type: "Equity",
      color: COLORS.equity,
    })) || [];

  const chartData = [...liabilitiesData, ...equityData].filter(
    (item) => item.value > 0
  );

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Card className="print:hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-red-600" />
          Liabilities & Equity Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis
              tickFormatter={(value) =>
                `₦${(value / 1000000).toFixed(1)}M`
              }
            />
            <Tooltip
              formatter={(value) =>
                `₦${Number(value).toLocaleString("en-NG", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              }
            />
            <Bar dataKey="value" fill="#dc2626" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function RevenueExpensesPieChart({ data }: { data: IncomeStatementData }) {
  const chartData = [
    {
      name: "Revenue",
      value: data.total_revenue || 0,
      color: COLORS.revenue,
    },
    {
      name: "Expenses",
      value: data.total_expenses || 0,
      color: COLORS.expenses,
    },
  ].filter(item => item.value > 0);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="w-5 h-5" />
            Revenue vs Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">No data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="print:hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="w-5 h-5" />
          Revenue vs Expenses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(1)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) =>
                `₦${Number(value).toLocaleString("en-NG", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              }
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function RevenueBreakdownChart({ data }: { data: IncomeStatementData }) {
  const chartData =
    data.revenue?.accounts
      .map((account, index) => ({
        name: account.account_name.length > 20
          ? account.account_name.substring(0, 20) + "..."
          : account.account_name,
        value: account.amount || 0,
        color: ACCOUNT_COLORS[index % ACCOUNT_COLORS.length],
      }))
      .filter(item => item.value > 0)
      .slice(0, 10) || [];

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Card className="print:hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Revenue by Source
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis
              tickFormatter={(value) =>
                `₦${(value / 1000000).toFixed(1)}M`
              }
            />
            <Tooltip
              formatter={(value) =>
                `₦${Number(value).toLocaleString("en-NG", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              }
            />
            <Bar dataKey="value" fill="#16a34a" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ExpensesBreakdownChart({ data }: { data: IncomeStatementData }) {
  const chartData =
    data.expenses?.accounts
      .map((account, index) => ({
        name: account.account_name.length > 20
          ? account.account_name.substring(0, 20) + "..."
          : account.account_name,
        value: account.amount || 0,
        color: ACCOUNT_COLORS[index % ACCOUNT_COLORS.length],
      }))
      .filter(item => item.value > 0)
      .slice(0, 10) || []; // Top 10 expenses

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Card className="print:hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-red-600" />
          Top Expenses by Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis
              tickFormatter={(value) =>
                `₦${(value / 1000000).toFixed(1)}M`
              }
            />
            <Tooltip
              formatter={(value) =>
                `₦${Number(value).toLocaleString("en-NG", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              }
            />
            <Bar dataKey="value" fill="#dc2626" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
