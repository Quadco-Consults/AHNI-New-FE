"use client";

import React, { useState } from "react";
import { Plus, FileText, Clock, CheckCircle, DollarSign, Search, Filter } from "lucide-react";

// UI Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Custom Components
import CreateTER from "./CreateTER";
import ReconciliationView from "./ReconciliationView";

// Controllers
import {
  useGetEmployeeTravelExpenses,
  formatReconciliationSummary,
} from "@/features/hr/controllers/employeeTravelExpenseController";

export default function TravelExpenses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);

  // Fetch employee's travel expenses
  const { data: expensesData, isLoading, refetch } = useGetEmployeeTravelExpenses({
    page: 1,
    size: 20,
    search: searchTerm,
    status: selectedStatus === "all" ? "" : selectedStatus,
  });

  const expenses = expensesData?.data?.results || [];

  // Statistics
  const stats = React.useMemo(() => {
    const total = expenses.length;
    const pending = expenses.filter((e: any) => e.status === "PENDING").length;
    const approved = expenses.filter((e: any) => e.status === "APPROVED").length;
    const awaitingReconciliation = expenses.filter((e: any) => e.status === "APPROVED" && !e.reconciliation).length;

    return { total, pending, approved, awaitingReconciliation };
  }, [expenses]);

  // Status badge helper
  const getStatusBadge = (status: string) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      REVIEWED: "bg-blue-100 text-blue-800",
      AUTHORIZED: "bg-purple-100 text-purple-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
    };

    return (
      <Badge className={colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {status}
      </Badge>
    );
  };

  // Handle create success
  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    refetch();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Travel Expenses</h1>
          <p className="text-gray-600">
            Submit travel expense reports and track reimbursements
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Submit New TER
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Submit Travel Expense Report</DialogTitle>
              <DialogDescription>
                Create a new travel expense report for your recent site visit
              </DialogDescription>
            </DialogHeader>
            <CreateTER
              onSuccess={handleCreateSuccess}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time submissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Successfully processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Awaiting Reconciliation</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.awaitingReconciliation}</div>
            <p className="text-xs text-muted-foreground">Need budget comparison</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="expenses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="expenses">My TER Submissions</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation Status</TabsTrigger>
          <TabsTrigger value="help">TER Guidelines</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Travel Expense Reports</CardTitle>
                  <CardDescription>
                    View and manage your submitted travel expense reports
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by travel purpose or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="REVIEWED">Reviewed</SelectItem>
                    <SelectItem value="AUTHORIZED">Authorized</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Expenses Table */}
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="ml-2">Loading your travel expenses...</span>
                </div>
              ) : expenses.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Submission Date</TableHead>
                      <TableHead>Travel Purpose</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Total Claimed</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((expense: any) => (
                      <TableRow key={expense.id}>
                        <TableCell>
                          {new Date(expense.created_datetime).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {expense.travel_purpose}
                        </TableCell>
                        <TableCell>
                          {expense.activities?.length || 0} day{expense.activities?.length !== 1 ? 's' : ''}
                        </TableCell>
                        <TableCell>
                          ₦{(expense.activities?.reduce((total: number, activity: any) => {
                            return total +
                              parseFloat(activity.airport_taxi_fee || 0) +
                              parseFloat(activity.registration_fee || 0) +
                              parseFloat(activity.inter_city_taxi_fee || 0) +
                              parseFloat(activity.others || 0);
                          }, 0) || 0).toLocaleString()}
                        </TableCell>
                        <TableCell>{getStatusBadge(expense.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedExpense(expense)}
                            >
                              <FileText className="h-4 w-4" />
                              View
                            </Button>
                            {expense.status === "APPROVED" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {/* Navigate to reconciliation */}}
                              >
                                <DollarSign className="h-4 w-4" />
                                Reconcile
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No travel expense reports</h3>
                  <p className="text-gray-600 mb-4">
                    You haven't submitted any travel expense reports yet.
                  </p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Your First TER
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reconciliation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Reconciliation</CardTitle>
              <CardDescription>
                Compare your actual expenses against budgeted allowances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReconciliationView expenses={expenses.filter((e: any) => e.status === "APPROVED")} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="help" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>TER Submission Guidelines</CardTitle>
              <CardDescription>
                Important information about submitting travel expense reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-lg mb-3">📝 What is a Travel Expense Report (TER)?</h4>
                  <p className="text-gray-600">
                    A TER documents your actual travel expenses incurred during official site visits. It's used to reconcile against your pre-approved travel allowances and determine reimbursements or fund returns.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-3">⏰ When to Submit</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Submit within 7 days of completing your site visit</li>
                    <li>Only submit for approved site visits</li>
                    <li>Ensure all receipts are collected before submission</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-3">💰 Expense Categories</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li><strong>Airport Taxi:</strong> Transportation to/from airports</li>
                    <li><strong>Registration Fees:</strong> Event or conference registration costs</li>
                    <li><strong>Inter-City Taxi:</strong> Transportation between cities</li>
                    <li><strong>Other Expenses:</strong> Miscellaneous approved travel costs</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-3">📄 Required Documents</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Receipts for all claimed expenses</li>
                    <li>Boarding passes or travel tickets</li>
                    <li>Hotel receipts (if accommodation was paid separately)</li>
                    <li>Any other supporting documentation</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-3">🔄 Reconciliation Process</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Your actual expenses are compared against budgeted allowances</li>
                    <li>If you spent more: Difference may be reimbursed (subject to approval)</li>
                    <li>If you spent less: You must return the unspent funds to AHNI</li>
                    <li>Equal amounts: No further action required</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important Notes</h4>
                  <ul className="list-disc list-inside text-yellow-700 space-y-1 text-sm">
                    <li>All expenses must be reasonable and justified</li>
                    <li>Luxury or excessive expenses may not be reimbursed</li>
                    <li>Keep all original receipts for audit purposes</li>
                    <li>Contact the finance team if you have questions about eligible expenses</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Expense Detail Dialog */}
      {selectedExpense && (
        <Dialog open={!!selectedExpense} onOpenChange={() => setSelectedExpense(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Travel Expense Report Details</DialogTitle>
              <DialogDescription>
                Submitted on {new Date(selectedExpense.created_datetime).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            {/* Add detailed view component here */}
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Travel Purpose:</h4>
                <p>{selectedExpense.travel_purpose}</p>
              </div>
              <div>
                <h4 className="font-semibold">Status:</h4>
                {getStatusBadge(selectedExpense.status)}
              </div>
              {/* Add more details as needed */}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
