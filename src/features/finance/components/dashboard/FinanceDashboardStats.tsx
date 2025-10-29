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

  // Fetch classification data
  const { data: budgetLinesData, isLoading: budgetLoading } = useGetBudgetLines({ page_size: 1 });
  const { data: costCategoriesData, isLoading: categoriesLoading } = useGetCostCategories({ page_size: 1 });
  const { data: fcoNumbersData, isLoading: fcoLoading } = useGetFCONumbers({ page_size: 1 });
  const { data: costGroupingsData, isLoading: groupingsLoading } = useGetCostGroupings({ page_size: 1 });
  const { data: costInputsData, isLoading: inputsLoading } = useGetCostInputs({ page_size: 1 });

  // Fetch accounting data
  const { data: journalEntriesData, isLoading: journalLoading, error: journalError } = useGetJournalEntries({ page_size: 1 });
  const { data: chartOfAccountsData, isLoading: chartLoading } = useGetChartOfAccounts({ page_size: 1 });

  // Fetch integration data
  const { data: integrationStats, isLoading: integrationLoading } = useGetIntegrationStats(30);

  // Fetch journal entry statistics (for better stats display)
  const { data: journalStats, isLoading: journalStatsLoading } = useGetJournalEntryStats();

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
    if (integrationLoading) return { text: "Loading...", variant: "secondary" as const };

    const stats = integrationStats?.data;
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
        value={journalStats?.data?.total_entries || journalEntriesData?.data?.count || 0}
        icon={FileText}
        color="bg-purple-500"
        subtitle={journalStats?.data ? `${journalStats.data.posted_entries} posted, ${journalStats.data.draft_entries} draft` : "Total entries in system"}
        loading={journalLoading || journalStatsLoading}
        error={!!journalError}
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
        value={integrationStats?.data?.total_transactions || 0}
        icon={Link2}
        color="bg-indigo-500"
        subtitle="Total transactions processed"
        badge={getIntegrationStatus()}
        loading={integrationLoading}
      />

      {/* Additional Stats Row */}
      <StatCard
        title="Monthly Volume"
        value={formatCurrency(integrationStats?.data?.total_amount || 0)}
        icon={DollarSign}
        color="bg-emerald-500"
        subtitle="Current month transaction volume"
        loading={integrationLoading}
      />

      <StatCard
        title="Success Rate"
        value={integrationStats?.data?.total_transactions && integrationStats?.data?.total_transactions > 0
          ? `${Math.round((integrationStats.data.successful_integrations / integrationStats.data.total_transactions) * 100)}%`
          : "0%"}
        icon={TrendingUp}
        color="bg-orange-500"
        subtitle="Integration success rate"
        loading={integrationLoading}
      />

      <StatCard
        title="Active Modules"
        value={integrationStats?.data?.modules?.length || 0}
        icon={Users}
        color="bg-pink-500"
        subtitle="Integrated ERP modules"
        loading={integrationLoading}
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