import Link from "next/link";
import Card from "components/Card";
import { Button } from "components/ui/button";
import {
  BarChart,
  Database,
  FileText,
  Settings,
  TrendingUp,
  Book,
  CreditCard,
  Link2,
  Users,
  Receipt,
  ShoppingCart,
  Calculator,
  DollarSign,
  FileCheck,
  Building2,
  Wallet
} from "lucide-react";
import { FinanceDashboardStats } from "@/features/finance/components/dashboard/FinanceDashboardStats";

export default function FinancePage() {
  const financeModules = [
    {
      title: "Financial Classifications",
      description: "Manage FCO numbers, cost categories, groupings, inputs, and budget lines",
      href: "/dashboard/finance/classifications",
      icon: Database,
      color: "bg-blue-500",
    },
    {
      title: "Chart of Accounts",
      description: "View and manage the chart of accounts structure",
      href: "/dashboard/finance/chart-of-accounts",
      icon: Book,
      color: "bg-green-500",
    },
    {
      title: "Journal Entries",
      description: "Create and manage journal entries and postings",
      href: "/dashboard/finance/journal-entries",
      icon: FileText,
      color: "bg-purple-500",
    },
    {
      title: "Financial Reports",
      description: "Generate trial balance, income statement, and other reports",
      href: "/dashboard/finance/reports",
      icon: BarChart,
      color: "bg-orange-500",
    },
    {
      title: "Bank Reconciliation",
      description: "Reconcile bank statements and manage cash flow",
      href: "/dashboard/finance/bank-reconciliation",
      icon: CreditCard,
      color: "bg-teal-500",
    },
    {
      title: "Integration Dashboard",
      description: "Monitor ERP integration status and financial data flow",
      href: "/dashboard/finance/integration-dashboard",
      icon: Link2,
      color: "bg-indigo-500",
    },
    {
      title: "Financial Analysis",
      description: "Analyze financial performance and integration health",
      href: "/dashboard/finance/analysis",
      icon: TrendingUp,
      color: "bg-pink-500",
    },
    {
      title: "QuickBooks Settings",
      description: "Configure QuickBooks integration and sync settings",
      href: "/dashboard/finance/quickbooks/settings",
      icon: Settings,
      color: "bg-gray-500",
    },
    // New QuickBooks Modules
    {
      title: "Customer Management",
      description: "Manage customers, contacts, and customer information",
      href: "/dashboard/finance/customers",
      icon: Users,
      color: "bg-blue-600",
    },
    {
      title: "Invoicing & Billing",
      description: "Create invoices, track payments, and manage billing",
      href: "/dashboard/finance/invoices",
      icon: Receipt,
      color: "bg-green-600",
    },
    {
      title: "Sales Orders",
      description: "Manage sales orders and track order fulfillment",
      href: "/dashboard/finance/sales-orders",
      icon: ShoppingCart,
      color: "bg-purple-600",
    },
    {
      title: "Accounts Receivable",
      description: "Track customer payments and outstanding invoices",
      href: "/dashboard/finance/accounts-receivable",
      icon: DollarSign,
      color: "bg-emerald-600",
    },
    {
      title: "Tax Management",
      description: "Calculate taxes, manage tax codes, and generate tax reports",
      href: "/dashboard/finance/tax-management",
      icon: Calculator,
      color: "bg-red-600",
    },
    {
      title: "Accounts Payable",
      description: "Manage vendor bills, payments, and supplier relationships",
      href: "/dashboard/finance/accounts-payable",
      icon: FileCheck,
      color: "bg-yellow-600",
    },
    {
      title: "Fixed Assets",
      description: "Track and manage company assets and depreciation",
      href: "/dashboard/finance/fixed-assets",
      icon: Building2,
      color: "bg-slate-600",
    },
    {
      title: "Expense Tracking",
      description: "Track business expenses and manage reimbursements",
      href: "/dashboard/finance/expenses",
      icon: Wallet,
      color: "bg-amber-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Finance Module</h1>
        <p className="text-gray-600">
          Comprehensive financial management system with QuickBooks integration
        </p>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {financeModules.map((module) => {
          const IconComponent = module.icon;
          return (
            <Link key={module.href} href={module.href}>
              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`${module.color} p-3 rounded-lg text-white`}>
                    <IconComponent size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{module.title}</h3>
                    <p className="text-gray-600 text-sm">{module.description}</p>
                  </div>
                  <Button variant="outline" size="sm" className="mt-auto">
                    Open Module
                  </Button>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Stats */}
      <FinanceDashboardStats />
    </div>
  );
}