"use client";

import { useState } from "react";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Badge } from "components/ui/badge";
import { Card } from "components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import {
  Plus,
  Search,
  Filter,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  FileText,
  MoreHorizontal,
  Eye,
  CreditCard,
  MessageSquare,
  Ban
} from "lucide-react";
import { toast } from "sonner";
import DataTable from "components/Table/DataTable";
import {
  AccountsReceivable,
  ARStatus,
  AgingBucket,
  CollectionStatus
} from "../../../../features/finance/types/accounts-receivable.types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "components/ui/tabs";

// Mock data for now - replace with actual API integration
const mockAccountsReceivable: AccountsReceivable[] = [
  {
    id: "1",
    customer_id: "cust-1",
    customer_name: "Acme Corporation",
    invoice_id: "inv-001",
    invoice_number: "INV-001",
    transaction_type: "INVOICE",
    transaction_date: "2024-09-01",
    due_date: "2024-09-30",
    original_amount: 5400.00,
    current_balance: 5400.00,
    amount_paid: 0,
    amount_due: 5400.00,
    aging_bucket: "PAST_DUE_30",
    days_outstanding: 45,
    status: "OVERDUE",
    payment_terms: "NET_30",
    currency: "USD",
    collection_status: "FIRST_NOTICE_SENT",
    last_contact_date: "2024-10-05",
    next_follow_up_date: "2024-10-28",
    collection_notes: "Customer responded via email, promised payment by end of month",
    assigned_collector: "John Smith",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: "user-1"
  },
  {
    id: "2",
    customer_id: "cust-2",
    customer_name: "Tech Solutions Inc",
    invoice_id: "inv-002",
    invoice_number: "INV-002",
    transaction_type: "INVOICE",
    transaction_date: "2024-10-15",
    due_date: "2024-11-15",
    original_amount: 3680.00,
    current_balance: 3680.00,
    amount_paid: 0,
    amount_due: 3680.00,
    aging_bucket: "CURRENT",
    days_outstanding: 10,
    status: "OPEN",
    payment_terms: "NET_30",
    currency: "USD",
    collection_status: "NOT_STARTED",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: "user-1"
  },
  {
    id: "3",
    customer_id: "cust-3",
    customer_name: "Small Business LLC",
    invoice_id: "inv-003",
    invoice_number: "INV-003",
    transaction_type: "INVOICE",
    transaction_date: "2024-07-01",
    due_date: "2024-07-31",
    original_amount: 1296.00,
    current_balance: 1296.00,
    amount_paid: 0,
    amount_due: 1296.00,
    aging_bucket: "PAST_DUE_90",
    days_outstanding: 95,
    status: "OVERDUE",
    payment_terms: "NET_30",
    currency: "USD",
    collection_status: "FINAL_NOTICE_SENT",
    last_contact_date: "2024-10-15",
    next_follow_up_date: "2024-10-30",
    collection_notes: "Customer disputes charges, reviewing documentation",
    assigned_collector: "Jane Doe",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: "user-1"
  }
];

export default function AccountsReceivablePage() {
  const [filters, setFilters] = useState<{
    status?: ARStatus;
    aging_bucket?: AgingBucket;
    collection_status?: CollectionStatus;
    assigned_collector?: string;
    search?: string;
    page?: number;
    page_size?: number;
  }>({
    page: 1,
    page_size: 10,
  });

  const [activeTab, setActiveTab] = useState("overview");

  const accountsReceivable = mockAccountsReceivable;

  // Handlers
  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ page: 1, page_size: 10 });
  };

  const handleRecordPayment = (ar: AccountsReceivable) => {
    toast.success(`Recording payment for ${ar.invoice_number}`);
    // Open payment form
  };

  const handleSendReminder = (ar: AccountsReceivable) => {
    toast.success(`Reminder sent to ${ar.customer_name}`);
  };

  const handleAddCollectionNote = (ar: AccountsReceivable) => {
    toast.success(`Adding collection note for ${ar.customer_name}`);
    // Open collection note form
  };

  const handleWriteOff = (ar: AccountsReceivable) => {
    toast.success(`Initiating write-off for ${ar.invoice_number}`);
    // Open write-off form
  };

  const getStatusColor = (status: ARStatus) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-100 text-blue-700';
      case 'PAID': return 'bg-green-100 text-green-700';
      case 'PARTIAL': return 'bg-yellow-100 text-yellow-700';
      case 'OVERDUE': return 'bg-red-100 text-red-700';
      case 'DISPUTED': return 'bg-orange-100 text-orange-700';
      case 'WRITTEN_OFF': return 'bg-gray-100 text-gray-500';
      case 'CANCELLED': return 'bg-gray-100 text-gray-500';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getAgingColor = (bucket: AgingBucket) => {
    switch (bucket) {
      case 'CURRENT': return 'bg-green-100 text-green-700';
      case 'PAST_DUE_30': return 'bg-yellow-100 text-yellow-700';
      case 'PAST_DUE_60': return 'bg-orange-100 text-orange-700';
      case 'PAST_DUE_90': return 'bg-red-100 text-red-700';
      case 'PAST_DUE_120': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCollectionStatusColor = (status: CollectionStatus) => {
    switch (status) {
      case 'NOT_STARTED': return 'bg-gray-100 text-gray-700';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700';
      case 'FIRST_NOTICE_SENT': return 'bg-yellow-100 text-yellow-700';
      case 'SECOND_NOTICE_SENT': return 'bg-orange-100 text-orange-700';
      case 'FINAL_NOTICE_SENT': return 'bg-red-100 text-red-700';
      case 'PAYMENT_PLAN': return 'bg-purple-100 text-purple-700';
      case 'LEGAL_ACTION': return 'bg-red-200 text-red-800';
      case 'COLLECTION_AGENCY': return 'bg-red-200 text-red-800';
      case 'RESOLVED': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Column definitions
  const columns = [
    {
      accessorKey: "invoice_number",
      header: "Invoice #",
      cell: ({ row }: any) => (
        <span className="font-mono text-sm font-medium">{row.getValue("invoice_number")}</span>
      ),
    },
    {
      accessorKey: "customer_name",
      header: "Customer",
      cell: ({ row }: any) => (
        <div className="font-medium">{row.getValue("customer_name")}</div>
      ),
    },
    {
      accessorKey: "due_date",
      header: "Due Date",
      cell: ({ row }: any) => {
        const dueDate = new Date(row.getValue("due_date"));
        const isOverdue = dueDate < new Date();
        return (
          <div className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
            {dueDate.toLocaleDateString()}
          </div>
        );
      },
    },
    {
      accessorKey: "amount_due",
      header: "Amount Due",
      cell: ({ row }: any) => (
        <div className="font-mono text-sm font-medium">
          ${row.getValue("amount_due")?.toLocaleString() || "0.00"}
        </div>
      ),
    },
    {
      accessorKey: "days_outstanding",
      header: "Days Outstanding",
      cell: ({ row }: any) => {
        const days = row.getValue("days_outstanding");
        return (
          <div className={`text-sm font-medium ${days > 60 ? 'text-red-600' : days > 30 ? 'text-orange-600' : 'text-green-600'}`}>
            {days} days
          </div>
        );
      },
    },
    {
      accessorKey: "aging_bucket",
      header: "Aging",
      cell: ({ row }: any) => {
        const bucket = row.getValue("aging_bucket") as AgingBucket;
        const bucketLabels = {
          'CURRENT': 'Current',
          'PAST_DUE_30': '31-60 Days',
          'PAST_DUE_60': '61-90 Days',
          'PAST_DUE_90': '91-120 Days',
          'PAST_DUE_120': '120+ Days'
        };
        return (
          <Badge className={`${getAgingColor(bucket)} border-0 text-xs`}>
            {bucketLabels[bucket]}
          </Badge>
        );
      },
    },
    {
      accessorKey: "collection_status",
      header: "Collection Status",
      cell: ({ row }: any) => {
        const status = row.getValue("collection_status") as CollectionStatus;
        return (
          <Badge className={`${getCollectionStatusColor(status)} border-0 text-xs`}>
            {status.replace(/_/g, ' ')}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.getValue("status") as ARStatus;
        return (
          <Badge className={`${getStatusColor(status)} border-0`}>
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const ar = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {}}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRecordPayment(ar)}>
                <CreditCard className="mr-2 h-4 w-4" />
                Record Payment
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSendReminder(ar)}>
                <Mail className="mr-2 h-4 w-4" />
                Send Reminder
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddCollectionNote(ar)}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Add Note
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleWriteOff(ar)}
                className="text-red-600"
              >
                <Ban className="mr-2 h-4 w-4" />
                Write Off
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Statistics
  const stats = {
    totalOutstanding: accountsReceivable.reduce((sum, ar) => sum + ar.amount_due, 0),
    totalOverdue: accountsReceivable.filter(ar => ar.status === 'OVERDUE').reduce((sum, ar) => sum + ar.amount_due, 0),
    current: accountsReceivable.filter(ar => ar.aging_bucket === 'CURRENT').reduce((sum, ar) => sum + ar.amount_due, 0),
    pastDue30: accountsReceivable.filter(ar => ar.aging_bucket === 'PAST_DUE_30').reduce((sum, ar) => sum + ar.amount_due, 0),
    pastDue60: accountsReceivable.filter(ar => ar.aging_bucket === 'PAST_DUE_60').reduce((sum, ar) => sum + ar.amount_due, 0),
    pastDue90: accountsReceivable.filter(ar => ar.aging_bucket === 'PAST_DUE_90').reduce((sum, ar) => sum + ar.amount_due, 0),
    pastDue120: accountsReceivable.filter(ar => ar.aging_bucket === 'PAST_DUE_120').reduce((sum, ar) => sum + ar.amount_due, 0),
    totalCustomers: new Set(accountsReceivable.map(ar => ar.customer_id)).size,
    averageDays: Math.round(accountsReceivable.reduce((sum, ar) => sum + ar.days_outstanding, 0) / accountsReceivable.length),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounts Receivable</h1>
          <p className="text-gray-600">
            Track customer payments and manage outstanding invoices
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <FileText size={20} className="mr-2" />
            Generate Statement
          </Button>
          <Button>
            <Plus size={20} className="mr-2" />
            Record Payment
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">${stats.totalOutstanding.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Outstanding</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-red-600">${stats.totalOverdue.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Overdue</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">${stats.current.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Current</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-yellow-600">${stats.pastDue30.toLocaleString()}</div>
          <div className="text-sm text-gray-600">31-60 Days</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-orange-600">${stats.pastDue60.toLocaleString()}</div>
          <div className="text-sm text-gray-600">61-90 Days</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-red-600">${stats.pastDue90.toLocaleString()}</div>
          <div className="text-sm text-gray-600">91-120 Days</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-red-700">${stats.pastDue120.toLocaleString()}</div>
          <div className="text-sm text-gray-600">120+ Days</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-purple-600">{stats.averageDays}</div>
          <div className="text-sm text-gray-600">Avg Days</div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="aging">Aging Report</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search customers or invoices..."
                value={filters.search || ""}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-64"
              />
            </div>

            <Select
              value={filters.status || "all"}
              onValueChange={(value) => handleFilterChange("status", value === "all" ? undefined : value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="PARTIAL">Partial</SelectItem>
                <SelectItem value="OVERDUE">Overdue</SelectItem>
                <SelectItem value="DISPUTED">Disputed</SelectItem>
                <SelectItem value="WRITTEN_OFF">Written Off</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.aging_bucket || "all"}
              onValueChange={(value) => handleFilterChange("aging_bucket", value === "all" ? undefined : value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Aging" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ages</SelectItem>
                <SelectItem value="CURRENT">Current</SelectItem>
                <SelectItem value="PAST_DUE_30">31-60 Days</SelectItem>
                <SelectItem value="PAST_DUE_60">61-90 Days</SelectItem>
                <SelectItem value="PAST_DUE_90">91-120 Days</SelectItem>
                <SelectItem value="PAST_DUE_120">120+ Days</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.collection_status || "all"}
              onValueChange={(value) => handleFilterChange("collection_status", value === "all" ? undefined : value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Collection Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="FIRST_NOTICE_SENT">First Notice</SelectItem>
                <SelectItem value="SECOND_NOTICE_SENT">Second Notice</SelectItem>
                <SelectItem value="FINAL_NOTICE_SENT">Final Notice</SelectItem>
                <SelectItem value="PAYMENT_PLAN">Payment Plan</SelectItem>
                <SelectItem value="LEGAL_ACTION">Legal Action</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
              </SelectContent>
            </Select>

            {(filters.search || filters.status || filters.aging_bucket || filters.collection_status) && (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}

            <div className="ml-auto flex items-center space-x-2 text-sm text-gray-600">
              <Filter className="w-4 h-4" />
              <span>
                {accountsReceivable.length} record{accountsReceivable.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Data Table */}
          <Card className="p-6">
            <DataTable
              columns={columns}
              data={accountsReceivable}
              pageCount={Math.ceil(accountsReceivable.length / (filters.page_size || 10))}
              pageIndex={(filters.page || 1) - 1}
              pageSize={filters.page_size || 10}
              onPaginationChange={(pagination) => {
                setFilters(prev => ({
                  ...prev,
                  page: pagination.pageIndex + 1,
                  page_size: pagination.pageSize,
                }));
              }}
            />
          </Card>
        </TabsContent>

        <TabsContent value="collections" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Collection Activities</h3>
            <p className="text-gray-600">Collection management features will be implemented here.</p>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Payment History</h3>
            <p className="text-gray-600">Payment tracking features will be implemented here.</p>
          </Card>
        </TabsContent>

        <TabsContent value="aging" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Aging Analysis</h3>
            <p className="text-gray-600">Aging report features will be implemented here.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}