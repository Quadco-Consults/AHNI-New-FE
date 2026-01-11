"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Plane,
  FileText,
  Wallet,
  ShoppingCart,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Settings,
  Target,
  Clock,
  TrendingDown,
} from "lucide-react";
import Link from "next/link";

interface FinancialModule {
  id: string;
  name: string;
  description: string;
  route: string;
  icon: React.ComponentType<any>;
  integrationStatus: "connected" | "partial" | "disconnected";
  lastSync?: string;
  transactionCount?: number;
  pendingAmount?: number;
  features: {
    autoJournalEntry: boolean;
    budgetTracking: boolean;
    projectLinking: boolean;
    departmentTracking: boolean;
  };
}

const FINANCIAL_MODULES: FinancialModule[] = [
  {
    id: "payment-request",
    name: "Payment Requests",
    description: "Process payments to consultants, facilitators, and vendors",
    route: "/dashboard/admin/payment-request",
    icon: CreditCard,
    integrationStatus: "partial",
    transactionCount: 45,
    pendingAmount: 2850000,
    features: {
      autoJournalEntry: false, // Not implemented yet
      budgetTracking: false,
      projectLinking: false,
      departmentTracking: false,
    },
  },
  {
    id: "expense-authorization",
    name: "Expense Authorization",
    description: "Pre-approve travel and business expenses",
    route: "/dashboard/admin/expense-authorization",
    icon: Plane,
    integrationStatus: "partial",
    transactionCount: 23,
    pendingAmount: 890000,
    features: {
      autoJournalEntry: false, // Ready to implement
      budgetTracking: true,    // Has FCO, project, department
      projectLinking: true,
      departmentTracking: true,
    },
  },
  {
    id: "travel-expense-report",
    name: "Travel Expense Reports",
    description: "Record actual travel expenses and reconcile with authorization",
    route: "/dashboard/admin/travel-expenses-report",
    icon: FileText,
    integrationStatus: "disconnected",
    transactionCount: 18,
    pendingAmount: 0,
    features: {
      autoJournalEntry: false,
      budgetTracking: false,
      projectLinking: false,
      departmentTracking: false,
    },
  },
  {
    id: "fund-request",
    name: "Fund Requests",
    description: "Project budget requests and activity planning",
    route: "/dashboard/programs/fund-request",
    icon: Wallet,
    integrationStatus: "partial",
    transactionCount: 12,
    pendingAmount: 15600000,
    features: {
      autoJournalEntry: false, // Ready to implement
      budgetTracking: true,    // Has cost categories, projects
      projectLinking: true,
      departmentTracking: false,
    },
  },
  {
    id: "purchase-order",
    name: "Purchase Orders",
    description: "Procurement and vendor purchase commitments",
    route: "/dashboard/admin/inventory-management", // Part of procurement
    icon: ShoppingCart,
    integrationStatus: "disconnected",
    transactionCount: 8,
    pendingAmount: 1200000,
    features: {
      autoJournalEntry: false,
      budgetTracking: false,
      projectLinking: false,
      departmentTracking: false,
    },
  },

  // Project Finance Modules
  {
    id: "project-budget",
    name: "Project Budget",
    description: "Project budget setup and authorization",
    route: "/dashboard/projects",
    icon: Target,
    integrationStatus: "connected",
    transactionCount: 25,
    pendingAmount: 0,
    features: {
      autoJournalEntry: true,
      budgetTracking: true,
      projectLinking: true,
      departmentTracking: true,
    },
  },
  {
    id: "project-obligations",
    name: "Project Obligations",
    description: "Track project commitments and obligations",
    route: "/dashboard/contracts-grants",
    icon: Clock,
    integrationStatus: "connected",
    transactionCount: 156,
    pendingAmount: 35000000,
    features: {
      autoJournalEntry: true,
      budgetTracking: true,
      projectLinking: true,
      departmentTracking: false,
    },
  },
  {
    id: "budget-modifications",
    name: "Budget Modifications",
    description: "Track budget changes and adjustments",
    route: "/dashboard/contracts-grants",
    icon: Settings,
    integrationStatus: "connected",
    transactionCount: 12,
    pendingAmount: 0,
    features: {
      autoJournalEntry: true,
      budgetTracking: true,
      projectLinking: true,
      departmentTracking: false,
    },
  },
  {
    id: "project-expenditures",
    name: "Project Expenditures",
    description: "Record actual project expenses and spending",
    route: "/dashboard/contracts-grants",
    icon: TrendingDown,
    integrationStatus: "connected",
    transactionCount: 89,
    pendingAmount: 0,
    features: {
      autoJournalEntry: true,
      budgetTracking: true,
      projectLinking: true,
      departmentTracking: true,
    },
  },
];

const getStatusIcon = (status: FinancialModule["integrationStatus"]) => {
  switch (status) {
    case "connected":
      return <CheckCircle className="text-green-500" size={16} />;
    case "partial":
      return <AlertTriangle className="text-yellow-500" size={16} />;
    case "disconnected":
      return <XCircle className="text-red-500" size={16} />;
  }
};

const getStatusColor = (status: FinancialModule["integrationStatus"]) => {
  switch (status) {
    case "connected":
      return "bg-green-100 text-green-800";
    case "partial":
      return "bg-yellow-100 text-yellow-800";
    case "disconnected":
      return "bg-red-100 text-red-800";
  }
};

const getStatusText = (status: FinancialModule["integrationStatus"]) => {
  switch (status) {
    case "connected":
      return "Fully Integrated";
    case "partial":
      return "Partially Integrated";
    case "disconnected":
      return "Not Integrated";
  }
};

export default function ModulesOverviewWidget() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getIntegrationScore = () => {
    const totalModules = FINANCIAL_MODULES.length;
    const connectedModules = FINANCIAL_MODULES.filter(m => m.integrationStatus === "connected").length;
    const partialModules = FINANCIAL_MODULES.filter(m => m.integrationStatus === "partial").length;

    return Math.round(((connectedModules * 1 + partialModules * 0.5) / totalModules) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Integration Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Financial Modules Integration</h3>
            <p className="text-sm text-gray-600">
              Status of AHNI's financial modules integration with the accounting system
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{getIntegrationScore()}%</div>
            <div className="text-sm text-gray-600">Integration Complete</div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">
              {FINANCIAL_MODULES.filter(m => m.integrationStatus === "connected").length}
            </div>
            <div className="text-sm text-gray-600">Fully Integrated</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-yellow-600">
              {FINANCIAL_MODULES.filter(m => m.integrationStatus === "partial").length}
            </div>
            <div className="text-sm text-gray-600">Partially Integrated</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-red-600">
              {FINANCIAL_MODULES.filter(m => m.integrationStatus === "disconnected").length}
            </div>
            <div className="text-sm text-gray-600">Not Integrated</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600">
              {FINANCIAL_MODULES.reduce((sum, m) => sum + (m.transactionCount || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Total Transactions</div>
          </div>
        </div>
      </Card>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FINANCIAL_MODULES.map((module) => {
          const Icon = module.icon;
          return (
            <Card key={module.id} className="p-6 hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Icon className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold">{module.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusIcon(module.integrationStatus)}
                      <Badge className={getStatusColor(module.integrationStatus)}>
                        {getStatusText(module.integrationStatus)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4">{module.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-lg font-bold">{module.transactionCount}</div>
                  <div className="text-xs text-gray-600">Transactions</div>
                </div>
                <div>
                  <div className="text-lg font-bold">
                    {module.pendingAmount ? formatCurrency(module.pendingAmount) : "₦0"}
                  </div>
                  <div className="text-xs text-gray-600">Pending Amount</div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-4">
                <div className="text-sm font-medium mb-2">Integration Features:</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-1">
                    {module.features.autoJournalEntry ? (
                      <CheckCircle className="text-green-500" size={12} />
                    ) : (
                      <XCircle className="text-red-500" size={12} />
                    )}
                    <span>Auto Journal Entry</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {module.features.budgetTracking ? (
                      <CheckCircle className="text-green-500" size={12} />
                    ) : (
                      <XCircle className="text-red-500" size={12} />
                    )}
                    <span>Budget Tracking</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {module.features.projectLinking ? (
                      <CheckCircle className="text-green-500" size={12} />
                    ) : (
                      <XCircle className="text-red-500" size={12} />
                    )}
                    <span>Project Linking</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {module.features.departmentTracking ? (
                      <CheckCircle className="text-green-500" size={12} />
                    ) : (
                      <XCircle className="text-red-500" size={12} />
                    )}
                    <span>Department Tracking</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Link href={module.route} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    View Module
                    <ArrowRight size={14} className="ml-2" />
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" title="Configure Integration">
                  <Settings size={14} />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Action Items */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Integration Action Items</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div>
              <div className="font-medium">Enable Automatic Journal Entries</div>
              <div className="text-sm text-gray-600">
                Connect Payment Requests and Expense Authorization to create journal entries automatically
              </div>
            </div>
            <Button size="sm">Configure</Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div>
              <div className="font-medium">Setup Chart of Accounts Mapping</div>
              <div className="text-sm text-gray-600">
                Map transaction types to specific general ledger accounts
              </div>
            </div>
            <Button size="sm">Setup</Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div>
              <div className="font-medium">Implement Budget Encumbrance</div>
              <div className="text-sm text-gray-600">
                Track budget commitments from Fund Requests and Purchase Orders
              </div>
            </div>
            <Button size="sm">Enable</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}