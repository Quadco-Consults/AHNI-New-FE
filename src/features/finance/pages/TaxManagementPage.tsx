"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Card from "@/components/Card";
import DataTable from "@/components/Table/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, DollarSign, Building2, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  useGetTaxTypes,
  useGetTaxAuthorities,
  useDeleteTaxType,
  useDeleteTaxAuthority,
} from "../controllers/taxController";
import {
  TaxTypeFilters,
  TaxAuthorityFilters,
  TaxType,
  TaxAuthority,
  TAX_CATEGORIES,
} from "../types/tax.types";
import TaxTypeForm from "../components/tax/TaxTypeForm";
import TaxAuthorityForm from "../components/tax/TaxAuthorityForm";
import { toast } from "sonner";

export default function TaxManagementPage() {
  const [activeTab, setActiveTab] = useState("tax-types");
  const [taxTypeFilters, setTaxTypeFilters] = useState<TaxTypeFilters>({
    search: "",
    is_active: undefined,
  });
  const [taxAuthorityFilters, setTaxAuthorityFilters] = useState<TaxAuthorityFilters>({
    search: "",
    is_active: undefined,
  });

  // Form states
  const [taxTypeFormOpen, setTaxTypeFormOpen] = useState(false);
  const [taxAuthorityFormOpen, setTaxAuthorityFormOpen] = useState(false);
  const [editingTaxType, setEditingTaxType] = useState<TaxType | undefined>();
  const [editingTaxAuthority, setEditingTaxAuthority] = useState<TaxAuthority | undefined>();

  // Delete mutations
  const deleteTaxType = useDeleteTaxType();
  const deleteTaxAuthority = useDeleteTaxAuthority();

  // Data fetching
  const { data: taxTypesData, isLoading: taxTypesLoading } = useGetTaxTypes(
    activeTab === "tax-types" ? taxTypeFilters : undefined
  );
  const { data: taxAuthoritiesData, isLoading: taxAuthoritiesLoading } = useGetTaxAuthorities(
    activeTab === "tax-authorities" ? taxAuthorityFilters : undefined
  );

  // Action handlers
  const handleCreateNew = () => {
    if (activeTab === "tax-types") {
      setEditingTaxType(undefined);
      setTaxTypeFormOpen(true);
    } else {
      setEditingTaxAuthority(undefined);
      setTaxAuthorityFormOpen(true);
    }
  };

  const handleEditTaxType = (taxType: TaxType) => {
    setEditingTaxType(taxType);
    setTaxTypeFormOpen(true);
  };

  const handleEditTaxAuthority = (authority: TaxAuthority) => {
    setEditingTaxAuthority(authority);
    setTaxAuthorityFormOpen(true);
  };

  const handleDeleteTaxType = async (taxType: TaxType) => {
    if (!confirm(`Are you sure you want to delete tax type "${taxType.name}"?`)) return;

    try {
      await deleteTaxType.mutateAsync(taxType.id);
      toast.success("Tax type deleted successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete tax type");
    }
  };

  const handleDeleteTaxAuthority = async (authority: TaxAuthority) => {
    if (!confirm(`Are you sure you want to delete tax authority "${authority.name}"?`)) return;

    try {
      await deleteTaxAuthority.mutateAsync(authority.id);
      toast.success("Tax authority deleted successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete tax authority");
    }
  };

  // Column definitions
  const taxTypeColumns = [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }: any) => (
        <Badge variant="outline" className="font-mono">
          {row.getValue("code")}
        </Badge>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "tax_category",
      header: "Category",
      cell: ({ row }: any) => {
        const category = row.getValue("tax_category");
        const categoryInfo = TAX_CATEGORIES.find(c => c.value === category);
        return (
          <Badge variant="secondary">
            {categoryInfo?.label || category}
          </Badge>
        );
      },
    },
    {
      accessorKey: "rate",
      header: "Rate",
      cell: ({ row }: any) => (
        <span className="font-medium">
          {Number(row.getValue("rate")).toFixed(2)}%
        </span>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }: any) => (
        <span className="text-gray-600 max-w-xs truncate block">
          {row.getValue("description") || "—"}
        </span>
      ),
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }: any) => (
        <Badge variant={row.getValue("is_active") ? "default" : "destructive"}>
          {row.getValue("is_active") ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditTaxType(row.original)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteTaxType(row.original)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const taxAuthorityColumns = [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }: any) => (
        <Badge variant="outline" className="font-mono">
          {row.getValue("code")}
        </Badge>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "contact_email",
      header: "Email",
      cell: ({ row }: any) => (
        <span className="text-gray-600">
          {row.getValue("contact_email") || "—"}
        </span>
      ),
    },
    {
      accessorKey: "contact_phone",
      header: "Phone",
      cell: ({ row }: any) => (
        <span className="text-gray-600">
          {row.getValue("contact_phone") || "—"}
        </span>
      ),
    },
    {
      accessorKey: "bank_name",
      header: "Bank",
      cell: ({ row }: any) => (
        <span className="text-gray-600">
          {row.getValue("bank_name") || "—"}
        </span>
      ),
    },
    {
      accessorKey: "account_number",
      header: "Account Number",
      cell: ({ row }: any) => (
        <span className="font-mono text-sm">
          {row.getValue("account_number") || "—"}
        </span>
      ),
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }: any) => (
        <Badge variant={row.getValue("is_active") ? "default" : "destructive"}>
          {row.getValue("is_active") ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditTaxAuthority(row.original)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteTaxAuthority(row.original)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tax Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage tax types (WHT, VAT, PAYE) and tax authorities
          </p>
        </div>
        <Button onClick={handleCreateNew} size="default">
          <Plus className="mr-2 h-4 w-4" />
          {activeTab === "tax-types" ? "New Tax Type" : "New Tax Authority"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="tax-types" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Tax Types
          </TabsTrigger>
          <TabsTrigger value="tax-authorities" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Tax Authorities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tax-types" className="mt-6">
          <Card
            title="Tax Types"
            description="Configure tax rates for WHT, VAT, and PAYE"
          >
            <DataTable
              columns={taxTypeColumns}
              data={taxTypesData?.data?.results || []}
              isLoading={taxTypesLoading}
              totalCount={taxTypesData?.data?.count || 0}
              pageSize={10}
              currentPage={1}
              onPageChange={(page) => {}}
            />
          </Card>
        </TabsContent>

        <TabsContent value="tax-authorities" className="mt-6">
          <Card
            title="Tax Authorities"
            description="Manage tax collection authorities (FIRS, State Revenue Services)"
          >
            <DataTable
              columns={taxAuthorityColumns}
              data={taxAuthoritiesData?.data?.results || []}
              isLoading={taxAuthoritiesLoading}
              totalCount={taxAuthoritiesData?.data?.count || 0}
              pageSize={10}
              currentPage={1}
              onPageChange={(page) => {}}
            />
          </Card>
        </TabsContent>
      </Tabs>

      {/* Forms */}
      <TaxTypeForm
        open={taxTypeFormOpen}
        onOpenChange={setTaxTypeFormOpen}
        taxType={editingTaxType}
        mode={editingTaxType ? "edit" : "create"}
      />

      <TaxAuthorityForm
        open={taxAuthorityFormOpen}
        onOpenChange={setTaxAuthorityFormOpen}
        taxAuthority={editingTaxAuthority}
        mode={editingTaxAuthority ? "edit" : "create"}
      />
    </div>
  );
}
