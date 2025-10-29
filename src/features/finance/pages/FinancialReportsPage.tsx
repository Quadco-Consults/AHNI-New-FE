"use client";

import { useState } from "react";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Card } from "components/ui/card";
import { Badge } from "components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import {
  Download,
  FileText,
  BarChart3,
  Calendar,
  Filter,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import {
  useGetTrialBalance,
  useGetIncomeStatement,
  useGetBalanceSheet,
  useGetCashFlowStatement,
  ReportFilters,
} from "../controllers/reportsController";

export default function FinancialReportsPage() {
  const [filters, setFilters] = useState<ReportFilters>({
    date_from: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // Start of current year
    date_to: new Date().toISOString().split('T')[0], // Today
  });

  const [activeReport, setActiveReport] = useState("trial-balance");

  // Data fetching hooks
  const { data: trialBalanceData, isLoading: trialLoading } = useGetTrialBalance(
    activeReport === "trial-balance" ? filters : undefined
  );
  const { data: incomeData, isLoading: incomeLoading } = useGetIncomeStatement(
    activeReport === "income-statement" ? filters : undefined
  );
  const { data: balanceSheetData, isLoading: balanceLoading } = useGetBalanceSheet(
    activeReport === "balance-sheet" ? filters : undefined
  );
  const { data: cashFlowData, isLoading: cashFlowLoading } = useGetCashFlowStatement(
    activeReport === "cash-flow" ? filters : undefined
  );

  const handleFilterChange = (key: keyof ReportFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const exportReport = (format: 'pdf' | 'excel') => {
    try {
      // Get current report data
      let reportData;
      let reportName = '';

      switch (activeReport) {
        case 'trial-balance':
          reportData = trialBalanceData?.data;
          reportName = 'Trial Balance';
          break;
        case 'income-statement':
          reportData = incomeData?.data;
          reportName = 'Income Statement';
          break;
        case 'balance-sheet':
          reportData = balanceSheetData?.data;
          reportName = 'Balance Sheet';
          break;
        case 'cash-flow':
          reportData = cashFlowData?.data;
          reportName = 'Cash Flow Statement';
          break;
        default:
          reportData = null;
      }

      if (!reportData) {
        console.warn('No data available for export');
        return;
      }

      // Generate filename with date range
      const dateFrom = filters.date_from ? new Date(filters.date_from).toLocaleDateString() : 'All';
      const dateTo = filters.date_to ? new Date(filters.date_to).toLocaleDateString() : 'All';
      const filename = `${reportName.replace(/\s+/g, '_')}_${dateFrom}_to_${dateTo}`;

      if (format === 'excel') {
        // Export as CSV (can be opened in Excel)
        exportToCSV(reportData, filename, activeReport);
      } else {
        // Export as PDF (placeholder for future implementation)
        console.log(`PDF export for ${reportName} - Feature coming soon`);
        // TODO: Implement PDF export using libraries like jsPDF or html2pdf
      }

    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const exportToCSV = (data: any, filename: string, reportType: string) => {
    let csvContent = '';

    try {
      switch (reportType) {
        case 'trial-balance':
          csvContent = 'Account Code,Account Name,Type,Debit,Credit,Balance\n';
          data.forEach((account: any) => {
            csvContent += `"${account.account_code}","${account.account_name}","${account.account_type}",${account.debit_balance},${account.credit_balance},${account.net_balance}\n`;
          });
          break;

        case 'income-statement':
          csvContent = 'Income Statement\n\n';
          csvContent += 'REVENUE\n';
          csvContent += 'Account,Amount\n';
          data.revenues?.forEach((rev: any) => {
            csvContent += `"${rev.account_name}",${rev.amount}\n`;
          });
          csvContent += `"Total Revenue",${data.total_revenue}\n\n`;

          csvContent += 'EXPENSES\n';
          csvContent += 'Account,Amount\n';
          data.expenses?.forEach((exp: any) => {
            csvContent += `"${exp.account_name}",${exp.amount}\n`;
          });
          csvContent += `"Total Expenses",${data.total_expenses}\n\n`;
          csvContent += `"Net Income",${data.net_income}\n`;
          break;

        case 'balance-sheet':
          csvContent = 'Balance Sheet\n\n';
          csvContent += 'ASSETS\n';
          csvContent += 'Account,Amount\n';
          data.assets?.current_assets?.forEach((asset: any) => {
            csvContent += `"${asset.account_name}",${asset.amount}\n`;
          });
          data.assets?.fixed_assets?.forEach((asset: any) => {
            csvContent += `"${asset.account_name}",${asset.amount}\n`;
          });
          csvContent += `"Total Assets",${data.assets?.total_assets}\n\n`;

          csvContent += 'LIABILITIES\n';
          data.liabilities?.current_liabilities?.forEach((liability: any) => {
            csvContent += `"${liability.account_name}",${liability.amount}\n`;
          });
          csvContent += `"Total Liabilities",${data.liabilities?.total_liabilities}\n\n`;

          csvContent += 'EQUITY\n';
          data.equity?.equity_accounts?.forEach((equity: any) => {
            csvContent += `"${equity.account_name}",${equity.amount}\n`;
          });
          csvContent += `"Total Equity",${data.equity?.total_equity}\n`;
          break;

        case 'cash-flow':
          csvContent = 'Cash Flow Statement\n\n';
          csvContent += 'OPERATING ACTIVITIES\n';
          csvContent += 'Description,Amount\n';
          data.operating_activities?.items?.forEach((item: any) => {
            csvContent += `"${item.description}",${item.amount}\n`;
          });
          csvContent += `"Net Cash from Operating",${data.operating_activities?.total}\n\n`;

          csvContent += 'INVESTING ACTIVITIES\n';
          data.investing_activities?.items?.forEach((item: any) => {
            csvContent += `"${item.description}",${item.amount}\n`;
          });
          csvContent += `"Net Cash from Investing",${data.investing_activities?.total}\n\n`;

          csvContent += 'FINANCING ACTIVITIES\n';
          data.financing_activities?.items?.forEach((item: any) => {
            csvContent += `"${item.description}",${item.amount}\n`;
          });
          csvContent += `"Net Cash from Financing",${data.financing_activities?.total}\n\n`;
          csvContent += `"Net Cash Flow",${data.net_cash_flow}\n`;
          break;
      }

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log(`Exported ${filename}.csv successfully`);
    } catch (error) {
      console.error('CSV export failed:', error);
    }
  };

  const ReportHeader = ({ title, description }: { title: string; description: string }) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => exportReport('pdf')}>
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportReport('excel')}>
            <Download className="w-4 h-4 mr-2" />
            Excel
          </Button>
        </div>
      </div>
      <div className="text-sm text-gray-600">
        Period: {new Date(filters.date_from || '').toLocaleDateString()} - {new Date(filters.date_to || '').toLocaleDateString()}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
          <p className="text-gray-600">
            Generate and export financial statements and analysis reports
          </p>
        </div>
        <Button onClick={() => exportReport('pdf')}>
          <Download size={20} className="mr-2" />
          Export Reports
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="text-blue-500" size={20} />
            <div>
              <p className="text-sm text-gray-600">Trial Balance</p>
              <p className="text-lg font-semibold">
                {trialBalanceData?.data?.length || 0} accounts
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="text-green-500" size={20} />
            <div>
              <p className="text-sm text-gray-600">Net Income</p>
              <p className="text-lg font-semibold">
                ${(incomeData?.data?.net_income || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="text-purple-500" size={20} />
            <div>
              <p className="text-sm text-gray-600">Total Assets</p>
              <p className="text-lg font-semibold">
                ${(balanceSheetData?.data?.assets?.total_assets || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <FileText className="text-orange-500" size={20} />
            <div>
              <p className="text-sm text-gray-600">Cash Flow</p>
              <p className="text-lg font-semibold">
                ${(cashFlowData?.data?.net_cash_flow || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium">Date Range:</span>
          </div>
          <Input
            type="date"
            value={filters.date_from || ""}
            onChange={(e) => handleFilterChange("date_from", e.target.value)}
            className="w-40"
          />
          <span className="text-gray-400">to</span>
          <Input
            type="date"
            value={filters.date_to || ""}
            onChange={(e) => handleFilterChange("date_to", e.target.value)}
            className="w-40"
          />

          <Select
            value={filters.account_type || "all"}
            onValueChange={(value) => handleFilterChange("account_type", value === "all" ? undefined : value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Account Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="ASSETS">Assets</SelectItem>
              <SelectItem value="LIABILITIES">Liabilities</SelectItem>
              <SelectItem value="EQUITY">Equity</SelectItem>
              <SelectItem value="REVENUE">Revenue</SelectItem>
              <SelectItem value="EXPENSES">Expenses</SelectItem>
            </SelectContent>
          </Select>

          <div className="ml-auto flex items-center space-x-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            <span>Report Filters</span>
          </div>
        </div>
      </Card>

      {/* Reports */}
      <Tabs value={activeReport} onValueChange={setActiveReport} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trial-balance">Trial Balance</TabsTrigger>
          <TabsTrigger value="income-statement">Income Statement</TabsTrigger>
          <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
          <TabsTrigger value="cash-flow">Cash Flow</TabsTrigger>
        </TabsList>

        {/* Trial Balance */}
        <TabsContent value="trial-balance">
          <Card className="p-6">
            <ReportHeader
              title="Trial Balance"
              description="Summary of all account balances to verify that debits equal credits"
            />

            {trialLoading ? (
              <div className="space-y-3 mt-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="mt-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Account Code</th>
                        <th className="text-left py-2">Account Name</th>
                        <th className="text-left py-2">Type</th>
                        <th className="text-right py-2">Debit</th>
                        <th className="text-right py-2">Credit</th>
                        <th className="text-right py-2">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trialBalanceData?.data?.map((account, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2 font-mono text-sm">{account.account_code}</td>
                          <td className="py-2">{account.account_name}</td>
                          <td className="py-2">
                            <Badge variant="outline" className="text-xs">
                              {account.account_type}
                            </Badge>
                          </td>
                          <td className="py-2 text-right font-mono">
                            ${account.debit_balance.toLocaleString()}
                          </td>
                          <td className="py-2 text-right font-mono">
                            ${account.credit_balance.toLocaleString()}
                          </td>
                          <td className="py-2 text-right font-mono font-semibold">
                            ${account.net_balance.toLocaleString()}
                          </td>
                        </tr>
                      )) || (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-gray-500">
                            No data available for the selected period
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Income Statement */}
        <TabsContent value="income-statement">
          <Card className="p-6">
            <ReportHeader
              title="Income Statement"
              description="Summary of revenues and expenses for the selected period"
            />

            {incomeLoading ? (
              <div className="space-y-4 mt-6">
                <div className="h-8 bg-gray-200 rounded animate-pulse" />
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-6 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-6 space-y-6">
                {/* Revenue Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Revenue</h3>
                  {incomeData?.data?.revenues?.map((revenue, index) => (
                    <div key={index} className="flex justify-between py-1">
                      <span>{revenue.account_name}</span>
                      <span className="font-mono">${revenue.amount.toLocaleString()}</span>
                    </div>
                  )) || <div className="text-gray-500">No revenue data</div>}
                  <div className="flex justify-between py-2 border-t border-b font-semibold">
                    <span>Total Revenue</span>
                    <span className="font-mono">${(incomeData?.data?.total_revenue || 0).toLocaleString()}</span>
                  </div>
                </div>

                {/* Expenses Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Expenses</h3>
                  {incomeData?.data?.expenses?.map((expense, index) => (
                    <div key={index} className="flex justify-between py-1">
                      <span>{expense.account_name}</span>
                      <span className="font-mono">${expense.amount.toLocaleString()}</span>
                    </div>
                  )) || <div className="text-gray-500">No expense data</div>}
                  <div className="flex justify-between py-2 border-t border-b font-semibold">
                    <span>Total Expenses</span>
                    <span className="font-mono">${(incomeData?.data?.total_expenses || 0).toLocaleString()}</span>
                  </div>
                </div>

                {/* Net Income */}
                <div className="flex justify-between py-4 border-t-2 border-gray-300 text-xl font-bold">
                  <span>Net Income</span>
                  <span className={`font-mono ${(incomeData?.data?.net_income || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${(incomeData?.data?.net_income || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Balance Sheet */}
        <TabsContent value="balance-sheet">
          <Card className="p-6">
            <ReportHeader
              title="Balance Sheet"
              description="Statement of financial position showing assets, liabilities, and equity"
            />

            {balanceLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {[1, 2].map((i) => (
                  <div key={i} className="space-y-3">
                    <div className="h-6 bg-gray-200 rounded animate-pulse" />
                    <div className="space-y-2">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="h-4 bg-gray-100 rounded animate-pulse" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Assets */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Assets</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Current Assets</h4>
                      {balanceSheetData?.data?.assets?.current_assets?.map((asset, index) => (
                        <div key={index} className="flex justify-between py-1 ml-4">
                          <span>{asset.account_name}</span>
                          <span className="font-mono">${asset.amount.toLocaleString()}</span>
                        </div>
                      )) || <div className="text-gray-500 ml-4">No current assets</div>}
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Fixed Assets</h4>
                      {balanceSheetData?.data?.assets?.fixed_assets?.map((asset, index) => (
                        <div key={index} className="flex justify-between py-1 ml-4">
                          <span>{asset.account_name}</span>
                          <span className="font-mono">${asset.amount.toLocaleString()}</span>
                        </div>
                      )) || <div className="text-gray-500 ml-4">No fixed assets</div>}
                    </div>
                    <div className="flex justify-between py-2 border-t font-semibold">
                      <span>Total Assets</span>
                      <span className="font-mono">${(balanceSheetData?.data?.assets?.total_assets || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Liabilities & Equity */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Liabilities & Equity</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Liabilities</h4>
                      {balanceSheetData?.data?.liabilities?.current_liabilities?.map((liability, index) => (
                        <div key={index} className="flex justify-between py-1 ml-4">
                          <span>{liability.account_name}</span>
                          <span className="font-mono">${liability.amount.toLocaleString()}</span>
                        </div>
                      )) || <div className="text-gray-500 ml-4">No liabilities</div>}
                      <div className="flex justify-between py-1 ml-4 font-medium">
                        <span>Total Liabilities</span>
                        <span className="font-mono">${(balanceSheetData?.data?.liabilities?.total_liabilities || 0).toLocaleString()}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Equity</h4>
                      {balanceSheetData?.data?.equity?.equity_accounts?.map((equity, index) => (
                        <div key={index} className="flex justify-between py-1 ml-4">
                          <span>{equity.account_name}</span>
                          <span className="font-mono">${equity.amount.toLocaleString()}</span>
                        </div>
                      )) || <div className="text-gray-500 ml-4">No equity accounts</div>}
                      <div className="flex justify-between py-1 ml-4 font-medium">
                        <span>Total Equity</span>
                        <span className="font-mono">${(balanceSheetData?.data?.equity?.total_equity || 0).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex justify-between py-2 border-t font-semibold">
                      <span>Total Liabilities & Equity</span>
                      <span className="font-mono">
                        ${((balanceSheetData?.data?.liabilities?.total_liabilities || 0) + (balanceSheetData?.data?.equity?.total_equity || 0)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Cash Flow */}
        <TabsContent value="cash-flow">
          <Card className="p-6">
            <ReportHeader
              title="Cash Flow Statement"
              description="Statement of cash flows from operating, investing, and financing activities"
            />

            {cashFlowLoading ? (
              <div className="space-y-4 mt-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded animate-pulse" />
                    <div className="space-y-1 ml-4">
                      {[1, 2].map((j) => (
                        <div key={j} className="h-4 bg-gray-100 rounded animate-pulse" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 space-y-6">
                {/* Operating Activities */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Operating Activities</h3>
                  {cashFlowData?.data?.operating_activities?.items?.map((item, index) => (
                    <div key={index} className="flex justify-between py-1 ml-4">
                      <span>{item.description}</span>
                      <span className="font-mono">${item.amount.toLocaleString()}</span>
                    </div>
                  )) || <div className="text-gray-500 ml-4">No operating activities</div>}
                  <div className="flex justify-between py-2 border-t font-semibold">
                    <span>Net Cash from Operating Activities</span>
                    <span className="font-mono">${(cashFlowData?.data?.operating_activities?.total || 0).toLocaleString()}</span>
                  </div>
                </div>

                {/* Investing Activities */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Investing Activities</h3>
                  {cashFlowData?.data?.investing_activities?.items?.map((item, index) => (
                    <div key={index} className="flex justify-between py-1 ml-4">
                      <span>{item.description}</span>
                      <span className="font-mono">${item.amount.toLocaleString()}</span>
                    </div>
                  )) || <div className="text-gray-500 ml-4">No investing activities</div>}
                  <div className="flex justify-between py-2 border-t font-semibold">
                    <span>Net Cash from Investing Activities</span>
                    <span className="font-mono">${(cashFlowData?.data?.investing_activities?.total || 0).toLocaleString()}</span>
                  </div>
                </div>

                {/* Financing Activities */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Financing Activities</h3>
                  {cashFlowData?.data?.financing_activities?.items?.map((item, index) => (
                    <div key={index} className="flex justify-between py-1 ml-4">
                      <span>{item.description}</span>
                      <span className="font-mono">${item.amount.toLocaleString()}</span>
                    </div>
                  )) || <div className="text-gray-500 ml-4">No financing activities</div>}
                  <div className="flex justify-between py-2 border-t font-semibold">
                    <span>Net Cash from Financing Activities</span>
                    <span className="font-mono">${(cashFlowData?.data?.financing_activities?.total || 0).toLocaleString()}</span>
                  </div>
                </div>

                {/* Net Cash Flow */}
                <div className="flex justify-between py-4 border-t-2 border-gray-300 text-xl font-bold">
                  <span>Net Cash Flow</span>
                  <span className={`font-mono ${(cashFlowData?.data?.net_cash_flow || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${(cashFlowData?.data?.net_cash_flow || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}