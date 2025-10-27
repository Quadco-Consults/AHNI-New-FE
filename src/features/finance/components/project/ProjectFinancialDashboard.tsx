"use client";

import { useState, useEffect } from "react";
import { Card } from "components/ui/card";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Progress } from "components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import {
  Target,
  DollarSign,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  FileText,
  Calendar,
  BarChart3,
  Activity,
  RefreshCw,
} from "lucide-react";

interface ProjectFinancialData {
  project_id: string;
  project_title: string;
  budget_amount: number;
  award_amount: number;
  currency: string;
  start_date: string;
  end_date: string;
  status: string;

  // Financial Summary
  total_obligations: number;
  total_expenditures: number;
  available_balance: number;
  uncommitted_balance: number;
  current_month_obligations: number;
  current_month_expenditures: number;

  // Calculated Metrics
  utilization_percentage: number;
  obligation_percentage: number;
  burn_rate: number;
  projected_completion_date: string;

  // Recent Transactions
  recent_obligations: Array<{
    id: string;
    description: string;
    amount: number;
    date: string;
    status: string;
  }>;

  recent_expenditures: Array<{
    id: string;
    description: string;
    amount: number;
    date: string;
    work_plan_activity?: string;
  }>;

  recent_modifications: Array<{
    id: string;
    modification_number: string;
    modification_type: string;
    amount: number;
    effective_date: string;
    reason: string;
  }>;

  // Budget Categories
  budget_categories: Array<{
    category: string;
    budgeted: number;
    obligated: number;
    spent: number;
    available: number;
  }>;
}

interface ProjectFinancialDashboardProps {
  projectId?: string;
  data?: ProjectFinancialData;
  loading?: boolean;
}

// Mock data for demonstration
const MOCK_PROJECT_DATA: ProjectFinancialData = {
  project_id: "proj-001",
  project_title: "Youth Development and Skills Acquisition Program",
  budget_amount: 50000000,
  award_amount: 45000000,
  currency: "NGN",
  start_date: "2024-01-01",
  end_date: "2024-12-31",
  status: "ACTIVE",

  total_obligations: 35000000,
  total_expenditures: 18000000,
  available_balance: 32000000, // budget - expenditures
  uncommitted_balance: 15000000, // budget - obligations
  current_month_obligations: 5000000,
  current_month_expenditures: 3200000,

  utilization_percentage: 36, // (expenditures / budget) * 100
  obligation_percentage: 70, // (obligations / budget) * 100
  burn_rate: 1500000, // monthly average expenditure
  projected_completion_date: "2024-11-15",

  recent_obligations: [
    {
      id: "obl-001",
      description: "Training Materials and Equipment",
      amount: 8500000,
      date: "2024-12-01",
      status: "APPROVED"
    },
    {
      id: "obl-002",
      description: "Consultant Services Q4",
      amount: 6200000,
      date: "2024-12-03",
      status: "PENDING"
    },
    {
      id: "obl-003",
      description: "Travel and Accommodation",
      amount: 2800000,
      date: "2024-12-05",
      status: "APPROVED"
    }
  ],

  recent_expenditures: [
    {
      id: "exp-001",
      description: "Training Facilitator Payments",
      amount: 4500000,
      date: "2024-12-02",
      work_plan_activity: "Training Implementation"
    },
    {
      id: "exp-002",
      description: "Office Supplies and Materials",
      amount: 1200000,
      date: "2024-12-04",
      work_plan_activity: "Program Administration"
    },
    {
      id: "exp-003",
      description: "Transport and Logistics",
      amount: 800000,
      date: "2024-12-06",
      work_plan_activity: "Field Operations"
    }
  ],

  recent_modifications: [
    {
      id: "mod-001",
      modification_number: "MOD-2024-001",
      modification_type: "INCREASE",
      amount: 5000000,
      effective_date: "2024-11-01",
      reason: "Additional training sites approved"
    },
    {
      id: "mod-002",
      modification_number: "MOD-2024-002",
      modification_type: "REALLOCATION",
      amount: 2000000,
      effective_date: "2024-10-15",
      reason: "Budget reallocation from equipment to personnel"
    }
  ],

  budget_categories: [
    {
      category: "Personnel",
      budgeted: 20000000,
      obligated: 15000000,
      spent: 8000000,
      available: 12000000
    },
    {
      category: "Travel",
      budgeted: 12000000,
      obligated: 8000000,
      spent: 4500000,
      available: 7500000
    },
    {
      category: "Supplies",
      budgeted: 10000000,
      obligated: 7000000,
      spent: 3500000,
      available: 6500000
    },
    {
      category: "Equipment",
      budgeted: 8000000,
      obligated: 5000000,
      spent: 2000000,
      available: 6000000
    }
  ]
};

export default function ProjectFinancialDashboard({
  projectId,
  data = MOCK_PROJECT_DATA,
  loading = false
}: ProjectFinancialDashboardProps) {

  const [refreshKey, setRefreshKey] = useState(0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: data.currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getFinancialHealth = () => {
    if (data.utilization_percentage > 90) return { status: "critical", color: "red", icon: AlertTriangle };
    if (data.utilization_percentage > 75) return { status: "warning", color: "yellow", icon: TrendingUp };
    if (data.utilization_percentage > 50) return { status: "good", color: "blue", icon: Activity };
    return { status: "excellent", color: "green", icon: CheckCircle };
  };

  const health = getFinancialHealth();
  const HealthIcon = health.icon;

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-96" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-64" />
          </div>
          <div className="h-10 bg-gray-200 rounded animate-pulse w-24" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{data.project_title}</h1>
          <p className="text-gray-600">
            Project ID: {data.project_id} • {data.start_date} to {data.end_date}
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <Badge className={`bg-${health.color}-100 text-${health.color}-800`}>
              {health.status.toUpperCase()}
            </Badge>
            <Badge variant="outline">{data.status}</Badge>
            <Badge variant="outline">{data.currency}</Badge>
          </div>
        </div>
        <Button onClick={handleRefresh}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Target className="h-8 w-8 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(data.budget_amount)}
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
                {formatCurrency(data.total_obligations)}
              </div>
              <div className="text-sm text-gray-600">Total Obligations</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <TrendingDown className="h-8 w-8 text-red-600" />
            <div>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(data.total_expenditures)}
              </div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(data.available_balance)}
              </div>
              <div className="text-sm text-gray-600">Available Balance</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Financial Overview */}
      <Card className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Budget Utilization */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Budget Utilization</h3>
              <div className="flex items-center space-x-2">
                <HealthIcon className={`h-5 w-5 text-${health.color}-600`} />
                <span className="text-sm font-medium">{data.utilization_percentage}%</span>
              </div>
            </div>
            <Progress value={data.utilization_percentage} className="h-3 mb-2" />
            <div className="text-sm text-gray-600">
              {formatCurrency(data.total_expenditures)} of {formatCurrency(data.budget_amount)} spent
            </div>
          </div>

          {/* Obligation Status */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Obligation Status</h3>
              <span className="text-sm font-medium">{data.obligation_percentage}%</span>
            </div>
            <Progress value={data.obligation_percentage} className="h-3 mb-2" />
            <div className="text-sm text-gray-600">
              {formatCurrency(data.total_obligations)} of {formatCurrency(data.budget_amount)} obligated
            </div>
          </div>
        </div>

        {/* Financial Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-lg font-semibold text-blue-600">
              {formatCurrency(data.uncommitted_balance)}
            </div>
            <div className="text-xs text-gray-600">Uncommitted Balance</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-lg font-semibold text-green-600">
              {formatCurrency(data.burn_rate)}
            </div>
            <div className="text-xs text-gray-600">Monthly Burn Rate</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-lg font-semibold text-yellow-600">
              {formatCurrency(data.current_month_obligations)}
            </div>
            <div className="text-xs text-gray-600">This Month Obligations</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-lg font-semibold text-purple-600">
              {formatCurrency(data.current_month_expenditures)}
            </div>
            <div className="text-xs text-gray-600">This Month Spent</div>
          </div>
        </div>
      </Card>

      {/* Detailed Tabs */}
      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="categories">Budget Categories</TabsTrigger>
          <TabsTrigger value="obligations">Recent Obligations</TabsTrigger>
          <TabsTrigger value="expenditures">Recent Expenditures</TabsTrigger>
          <TabsTrigger value="modifications">Modifications</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Budget Category Analysis</h3>
            <div className="space-y-4">
              {data.budget_categories.map((category) => {
                const utilizationRate = Math.round((category.spent / category.budgeted) * 100);
                const obligationRate = Math.round((category.obligated / category.budgeted) * 100);

                return (
                  <div key={category.category} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{category.category}</h4>
                      <div className="text-sm text-gray-600">
                        {formatCurrency(category.budgeted)} budgeted
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-center text-sm mb-2">
                      <div>
                        <div className="font-semibold text-blue-600">{formatCurrency(category.obligated)}</div>
                        <div className="text-xs text-gray-600">Obligated</div>
                      </div>
                      <div>
                        <div className="font-semibold text-red-600">{formatCurrency(category.spent)}</div>
                        <div className="text-xs text-gray-600">Spent</div>
                      </div>
                      <div>
                        <div className="font-semibold text-green-600">{formatCurrency(category.available)}</div>
                        <div className="text-xs text-gray-600">Available</div>
                      </div>
                      <div>
                        <div className="font-semibold text-purple-600">{utilizationRate}%</div>
                        <div className="text-xs text-gray-600">Utilized</div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Obligation Rate</span>
                        <span>{obligationRate}%</span>
                      </div>
                      <Progress value={obligationRate} className="h-1 mb-1" />
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Utilization Rate</span>
                        <span>{utilizationRate}%</span>
                      </div>
                      <Progress value={utilizationRate} className="h-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="obligations" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Obligations</h3>
            <div className="space-y-3">
              {data.recent_obligations.map((obligation) => (
                <div key={obligation.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{obligation.description}</div>
                    <div className="text-sm text-gray-600">{obligation.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(obligation.amount)}</div>
                    <Badge
                      variant={obligation.status === "APPROVED" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {obligation.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="expenditures" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Expenditures</h3>
            <div className="space-y-3">
              {data.recent_expenditures.map((expenditure) => (
                <div key={expenditure.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{expenditure.description}</div>
                    <div className="text-sm text-gray-600">{expenditure.date}</div>
                    {expenditure.work_plan_activity && (
                      <Badge variant="outline" className="text-xs mt-1">
                        {expenditure.work_plan_activity}
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(expenditure.amount)}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="modifications" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Budget Modifications</h3>
            <div className="space-y-3">
              {data.recent_modifications.map((modification) => (
                <div key={modification.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{modification.modification_number}</span>
                      <Badge
                        variant={modification.modification_type === "INCREASE" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {modification.modification_type}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{modification.reason}</div>
                    <div className="text-sm text-gray-600">{modification.effective_date}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${
                      modification.modification_type === "INCREASE" ? "text-green-600" :
                      modification.modification_type === "DECREASE" ? "text-red-600" : "text-blue-600"
                    }`}>
                      {modification.modification_type === "INCREASE" ? "+" :
                       modification.modification_type === "DECREASE" ? "-" : ""}
                      {formatCurrency(modification.amount)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}