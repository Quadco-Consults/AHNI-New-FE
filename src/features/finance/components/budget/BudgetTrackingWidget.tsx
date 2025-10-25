"use client";

import { Card } from "components/ui/card";
import { Badge } from "components/ui/badge";
import { Progress } from "components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Activity,
  Target,
  Clock,
} from "lucide-react";

interface BudgetItem {
  id: string;
  project: {
    id: string;
    title: string;
    budget: number;
  };
  totalCommitted: number;
  totalSpent: number;
  pendingCommitments: number;
  availableBalance: number;
  utilizationPercentage: number;
  costCategories: {
    category: string;
    budgeted: number;
    committed: number;
    spent: number;
  }[];
}

interface BudgetTrackingWidgetProps {
  budgetData?: BudgetItem[];
  loading?: boolean;
}

// Mock data for demonstration
const MOCK_BUDGET_DATA: BudgetItem[] = [
  {
    id: "1",
    project: {
      id: "proj-1",
      title: "Youth Development Program",
      budget: 5000000,
    },
    totalCommitted: 3200000,
    totalSpent: 1800000,
    pendingCommitments: 800000,
    availableBalance: 1800000,
    utilizationPercentage: 64,
    costCategories: [
      { category: "Personnel", budgeted: 2000000, committed: 1200000, spent: 800000 },
      { category: "Travel", budgeted: 1500000, committed: 900000, spent: 500000 },
      { category: "Supplies", budgeted: 1000000, committed: 600000, spent: 300000 },
      { category: "Equipment", budgeted: 500000, committed: 500000, spent: 200000 },
    ],
  },
  {
    id: "2",
    project: {
      id: "proj-2",
      title: "Community Health Initiative",
      budget: 3000000,
    },
    totalCommitted: 2400000,
    totalSpent: 1500000,
    pendingCommitments: 600000,
    availableBalance: 600000,
    utilizationPercentage: 80,
    costCategories: [
      { category: "Personnel", budgeted: 1200000, committed: 1000000, spent: 700000 },
      { category: "Travel", budgeted: 800000, committed: 600000, spent: 400000 },
      { category: "Supplies", budgeted: 700000, committed: 500000, spent: 300000 },
      { category: "Equipment", budgeted: 300000, committed: 300000, spent: 100000 },
    ],
  },
];

export default function BudgetTrackingWidget({
  budgetData = MOCK_BUDGET_DATA,
  loading = false
}: BudgetTrackingWidgetProps) {

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getBudgetStatus = (utilizationPercentage: number) => {
    if (utilizationPercentage >= 90) return { status: "critical", color: "red", icon: AlertTriangle };
    if (utilizationPercentage >= 75) return { status: "warning", color: "yellow", icon: TrendingUp };
    if (utilizationPercentage >= 50) return { status: "good", color: "blue", icon: Activity };
    return { status: "excellent", color: "green", icon: CheckCircle };
  };

  const totalBudget = budgetData.reduce((sum, item) => sum + item.project.budget, 0);
  const totalCommitted = budgetData.reduce((sum, item) => sum + item.totalCommitted, 0);
  const totalSpent = budgetData.reduce((sum, item) => sum + item.totalSpent, 0);
  const totalAvailable = budgetData.reduce((sum, item) => sum + item.availableBalance, 0);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Target className="h-8 w-8 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(totalBudget)}
              </div>
              <div className="text-sm text-gray-600">Total Budget</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {formatCurrency(totalCommitted)}
              </div>
              <div className="text-sm text-gray-600">Committed</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <TrendingDown className="h-8 w-8 text-red-600" />
            <div>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(totalSpent)}
              </div>
              <div className="text-sm text-gray-600">Spent</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(totalAvailable)}
              </div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Project Budget Details */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Project Budget Tracking</h3>
        <div className="space-y-6">
          {budgetData.map((budget) => {
            const budgetStatus = getBudgetStatus(budget.utilizationPercentage);
            const StatusIcon = budgetStatus.icon;

            return (
              <div key={budget.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                {/* Project Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-lg">{budget.project.title}</h4>
                    <p className="text-sm text-gray-600">
                      Total Budget: {formatCurrency(budget.project.budget)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      className={`bg-${budgetStatus.color}-100 text-${budgetStatus.color}-800`}
                    >
                      {budget.utilizationPercentage}% Utilized
                    </Badge>
                    <StatusIcon className={`h-5 w-5 text-${budgetStatus.color}-600`} />
                  </div>
                </div>

                {/* Budget Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Budget Utilization</span>
                    <span>{budget.utilizationPercentage}%</span>
                  </div>
                  <Progress
                    value={budget.utilizationPercentage}
                    className="h-2"
                  />
                </div>

                {/* Budget Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">
                      {formatCurrency(budget.totalCommitted)}
                    </div>
                    <div className="text-xs text-gray-600">Committed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-red-600">
                      {formatCurrency(budget.totalSpent)}
                    </div>
                    <div className="text-xs text-gray-600">Spent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-yellow-600">
                      {formatCurrency(budget.pendingCommitments)}
                    </div>
                    <div className="text-xs text-gray-600">Pending</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">
                      {formatCurrency(budget.availableBalance)}
                    </div>
                    <div className="text-xs text-gray-600">Available</div>
                  </div>
                </div>

                {/* Cost Category Breakdown */}
                <div className="space-y-3">
                  <h5 className="font-medium text-gray-900">Cost Category Breakdown</h5>
                  {budget.costCategories.map((category) => {
                    const categoryUtilization = Math.round((category.committed / category.budgeted) * 100);
                    return (
                      <div key={category.category} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">{category.category}</span>
                            <span className="text-gray-600">
                              {formatCurrency(category.committed)} / {formatCurrency(category.budgeted)}
                            </span>
                          </div>
                          <Progress value={categoryUtilization} className="h-1" />
                        </div>
                        <div className="ml-4 text-sm text-gray-600">
                          {categoryUtilization}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}