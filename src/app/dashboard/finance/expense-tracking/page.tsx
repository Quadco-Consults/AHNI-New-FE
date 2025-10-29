"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Search, Plus, Filter, Download, Receipt, CreditCard, Calendar, DollarSign, TrendingUp, FileText, Image, Edit, Trash2 } from "lucide-react";
import DataTable from "@/components/DataTable";

const ExpenseTrackingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState("this-month");
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [isReimbursementDialogOpen, setIsReimbursementDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  // Mock data for expense summary
  const expenseSummary = {
    totalExpenses: 45670,
    pendingReimbursements: 8950,
    approvedExpenses: 36720,
    rejectedExpenses: 1250,
    monthlyBudget: 55000,
    budgetUsed: 83.0,
    categoriesCount: 12,
    employeeSubmissions: 127,
  };

  const mockExpenses = [
    {
      id: "1",
      expenseNumber: "EXP-001",
      date: "2024-01-15",
      employee: "John Smith",
      category: "Travel",
      description: "Flight to client meeting",
      amount: 850.00,
      status: "Approved",
      reimbursementStatus: "Reimbursed",
      receiptAttached: true,
      approvedBy: "Jane Manager",
      approvedDate: "2024-01-16",
      paymentMethod: "Corporate Card",
      project: "Project Alpha",
    },
    {
      id: "2",
      expenseNumber: "EXP-002",
      date: "2024-01-18",
      employee: "Sarah Johnson",
      category: "Meals",
      description: "Client dinner",
      amount: 125.50,
      status: "Pending",
      reimbursementStatus: "Pending",
      receiptAttached: true,
      paymentMethod: "Personal Card",
      project: "Project Beta",
    },
    {
      id: "3",
      expenseNumber: "EXP-003",
      date: "2024-01-20",
      employee: "Mike Wilson",
      category: "Office Supplies",
      description: "Stationery and printing",
      amount: 75.25,
      status: "Approved",
      reimbursementStatus: "Processing",
      receiptAttached: false,
      approvedBy: "Jane Manager",
      approvedDate: "2024-01-21",
      paymentMethod: "Petty Cash",
      project: "General",
    },
    {
      id: "4",
      expenseNumber: "EXP-004",
      date: "2024-01-22",
      employee: "Lisa Brown",
      category: "Training",
      description: "Online course subscription",
      amount: 299.00,
      status: "Rejected",
      reimbursementStatus: "N/A",
      receiptAttached: true,
      rejectedReason: "Not pre-approved",
      paymentMethod: "Personal Card",
      project: "HR Development",
    },
  ];

  const mockCategories = [
    {
      id: "1",
      name: "Travel",
      budget: 15000,
      spent: 12450,
      percentage: 83,
      transactions: 24,
      color: "bg-blue-500",
    },
    {
      id: "2",
      name: "Meals & Entertainment",
      budget: 8000,
      spent: 6750,
      percentage: 84,
      transactions: 45,
      color: "bg-green-500",
    },
    {
      id: "3",
      name: "Office Supplies",
      budget: 5000,
      spent: 3200,
      percentage: 64,
      transactions: 18,
      color: "bg-yellow-500",
    },
    {
      id: "4",
      name: "Training",
      budget: 10000,
      spent: 7800,
      percentage: 78,
      transactions: 12,
      color: "bg-purple-500",
    },
  ];

  const mockReimbursements = [
    {
      id: "1",
      employeeName: "John Smith",
      totalAmount: 975.50,
      expenseCount: 3,
      submissionDate: "2024-01-20",
      status: "Processing",
      dueDate: "2024-02-05",
    },
    {
      id: "2",
      employeeName: "Sarah Johnson",
      totalAmount: 550.25,
      expenseCount: 2,
      submissionDate: "2024-01-18",
      status: "Approved",
      dueDate: "2024-02-03",
    },
  ];

  const expenseColumns = [
    {
      accessorKey: "expenseNumber",
      header: "Expense #",
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "employee",
      header: "Employee",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => `$${row.getValue("amount").toFixed(2)}`,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <Badge
            variant={
              status === "Approved"
                ? "default"
                : status === "Pending"
                ? "secondary"
                : "destructive"
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "receiptAttached",
      header: "Receipt",
      cell: ({ row }) => {
        const hasReceipt = row.getValue("receiptAttached");
        return hasReceipt ? (
          <Badge variant="outline">
            <Receipt className="h-3 w-3 mr-1" />
            Yes
          </Badge>
        ) : (
          <Badge variant="secondary">No</Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setSelectedExpense(row.original)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline">
            <FileText className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const reimbursementColumns = [
    {
      accessorKey: "employeeName",
      header: "Employee",
    },
    {
      accessorKey: "expenseCount",
      header: "Expenses",
    },
    {
      accessorKey: "totalAmount",
      header: "Total Amount",
      cell: ({ row }) => `$${row.getValue("totalAmount").toFixed(2)}`,
    },
    {
      accessorKey: "submissionDate",
      header: "Submitted",
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <Badge
            variant={
              status === "Approved"
                ? "default"
                : status === "Processing"
                ? "secondary"
                : "destructive"
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            Process Payment
          </Button>
          <Button size="sm" variant="outline">
            <FileText className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expense Tracking</h1>
          <p className="text-muted-foreground">
            Track and manage employee expenses, reimbursements, and budgets
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogDescription>
                  Record a new expense entry
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expenseDate">Expense Date</Label>
                  <Input id="expenseDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employee">Employee</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john-smith">John Smith</SelectItem>
                      <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                      <SelectItem value="mike-wilson">Mike Wilson</SelectItem>
                      <SelectItem value="lisa-brown">Lisa Brown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="meals">Meals & Entertainment</SelectItem>
                      <SelectItem value="office-supplies">Office Supplies</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="utilities">Utilities</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input id="amount" type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="corporate-card">Corporate Card</SelectItem>
                      <SelectItem value="personal-card">Personal Card</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="petty-cash">Petty Cash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project">Project (Optional)</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="project-alpha">Project Alpha</SelectItem>
                      <SelectItem value="project-beta">Project Beta</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="hr-development">HR Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Expense description" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="receipt">Receipt Upload</Label>
                  <Input id="receipt" type="file" accept="image/*,.pdf" />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsExpenseDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsExpenseDialogOpen(false)}>
                  Add Expense
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${expenseSummary.totalExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reimbursements</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${expenseSummary.pendingReimbursements.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting payment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Used</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expenseSummary.budgetUsed}%</div>
            <p className="text-xs text-muted-foreground">
              Of ${expenseSummary.monthlyBudget.toLocaleString()} budget
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submissions</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expenseSummary.employeeSubmissions}</div>
            <p className="text-xs text-muted-foreground">
              Employee submissions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="expenses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="expenses">Expense List</TabsTrigger>
          <TabsTrigger value="categories">Categories & Budgets</TabsTrigger>
          <TabsTrigger value="reimbursements">Reimbursements</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Entries</CardTitle>
              <CardDescription>
                All expense submissions with approval status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search expenses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="meals">Meals</SelectItem>
                    <SelectItem value="office-supplies">Office Supplies</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="this-week">This Week</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="this-quarter">This Quarter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DataTable columns={expenseColumns} data={mockExpenses} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Categories & Budgets</CardTitle>
              <CardDescription>
                Monitor spending by category and track budget utilization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockCategories.map((category) => (
                  <Card key={category.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <CardDescription>{category.transactions} transactions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Spent: ${category.spent.toLocaleString()}</span>
                          <span>Budget: ${category.budget.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${category.color}`}
                            style={{ width: `${category.percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          {category.percentage}% used
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reimbursements" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Employee Reimbursements</CardTitle>
                  <CardDescription>
                    Process and track employee expense reimbursements
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Process Batch Payment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable columns={reimbursementColumns} data={mockReimbursements} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Expense Reports</CardTitle>
                <CardDescription>Generate comprehensive expense reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Monthly Expense Summary
                </Button>
                <Button className="w-full justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Budget vs Actual Report
                </Button>
                <Button className="w-full justify-start">
                  <Receipt className="mr-2 h-4 w-4" />
                  Employee Expense Report
                </Button>
                <Button className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Tax Deductible Expenses
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analytics & Insights</CardTitle>
                <CardDescription>Expense analytics and trend reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Spending Trends Analysis
                </Button>
                <Button className="w-full justify-start">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Cost Center Analysis
                </Button>
                <Button className="w-full justify-start">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payment Method Report
                </Button>
                <Button className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Compliance Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExpenseTrackingPage;