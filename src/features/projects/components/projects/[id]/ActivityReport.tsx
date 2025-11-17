"use client";

import { useState, useMemo } from "react";
import { Button } from "components/ui/button";
import Card from "components/Card";
import {
  FaDownload,
  FaFileExcel,
  FaFilePdf,
  FaChartLine,
  FaDollarSign,
  FaBullseye,
  FaUsers,
  FaClock,
  FaMoneyBillWave,
  FaHandHoldingUsd,
  FaReceipt,
  FaArrowUp,
  FaArrowDown,
  FaExclamationTriangle
} from "react-icons/fa";
import { toast } from "sonner";
import { IProjectSingleData } from "@/features/projects/types/project";
import {
  useGetProjectActivityReport,
  useGenerateProjectReport
} from "@/features/projects/controllers/projectController";

interface ActivityReportProps extends IProjectSingleData {
  budget_performance_calculated?: {
    budget_performance_percentage: number;
  };
  achievement_against_target_calculated?: {
    achievement_percentage: number;
  };
}

export default function ActivityReport(props: ActivityReportProps) {
  const {
    id,
    title,
    budget,
    currency,
    start_date,
    end_date,
    project_managers,
    beneficiaries,
    funding_sources,
    budget_performance_calculated,
    achievement_against_target_calculated,
    created_datetime,
    targets
  } = props;

  const [selectedDateRange, setSelectedDateRange] = useState<'all' | '30d' | '90d' | 'year'>('all');

  // Fetch real activity report data
  const {
    data: activityReportData,
    isLoading: isLoadingReport,
    error: reportError
  } = useGetProjectActivityReport(id, !!id);

  // Report generation hook
  const {
    generateReport,
    isLoading: isGeneratingReport
  } = useGenerateProjectReport(id);

  // Real financial data from API response
  const financialData = useMemo(() => {
    if (!activityReportData?.data?.data) {
      return {
        disbursements: [],
        fundRequests: [],
        expenses: []
      };
    }

    const data = activityReportData.data.data;
    return {
      disbursements: data.disbursements || [],
      fundRequests: data.fund_requests || [],
      expenses: data.expenses || []
    };
  }, [activityReportData]);

  // Calculate project statistics
  const projectStats = useMemo(() => {
    // Use real data from API or fallback to calculated values from project
    const reportData = activityReportData?.data?.data;
    const summary = reportData?.summary || {};
    const financialSummary = reportData?.financial_summary || {};


    // Get API response details first
    const achievementDetails = reportData?.achievement_details || {};
    const budgetDetails = reportData?.budget_details || {};

    const totalBudget = financialSummary.total_budget || Number(budget) || budgetDetails.total_project_budget || 0;
    const budgetPerformancePercentage = budgetDetails.budget_performance_percentage ||
      budget_performance_calculated?.budget_performance_percentage ||
      summary.budget_utilization_percentage || 0;
    const budgetUtilized = budgetDetails.completed_activities_budget ||
      (totalBudget * (budgetPerformancePercentage / 100));

    let daysPassed = summary.project_duration_days || 0;
    if (!daysPassed && start_date && end_date) {
      const projectDuration = new Date(end_date).getTime() - new Date(start_date).getTime();
      daysPassed = Math.floor(projectDuration / (1000 * 60 * 60 * 24));
    }

    // Use financial summary data from API for totals
    const totalDisbursements = financialSummary.total_disbursements || 0;
    const completedDisbursements = financialData.disbursements
      .filter((d: any) => d.status === 'Completed')
      .reduce((sum: number, d: any) => sum + d.amount, 0);

    const totalFundRequests = financialSummary.total_fund_requests || 0;
    const approvedFundRequests = financialData.fundRequests
      .filter((f: any) => f.status === 'Approved')
      .reduce((sum: number, f: any) => sum + f.amount, 0);

    const totalExpenses = financialSummary.total_expenses ||
      financialData.expenses.reduce((sum: number, e: any) => sum + e.amount, 0);
    const paidExpenses = financialData.expenses
      .filter((e: any) => e.status === 'paid')
      .reduce((sum: number, e: any) => sum + e.amount, 0);


    // Calculate target metrics from actual targets (props) with fallback to API data
    const totalTargets = targets?.length || achievementDetails.total_planned_activities || 1; // Default to 1 to avoid division by zero

    // Calculate achieved targets based on achievement percentage >= 80%
    const achievedTargets = targets?.filter((target: any) => {
      // Check if target has achievements and calculate percentage
      const achievements = target.achievements || [];
      if (achievements.length === 0) return false;

      // Get the latest or total achievement
      const totalAchieved = achievements.reduce((sum: number, ach: any) => sum + (Number(ach.actual) || 0), 0);
      const targetValue = Number(target.annual_target || target.target_value || 0);
      const achievementPercentage = targetValue > 0 ? (totalAchieved / targetValue * 100) : 0;

      return achievementPercentage >= 80;
    }).length || achievementDetails.total_completed_activities || 0;

    const targetAchievementPercentage = totalTargets > 0 ? (achievedTargets / totalTargets * 100) :
      (achievementDetails.achievement_percentage || achievement_against_target_calculated?.achievement_percentage || 0);

    return {
      totalTargets,
      achievedTargets,
      targetAchievementRate: targetAchievementPercentage,
      totalBudget,
      budgetUtilized,
      budgetUtilizationRate: budgetDetails.budget_performance_percentage || budget_performance_calculated?.budget_performance_percentage || 0,
      projectDuration: daysPassed,
      totalBeneficiaries: beneficiaries?.length || 0,
      totalManagers: project_managers?.length || 0,
      fundingSources: funding_sources?.length || 0,
      // Financial metrics
      totalDisbursements,
      completedDisbursements,
      disbursementRate: totalDisbursements > 0 ? (completedDisbursements / totalDisbursements * 100) : 0,
      totalFundRequests,
      approvedFundRequests,
      fundRequestApprovalRate: totalFundRequests > 0 ? (approvedFundRequests / totalFundRequests * 100) : 0,
      totalExpenses,
      paidExpenses,
      expensePaymentRate: totalExpenses > 0 ? (paidExpenses / totalExpenses * 100) : 0,
      cashFlow: financialSummary.cash_flow || (completedDisbursements - paidExpenses)
    };
  }, [activityReportData, budget, budget_performance_calculated, start_date, end_date, beneficiaries, project_managers, funding_sources, achievement_against_target_calculated, financialData, targets]);

  // Mock activity timeline data
  const activityTimeline = useMemo(() => [
    {
      id: '1',
      type: 'project_created',
      title: 'Project Created',
      description: `Project "${title}" was successfully created`,
      date: created_datetime,
      user: 'System',
      icon: FaBullseye,
      color: 'bg-green-500'
    },
    {
      id: '2',
      type: 'targets_defined',
      title: 'Targets Defined',
      description: `${projectStats.totalTargets} performance targets were set for the project`,
      date: created_datetime,
      user: 'Project Manager',
      icon: FaChartLine,
      color: 'bg-blue-500'
    },
    {
      id: '3',
      type: 'budget_allocated',
      title: 'Budget Allocated',
      description: `Budget of ${currency} ${Number(budget).toLocaleString()} allocated to the project`,
      date: created_datetime,
      user: 'Finance Team',
      icon: FaDollarSign,
      color: 'bg-yellow-500'
    },
    {
      id: '4',
      type: 'team_assigned',
      title: 'Team Assigned',
      description: `${projectStats.totalManagers} project managers assigned`,
      date: created_datetime,
      user: 'HR Team',
      icon: FaUsers,
      color: 'bg-purple-500'
    }
  ], [title, created_datetime, projectStats.totalTargets, projectStats.totalManagers, currency, budget]);

  const handleDownloadReport = async (format: 'pdf' | 'excel' | 'csv') => {
    try {
      // Convert selectedDateRange to actual dates if needed
      let start_date, end_date;
      const now = new Date();

      switch (selectedDateRange) {
        case '30d':
          start_date = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          end_date = now.toISOString().split('T')[0];
          break;
        case '90d':
          start_date = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          end_date = now.toISOString().split('T')[0];
          break;
        case 'year':
          start_date = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
          end_date = now.toISOString().split('T')[0];
          break;
        case 'all':
        default:
          start_date = start_date;
          end_date = end_date;
          break;
      }

      // Call real API to generate and download report
      await generateReport({
        type: format,
        start_date,
        end_date
      });

      toast.success(`${format.toUpperCase()} report downloaded successfully`);
    } catch (error) {
      console.error('Report download error:', error);
      toast.error(`Failed to download ${format.toUpperCase()} report`);
    }
  };

  // Show loading state while fetching data
  if (isLoadingReport) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-gray-500">Loading activity report data...</div>
          </div>
        </Card>
      </div>
    );
  }

  // Show error state if data fetch failed
  if (reportError) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center justify-center h-32 text-red-500">
            <FaExclamationTriangle className="mr-2" />
            Error loading activity report: {reportError.message}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Target Achievement</p>
              <p className="text-2xl font-bold text-green-600">
                {projectStats.targetAchievementRate.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500">
                {projectStats.achievedTargets} of {projectStats.totalTargets} targets
              </p>
            </div>
            <FaBullseye className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Budget Utilization</p>
              <p className="text-2xl font-bold text-blue-600">
                {projectStats.budgetUtilizationRate.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500">
                {currency} {projectStats.budgetUtilized.toLocaleString()} used
              </p>
            </div>
            <FaDollarSign className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Project Duration</p>
              <p className="text-2xl font-bold text-purple-600">
                {Math.abs(projectStats.projectDuration)}
              </p>
              <p className="text-xs text-gray-500">
                days planned
              </p>
            </div>
            <FaClock className="h-8 w-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Beneficiaries</p>
              <p className="text-2xl font-bold text-orange-600">
                {projectStats.totalBeneficiaries}
              </p>
              <p className="text-xs text-gray-500">
                target populations
              </p>
            </div>
            <FaUsers className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Disbursements</p>
              <p className="text-2xl font-bold text-green-600">
                {currency} {projectStats.totalDisbursements.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                {projectStats.disbursementRate.toFixed(1)}% completed
              </p>
            </div>
            <FaMoneyBillWave className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Fund Requests</p>
              <p className="text-2xl font-bold text-blue-600">
                {currency} {projectStats.totalFundRequests.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                {projectStats.fundRequestApprovalRate.toFixed(1)}% approved
              </p>
            </div>
            <FaHandHoldingUsd className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">
                {currency} {projectStats.totalExpenses.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                {projectStats.expensePaymentRate.toFixed(1)}% paid
              </p>
            </div>
            <FaReceipt className="h-8 w-8 text-red-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cash Flow</p>
              <p className="text-2xl font-bold text-purple-600">
                {currency} {projectStats.cashFlow.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                available balance
              </p>
            </div>
            {projectStats.cashFlow >= 0 ?
              <FaArrowUp className="h-8 w-8 text-green-500" /> :
              <FaArrowDown className="h-8 w-8 text-red-500" />
            }
          </div>
        </Card>
      </div>

      {/* Report Generation Section */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold">Generate Reports</h3>
            <p className="text-sm text-gray-600">Download comprehensive project reports and statistics</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Time</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => handleDownloadReport('pdf')}
            disabled={isGeneratingReport}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50"
          >
            <FaFilePdf className="h-4 w-4" />
            {isGeneratingReport ? 'Generating...' : 'Download PDF Report'}
          </Button>

          <Button
            onClick={() => handleDownloadReport('excel')}
            disabled={isGeneratingReport}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            <FaFileExcel className="h-4 w-4" />
            {isGeneratingReport ? 'Generating...' : 'Download Excel Report'}
          </Button>

          <Button
            onClick={() => handleDownloadReport('csv')}
            disabled={isGeneratingReport}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            <FaDownload className="h-4 w-4" />
            {isGeneratingReport ? 'Generating...' : 'Download CSV Data'}
          </Button>
        </div>
      </Card>

      {/* Activity Timeline */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Project Activity Timeline</h3>
        <div className="space-y-4">
          {activityTimeline.map((activity) => {
            const IconComponent = activity.icon;
            return (
              <div key={activity.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                <div className={`p-2 rounded-full ${activity.color} text-white flex-shrink-0`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{activity.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-2">By {activity.user}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(activity.date).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Detailed Statistics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Detailed Project Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Performance Metrics</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Targets Defined:</span>
                <span className="font-medium">{projectStats.totalTargets}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Targets Achieved (≥80%):</span>
                <span className="font-medium">{projectStats.achievedTargets}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Achievement Rate:</span>
                <span className="font-medium">{projectStats.targetAchievementRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Financial Overview</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Budget:</span>
                <span className="font-medium">{currency} {Number(budget).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Budget Utilized:</span>
                <span className="font-medium">{currency} {projectStats.budgetUtilized.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Utilization Rate:</span>
                <span className="font-medium">{projectStats.budgetUtilizationRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Detailed Financial Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Disbursements Table */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaMoneyBillWave className="h-5 w-5 text-green-500" />
            Recent Disbursements
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-900">Date</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-900">Amount</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-900">Status</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-900">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {financialData.disbursements.map((disbursement: any) => (
                  <tr key={disbursement.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-gray-900">
                      {new Date(disbursement.date).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2 font-medium text-gray-900">
                      {currency} {disbursement.amount.toLocaleString()}
                    </td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        disbursement.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {disbursement.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-gray-600 text-xs">
                      {disbursement.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Fund Requests Table */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaHandHoldingUsd className="h-5 w-5 text-blue-500" />
            Fund Requests
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-900">Date</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-900">Amount</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-900">Status</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-900">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {financialData.fundRequests.map((request: any) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-gray-900">
                      {new Date(request.date).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2 font-medium text-gray-900">
                      {currency} {request.amount.toLocaleString()}
                    </td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        request.status === 'Approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {request.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-gray-600 text-xs">
                      {request.location}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Expenses Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaReceipt className="h-5 w-5 text-red-500" />
          Recent Expenses
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-900">Date</th>
                <th className="px-3 py-2 text-left font-medium text-gray-900">Amount</th>
                <th className="px-3 py-2 text-left font-medium text-gray-900">Category</th>
                <th className="px-3 py-2 text-left font-medium text-gray-900">Vendor</th>
                <th className="px-3 py-2 text-left font-medium text-gray-900">Status</th>
                <th className="px-3 py-2 text-left font-medium text-gray-900">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {financialData.expenses.map((expense: any) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-gray-900">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 font-medium text-gray-900">
                    {currency} {expense.amount.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-gray-700">
                    {expense.category}
                  </td>
                  <td className="px-3 py-2 text-gray-700">
                    {expense.vendor}
                  </td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      expense.status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {expense.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-gray-600 text-xs">
                    {expense.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Financial Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Financial Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <FaMoneyBillWave className="h-4 w-4 text-green-500" />
              Disbursement Overview
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Requested:</span>
                <span className="font-medium">{currency} {projectStats.totalDisbursements.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Completed:</span>
                <span className="font-medium">{currency} {projectStats.completedDisbursements.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Completion Rate:</span>
                <span className="font-medium">{projectStats.disbursementRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <FaHandHoldingUsd className="h-4 w-4 text-blue-500" />
              Fund Requests
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Requested:</span>
                <span className="font-medium">{currency} {projectStats.totalFundRequests.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Approved:</span>
                <span className="font-medium">{currency} {projectStats.approvedFundRequests.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Approval Rate:</span>
                <span className="font-medium">{projectStats.fundRequestApprovalRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <FaReceipt className="h-4 w-4 text-red-500" />
              Expense Tracking
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Expenses:</span>
                <span className="font-medium">{currency} {projectStats.totalExpenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Paid:</span>
                <span className="font-medium">{currency} {projectStats.paidExpenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Payment Rate:</span>
                <span className="font-medium">{projectStats.expensePaymentRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}