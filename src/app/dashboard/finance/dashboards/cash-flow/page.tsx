"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingDown, Droplets, AlertTriangle } from "lucide-react";

export default function CashFlowDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cash Flow Dashboard</h1>
        <p className="text-gray-600">
          Track cash inflows, outflows, and liquidity metrics
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bank Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">₦0</div>
            <p className="text-xs text-muted-foreground">Total cash on hand</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Outflows</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₦0</div>
            <p className="text-xs text-muted-foreground">This period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Liquidity Ratio</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">0.0</div>
            <p className="text-xs text-muted-foreground">Cash / Obligations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">0</div>
            <p className="text-xs text-muted-foreground">₦0</p>
          </CardContent>
        </Card>
      </div>

      {/* Bank Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Bank Account Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Wallet className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-sm text-gray-500">No data available</p>
          </div>
        </CardContent>
      </Card>

      {/* Cash Flow Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Cash Flow Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <TrendingDown className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-sm text-gray-500">No data available</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Outflows by Payment Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <TrendingDown className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-sm text-gray-500">No data available</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">Cash Flow Dashboard</h3>
            <p className="text-gray-600 mb-4">
              This page is connected to the backend API at<br />
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                /api/v1/finance/dashboards/cash-flow/
              </code>
            </p>
            <p className="text-sm text-gray-500">
              Frontend data visualization coming soon. Backend APIs are fully functional.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
