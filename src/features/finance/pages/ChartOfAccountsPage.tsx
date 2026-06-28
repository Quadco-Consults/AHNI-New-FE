"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Filter, TreePine } from "lucide-react";
import { toast } from "sonner";
import {
  useGetChartOfAccounts,
  useDeleteChartOfAccount,
} from "../controllers/accountingController";
import { ChartOfAccount, AccountType } from "../types/accounting.types";
import ChartOfAccountsTree from "../components/accounting/ChartOfAccountsTree";
import AccountForm from "../components/accounting/AccountForm";

export default function ChartOfAccountsPage() {
  const [filters, setFilters] = useState<{
    account_type?: AccountType;
    is_active?: boolean;
    search?: string;
  }>({});

  const [editingAccount, setEditingAccount] = useState<ChartOfAccount | undefined>();
  const [parentAccountId, setParentAccountId] = useState<string | undefined>();
  const [formOpen, setFormOpen] = useState(false);

  // Data fetching
  const { data: accountsData, isLoading, error } = useGetChartOfAccounts(filters);
  const deleteAccount = useDeleteChartOfAccount();

  const accounts = accountsData?.data?.results ? accountsData.data.results : [];

  // Debug logging
  console.log("ChartOfAccountsPage - Raw accountsData:", accountsData);
  console.log("ChartOfAccountsPage - Processed accounts:", accounts);
  console.log("ChartOfAccountsPage - isLoading:", isLoading);
  console.log("ChartOfAccountsPage - error:", error);

  // Handlers
  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleAddAccount = (parentId?: string) => {
    setEditingAccount(undefined);
    setParentAccountId(parentId);
    setFormOpen(true);
  };

  const handleEditAccount = (account: ChartOfAccount) => {
    setEditingAccount(account);
    setParentAccountId(undefined);
    setFormOpen(true);
  };

  const handleDeleteAccount = async (account: ChartOfAccount) => {
    if (!confirm(`Are you sure you want to delete "${account.account_name}"?`)) return;

    try {
      await deleteAccount.mutateAsync(account.id);
      toast.success("Account deleted successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete account");
    }
  };

  const clearFilters = () => {
    setFilters({});
  };

  // Statistics
  const totalAccounts = accounts?.length || 0;
  const activeAccounts = accounts?.filter(a => a?.is_active)?.length || 0;
  const accountsByType = accounts?.reduce((acc, account) => {
    if (account?.account_type) {
      acc[account.account_type] = (acc[account.account_type] || 0) + 1;
    }
    return acc;
  }, {} as Record<AccountType, number>) || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold tracking-tight">Chart of Accounts</h1>
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              ✓ QuickBooks Compatible
            </Badge>
          </div>
          <p className="text-gray-600">
            Manage your accounting structure and account hierarchy (Syncs with QuickBooks)
          </p>
        </div>
        <Button onClick={() => handleAddAccount()}>
          <Plus size={20} className="mr-2" />
          Add Account
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">{totalAccounts}</div>
          <div className="text-sm text-gray-600">Total Accounts</div>
          <div className="text-xs text-gray-500 mt-1">AHNI Chart of Accounts</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">{activeAccounts}</div>
          <div className="text-sm text-gray-600">Active</div>
          <div className="text-xs text-gray-500 mt-1">Multi-project tracking</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-purple-600">{accountsByType.ASSETS || 0}</div>
          <div className="text-sm text-gray-600">Assets</div>
          <div className="text-xs text-gray-500 mt-1">Bank & Current Assets</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-red-600">{accountsByType.LIABILITIES || 0}</div>
          <div className="text-sm text-gray-600">Liabilities</div>
          <div className="text-xs text-gray-500 mt-1">Payroll & Accruals</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-indigo-600">{accountsByType.EQUITY || 0}</div>
          <div className="text-sm text-gray-600">Equity</div>
          <div className="text-xs text-gray-500 mt-1">Net Assets & Retained</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-orange-600">
            {(accountsByType.REVENUE || 0) + (accountsByType.EXPENSES || 0)}
          </div>
          <div className="text-sm text-gray-600">P&L Accounts</div>
          <div className="text-xs text-gray-500 mt-1">Grant Revenue & Expenses</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search accounts..."
            value={filters.search || ""}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-64"
          />
        </div>

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

        <Select
          value={filters.is_active?.toString() || "all"}
          onValueChange={(value) =>
            handleFilterChange("is_active", value === "all" ? undefined : value === "true")
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={(filters as any).currency || "all"}
          onValueChange={(value) => handleFilterChange("currency", value === "all" ? undefined : value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="NGN">NGN</SelectItem>
            <SelectItem value="USD">USD</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={(filters as any).project || "all"}
          onValueChange={(value) => handleFilterChange("project", value === "all" ? undefined : value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            <SelectItem value="ACEBAY">ACEBAY</SelectItem>
            <SelectItem value="PLANE">PLANE</SelectItem>
            <SelectItem value="GF_HIV">GF HIV Impact</SelectItem>
            <SelectItem value="SIDHAS">SIDHAS</SelectItem>
            <SelectItem value="SHARP">SHARP+</SelectItem>
            <SelectItem value="MALARIA">Malaria</SelectItem>
            <SelectItem value="RANA">RANA/UNICEF</SelectItem>
            <SelectItem value="UNHCR">UNHCR</SelectItem>
            <SelectItem value="UNFPA">UNFPA</SelectItem>
            <SelectItem value="EPIC">EPiC</SelectItem>
          </SelectContent>
        </Select>

        {(filters.search || filters.account_type || filters.is_active !== undefined || (filters as any).currency || (filters as any).project) && (
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}

        <div className="ml-auto flex items-center space-x-2 text-sm text-gray-600">
          <Filter className="w-4 h-4" />
          <span>
            {accounts.length} account{accounts.length !== 1 ? 's' : ''}
            {filters.search || filters.account_type || filters.is_active !== undefined ? ' (filtered)' : ''}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="tree" className="w-full">
        <TabsList>
          <TabsTrigger value="tree">Tree View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="tree" className="space-y-4">
          <ChartOfAccountsTree
            accounts={accounts}
            onAddAccount={handleAddAccount}
            onEditAccount={handleEditAccount}
            onDeleteAccount={handleDeleteAccount}
            loading={isLoading}
          />
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Account List</h3>
              <p className="text-sm text-gray-600">All accounts in table format</p>
            </div>
            <div className="p-4">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              ) : accounts.length === 0 ? (
                <div className="text-center py-12">
                  <TreePine className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Accounts Found</h3>
                  <p className="text-gray-600 mb-4">
                    {filters.search || filters.account_type || filters.is_active !== undefined
                      ? "No accounts match your current filters."
                      : "Get started by creating your first account."}
                  </p>
                  <Button onClick={() => handleAddAccount()}>
                    <Plus size={16} className="mr-2" />
                    Add Account
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-4 p-3 text-sm font-medium text-gray-600 border-b">
                    <div className="col-span-2">Code</div>
                    <div className="col-span-4">Account Name</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-2">Balance</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-1">Actions</div>
                  </div>
                  {accounts.map((account) => (
                    <div
                      key={account.id}
                      className="grid grid-cols-12 gap-4 p-3 hover:bg-gray-50 rounded border-b last:border-b-0"
                    >
                      <div className="col-span-2 font-mono text-sm">
                        {account.account_code}
                      </div>
                      <div className="col-span-4">
                        <div className="font-medium">{account.account_name}</div>
                        {account.description && (
                          <div className="text-sm text-gray-600 truncate">
                            {account.description}
                          </div>
                        )}
                      </div>
                      <div className="col-span-2">
                        <Badge className="text-xs">
                          {account.account_type}
                        </Badge>
                      </div>
                      <div className="col-span-2 font-mono text-sm">
                        ${account.balance.toLocaleString()}
                      </div>
                      <div className="col-span-1">
                        <Badge
                          variant={account.is_active ? "default" : "outline"}
                          className="text-xs"
                        >
                          {account.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="col-span-1">
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-8 h-8 p-0"
                            onClick={() => handleEditAccount(account)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Account Form Dialog */}
      <AccountForm
        open={formOpen}
        onOpenChange={setFormOpen}
        account={editingAccount}
        parentAccountId={parentAccountId}
      />
    </div>
  );
}