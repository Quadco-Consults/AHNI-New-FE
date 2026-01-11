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
  Calculator,
  Percent,
  FileText,
  Calendar,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  Settings,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";
import DataTable from "@/components/Table/DataTable";
import TaxCodeForm from "@/features/finance/components/tax/TaxCodeForm";
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

// Types for Tax Management
interface TaxCode {
  id: string;
  code: string;
  name: string;
  description?: string;
  tax_rate: number;
  tax_type: TaxType;
  status: TaxStatus;
  effective_date: string;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
}

interface TaxCalculation {
  id: string;
  transaction_id: string;
  transaction_type: 'INVOICE' | 'SALES_ORDER' | 'PURCHASE' | 'EXPENSE';
  customer_id?: string;
  vendor_id?: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  tax_details: TaxLineItem[];
  calculation_date: string;
  status: 'CALCULATED' | 'APPLIED' | 'REVERSED';
}

interface TaxLineItem {
  tax_code_id: string;
  tax_code: string;
  tax_rate: number;
  taxable_amount: number;
  tax_amount: number;
  description: string;
}

interface TaxReport {
  id: string;
  report_type: TaxReportType;
  period_start: string;
  period_end: string;
  total_sales: number;
  total_tax_collected: number;
  total_purchases: number;
  total_tax_paid: number;
  net_tax_due: number;
  status: 'DRAFT' | 'FILED' | 'PAID';
  due_date: string;
  filed_date?: string;
  created_at: string;
}

type TaxType =
  | 'SALES_TAX'
  | 'VAT'
  | 'INCOME_TAX'
  | 'WITHHOLDING_TAX'
  | 'EXCISE_TAX'
  | 'CUSTOMS_DUTY'
  | 'OTHER';

type TaxStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED';

type TaxReportType =
  | 'MONTHLY'
  | 'QUARTERLY'
  | 'ANNUAL'
  | 'CUSTOM';

// Mock data
const mockTaxCodes: TaxCode[] = [
  {
    id: "1",
    code: "ST-STD",
    name: "Standard Sales Tax",
    description: "Standard sales tax rate",
    tax_rate: 8.25,
    tax_type: "SALES_TAX",
    status: "ACTIVE",
    effective_date: "2024-01-01",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    code: "VAT-STD",
    name: "Standard VAT",
    description: "Standard VAT rate",
    tax_rate: 20.0,
    tax_type: "VAT",
    status: "ACTIVE",
    effective_date: "2024-01-01",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    code: "WHT-STD",
    name: "Withholding Tax",
    description: "Standard withholding tax",
    tax_rate: 5.0,
    tax_type: "WITHHOLDING_TAX",
    status: "ACTIVE",
    effective_date: "2024-01-01",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

const mockTaxCalculations: TaxCalculation[] = [
  {
    id: "1",
    transaction_id: "INV-001",
    transaction_type: "INVOICE",
    customer_id: "cust-1",
    subtotal: 5000.00,
    tax_amount: 412.50,
    total_amount: 5412.50,
    tax_details: [
      {
        tax_code_id: "1",
        tax_code: "ST-STD",
        tax_rate: 8.25,
        taxable_amount: 5000.00,
        tax_amount: 412.50,
        description: "Standard Sales Tax"
      }
    ],
    calculation_date: "2024-10-25",
    status: "APPLIED"
  }
];

const mockTaxReports: TaxReport[] = [
  {
    id: "1",
    report_type: "MONTHLY",
    period_start: "2024-10-01",
    period_end: "2024-10-31",
    total_sales: 45000.00,
    total_tax_collected: 3712.50,
    total_purchases: 12000.00,
    total_tax_paid: 990.00,
    net_tax_due: 2722.50,
    status: "DRAFT",
    due_date: "2024-11-15",
    created_at: new Date().toISOString(),
  }
];

export default function TaxManagementPage() {
  const [activeTab, setActiveTab] = useState("tax-codes");
  const [filters, setFilters] = useState<{
    search?: string;
    status?: string;
    tax_type?: string;
    page?: number;
    page_size?: number;
  }>({
    page: 1,
    page_size: 10,
  });

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [editingTaxCode, setEditingTaxCode] = useState<TaxCode | undefined>();

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ page: 1, page_size: 10 });
  };

  const handleCreateTaxCode = () => {
    setEditingTaxCode(undefined);
    setFormOpen(true);
  };

  const handleEditTaxCode = (taxCode: TaxCode) => {
    setEditingTaxCode(taxCode);
    setFormOpen(true);
  };

  const handleFormSuccess = () => {
    // In a real app, you would refetch the data here
    // For now, just show a success message
    setFormOpen(false);
    setEditingTaxCode(undefined);
  };

  const getStatusColor = (status: TaxStatus) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-700';
      case 'INACTIVE': return 'bg-gray-100 text-gray-700';
      case 'EXPIRED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTaxTypeColor = (type: TaxType) => {
    switch (type) {
      case 'SALES_TAX': return 'bg-blue-100 text-blue-700';
      case 'VAT': return 'bg-purple-100 text-purple-700';
      case 'INCOME_TAX': return 'bg-green-100 text-green-700';
      case 'WITHHOLDING_TAX': return 'bg-orange-100 text-orange-700';
      case 'EXCISE_TAX': return 'bg-yellow-100 text-yellow-700';
      case 'CUSTOMS_DUTY': return 'bg-indigo-100 text-indigo-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Tax Codes columns
  const taxCodesColumns = [
    {
      id: "code",
      accessorKey: "code",
      header: "Tax Code",
      cell: ({ row }: any) => (
        <span className="font-mono text-sm font-medium">{row.getValue("code")}</span>
      ),
    },
    {
      id: "name",
      accessorKey: "name",
      header: "Name",
      cell: ({ row }: any) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      id: "tax_type",
      accessorKey: "tax_type",
      header: "Type",
      cell: ({ row }: any) => {
        const type = row.getValue("tax_type") as TaxType;
        return (
          <Badge className={`${getTaxTypeColor(type)} border-0 text-xs`}>
            {type.replace('_', ' ')}
          </Badge>
        );
      },
    },
    {
      id: "tax_rate",
      accessorKey: "tax_rate",
      header: "Rate",
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-1">
          <Percent className="w-3 h-3" />
          <span className="font-mono">{row.getValue("tax_rate")}%</span>
        </div>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.getValue("status") as TaxStatus;
        return (
          <Badge className={`${getStatusColor(status)} border-0`}>
            {status}
          </Badge>
        );
      },
    },
    {
      id: "effective_date",
      accessorKey: "effective_date",
      header: "Effective Date",
      cell: ({ row }: any) => (
        <div className="text-sm">
          {new Date(row.getValue("effective_date")).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const taxCode = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditTaxCode(taxCode)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Configure
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Statistics
  const stats = {
    totalTaxCodes: mockTaxCodes.length,
    activeTaxCodes: mockTaxCodes.filter(tc => tc.status === 'ACTIVE').length,
    totalCalculations: mockTaxCalculations.length,
    totalTaxCollected: mockTaxCalculations.reduce((sum, calc) => sum + calc.tax_amount, 0),
    pendingReports: mockTaxReports.filter(report => report.status === 'DRAFT').length,
    avgTaxRate: mockTaxCodes.reduce((sum, tc) => sum + tc.tax_rate, 0) / mockTaxCodes.length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tax Management</h1>
          <p className="text-gray-600">
            Calculate taxes, manage tax codes, and generate tax reports
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download size={20} className="mr-2" />
            Export Reports
          </Button>
          <Button onClick={handleCreateTaxCode}>
            <Plus size={20} className="mr-2" />
            Add Tax Code
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">{stats.totalTaxCodes}</div>
          <div className="text-sm text-gray-600">Total Tax Codes</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">{stats.activeTaxCodes}</div>
          <div className="text-sm text-gray-600">Active Codes</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-purple-600">{stats.totalCalculations}</div>
          <div className="text-sm text-gray-600">Calculations</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-emerald-600">${stats.totalTaxCollected.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Tax Collected</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-orange-600">{stats.pendingReports}</div>
          <div className="text-sm text-gray-600">Pending Reports</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-indigo-600">{stats.avgTaxRate.toFixed(2)}%</div>
          <div className="text-sm text-gray-600">Avg Tax Rate</div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="tax-codes">Tax Codes</TabsTrigger>
          <TabsTrigger value="calculations">Tax Calculations</TabsTrigger>
          <TabsTrigger value="reports">Tax Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="tax-codes" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search tax codes..."
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
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.tax_type || "all"}
              onValueChange={(value) => handleFilterChange("tax_type", value === "all" ? undefined : value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tax Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="SALES_TAX">Sales Tax</SelectItem>
                <SelectItem value="VAT">VAT</SelectItem>
                <SelectItem value="INCOME_TAX">Income Tax</SelectItem>
                <SelectItem value="WITHHOLDING_TAX">Withholding Tax</SelectItem>
                <SelectItem value="EXCISE_TAX">Excise Tax</SelectItem>
                <SelectItem value="CUSTOMS_DUTY">Customs Duty</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>

            {(filters.search || filters.status || filters.tax_type) && (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}

            <div className="ml-auto flex items-center space-x-2 text-sm text-gray-600">
              <Filter className="w-4 h-4" />
              <span>{mockTaxCodes.length} tax code{mockTaxCodes.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Tax Codes Table */}
          <Card className="p-6">
            <DataTable
              columns={taxCodesColumns}
              data={mockTaxCodes}
              pagination={{
                total: mockTaxCodes.length,
                pageSize: filters.page_size || 10,
                onChange: (page) => {
                  setFilters(prev => ({ ...prev, page }));
                }
              }}
            />
          </Card>
        </TabsContent>

        <TabsContent value="calculations" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Tax Calculations</h3>
            <div className="space-y-4">
              {mockTaxCalculations.map((calc) => (
                <div key={calc.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{calc.transaction_type} - {calc.transaction_id}</h4>
                      <p className="text-sm text-gray-600">Calculated on {new Date(calc.calculation_date).toLocaleDateString()}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-0">
                      {calc.status}
                    </Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="ml-2 font-mono">${calc.subtotal.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Tax Amount:</span>
                      <span className="ml-2 font-mono">${calc.tax_amount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Total:</span>
                      <span className="ml-2 font-mono font-medium">${calc.total_amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Tax Reports</h3>
            <div className="space-y-4">
              {mockTaxReports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{report.report_type} Tax Report</h4>
                      <p className="text-sm text-gray-600">
                        Period: {new Date(report.period_start).toLocaleDateString()} - {new Date(report.period_end).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">Due: {new Date(report.due_date).toLocaleDateString()}</p>
                    </div>
                    <Badge className={report.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-700 border-0' : 'bg-green-100 text-green-700 border-0'}>
                      {report.status}
                    </Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Sales:</span>
                      <div className="font-mono">${report.total_sales.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Tax Collected:</span>
                      <div className="font-mono">${report.total_tax_collected.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Purchases:</span>
                      <div className="font-mono">${report.total_purchases.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Tax Paid:</span>
                      <div className="font-mono">${report.total_tax_paid.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Net Due:</span>
                      <div className="font-mono font-medium">${report.net_tax_due.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Tax Settings</h3>
            <p className="text-gray-600">Tax configuration and settings will be implemented here.</p>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Tax Code Form */}
      <TaxCodeForm
        open={formOpen}
        onOpenChange={setFormOpen}
        taxCode={editingTaxCode}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}