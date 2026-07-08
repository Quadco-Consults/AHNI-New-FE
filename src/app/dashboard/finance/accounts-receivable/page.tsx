"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import DataTable from "@/components/Table/DataTable";
import PaymentForm from "../../../../features/finance/components/receivables/PaymentForm";
import {
  AccountsReceivable,
  ARStatus,
  AgingBucket,
  CollectionStatus
} from "../../../../features/finance/types/accounts-receivable.types";
import {
  useGetAccountsReceivable,
  useGetARSummary,
  useSendReminder,
  useUpdateCollectionStatus,
  useWriteOffAR,
} from "../../../../features/finance/controllers/accountsReceivableController";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function AccountsReceivablePage() {
  const [filters, setFilters] = useState<{
    status?: ARStatus | "all";
    aging_bucket?: AgingBucket | "all";
    collection_status?: CollectionStatus | "all";
    assigned_collector?: string;
    search?: string;
    page?: number;
    page_size?: number;
  }>({
    page: 1,
    page_size: 20,
  });

  const [activeTab, setActiveTab] = useState("overview");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedReceivable, setSelectedReceivable] = useState<AccountsReceivable | null>(null);

  // Fetch accounts receivable data
  const { data: arData, isLoading: arLoading } = useGetAccountsReceivable(filters);
  const { data: statsData, isLoading: statsLoading } = useGetARSummary(filters);

  const accountsReceivable = arData?.data || [];
  const stats = statsData?.data;

  // Helper function to format currency
  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return numAmount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Handlers
  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      page_size: 20,
      status: "all",
      aging_bucket: "all",
      collection_status: "all",
      search: "",
    });
  };

  const handleRecordPayment = (ar: AccountsReceivable) => {
    setSelectedReceivable(ar);
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = () => {
    // Refresh accounts receivable list when payment succeeds
    // This will be handled automatically by React Query when backend is ready
    toast.success("Accounts receivable list refreshed");
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
      case 'current': return 'bg-blue-100 text-blue-700';
      case 'paid': return 'bg-green-100 text-green-700';
      case 'partially_paid': return 'bg-yellow-100 text-yellow-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      case 'disputed': return 'bg-orange-100 text-orange-700';
      case 'written_off': return 'bg-gray-100 text-gray-500';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getAgingColor = (bucket: AgingBucket) => {
    switch (bucket) {
      case 'current': return 'bg-green-100 text-green-700';
      case 'past_due_30': return 'bg-yellow-100 text-yellow-700';
      case 'past_due_60': return 'bg-orange-100 text-orange-700';
      case 'past_due_90': return 'bg-red-100 text-red-700';
      case 'past_due_120': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCollectionStatusColor = (status: CollectionStatus) => {
    switch (status) {
      case 'not_started': return 'bg-gray-100 text-gray-700';
      case 'first_notice_sent': return 'bg-yellow-100 text-yellow-700';
      case 'second_notice_sent': return 'bg-orange-100 text-orange-700';
      case 'final_notice_sent': return 'bg-red-100 text-red-700';
      case 'in_negotiation': return 'bg-blue-100 text-blue-700';
      case 'payment_plan_active': return 'bg-purple-100 text-purple-700';
      case 'legal_action': return 'bg-red-200 text-red-800';
      case 'resolved': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Column definitions
  const columns = [
    {
      id: "invoice_number",
      accessorKey: "invoice_number",
      header: "Invoice #",
      cell: ({ row }: any) => (
        <span className="font-mono text-sm font-medium">{row.getValue("invoice_number")}</span>
      ),
    },
    {
      id: "customer_name",
      accessorKey: "customer_name",
      header: "Customer",
      cell: ({ row }: any) => (
        <div className="font-medium">{row.getValue("customer_name")}</div>
      ),
    },
    {
      id: "due_date",
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
      id: "amount_due",
      accessorKey: "amount_due",
      header: "Amount Due",
      cell: ({ row }: any) => (
        <div className="font-mono text-sm font-medium">
          ${formatCurrency(row.getValue("amount_due") || "0")}
        </div>
      ),
    },
    {
      id: "days_outstanding",
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
      id: "aging_bucket",
      accessorKey: "aging_bucket",
      header: "Aging",
      cell: ({ row }: any) => {
        const bucket = row.getValue("aging_bucket") as AgingBucket;
        const bucketLabels: Record<AgingBucket, string> = {
          'current': 'Current',
          'past_due_30': '31-60 Days',
          'past_due_60': '61-90 Days',
          'past_due_90': '91-120 Days',
          'past_due_120': '120+ Days'
        };
        return (
          <Badge className={`${getAgingColor(bucket)} border-0 text-xs`}>
            {bucketLabels[bucket]}
          </Badge>
        );
      },
    },
    {
      id: "collection_status",
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
      id: "status",
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
          <Button onClick={() => {
            // Select the first overdue receivable or any receivable
            const overdueReceivable = accountsReceivable.find((ar) => ar.status === 'overdue') || accountsReceivable[0];
            if (overdueReceivable) {
              setSelectedReceivable(overdueReceivable);
              setShowPaymentForm(true);
            } else {
              toast.info("No receivables available to record payment");
            }
          }}>
            <Plus size={20} className="mr-2" />
            Record Payment
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {statsLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">${formatCurrency(stats.total_outstanding)}</div>
            <div className="text-sm text-gray-600">Total Outstanding</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-red-600">${formatCurrency(stats.total_overdue)}</div>
            <div className="text-sm text-gray-600">Overdue</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-green-600">${formatCurrency(stats.current)}</div>
            <div className="text-sm text-gray-600">Current</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-yellow-600">${formatCurrency(stats.past_due_30)}</div>
            <div className="text-sm text-gray-600">31-60 Days</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-orange-600">${formatCurrency(stats.past_due_60)}</div>
            <div className="text-sm text-gray-600">61-90 Days</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-red-600">${formatCurrency(stats.past_due_90)}</div>
            <div className="text-sm text-gray-600">91-120 Days</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-red-700">${formatCurrency(stats.past_due_120)}</div>
            <div className="text-sm text-gray-600">120+ Days</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-purple-600">{Math.round(stats.average_days_outstanding)}</div>
            <div className="text-sm text-gray-600">Avg Days</div>
          </div>
        </div>
      ) : null}

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
              onValueChange={(value) => handleFilterChange("status", value === "all" ? "all" : value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="current">Current</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="partially_paid">Partially Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="disputed">Disputed</SelectItem>
                <SelectItem value="written_off">Written Off</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.aging_bucket || "all"}
              onValueChange={(value) => handleFilterChange("aging_bucket", value === "all" ? "all" : value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Aging" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ages</SelectItem>
                <SelectItem value="current">Current</SelectItem>
                <SelectItem value="past_due_30">31-60 Days</SelectItem>
                <SelectItem value="past_due_60">61-90 Days</SelectItem>
                <SelectItem value="past_due_90">91-120 Days</SelectItem>
                <SelectItem value="past_due_120">120+ Days</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.collection_status || "all"}
              onValueChange={(value) => handleFilterChange("collection_status", value === "all" ? "all" : value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Collection Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="not_started">Not Started</SelectItem>
                <SelectItem value="first_notice_sent">First Notice</SelectItem>
                <SelectItem value="second_notice_sent">Second Notice</SelectItem>
                <SelectItem value="final_notice_sent">Final Notice</SelectItem>
                <SelectItem value="in_negotiation">In Negotiation</SelectItem>
                <SelectItem value="payment_plan_active">Payment Plan</SelectItem>
                <SelectItem value="legal_action">Legal Action</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>

            {(filters.search || (filters.status && filters.status !== "all") || (filters.aging_bucket && filters.aging_bucket !== "all") || (filters.collection_status && filters.collection_status !== "all")) && (
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
            {arLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : accountsReceivable.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">No accounts receivable found</p>
                <p className="text-sm text-gray-500 mt-2">
                  {filters.search || filters.status !== "all" || filters.aging_bucket !== "all"
                    ? "Try adjusting your filters"
                    : "Start by creating invoices for your customers"}
                </p>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={accountsReceivable}
                pagination={{
                  total: arData?.pagination?.total || 0,
                  pageSize: filters.page_size || 20,
                  onChange: (page) => {
                    setFilters(prev => ({ ...prev, page }));
                  }
                }}
              />
            )}
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

      {/* Payment Form Dialog */}
      {showPaymentForm && selectedReceivable && (
        <PaymentForm
          open={showPaymentForm}
          onOpenChange={setShowPaymentForm}
          accountsReceivable={selectedReceivable}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}