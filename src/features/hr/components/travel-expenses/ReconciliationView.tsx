"use client";

import React, { useState } from "react";
import { Calculator, DollarSign, TrendingUp, TrendingDown, Equal, AlertCircle, CheckCircle, Clock, Banknote } from "lucide-react";

// Custom Components
import ReconciliationDocuments from "./ReconciliationDocuments";
import { toast } from "sonner";

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Controllers
import {
  useCalculateReconciliation,
  useProcessReconciliation,
  calculateActualTotal,
  calculateReconciliationDifference,
  getReconciliationType,
  formatReconciliationSummary,
} from "@/features/hr/controllers/employeeTravelExpenseController";

interface ReconciliationViewProps {
  expenses: any[];
}

const ReconciliationView: React.FC<ReconciliationViewProps> = ({ expenses }) => {
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const { calculateReconciliation } = useCalculateReconciliation();
  const { processReconciliation } = useProcessReconciliation();

  // Process reconciliation for an expense
  const handleCalculateReconciliation = async (expense: any) => {
    setIsCalculating(true);
    try {
      await calculateReconciliation(expense.id);
      toast.success("Reconciliation calculated successfully");
      // Refresh data would happen here in real app
    } catch (error: any) {
      toast.error("Failed to calculate reconciliation: " + (error.message || "Unknown error"));
    } finally {
      setIsCalculating(false);
    }
  };

  // Helper function to calculate reconciliation data
  const calculateReconciliationData = (expense: any) => {
    const actualTotal = calculateActualTotal(expense.activities || []);

    // Get budgeted amounts from site visit or expense authorization
    const budgetedTotal = expense.expense_authorization?.budgeted_total ||
                          expense.site_visit?.travel_fees?.total_cost || 0;

    const difference = calculateReconciliationDifference(budgetedTotal, actualTotal);
    const reconciliationType = getReconciliationType(difference);
    const reconciliationAmount = Math.abs(difference);

    return {
      actualTotal,
      budgetedTotal,
      difference,
      reconciliationType,
      reconciliationAmount,
      needsAction: reconciliationAmount > 0, // Only needs action if there's a difference
    };
  };

  // Get reconciliation status badge
  const getReconciliationStatusBadge = (reconciliation: any) => {
    if (!reconciliation) {
      return <Badge variant="outline" className="text-gray-600">Not Calculated</Badge>;
    }

    const statusColors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      PROCESSED: "bg-blue-100 text-blue-800",
      COMPLETED: "bg-green-100 text-green-800",
    };

    return (
      <Badge className={statusColors[reconciliation.reconciliation_status as keyof typeof statusColors]}>
        {reconciliation.reconciliation_status}
      </Badge>
    );
  };

  // Get difference icon and color
  const getDifferenceDisplay = (difference: number) => {
    if (difference > 0) {
      return {
        icon: <TrendingUp className="h-4 w-4 text-red-600" />,
        color: "text-red-600",
        bgColor: "bg-red-50 border-red-200",
        label: "Reimbursement Due",
      };
    } else if (difference < 0) {
      return {
        icon: <TrendingDown className="h-4 w-4 text-orange-600" />,
        color: "text-orange-600",
        bgColor: "bg-orange-50 border-orange-200",
        label: "Retirement Required",
      };
    } else {
      return {
        icon: <Equal className="h-4 w-4 text-green-600" />,
        color: "text-green-600",
        bgColor: "bg-green-50 border-green-200",
        label: "Balanced",
      };
    }
  };

  // Prepare reconciliation summary
  const reconciliationSummary = React.useMemo(() => {
    const summary = {
      total: expenses.length,
      needsReconciliation: 0,
      reimbursementDue: 0,
      retirementRequired: 0,
      totalReimbursement: 0,
      totalRetirement: 0,
      balanced: 0,
    };

    expenses.forEach((expense) => {
      const data = calculateReconciliationData(expense);

      if (data.needsAction) {
        summary.needsReconciliation++;

        if (data.reconciliationType === "REIMBURSEMENT") {
          summary.reimbursementDue++;
          summary.totalReimbursement += data.reconciliationAmount;
        } else {
          summary.retirementRequired++;
          summary.totalRetirement += data.reconciliationAmount;
        }
      } else {
        summary.balanced++;
      }
    });

    return summary;
  }, [expenses]);

  return (
    <div className="space-y-6">
      {/* Reconciliation Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Approved TERs</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{reconciliationSummary.total}</div>
            <p className="text-xs text-muted-foreground">Ready for reconciliation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reimbursements Due</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{reconciliationSummary.reimbursementDue}</div>
            <p className="text-xs text-muted-foreground">
              ₦{reconciliationSummary.totalReimbursement.toLocaleString()} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retirement Required</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{reconciliationSummary.retirementRequired}</div>
            <p className="text-xs text-muted-foreground">
              ₦{reconciliationSummary.totalRetirement.toLocaleString()} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balanced</CardTitle>
            <Equal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{reconciliationSummary.balanced}</div>
            <p className="text-xs text-muted-foreground">No action required</p>
          </CardContent>
        </Card>
      </div>

      {/* Reconciliation Instructions */}
      {reconciliationSummary.needsReconciliation > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You have {reconciliationSummary.needsReconciliation} expense report{reconciliationSummary.needsReconciliation !== 1 ? 's' : ''} that require reconciliation.
            Please review the details below and contact the finance team for payment processing.
          </AlertDescription>
        </Alert>
      )}

      {/* Reconciliation Table */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Reconciliation Details</CardTitle>
          <CardDescription>
            Compare your actual expenses against budgeted allowances
          </CardDescription>
        </CardHeader>
        <CardContent>
          {expenses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Travel Purpose</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Budgeted Amount</TableHead>
                  <TableHead>Actual Expenses</TableHead>
                  <TableHead>Difference</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => {
                  const reconciliationData = calculateReconciliationData(expense);
                  const differenceDisplay = getDifferenceDisplay(reconciliationData.difference);

                  return (
                    <TableRow key={expense.id}>
                      <TableCell className="max-w-xs truncate">
                        {expense.travel_purpose}
                      </TableCell>
                      <TableCell>
                        {new Date(expense.created_datetime).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        ₦{reconciliationData.budgetedTotal.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        ₦{reconciliationData.actualTotal.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-2 ${differenceDisplay.color}`}>
                          {differenceDisplay.icon}
                          <span className="font-medium">
                            ₦{reconciliationData.reconciliationAmount.toLocaleString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getReconciliationStatusBadge(expense.reconciliation)}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedExpense(expense)}
                            >
                              <Calculator className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Reconciliation Details</DialogTitle>
                              <DialogDescription>
                                Detailed breakdown of budgeted vs actual expenses
                              </DialogDescription>
                            </DialogHeader>

                            {selectedExpense && (
                              <ReconciliationDetails
                                expense={selectedExpense}
                                reconciliationData={calculateReconciliationData(selectedExpense)}
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No approved expenses</h3>
              <p className="text-gray-600">
                Once your travel expense reports are approved, they will appear here for reconciliation.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Reconciliation Details Component
const ReconciliationDetails: React.FC<{
  expense: any;
  reconciliationData: any;
}> = ({ expense, reconciliationData }) => {
  const differenceDisplay = getDifferenceDisplay(reconciliationData.difference);

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <div className={`rounded-lg border p-4 ${differenceDisplay.bgColor}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {differenceDisplay.icon}
            <h3 className={`font-semibold ${differenceDisplay.color}`}>
              {differenceDisplay.label}
            </h3>
          </div>
          <Badge variant="outline" className={differenceDisplay.color}>
            ₦{reconciliationData.reconciliationAmount.toLocaleString()}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium">Budgeted:</span>
            <div className="text-lg font-bold">₦{reconciliationData.budgetedTotal.toLocaleString()}</div>
          </div>
          <div>
            <span className="font-medium">Actual:</span>
            <div className="text-lg font-bold">₦{reconciliationData.actualTotal.toLocaleString()}</div>
          </div>
          <div>
            <span className="font-medium">Difference:</span>
            <div className={`text-lg font-bold ${differenceDisplay.color}`}>
              {reconciliationData.difference > 0 ? "+" : ""}₦{reconciliationData.reconciliationAmount.toLocaleString()}
            </div>
          </div>
        </div>

        {reconciliationData.needsAction && (
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {reconciliationData.reconciliationType === "REIMBURSEMENT"
                ? `You are entitled to a reimbursement of ₦${reconciliationData.reconciliationAmount.toLocaleString()}. Please contact the finance team to process this payment.`
                : `You need to return ₦${reconciliationData.reconciliationAmount.toLocaleString()} to AHNI as you spent less than the budgeted allowance.`
              }
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Activity Breakdown */}
      <div>
        <h4 className="font-semibold mb-3">Daily Expense Breakdown</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Airport Taxi</TableHead>
              <TableHead>Registration</TableHead>
              <TableHead>Inter-City Taxi</TableHead>
              <TableHead>Others</TableHead>
              <TableHead>Daily Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(expense.activities || []).map((activity: any, index: number) => {
              const dayTotal =
                parseFloat(activity.airport_taxi_fee || 0) +
                parseFloat(activity.registration_fee || 0) +
                parseFloat(activity.inter_city_taxi_fee || 0) +
                parseFloat(activity.others || 0);

              return (
                <TableRow key={index}>
                  <TableCell>{activity.date}</TableCell>
                  <TableCell>₦{parseFloat(activity.airport_taxi_fee || 0).toLocaleString()}</TableCell>
                  <TableCell>₦{parseFloat(activity.registration_fee || 0).toLocaleString()}</TableCell>
                  <TableCell>₦{parseFloat(activity.inter_city_taxi_fee || 0).toLocaleString()}</TableCell>
                  <TableCell>₦{parseFloat(activity.others || 0).toLocaleString()}</TableCell>
                  <TableCell className="font-medium">₦{dayTotal.toLocaleString()}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Budget vs Actual Comparison */}
      <div>
        <h4 className="font-semibold mb-3">Budget vs Actual Comparison</h4>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Budgeted Allowance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Allowance:</span>
                  <span className="font-medium">₦{reconciliationData.budgetedTotal.toLocaleString()}</span>
                </div>
                <div className="text-xs text-gray-600">
                  Based on site visit budget or expense authorization
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Actual Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Claimed:</span>
                  <span className="font-medium">₦{reconciliationData.actualTotal.toLocaleString()}</span>
                </div>
                <div className="text-xs text-gray-600">
                  Sum of all daily expenses submitted
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reconciliation Documents */}
      {expense.reconciliation && (
        <div>
          <ReconciliationDocuments reconciliation={expense.reconciliation} />
        </div>
      )}

      {/* Next Steps */}
      <div>
        <h4 className="font-semibold mb-3">Next Steps</h4>
        <div className="space-y-3">
          {reconciliationData.reconciliationType === "REIMBURSEMENT" ? (
            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Banknote className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium text-blue-900">Reimbursement Process</div>
                <div className="text-sm text-blue-700">
                  Contact the finance team with this reconciliation report. They will review and process your reimbursement payment.
                </div>
              </div>
            </div>
          ) : reconciliationData.reconciliationType === "RETIREMENT" ? (
            <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <TrendingDown className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <div className="font-medium text-orange-900">Fund Retirement Required</div>
                <div className="text-sm text-orange-700">
                  You need to return the unspent funds to AHNI. Please coordinate with the finance team for the return process.
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-green-900">Perfect Balance</div>
                <div className="text-sm text-green-700">
                  Your expenses exactly match the budgeted allowance. No further action is required.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function moved outside component to avoid redefinition
function getDifferenceDisplay(difference: number) {
  if (difference > 0) {
    return {
      icon: <TrendingUp className="h-4 w-4 text-red-600" />,
      color: "text-red-600",
      bgColor: "bg-red-50 border-red-200",
      label: "Reimbursement Due",
    };
  } else if (difference < 0) {
    return {
      icon: <TrendingDown className="h-4 w-4 text-orange-600" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50 border-orange-200",
      label: "Retirement Required",
    };
  } else {
    return {
      icon: <Equal className="h-4 w-4 text-green-600" />,
      color: "text-green-600",
      bgColor: "bg-green-50 border-green-200",
      label: "Balanced",
    };
  }
}

export default ReconciliationView;