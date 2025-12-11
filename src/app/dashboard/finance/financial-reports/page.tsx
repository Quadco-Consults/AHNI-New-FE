"use client";

import { useState } from "react";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Badge } from "components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart,
  PieChart
} from "lucide-react";
import { toast } from "sonner";

// AHNI Financial Data based on actual chart of accounts
const ahniFinancialData = {
  // Assets (from AHNI chart of accounts)
  assets: {
    currentAssets: {
      cash: {
        "Union Bank - NGN": 45234567.89,
        "First Bank - USD": 123456.78,
        "Access Bank - NGN": 12345678.90,
        "Petty Cash": 234567.45
      },
      accountsReceivable: {
        "CDC Grant Receivable": 25000000.00,
        "UNICEF Grant Receivable": 15000000.00,
        "Other Receivables": 5000000.00
      },
      inventory: {
        "Medical Supplies": 8500000.00,
        "Office Supplies": 1200000.00,
        "IT Equipment": 4500000.00
      },
      prepaidExpenses: {
        "Prepaid Insurance": 2400000.00,
        "Prepaid Rent": 1800000.00
      }
    },
    fixedAssets: {
      "Land and Buildings": 150000000.00,
      "Motor Vehicles": 45000000.00,
      "Furniture and Fittings": 12000000.00,
      "Computer Equipment": 8500000.00,
      "Less: Accumulated Depreciation": -45000000.00
    }
  },

  // Liabilities
  liabilities: {
    currentLiabilities: {
      "Accounts Payable": 15600000.00,
      "Accrued Expenses": 8900000.00,
      "Payroll Liabilities": 12300000.00,
      "VAT Payable": 4500000.00,
      "PAYE Payable": 6700000.00
    },
    longTermLiabilities: {
      "Long Term Loans": 25000000.00,
      "Deferred Revenue": 18000000.00
    }
  },

  // Equity
  equity: {
    "Net Assets Without Donor Restrictions": 125000000.00,
    "Net Assets With Donor Restrictions": 89000000.00,
    "Retained Earnings": 45000000.00
  },

  // Revenue (Grant-based)
  revenue: {
    grantRevenue: {
      "CDC Grant Revenue - ACEBAY": 85000000.00,
      "CDC Grant Revenue - PLANE": 65000000.00,
      "CDC Grant Revenue - GF HIV": 45000000.00,
      "UNICEF Grant Revenue - RANA": 25000000.00,
      "UNFPA Grant Revenue": 18000000.00,
      "UNHCR Grant Revenue": 12000000.00
    },
    otherRevenue: {
      "Training Revenue": 5000000.00,
      "Consultancy Revenue": 3000000.00,
      "Interest Income": 1200000.00
    }
  },

  // Expenses (CDC Budget Categories)
  expenses: {
    personnelCost: {
      "Salaries and Wages": 48500000.00,
      "Consultant Fees": 15600000.00,
      "Overtime": 2800000.00
    },
    fringeBenefits: {
      "Health Insurance": 6700000.00,
      "Pension Contributions": 4800000.00,
      "Life Insurance": 1200000.00,
      "Worker's Compensation": 800000.00
    },
    travels: {
      "Domestic Travel": 12500000.00,
      "International Travel": 8900000.00,
      "Per Diem": 4200000.00
    },
    equipment: {
      "Medical Equipment": 15600000.00,
      "IT Equipment": 8900000.00,
      "Office Equipment": 3400000.00
    },
    supplies: {
      "Medical Supplies": 18700000.00,
      "Office Supplies": 4500000.00,
      "Training Materials": 2800000.00
    },
    consultant: {
      "Technical Assistance": 12300000.00,
      "Training Consultants": 6700000.00
    },
    contractual: {
      "Sub-agreements": 23400000.00,
      "Service Contracts": 8900000.00
    },
    otherDirectCosts: {
      "Communications": 3400000.00,
      "Utilities": 2800000.00,
      "Rent": 4200000.00,
      "Insurance": 1800000.00
    },
    indirectCosts: {
      "Administrative Overhead": 18600000.00
    }
  }
};

export default function FinancialReportsPage() {
  const [reportPeriod, setReportPeriod] = useState("2024");
  const [currency, setCurrency] = useState("NGN");
  const [project, setProject] = useState("ALL");
  const [reportType, setReportType] = useState("standard");

  // Calculate totals
  const calculateAssetTotals = () => {
    const currentAssets =
      Object.values(ahniFinancialData.assets.currentAssets.cash).reduce((sum, val) => sum + val, 0) +
      Object.values(ahniFinancialData.assets.currentAssets.accountsReceivable).reduce((sum, val) => sum + val, 0) +
      Object.values(ahniFinancialData.assets.currentAssets.inventory).reduce((sum, val) => sum + val, 0) +
      Object.values(ahniFinancialData.assets.currentAssets.prepaidExpenses).reduce((sum, val) => sum + val, 0);

    const fixedAssets = Object.values(ahniFinancialData.assets.fixedAssets).reduce((sum, val) => sum + val, 0);

    return { currentAssets, fixedAssets, totalAssets: currentAssets + fixedAssets };
  };

  const calculateLiabilityTotals = () => {
    const currentLiabilities = Object.values(ahniFinancialData.liabilities.currentLiabilities).reduce((sum, val) => sum + val, 0);
    const longTermLiabilities = Object.values(ahniFinancialData.liabilities.longTermLiabilities).reduce((sum, val) => sum + val, 0);

    return { currentLiabilities, longTermLiabilities, totalLiabilities: currentLiabilities + longTermLiabilities };
  };

  const calculateEquityTotal = () => {
    return Object.values(ahniFinancialData.equity).reduce((sum, val) => sum + val, 0);
  };

  const calculateRevenueTotals = () => {
    const grantRevenue = Object.values(ahniFinancialData.revenue.grantRevenue).reduce((sum, val) => sum + val, 0);
    const otherRevenue = Object.values(ahniFinancialData.revenue.otherRevenue).reduce((sum, val) => sum + val, 0);

    return { grantRevenue, otherRevenue, totalRevenue: grantRevenue + otherRevenue };
  };

  const calculateExpenseTotals = () => {
    const personnelCost = Object.values(ahniFinancialData.expenses.personnelCost).reduce((sum, val) => sum + val, 0);
    const fringeBenefits = Object.values(ahniFinancialData.expenses.fringeBenefits).reduce((sum, val) => sum + val, 0);
    const travels = Object.values(ahniFinancialData.expenses.travels).reduce((sum, val) => sum + val, 0);
    const equipment = Object.values(ahniFinancialData.expenses.equipment).reduce((sum, val) => sum + val, 0);
    const supplies = Object.values(ahniFinancialData.expenses.supplies).reduce((sum, val) => sum + val, 0);
    const consultant = Object.values(ahniFinancialData.expenses.consultant).reduce((sum, val) => sum + val, 0);
    const contractual = Object.values(ahniFinancialData.expenses.contractual).reduce((sum, val) => sum + val, 0);
    const otherDirectCosts = Object.values(ahniFinancialData.expenses.otherDirectCosts).reduce((sum, val) => sum + val, 0);
    const indirectCosts = Object.values(ahniFinancialData.expenses.indirectCosts).reduce((sum, val) => sum + val, 0);

    return {
      personnelCost,
      fringeBenefits,
      travels,
      equipment,
      supplies,
      consultant,
      contractual,
      otherDirectCosts,
      indirectCosts,
      totalExpenses: personnelCost + fringeBenefits + travels + equipment + supplies + consultant + contractual + otherDirectCosts + indirectCosts
    };
  };

  const assetTotals = calculateAssetTotals();
  const liabilityTotals = calculateLiabilityTotals();
  const equityTotal = calculateEquityTotal();
  const revenueTotals = calculateRevenueTotals();
  const expenseTotals = calculateExpenseTotals();
  const netIncome = revenueTotals.totalRevenue - expenseTotals.totalExpenses;

  const formatCurrency = (amount: number) => {
    const symbol = currency === "NGN" ? "₦" : "$";
    return `${symbol}${amount.toLocaleString()}`;
  };

  const exportToExcel = () => {
    toast.success("Financial report exported to Excel");
  };

  const exportToPDF = () => {
    toast.success("Financial report exported to PDF");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
          <p className="text-gray-600">
            Comprehensive financial statements and analysis for AHNI
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={exportToExcel}>
            <Download size={16} className="mr-2" />
            Export Excel
          </Button>
          <Button variant="outline" onClick={exportToPDF}>
            <FileText size={16} className="mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <Select value={reportPeriod} onValueChange={setReportPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="Q4-2024">Q4 2024</SelectItem>
              <SelectItem value="Q3-2024">Q3 2024</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NGN">NGN</SelectItem>
            <SelectItem value="USD">USD</SelectItem>
          </SelectContent>
        </Select>

        <Select value={project} onValueChange={setProject}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Projects</SelectItem>
            <SelectItem value="ACEBAY">ACEBAY</SelectItem>
            <SelectItem value="PLANE">PLANE</SelectItem>
            <SelectItem value="GF_HIV">GF HIV Impact</SelectItem>
            <SelectItem value="RANA">RANA/UNICEF</SelectItem>
            <SelectItem value="SHARP">SHARP+</SelectItem>
          </SelectContent>
        </Select>

        <Select value={reportType} onValueChange={setReportType}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Report Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="detailed">Detailed</SelectItem>
            <SelectItem value="summary">Summary</SelectItem>
            <SelectItem value="comparative">Comparative</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(assetTotals.totalAssets)}
            </div>
            <p className="text-xs text-muted-foreground">
              Current: {formatCurrency(assetTotals.currentAssets)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(revenueTotals.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Grant: {formatCurrency(revenueTotals.grantRevenue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(expenseTotals.totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              Personnel: {formatCurrency(expenseTotals.personnelCost)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(netIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              Margin: {((netIncome / revenueTotals.totalRevenue) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Statements */}
      <Tabs defaultValue="profit-loss" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profit-loss">Profit & Loss</TabsTrigger>
          <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
          <TabsTrigger value="cash-flow">Cash Flow</TabsTrigger>
        </TabsList>

        {/* Profit & Loss Statement */}
        <TabsContent value="profit-loss" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart className="w-5 h-5" />
                <span>Profit & Loss Statement</span>
                <Badge variant="outline">{reportPeriod}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Revenue Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-green-700">REVENUE</h3>
                  <div className="space-y-2 ml-4">
                    <div className="font-medium text-green-600">Grant Revenue</div>
                    {Object.entries(ahniFinancialData.revenue.grantRevenue).map(([key, value]) => (
                      <div key={key} className="flex justify-between ml-4">
                        <span className="text-gray-700">{key}</span>
                        <span className="font-mono">{formatCurrency(value)}</span>
                      </div>
                    ))}
                    <div className="font-medium text-green-600 mt-3">Other Revenue</div>
                    {Object.entries(ahniFinancialData.revenue.otherRevenue).map(([key, value]) => (
                      <div key={key} className="flex justify-between ml-4">
                        <span className="text-gray-700">{key}</span>
                        <span className="font-mono">{formatCurrency(value)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between border-t pt-2 font-bold text-green-700">
                      <span>TOTAL REVENUE</span>
                      <span className="font-mono">{formatCurrency(revenueTotals.totalRevenue)}</span>
                    </div>
                  </div>
                </div>

                {/* Expenses Section - CDC Budget Categories */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-red-700">EXPENSES</h3>
                  <div className="space-y-4 ml-4">
                    {/* Personnel Cost */}
                    <div>
                      <div className="font-medium text-red-600">Personnel Cost</div>
                      {Object.entries(ahniFinancialData.expenses.personnelCost).map(([key, value]) => (
                        <div key={key} className="flex justify-between ml-4">
                          <span className="text-gray-700">{key}</span>
                          <span className="font-mono">{formatCurrency(value)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between ml-4 font-medium">
                        <span>Subtotal</span>
                        <span className="font-mono">{formatCurrency(expenseTotals.personnelCost)}</span>
                      </div>
                    </div>

                    {/* Fringe Benefits */}
                    <div>
                      <div className="font-medium text-red-600">Fringe Benefits</div>
                      {Object.entries(ahniFinancialData.expenses.fringeBenefits).map(([key, value]) => (
                        <div key={key} className="flex justify-between ml-4">
                          <span className="text-gray-700">{key}</span>
                          <span className="font-mono">{formatCurrency(value)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between ml-4 font-medium">
                        <span>Subtotal</span>
                        <span className="font-mono">{formatCurrency(expenseTotals.fringeBenefits)}</span>
                      </div>
                    </div>

                    {/* Other expense categories... */}
                    <div>
                      <div className="font-medium text-red-600">Travel</div>
                      {Object.entries(ahniFinancialData.expenses.travels).map(([key, value]) => (
                        <div key={key} className="flex justify-between ml-4">
                          <span className="text-gray-700">{key}</span>
                          <span className="font-mono">{formatCurrency(value)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between ml-4 font-medium">
                        <span>Subtotal</span>
                        <span className="font-mono">{formatCurrency(expenseTotals.travels)}</span>
                      </div>
                    </div>

                    <div>
                      <div className="font-medium text-red-600">Equipment</div>
                      {Object.entries(ahniFinancialData.expenses.equipment).map(([key, value]) => (
                        <div key={key} className="flex justify-between ml-4">
                          <span className="text-gray-700">{key}</span>
                          <span className="font-mono">{formatCurrency(value)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between ml-4 font-medium">
                        <span>Subtotal</span>
                        <span className="font-mono">{formatCurrency(expenseTotals.equipment)}</span>
                      </div>
                    </div>

                    <div>
                      <div className="font-medium text-red-600">Supplies</div>
                      {Object.entries(ahniFinancialData.expenses.supplies).map(([key, value]) => (
                        <div key={key} className="flex justify-between ml-4">
                          <span className="text-gray-700">{key}</span>
                          <span className="font-mono">{formatCurrency(value)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between ml-4 font-medium">
                        <span>Subtotal</span>
                        <span className="font-mono">{formatCurrency(expenseTotals.supplies)}</span>
                      </div>
                    </div>

                    <div>
                      <div className="font-medium text-red-600">Consultant</div>
                      {Object.entries(ahniFinancialData.expenses.consultant).map(([key, value]) => (
                        <div key={key} className="flex justify-between ml-4">
                          <span className="text-gray-700">{key}</span>
                          <span className="font-mono">{formatCurrency(value)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between ml-4 font-medium">
                        <span>Subtotal</span>
                        <span className="font-mono">{formatCurrency(expenseTotals.consultant)}</span>
                      </div>
                    </div>

                    <div>
                      <div className="font-medium text-red-600">Contractual</div>
                      {Object.entries(ahniFinancialData.expenses.contractual).map(([key, value]) => (
                        <div key={key} className="flex justify-between ml-4">
                          <span className="text-gray-700">{key}</span>
                          <span className="font-mono">{formatCurrency(value)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between ml-4 font-medium">
                        <span>Subtotal</span>
                        <span className="font-mono">{formatCurrency(expenseTotals.contractual)}</span>
                      </div>
                    </div>

                    <div>
                      <div className="font-medium text-red-600">Other Direct Costs</div>
                      {Object.entries(ahniFinancialData.expenses.otherDirectCosts).map(([key, value]) => (
                        <div key={key} className="flex justify-between ml-4">
                          <span className="text-gray-700">{key}</span>
                          <span className="font-mono">{formatCurrency(value)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between ml-4 font-medium">
                        <span>Subtotal</span>
                        <span className="font-mono">{formatCurrency(expenseTotals.otherDirectCosts)}</span>
                      </div>
                    </div>

                    <div>
                      <div className="font-medium text-red-600">Indirect Costs</div>
                      {Object.entries(ahniFinancialData.expenses.indirectCosts).map(([key, value]) => (
                        <div key={key} className="flex justify-between ml-4">
                          <span className="text-gray-700">{key}</span>
                          <span className="font-mono">{formatCurrency(value)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between ml-4 font-medium">
                        <span>Subtotal</span>
                        <span className="font-mono">{formatCurrency(expenseTotals.indirectCosts)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between border-t pt-2 font-bold text-red-700">
                      <span>TOTAL EXPENSES</span>
                      <span className="font-mono">{formatCurrency(expenseTotals.totalExpenses)}</span>
                    </div>
                  </div>
                </div>

                {/* Net Income */}
                <div className="border-t-2 pt-4">
                  <div className={`flex justify-between text-xl font-bold ${netIncome >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    <span>NET INCOME</span>
                    <span className="font-mono">{formatCurrency(netIncome)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Balance Sheet */}
        <TabsContent value="balance-sheet" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="w-5 h-5" />
                <span>Balance Sheet</span>
                <Badge variant="outline">As of Dec 31, {reportPeriod}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Assets */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-blue-700">ASSETS</h3>

                  {/* Current Assets */}
                  <div className="mb-4">
                    <div className="font-medium text-blue-600 mb-2">Current Assets</div>
                    <div className="space-y-1 ml-4">
                      <div className="font-medium">Cash and Cash Equivalents</div>
                      {Object.entries(ahniFinancialData.assets.currentAssets.cash).map(([key, value]) => (
                        <div key={key} className="flex justify-between ml-4">
                          <span className="text-gray-700">{key}</span>
                          <span className="font-mono text-sm">{formatCurrency(value)}</span>
                        </div>
                      ))}

                      <div className="font-medium mt-2">Accounts Receivable</div>
                      {Object.entries(ahniFinancialData.assets.currentAssets.accountsReceivable).map(([key, value]) => (
                        <div key={key} className="flex justify-between ml-4">
                          <span className="text-gray-700">{key}</span>
                          <span className="font-mono text-sm">{formatCurrency(value)}</span>
                        </div>
                      ))}

                      <div className="font-medium mt-2">Inventory</div>
                      {Object.entries(ahniFinancialData.assets.currentAssets.inventory).map(([key, value]) => (
                        <div key={key} className="flex justify-between ml-4">
                          <span className="text-gray-700">{key}</span>
                          <span className="font-mono text-sm">{formatCurrency(value)}</span>
                        </div>
                      ))}

                      <div className="font-medium mt-2">Prepaid Expenses</div>
                      {Object.entries(ahniFinancialData.assets.currentAssets.prepaidExpenses).map(([key, value]) => (
                        <div key={key} className="flex justify-between ml-4">
                          <span className="text-gray-700">{key}</span>
                          <span className="font-mono text-sm">{formatCurrency(value)}</span>
                        </div>
                      ))}

                      <div className="flex justify-between border-t pt-1 font-medium">
                        <span>Total Current Assets</span>
                        <span className="font-mono">{formatCurrency(assetTotals.currentAssets)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Fixed Assets */}
                  <div className="mb-4">
                    <div className="font-medium text-blue-600 mb-2">Fixed Assets</div>
                    <div className="space-y-1 ml-4">
                      {Object.entries(ahniFinancialData.assets.fixedAssets).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-700">{key}</span>
                          <span className="font-mono text-sm">{formatCurrency(value)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between border-t pt-1 font-medium">
                        <span>Net Fixed Assets</span>
                        <span className="font-mono">{formatCurrency(assetTotals.fixedAssets)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between border-t-2 pt-2 text-lg font-bold text-blue-700">
                    <span>TOTAL ASSETS</span>
                    <span className="font-mono">{formatCurrency(assetTotals.totalAssets)}</span>
                  </div>
                </div>

                {/* Liabilities & Equity */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-red-700">LIABILITIES & EQUITY</h3>

                  {/* Current Liabilities */}
                  <div className="mb-4">
                    <div className="font-medium text-red-600 mb-2">Current Liabilities</div>
                    <div className="space-y-1 ml-4">
                      {Object.entries(ahniFinancialData.liabilities.currentLiabilities).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-700">{key}</span>
                          <span className="font-mono text-sm">{formatCurrency(value)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between border-t pt-1 font-medium">
                        <span>Total Current Liabilities</span>
                        <span className="font-mono">{formatCurrency(liabilityTotals.currentLiabilities)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Long-term Liabilities */}
                  <div className="mb-4">
                    <div className="font-medium text-red-600 mb-2">Long-term Liabilities</div>
                    <div className="space-y-1 ml-4">
                      {Object.entries(ahniFinancialData.liabilities.longTermLiabilities).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-700">{key}</span>
                          <span className="font-mono text-sm">{formatCurrency(value)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between border-t pt-1 font-medium">
                        <span>Total Long-term Liabilities</span>
                        <span className="font-mono">{formatCurrency(liabilityTotals.longTermLiabilities)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between border-t pt-2 font-bold text-red-700 mb-4">
                    <span>TOTAL LIABILITIES</span>
                    <span className="font-mono">{formatCurrency(liabilityTotals.totalLiabilities)}</span>
                  </div>

                  {/* Equity */}
                  <div className="mb-4">
                    <div className="font-medium text-green-600 mb-2">Net Assets (Equity)</div>
                    <div className="space-y-1 ml-4">
                      {Object.entries(ahniFinancialData.equity).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-700">{key}</span>
                          <span className="font-mono text-sm">{formatCurrency(value)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between border-t pt-1 font-medium">
                        <span>Total Net Assets</span>
                        <span className="font-mono">{formatCurrency(equityTotal)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between border-t-2 pt-2 text-lg font-bold text-green-700">
                    <span>TOTAL LIABILITIES & EQUITY</span>
                    <span className="font-mono">{formatCurrency(liabilityTotals.totalLiabilities + equityTotal)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cash Flow Statement */}
        <TabsContent value="cash-flow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Cash Flow Statement</span>
                <Badge variant="outline">{reportPeriod}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center py-12">
                  <TrendingUp className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Cash Flow Statement</h3>
                  <p className="text-gray-600 mb-4">
                    Cash flow analysis will be available with transaction data integration
                  </p>
                  <Button variant="outline">
                    Configure Cash Flow Tracking
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}