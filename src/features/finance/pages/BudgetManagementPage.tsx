"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Edit2,
  Trash2,
  Settings
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetBudgetLines,
  useCreateBudgetLine,
  useGetCostCategories,
  useCreateCostCategory,
  useGetFCONumbers,
  useCreateFCONumber,
  useDeleteFCONumber,
  useGetCostGroupings,
  useGetCostInputs
} from "../controllers/classificationsController";
import {
  BudgetLine,
  CostCategory,
  FCONumber,
  CostGrouping,
  CostInput
} from "../types/classification.types";

export default function BudgetManagementPage() {
  const [activeTab, setActiveTab] = useState("fco-numbers");
  const [budgetFilters, setBudgetFilters] = useState({
    is_active: true,
    search: "",
    page: 1,
    page_size: 10
  });

  const [costFilters, setCostFilters] = useState({
    is_active: true,
    search: "",
    page: 1,
    page_size: 10
  });

  const [fcoFilters, setFcoFilters] = useState({
    is_active: true,
    search: "",
    page: 1,
    page_size: 10
  });

  // Data fetching hooks
  const { data: budgetLinesData, isLoading: budgetLoading } = useGetBudgetLines(budgetFilters);
  const { data: costCategoriesData, isLoading: costLoading } = useGetCostCategories(costFilters);
  const { data: fcoNumbersData, isLoading: fcoLoading } = useGetFCONumbers(fcoFilters);
  const { data: costGroupingsData, isLoading: groupingsLoading } = useGetCostGroupings(costFilters);
  const { data: costInputsData, isLoading: inputsLoading } = useGetCostInputs(costFilters);

  const budgetLines = budgetLinesData?.data?.results || [];
  const costCategories = costCategoriesData?.data?.results || [];
  const fcoNumbers = fcoNumbersData?.data?.results || [];
  const costGroupings = costGroupingsData?.data?.results || [];
  const costInputs = costInputsData?.data?.results || [];

  // Mutations
  const { createBudgetLine } = useCreateBudgetLine();
  const { createCostCategory } = useCreateCostCategory();
  const { createFCONumber } = useCreateFCONumber();
  const deleteFCONumber = useDeleteFCONumber();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Classifications</h1>
          <p className="text-gray-600">
            Manage FCO numbers, cost categories, groupings, inputs, and budget lines
          </p>
        </div>
        <Button onClick={() => {}}>
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-4">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{fcoNumbers.length}</div>
              <div className="text-sm text-gray-600">FCO Numbers</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{costCategories.length}</div>
              <div className="text-sm text-gray-600">Cost Categories</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg mr-4">
              <TrendingDown className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{costGroupings.length}</div>
              <div className="text-sm text-gray-600">Cost Groupings</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-4">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{costInputs.length}</div>
              <div className="text-sm text-gray-600">Cost Inputs</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="fco-numbers">FCO Numbers</TabsTrigger>
          <TabsTrigger value="cost-categories">Cost Categories</TabsTrigger>
          <TabsTrigger value="cost-groupings">Cost Groupings</TabsTrigger>
          <TabsTrigger value="cost-inputs">Cost Inputs</TabsTrigger>
          <TabsTrigger value="budget-lines">Budget Lines</TabsTrigger>
        </TabsList>

        {/* FCO Numbers Tab */}
        <TabsContent value="fco-numbers" className="space-y-4">
          {/* Filters */}
          <Card className="p-4">
            <div className="flex space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search FCO numbers..."
                  className="pl-10"
                  value={fcoFilters.search}
                  onChange={(e) => setFcoFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
              <Select
                value={fcoFilters.is_active === undefined ? "all" : fcoFilters.is_active.toString()}
                onValueChange={(value) => setFcoFilters(prev => ({
                  ...prev,
                  is_active: value === "all" ? undefined : value === "true"
                }))}
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
            </div>
          </Card>

          {/* FCO Numbers List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fcoLoading ? (
              [1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded" />
                      <div className="h-3 bg-gray-200 rounded" />
                    </div>
                  </div>
                </Card>
              ))
            ) : fcoNumbers.length === 0 ? (
              <Card className="p-12 text-center col-span-full">
                <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No FCO Numbers Found</h3>
                <p className="text-gray-600 mb-6">
                  Create FCO numbers to track project funding sources.
                </p>
                <Button onClick={() => {}}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create FCO Number
                </Button>
              </Card>
            ) : (
              fcoNumbers.map((fco: FCONumber) => (
                <Card key={fco.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{fco.name}</h3>
                      <p className="text-sm text-gray-600 font-mono">{fco.code}</p>
                    </div>
                    <Badge variant={fco.is_active ? "default" : "secondary"}>
                      {fco.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  {fco.description && (
                    <p className="text-gray-600 mb-4">{fco.description}</p>
                  )}

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Created</span>
                      <span className="font-medium">
                        {new Date(fco.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last Updated</span>
                      <span className="font-medium">
                        {new Date(fco.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this FCO number?")) {
                          deleteFCONumber.mutate(fco.id, {
                            onSuccess: () => {
                              toast.success("FCO number deleted successfully");
                            },
                            onError: () => {
                              toast.error("Failed to delete FCO number");
                            }
                          });
                        }
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Cost Categories Tab */}
        <TabsContent value="cost-categories" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {costLoading ? (
              [1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded" />
                      <div className="h-3 bg-gray-200 rounded" />
                    </div>
                  </div>
                </Card>
              ))
            ) : costCategories.length === 0 ? (
              <Card className="p-12 text-center col-span-full">
                <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Cost Categories Found</h3>
                <p className="text-gray-600 mb-6">
                  Create cost categories to organize your expenses.
                </p>
                <Button onClick={() => {}}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Cost Category
                </Button>
              </Card>
            ) : (
              costCategories.map((category: CostCategory) => (
                <Card key={category.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{category.name}</h3>
                      <p className="text-sm text-gray-600 font-mono">{category.code}</p>
                    </div>
                    <Badge variant={category.is_active ? "default" : "secondary"}>
                      {category.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  {category.description && (
                    <p className="text-gray-600 mb-4">{category.description}</p>
                  )}

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">FCO Number</span>
                      <span className="font-medium">
                        {typeof category.fco_number === 'object'
                          ? (category.fco_number as FCONumber).name
                          : category.fco_number}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Created</span>
                      <span className="font-medium">
                        {new Date(category.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Cost Groupings Tab */}
        <TabsContent value="cost-groupings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupingsLoading ? (
              [1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded" />
                      <div className="h-3 bg-gray-200 rounded" />
                    </div>
                  </div>
                </Card>
              ))
            ) : costGroupings.length === 0 ? (
              <Card className="p-12 text-center col-span-full">
                <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Cost Groupings Found</h3>
                <p className="text-gray-600 mb-6">
                  Create cost groupings to organize your cost categories.
                </p>
                <Button onClick={() => {}}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Cost Grouping
                </Button>
              </Card>
            ) : (
              costGroupings.map((grouping: CostGrouping) => (
                <Card key={grouping.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{grouping.name}</h3>
                      <p className="text-sm text-gray-600 font-mono">{grouping.code}</p>
                    </div>
                    <Badge variant={grouping.is_active ? "default" : "secondary"}>
                      {grouping.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  {grouping.description && (
                    <p className="text-gray-600 mb-4">{grouping.description}</p>
                  )}

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Cost Category</span>
                      <span className="font-medium">
                        {typeof grouping.cost_category === 'object'
                          ? (grouping.cost_category as CostCategory).name
                          : grouping.cost_category}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Created</span>
                      <span className="font-medium">
                        {new Date(grouping.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Cost Inputs Tab */}
        <TabsContent value="cost-inputs" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inputsLoading ? (
              [1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded" />
                      <div className="h-3 bg-gray-200 rounded" />
                    </div>
                  </div>
                </Card>
              ))
            ) : costInputs.length === 0 ? (
              <Card className="p-12 text-center col-span-full">
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Cost Inputs Found</h3>
                <p className="text-gray-600 mb-6">
                  Create cost inputs to define specific cost items.
                </p>
                <Button onClick={() => {}}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Cost Input
                </Button>
              </Card>
            ) : (
              costInputs.map((input: CostInput) => (
                <Card key={input.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{input.name}</h3>
                      <p className="text-sm text-gray-600 font-mono">{input.code}</p>
                    </div>
                    <Badge variant={input.is_active ? "default" : "secondary"}>
                      {input.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  {input.description && (
                    <p className="text-gray-600 mb-4">{input.description}</p>
                  )}

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Cost Grouping</span>
                      <span className="font-medium">
                        {typeof input.cost_grouping === 'object'
                          ? (input.cost_grouping as CostGrouping).name
                          : input.cost_grouping}
                      </span>
                    </div>
                    {input.unit_of_measure && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Unit of Measure</span>
                        <span className="font-medium">{input.unit_of_measure}</span>
                      </div>
                    )}
                    {input.standard_rate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Standard Rate</span>
                        <span className="font-medium">${input.standard_rate.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Created</span>
                      <span className="font-medium">
                        {new Date(input.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Budget Lines Tab */}
        <TabsContent value="budget-lines" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgetLoading ? (
              [1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded" />
                      <div className="h-3 bg-gray-200 rounded" />
                    </div>
                  </div>
                </Card>
              ))
            ) : budgetLines.length === 0 ? (
              <Card className="p-12 text-center col-span-full">
                <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Budget Lines Found</h3>
                <p className="text-gray-600 mb-6">
                  Create budget lines to map cost inputs to GL accounts.
                </p>
                <Button onClick={() => {}}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Budget Line
                </Button>
              </Card>
            ) : (
              budgetLines.map((budgetLine: BudgetLine) => (
                <Card key={budgetLine.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{budgetLine.name}</h3>
                      <p className="text-sm text-gray-600 font-mono">{budgetLine.code}</p>
                    </div>
                    <Badge variant={budgetLine.is_active ? "default" : "secondary"}>
                      {budgetLine.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  {budgetLine.description && (
                    <p className="text-gray-600 mb-4">{budgetLine.description}</p>
                  )}

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Cost Input</span>
                      <span className="font-medium">
                        {typeof budgetLine.cost_input === 'object'
                          ? (budgetLine.cost_input as CostInput).name
                          : budgetLine.cost_input}
                      </span>
                    </div>
                    {budgetLine.account_code && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Account Code</span>
                        <span className="font-medium font-mono">{budgetLine.account_code}</span>
                      </div>
                    )}
                    {budgetLine.gl_account && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">GL Account</span>
                        <span className="font-medium font-mono">{budgetLine.gl_account}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Created</span>
                      <span className="font-medium">
                        {new Date(budgetLine.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}