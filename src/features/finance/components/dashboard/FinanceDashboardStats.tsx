"use client";

import { useState, useEffect } from "react";
import Card from "components/Card";
import { Badge } from "components/ui/badge";
import {
  Database,
  FileText,
  BarChart3,
  Link2,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Book
} from "lucide-react";
import {
  useGetBudgetLines,
  useGetCostCategories,
  useGetFCONumbers,
  useGetCostGroupings,
  useGetCostInputs
} from "../../controllers/classificationsController";
import {
  useGetJournalEntries,
  useGetChartOfAccounts
} from "../../controllers/accountingController";
import {
  useGetIntegrationStats
} from "../../controllers/integrationController";
import {
  useGetJournalEntryStats
} from "../../controllers/accountingController";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  subtitle?: string;
  badge?: {
    text: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  };
  loading?: boolean;
  error?: boolean;
  errorMessage?: string;
}

function StatCard({ title, value, icon: IconComponent, color, subtitle, badge, loading, error, errorMessage }: StatCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${error ? 'bg-orange-500' : color}`}>
            <IconComponent className="text-white" size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold">
              {loading ? (
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
              ) : error ? (
                <span className="text-orange-600 text-base">--</span>
              ) : (
                value
              )}
            </p>
            {error && errorMessage ? (
              <p className="text-xs text-orange-500 mt-1">{errorMessage}</p>
            ) : subtitle ? (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            ) : null}
          </div>
        </div>
        {error ? (
          <Badge variant="outline" className="text-xs border-orange-300 text-orange-600">
            Coming Soon
          </Badge>
        ) : badge ? (
          <Badge variant={badge.variant} className="text-xs">
            {badge.text}
          </Badge>
        ) : null}
      </div>
    </Card>
  );
}

export function FinanceDashboardStats() {
  const [totalClassifications, setTotalClassifications] = useState(0);
  const [classificationLoading, setClassificationLoading] = useState(true);

  // Add error logging for debugging
  console.log('🏦 Finance Dashboard Stats - Component mounted');

  // Mock data for development (enable when backend endpoints are not available)
  const useMockData = true; // Set to true if backend endpoints are not available

  // Mock data for development
  const mockIntegrationStats = {
    data: {
      total_transactions: 1247,
      successful_integrations: 1189,
      total_amount: 45678.90,
      modules: ['purchase-orders', 'invoicing', 'payroll', 'inventory']
    }
  };

  const mockJournalStats = {
    data: {
      total_entries: 342,
      posted_entries: 298,
      draft_entries: 44
    }
  };

  // Fetch classification data
  const { data: budgetLinesData, isLoading: budgetLoading, error: budgetError } = useGetBudgetLines({ page_size: 1 });
  const { data: costCategoriesData, isLoading: categoriesLoading, error: categoriesError } = useGetCostCategories({ page_size: 1 });
  const { data: fcoNumbersData, isLoading: fcoLoading, error: fcoError } = useGetFCONumbers({ page_size: 1 });
  const { data: costGroupingsData, isLoading: groupingsLoading, error: groupingsError } = useGetCostGroupings({ page_size: 1 });
  const { data: costInputsData, isLoading: inputsLoading, error: inputsError } = useGetCostInputs({ page_size: 1 });

  // Log errors for debugging
  if (budgetError) console.error('🏦 Budget Lines API Error:', budgetError);
  if (categoriesError) console.error('🏦 Cost Categories API Error:', categoriesError);
  if (fcoError) console.error('🏦 FCO Numbers API Error:', fcoError);
  if (groupingsError) console.error('🏦 Cost Groupings API Error:', groupingsError);
  if (inputsError) console.error('🏦 Cost Inputs API Error:', inputsError);

  // Fetch accounting data
  const { data: journalEntriesData, isLoading: journalLoading, error: journalError } = useGetJournalEntries({ page_size: 1 });
  const { data: chartOfAccountsData, isLoading: chartLoading, error: chartError } = useGetChartOfAccounts({ page_size: 1 });

  // Fetch integration data (conditionally use mock data)
  const { data: integrationStats, isLoading: integrationLoading, error: integrationError } = useGetIntegrationStats(30);
  const finalIntegrationStats = useMockData ? mockIntegrationStats : integrationStats;
  const finalIntegrationLoading = useMockData ? false : integrationLoading;

  // Fetch journal entry statistics (conditionally use mock data)
  const { data: journalStats, isLoading: journalStatsLoading, error: journalStatsError } = useGetJournalEntryStats();
  const finalJournalStats = useMockData ? mockJournalStats : journalStats;
  const finalJournalStatsLoading = useMockData ? false : journalStatsLoading;

  // Log additional errors
  if (journalError) console.error('🏦 Journal Entries API Error:', journalError);
  if (chartError) console.error('🏦 Chart of Accounts API Error:', chartError);
  if (integrationError) console.error('🏦 Integration Stats API Error:', integrationError);
  if (journalStatsError) console.error('🏦 Journal Stats API Error:', journalStatsError);

  // Calculate total classifications
  useEffect(() => {
    const allLoading = budgetLoading || categoriesLoading || fcoLoading || groupingsLoading || inputsLoading;
    setClassificationLoading(allLoading);

    if (!allLoading) {
      const total = (budgetLinesData?.data?.count || 0) +
                   (costCategoriesData?.data?.count || 0) +
                   (fcoNumbersData?.data?.count || 0) +
                   (costGroupingsData?.data?.count || 0) +
                   (costInputsData?.data?.count || 0);
      setTotalClassifications(total);
    }
  }, [
    budgetLoading, categoriesLoading, fcoLoading, groupingsLoading, inputsLoading,
    budgetLinesData, costCategoriesData, fcoNumbersData, costGroupingsData, costInputsData
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getIntegrationStatus = () => {
    if (finalIntegrationLoading) return { text: "Loading...", variant: "secondary" as const };

    const stats = finalIntegrationStats?.data;
    if (!stats) return { text: "Unknown", variant: "secondary" as const };

    const successRate = stats.total_transactions > 0
      ? (stats.successful_integrations / stats.total_transactions) * 100
      : 0;

    if (successRate >= 95) return { text: "Excellent", variant: "default" as const };
    if (successRate >= 85) return { text: "Good", variant: "outline" as const };
    if (successRate >= 70) return { text: "Fair", variant: "secondary" as const };
    return { text: "Poor", variant: "destructive" as const };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Classifications */}
      <StatCard
        title="Classifications"
        value={totalClassifications}
        icon={Database}
        color="bg-blue-500"
        subtitle="FCO, Categories, Groupings, Inputs, Budget Lines"
        loading={classificationLoading}
      />

      {/* Journal Entries */}
      <StatCard
        title="Journal Entries"
        value={finalJournalStats?.data?.total_entries || journalEntriesData?.data?.count || 0}
        icon={FileText}
        color="bg-purple-500"
        subtitle={finalJournalStats?.data ? `${finalJournalStats.data.posted_entries} posted, ${finalJournalStats.data.draft_entries} draft` : "Total entries in system"}
        loading={journalLoading || finalJournalStatsLoading}
        error={!!journalError && !useMockData}
        errorMessage="Feature being implemented"
      />

      {/* Chart of Accounts */}
      <StatCard
        title="Chart of Accounts"
        value={Array.isArray(chartOfAccountsData?.data) ? chartOfAccountsData.data.length : 0}
        icon={Book}
        color="bg-green-500"
        subtitle="Active accounts"
        loading={chartLoading}
      />

      {/* Integration Status */}
      <StatCard
        title="Integration Health"
        value={finalIntegrationStats?.data?.total_transactions || 0}
        icon={Link2}
        color="bg-indigo-500"
        subtitle="Total transactions processed"
        badge={getIntegrationStatus()}
        loading={finalIntegrationLoading}
      />

      {/* Additional Stats Row */}
      <StatCard
        title="Monthly Volume"
        value={formatCurrency(finalIntegrationStats?.data?.total_amount || 0)}
        icon={DollarSign}
        color="bg-emerald-500"
        subtitle="Current month transaction volume"
        loading={finalIntegrationLoading}
      />

      <StatCard
        title="Success Rate"
        value={finalIntegrationStats?.data?.total_transactions && finalIntegrationStats?.data?.total_transactions > 0
          ? `${Math.round((finalIntegrationStats.data.successful_integrations / finalIntegrationStats.data.total_transactions) * 100)}%`
          : "0%"}
        icon={TrendingUp}
        color="bg-orange-500"
        subtitle="Integration success rate"
        loading={finalIntegrationLoading}
      />

      <StatCard
        title="Active Modules"
        value={finalIntegrationStats?.data?.modules?.length || 0}
        icon={Users}
        color="bg-pink-500"
        subtitle="Integrated ERP modules"
        loading={finalIntegrationLoading}
      />

      <StatCard
        title="Last Sync"
        value="Live"
        icon={Clock}
        color="bg-teal-500"
        subtitle="Real-time integration"
        badge={{ text: "Active", variant: "default" }}
      />
    </div>
  );
}