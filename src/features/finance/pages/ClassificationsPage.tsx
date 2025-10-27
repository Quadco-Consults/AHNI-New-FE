"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import Card from "components/Card";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Button } from "components/ui/button";
import { Plus, Search, Filter, Edit, Trash2 } from "lucide-react";
import { Input } from "components/ui/input";
import { Badge } from "components/ui/badge";
import {
  useGetFCONumbers,
  useGetCostCategories,
  useGetCostGroupings,
  useGetCostInputs,
  useGetBudgetLines,
  useDeleteFCONumber,
} from "../controllers/classificationsController";
import { ClassificationFilters, FCONumber, CostCategory, CostGrouping, CostInput, BudgetLine } from "../types/classification.types";
import FCONumberForm from "../components/classifications/FCONumberForm";
import CostCategoryForm from "../components/classifications/CostCategoryForm";
import CostGroupingForm from "../components/classifications/CostGroupingForm";
import CostInputForm from "../components/classifications/CostInputForm";
import BudgetLineForm from "../components/classifications/BudgetLineForm";
import { toast } from "sonner";

export default function ClassificationsPage() {
  const [activeTab, setActiveTab] = useState("fco-numbers");
  const [filters, setFilters] = useState<ClassificationFilters>({
    page: 1,
    page_size: 10,
    search: "",
    is_active: undefined,
  });

  // Form states
  const [fcoFormOpen, setFcoFormOpen] = useState(false);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [groupingFormOpen, setGroupingFormOpen] = useState(false);
  const [inputFormOpen, setInputFormOpen] = useState(false);
  const [budgetFormOpen, setBudgetFormOpen] = useState(false);
  const [editingFCO, setEditingFCO] = useState<FCONumber | undefined>();
  const [editingCategory, setEditingCategory] = useState<CostCategory | undefined>();
  const [editingGrouping, setEditingGrouping] = useState<CostGrouping | undefined>();
  const [editingInput, setEditingInput] = useState<CostInput | undefined>();
  const [editingBudget, setEditingBudget] = useState<BudgetLine | undefined>();

  // Delete mutation
  const deleteFCO = useDeleteFCONumber();

  // Data fetching hooks
  const { data: fcoData, isLoading: fcoLoading } = useGetFCONumbers(
    activeTab === "fco-numbers" ? filters : undefined
  );
  const { data: categoryData, isLoading: categoryLoading } = useGetCostCategories(
    activeTab === "cost-categories" ? filters : undefined
  );
  const { data: groupingData, isLoading: groupingLoading } = useGetCostGroupings(
    activeTab === "cost-groupings" ? filters : undefined
  );
  const { data: inputData, isLoading: inputLoading } = useGetCostInputs(
    activeTab === "cost-inputs" ? filters : undefined
  );
  const { data: budgetData, isLoading: budgetLoading } = useGetBudgetLines(
    activeTab === "budget-lines" ? filters : undefined
  );

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  };

  const handleFilterChange = (key: keyof ClassificationFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // Action handlers
  const handleCreateNew = () => {
    switch (activeTab) {
      case "fco-numbers":
        setEditingFCO(undefined);
        setFcoFormOpen(true);
        break;
      case "cost-categories":
        setEditingCategory(undefined);
        setCategoryFormOpen(true);
        break;
      case "cost-groupings":
        setEditingGrouping(undefined);
        setGroupingFormOpen(true);
        break;
      case "cost-inputs":
        setEditingInput(undefined);
        setInputFormOpen(true);
        break;
      case "budget-lines":
        setEditingBudget(undefined);
        setBudgetFormOpen(true);
        break;
    }
  };

  const handleEdit = (item: any) => {
    switch (activeTab) {
      case "fco-numbers":
        setEditingFCO(item);
        setFcoFormOpen(true);
        break;
      case "cost-categories":
        setEditingCategory(item);
        setCategoryFormOpen(true);
        break;
      case "cost-groupings":
        setEditingGrouping(item);
        setGroupingFormOpen(true);
        break;
      case "cost-inputs":
        setEditingInput(item);
        setInputFormOpen(true);
        break;
      case "budget-lines":
        setEditingBudget(item);
        setBudgetFormOpen(true);
        break;
    }
  };

  const handleDelete = async (item: any) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      switch (activeTab) {
        case "fco-numbers":
          await deleteFCO.mutateAsync(item.id);
          toast.success("FCO Number deleted successfully");
          break;
        // Add more cases for other types
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete item");
    }
  };

  // Column definitions for each classification type
  const fcoColumns = [
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
      accessorKey: "description",
      header: "Description",
      cell: ({ row }: any) => (
        <span className="text-gray-600 max-w-xs truncate">
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
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }: any) => (
        <span className="text-sm text-gray-500">
          {new Date(row.getValue("created_at")).toLocaleDateString()}
        </span>
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
            onClick={() => handleEdit(row.original)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.original)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const categoryColumns = [
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
      accessorKey: "fco_number",
      header: "FCO Number",
      cell: ({ row }: any) => {
        const fco = row.getValue("fco_number");
        return (
          <span className="text-sm">
            {typeof fco === 'object' ? (fco as any)?.name : fco || "—"}
          </span>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }: any) => (
        <span className="text-gray-600 max-w-xs truncate">
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
            onClick={() => handleEdit(row.original)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.original)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const groupingColumns = [
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
      accessorKey: "cost_category",
      header: "Cost Category",
      cell: ({ row }: any) => {
        const category = row.getValue("cost_category");
        return (
          <span className="text-sm">
            {typeof category === 'object' ? (category as any)?.name : category || "—"}
          </span>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }: any) => (
        <span className="text-gray-600 max-w-xs truncate">
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
            onClick={() => handleEdit(row.original)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.original)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const inputColumns = [
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
      accessorKey: "cost_grouping",
      header: "Cost Grouping",
      cell: ({ row }: any) => {
        const grouping = row.getValue("cost_grouping");
        return (
          <span className="text-sm">
            {typeof grouping === 'object' ? (grouping as any)?.name : grouping || "—"}
          </span>
        );
      },
    },
    {
      accessorKey: "unit_of_measure",
      header: "Unit",
      cell: ({ row }: any) => (
        <span className="text-sm">
          {row.getValue("unit_of_measure") || "—"}
        </span>
      ),
    },
    {
      accessorKey: "standard_rate",
      header: "Standard Rate",
      cell: ({ row }: any) => {
        const rate = row.getValue("standard_rate");
        return (
          <span className="text-sm font-mono">
            {rate ? `$${Number(rate).toFixed(2)}` : "—"}
          </span>
        );
      },
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
            onClick={() => handleEdit(row.original)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.original)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const budgetColumns = [
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
      accessorKey: "cost_input",
      header: "Cost Input",
      cell: ({ row }: any) => {
        const input = row.getValue("cost_input");
        return (
          <span className="text-sm">
            {typeof input === 'object' ? (input as any)?.name : input || "—"}
          </span>
        );
      },
    },
    {
      accessorKey: "account_code",
      header: "Account Code",
      cell: ({ row }: any) => (
        <span className="text-sm font-mono">
          {row.getValue("account_code") || "—"}
        </span>
      ),
    },
    {
      accessorKey: "gl_account",
      header: "GL Account",
      cell: ({ row }: any) => (
        <span className="text-sm font-mono">
          {row.getValue("gl_account") || "—"}
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
            onClick={() => handleEdit(row.original)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.original)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Get current data and loading state
  const getCurrentData = () => {
    switch (activeTab) {
      case "fco-numbers":
        return { data: fcoData?.data?.results || [], loading: fcoLoading, total: fcoData?.data?.count || 0 };
      case "cost-categories":
        return { data: categoryData?.data?.results || [], loading: categoryLoading, total: categoryData?.data?.count || 0 };
      case "cost-groupings":
        return { data: groupingData?.data?.results || [], loading: groupingLoading, total: groupingData?.data?.count || 0 };
      case "cost-inputs":
        return { data: inputData?.data?.results || [], loading: inputLoading, total: inputData?.data?.count || 0 };
      case "budget-lines":
        return { data: budgetData?.data?.results || [], loading: budgetLoading, total: budgetData?.data?.count || 0 };
      default:
        return { data: [], loading: false, total: 0 };
    }
  };

  const getCurrentColumns = () => {
    switch (activeTab) {
      case "fco-numbers":
        return fcoColumns;
      case "cost-categories":
        return categoryColumns;
      case "cost-groupings":
        return groupingColumns;
      case "cost-inputs":
        return inputColumns;
      case "budget-lines":
        return budgetColumns;
      default:
        return [];
    }
  };

  const getCreateButtonText = () => {
    switch (activeTab) {
      case "fco-numbers":
        return "Add FCO Number";
      case "cost-categories":
        return "Add Cost Category";
      case "cost-groupings":
        return "Add Cost Grouping";
      case "cost-inputs":
        return "Add Cost Input";
      case "budget-lines":
        return "Add Budget Line";
      default:
        return "Add New";
    }
  };

  const currentData = getCurrentData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Classifications</h1>
          <p className="text-gray-600">
            Manage funding sources, cost categories, groupings, inputs, and budget lines
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus size={20} className="mr-2" />
          {getCreateButtonText()}
        </Button>
      </div>

      {/* Main Content */}
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="fco-numbers">FCO Numbers</TabsTrigger>
            <TabsTrigger value="cost-categories">Cost Categories</TabsTrigger>
            <TabsTrigger value="cost-groupings">Cost Groupings</TabsTrigger>
            <TabsTrigger value="cost-inputs">Cost Inputs</TabsTrigger>
            <TabsTrigger value="budget-lines">Budget Lines</TabsTrigger>
          </TabsList>

          {/* Search and Filters */}
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  value={filters.search || ""}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter size={16} className="mr-2" />
                Filters
              </Button>
            </div>
            <div className="text-sm text-gray-600">
              Total: {currentData.total} items
            </div>
          </div>

          {/* Tab Contents */}
          <TabsContent value="fco-numbers" className="mt-0">
            <DataTable
              columns={getCurrentColumns()}
              data={currentData.data}
              isLoading={currentData.loading}
              pagination={{
                pageSize: filters.page_size || 10,
                total: currentData.total,
                onChange: handlePageChange,
              }}
            />
          </TabsContent>

          <TabsContent value="cost-categories" className="mt-0">
            <DataTable
              columns={getCurrentColumns()}
              data={currentData.data}
              isLoading={currentData.loading}
              pagination={{
                pageSize: filters.page_size || 10,
                total: currentData.total,
                onChange: handlePageChange,
              }}
            />
          </TabsContent>

          <TabsContent value="cost-groupings" className="mt-0">
            <DataTable
              columns={getCurrentColumns()}
              data={currentData.data}
              isLoading={currentData.loading}
              pagination={{
                pageSize: filters.page_size || 10,
                total: currentData.total,
                onChange: handlePageChange,
              }}
            />
          </TabsContent>

          <TabsContent value="cost-inputs" className="mt-0">
            <DataTable
              columns={getCurrentColumns()}
              data={currentData.data}
              isLoading={currentData.loading}
              pagination={{
                pageSize: filters.page_size || 10,
                total: currentData.total,
                onChange: handlePageChange,
              }}
            />
          </TabsContent>

          <TabsContent value="budget-lines" className="mt-0">
            <DataTable
              columns={getCurrentColumns()}
              data={currentData.data}
              isLoading={currentData.loading}
              pagination={{
                pageSize: filters.page_size || 10,
                total: currentData.total,
                onChange: handlePageChange,
              }}
            />
          </TabsContent>
        </Tabs>
      </Card>

      {/* Forms */}
      <FCONumberForm
        open={fcoFormOpen}
        onOpenChange={setFcoFormOpen}
        fcoNumber={editingFCO}
        mode={editingFCO ? "edit" : "create"}
      />

      <CostCategoryForm
        open={categoryFormOpen}
        onOpenChange={setCategoryFormOpen}
        costCategory={editingCategory}
        mode={editingCategory ? "edit" : "create"}
      />

      <CostGroupingForm
        open={groupingFormOpen}
        onOpenChange={setGroupingFormOpen}
        costGrouping={editingGrouping}
        mode={editingGrouping ? "edit" : "create"}
      />

      <CostInputForm
        open={inputFormOpen}
        onOpenChange={setInputFormOpen}
        costInput={editingInput}
        mode={editingInput ? "edit" : "create"}
      />

      <BudgetLineForm
        open={budgetFormOpen}
        onOpenChange={setBudgetFormOpen}
        budgetLine={editingBudget}
        mode={editingBudget ? "edit" : "create"}
      />
    </div>
  );
}