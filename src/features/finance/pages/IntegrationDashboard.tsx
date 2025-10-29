"use client";

import { useState, useEffect } from "react";
import { initializeFinanceModule } from "../utils/financeInit";
import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import { Badge } from "components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import {
  RefreshCw,
  Activity,
  Database,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import {
  useGetIntegrationStats,
  useGetIntegrationActivity,
  useGetSyncStatus,
  useGetFinancialAnalysis,
  useGetIntegrationAlerts,
  useGetRecentTransactions,
  useGetModuleStats,
} from "../controllers/integrationController";
import StatCard from "../components/integration/StatCard";
import ActivityChart from "../components/integration/ActivityChart";
import ModulesOverviewWidget from "../components/integration/ModulesOverviewWidget";
import AlertsList from "../components/integration/AlertsList";
import BudgetTrackingWidget from "../components/budget/BudgetTrackingWidget";
import ProjectFinancialDashboard from "../components/project/ProjectFinancialDashboard";

export default function IntegrationDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  // Initialize finance module on mount
  useEffect(() => {
    initializeFinanceModule();
  }, []);

  // Data fetching hooks
  const { data: statsData, isLoading: statsLoading } = useGetIntegrationStats(30);
  const { data: activityData, isLoading: activityLoading } = useGetIntegrationActivity({
    page: 1,
    page_size: 10,
  });
  const { data: syncStatusData, isLoading: syncLoading } = useGetSyncStatus();
  const { data: analysisData, isLoading: analysisLoading } = useGetFinancialAnalysis(30);
  const { data: alertsData, isLoading: alertsLoading } = useGetIntegrationAlerts(false);
  const { data: recentData, isLoading: recentLoading } = useGetRecentTransactions(10);
  const { data: moduleStatsData, isLoading: moduleLoading } = useGetModuleStats();

  // Extract data from API responses
  const stats = statsData?.data;
  const activity = activityData?.data?.results || [];
  const syncStatus = syncStatusData?.data || [];
  const analysis = analysisData?.data;
  const alerts = alertsData?.data?.results || [];
  const recentTransactions = recentData?.data || [];
  const moduleStats = stats?.modules || [];

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integration Dashboard</h1>
          <p className="text-gray-600">
            Monitor ERP integration status and financial data flow
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={statsLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${statsLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Transactions"
          value={stats?.total_transactions?.toLocaleString() || "0"}
          description="Last 30 days"
          icon={FileText}
          color="blue"
          loading={statsLoading}
        />
        <StatCard
          title="Success Rate"
          value={
            stats?.total_transactions
              ? `${((stats.successful_integrations / stats.total_transactions) * 100).toFixed(1)}%`
              : "0%"
          }
          description={`${stats?.successful_integrations || 0} successful`}
          icon={CheckCircle}
          color="green"
          loading={statsLoading}
        />
        <StatCard
          title="Failed Integrations"
          value={stats?.failed_integrations?.toLocaleString() || "0"}
          description="Requiring attention"
          icon={XCircle}
          color="red"
          loading={statsLoading}
        />
        <StatCard
          title="Total Amount"
          value={`$${(stats?.total_amount || 0).toLocaleString()}`}
          description="Integrated transactions"
          icon={DollarSign}
          color="purple"
          loading={statsLoading}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module Activity Chart */}
        <div className="lg:col-span-2">
          <ActivityChart moduleStats={moduleStats} loading={moduleLoading} />
        </div>

        {/* Sync Status */}
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Sync Status</h3>
              <p className="text-sm text-gray-600">Module synchronization status</p>
            </div>

            <div className="space-y-4">
              {syncLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-lg border">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-32" />
                      </div>
                      <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : syncStatus.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <Clock className="w-8 h-8 mx-auto mb-2" />
                  <p>No sync status available</p>
                </div>
              ) : (
                syncStatus.map((sync) => (
                  <div key={sync.module_name} className="flex justify-between items-center p-3 rounded-lg border">
                    <div>
                      <div className="font-medium">{sync.module_name}</div>
                      <div className="text-sm text-gray-600">
                        Last sync: {new Date(sync.last_sync).toLocaleString()}
                      </div>
                    </div>
                    <Badge
                      variant={
                        sync.status === "RUNNING"
                          ? "default"
                          : sync.status === "ERROR"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {sync.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="modules" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="projects">Project Finance</TabsTrigger>
          <TabsTrigger value="budget">Budget Tracking</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-4">
          <ModulesOverviewWidget />
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <ProjectFinancialDashboard />
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <BudgetTrackingWidget />
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Recent Transactions</h3>
                <p className="text-sm text-gray-600">Latest integration activity</p>
              </div>

              <div className="space-y-3">
                {recentLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex justify-between items-center p-3 rounded-lg border">
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
                        </div>
                        <div className="w-20 h-6 bg-gray-200 rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                ) : recentTransactions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="w-8 h-8 mx-auto mb-2" />
                    <p>No recent transactions</p>
                  </div>
                ) : (
                  recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center p-3 rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{transaction.module_name}</span>
                          <Badge variant="outline" className="text-xs">
                            {transaction.transaction_type}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {new Date(transaction.processed_at).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${transaction.amount.toLocaleString()}</div>
                        <Badge
                          variant={transaction.status === "SUCCESS" ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <AlertsList alerts={alerts} loading={alertsLoading} />
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Integration Health"
              value={`${analysis?.integration_health_score || 0}%`}
              description="Overall system health"
              icon={TrendingUp}
              color="green"
              loading={analysisLoading}
            />
            <StatCard
              title="Avg Transaction"
              value={`$${(analysis?.average_transaction_amount || 0).toLocaleString()}`}
              description="Average amount"
              icon={DollarSign}
              color="blue"
              loading={analysisLoading}
            />
            <StatCard
              title="Daily Volume"
              value={(analysis?.daily_volume?.length || 0).toString()}
              description="Active days"
              icon={Activity}
              color="purple"
              loading={analysisLoading}
            />
            <StatCard
              title="Error Rate"
              value={
                analysis?.total_transactions
                  ? `${(((analysis.total_transactions - analysis.total_amount) / analysis.total_transactions) * 100).toFixed(1)}%`
                  : "0%"
              }
              description="Error percentage"
              icon={AlertTriangle}
              color="red"
              loading={analysisLoading}
            />
          </div>

          {/* Module Breakdown */}
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Module Performance</h3>
              {analysisLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {analysis?.module_breakdown?.map((module) => (
                    <div key={module.module_name} className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{module.module_name}</span>
                        <span className="text-sm text-gray-600 ml-2">
                          {module.percentage.toFixed(1)}% of total
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{module.transaction_count} transactions</div>
                        <div className="text-sm text-gray-600">
                          ${module.total_amount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-4 text-gray-500">
                      <Database className="w-8 h-8 mx-auto mb-2" />
                      <p>No module data available</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}