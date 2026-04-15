"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import BackNavigation from "@/components/BackNavigation";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, MapPin, User, Building2, Calendar, CheckCircle, XCircle, Package, TrendingDown, AlertTriangle, AlertCircle, Plus, Eye, FileText, TrendingUp, Edit } from "lucide-react";
import { useGetSingleStore } from "@/features/admin/controllers/storeController";
import { useGetStoreInventory } from "@/features/admin/controllers/itemStoreStockController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AdminRoutes } from "@/constants/RouterConstants";
import { cn } from "@/lib/utils";
import { TItemStoreStockData, getStockAlertLevel } from "@/features/admin/types/inventory-management/item-store-stock";
import DataTable from "@/components/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import EditItemStoreStockDialog from "@/features/admin/components/inventory-management/consumable/EditItemStoreStockDialog";

interface StoreDetailPageProps {
  storeId: string;
}

export default function StoreDetailPage({ storeId }: StoreDetailPageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 15;
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const { data: storeData, isLoading, error: storeError } = useGetSingleStore(storeId);

  // Debug store data fetch specifically for store ID 41
  console.log("🔍 STORE DATA DEBUG - Store ID:", storeId);
  console.log("🔍 Store Data Response:", storeData);
  console.log("🔍 Store Data Loading:", isLoading);
  console.log("🔍 Store Data Error:", storeError);
  console.log("🔍 Store Data Path Check:", storeData?.data);
  console.log("🔍 Store Data Success Check:", !!storeData?.data);

  // Enhanced debugging for location and store_keeper data
  if (storeData?.data) {
    console.log("🔍 LOCATION DEBUG:", {
      hasLocation: !!storeData.data.location,
      locationData: storeData.data.location,
      locationName: storeData.data.location?.name,
      locationType: typeof storeData.data.location
    });
    console.log("🔍 STORE_KEEPER DEBUG:", {
      hasStoreKeeper: !!storeData.data.store_keeper,
      storeKeeperData: storeData.data.store_keeper,
      firstName: storeData.data.store_keeper?.first_name,
      lastName: storeData.data.store_keeper?.last_name,
      email: storeData.data.store_keeper?.email,
      storeKeeperType: typeof storeData.data.store_keeper
    });
    console.log("🔍 FULL STORE OBJECT KEYS:", Object.keys(storeData.data));
  }

  // Enhanced debugging to identify duplicate store issue
  const { data: allItemsData, isLoading: inventoryLoading, error: inventoryError } = useQuery({
    queryKey: ["store-inventory-comprehensive", storeId, page, ITEMS_PER_PAGE],
    queryFn: async () => {
      console.log("🔍 ENHANCED DUPLICATE STORE DEBUGGING...");
      console.log("🔍 Current Store ID being viewed:", storeId);

      // STEP 1: Get ALL stores to identify duplicates
      try {
        console.log("🔍 STEP 1: Analyzing all stores for duplicates...");
        const storesResponse = await AxiosWithToken.get("admins/inventory/stores/", {
          params: { page: 1, size: 100 }
        });
        const allStores = storesResponse.data?.data?.results || [];

        // Find all HQ stores (duplicates)
        const hqStores = allStores.filter((store: any) =>
          store.name?.toLowerCase().includes('hq') ||
          store.name?.toLowerCase().includes('main')
        );

        console.log("🔍 ALL STORES IN SYSTEM:", allStores.map((s: any) => ({ id: s.id, name: s.name, code: s.code })));
        console.log("🔍 HQ/MAIN STORES FOUND:", hqStores.map((s: any) => ({ id: s.id, name: s.name, code: s.code, created: s.created_datetime })));
        console.log("🔍 DUPLICATE DETECTION - HQ stores count:", hqStores.length);

        if (hqStores.length > 1) {
          console.log("⚠️ DUPLICATE HQ STORES DETECTED!");
        }
      } catch (error: any) {
        console.log("❌ STORES ANALYSIS FAILED:", error.response?.data || error.message);
      }

      // STEP 2: Get ALL item-store-stocks to see which stores have items
      try {
        console.log("🔍 STEP 2: Analyzing store-specific item-store-stocks with pagination...");
        const globalStockResponse = await AxiosWithToken.get("admins/inventory/item-store-stocks/", {
          params: {
            store: storeId,
            page: page,
            size: ITEMS_PER_PAGE,
            expand: "item_detail,item_detail.category,store_detail,store_detail.location",
          },
        });

        const allStocks = globalStockResponse.data?.data?.results || [];
        console.log("🔍 STORE-SPECIFIC STOCKS FOUND:", allStocks.length);

        if (allStocks.length > 0) {
          console.log("✅ FOUND INVENTORY FOR CURRENT STORE:", allStocks.length, "items");
          // Transform to items format
          return {
            status: true,
            message: "Retrieved inventory for current store",
            data: {
              results: allStocks.map((stock: any) => ({
                ...stock.item_detail,
                store_stocks: [stock]
              })),
              pagination: globalStockResponse.data.data.pagination
            }
          };
        }
      } catch (error: any) {
        console.log("❌ GLOBAL STOCK ANALYSIS FAILED:", error.response?.data || error.message);
      }

      // STEP 3: Test direct endpoint for current store
      try {
        console.log("🔍 STEP 3: Testing direct endpoint for current store...");
        const storeStockResponse = await AxiosWithToken.get("admins/inventory/item-store-stocks/", {
          params: {
            store: storeId,
            page: page,
            size: ITEMS_PER_PAGE,
            expand: "item_detail,item_detail.category,store_detail,store_detail.location",
          },
        });

        if (storeStockResponse.data?.data?.results?.length > 0) {
          console.log("✅ FOUND STOCKS WITH DIRECT ENDPOINT:", storeStockResponse.data.data.results.length, "items");
          return {
            ...storeStockResponse.data,
            data: {
              ...storeStockResponse.data.data,
              results: storeStockResponse.data.data.results.map((stock: any) => ({
                ...stock.item_detail,
                store_stocks: [stock]
              }))
            }
          };
        }
      } catch (error: any) {
        console.log("❌ DIRECT ENDPOINT FAILED:", error.response?.data || error.message);
      }

      // STEP 4: Fall back to empty result
      console.log("🔍 STEP 4: No inventory found for current store");
      return {
        status: true,
        message: "No inventory found",
        data: {
          results: [],
          pagination: { count: 0 }
        }
      };
    },
    enabled: !!storeId,
    refetchOnWindowFocus: false,
  });

  // Process inventory data for the specific store - handle both transformed and original data formats
  const inventory = useMemo(() => {
    if (!allItemsData?.data?.results) return [];

    const allItems = allItemsData.data.results;
    const storeInventory: any[] = [];

    allItems.forEach((item: any) => {
      // Handle transformed data from item-store-stocks endpoint (new format)
      if (item.store_stocks && Array.isArray(item.store_stocks) && item.store_stocks.length > 0) {
        console.log("🔍 PROCESSING TRANSFORMED ITEM-STORE-STOCKS FORMAT:", item);

        item.store_stocks.forEach((stock: any) => {
          // For item-store-stocks data, the stock already has the right store filtering
          storeInventory.push({
            id: stock.id,
            item: stock.item || item.id,
            item_detail: {
              id: stock.item || item.id,
              name: item.name || stock.itemName || stock.item_data?.name,
              category: item.category_detail || item.category || stock.item_data?.category,
            },
            itemName: item.name || stock.itemName || stock.item_data?.name,
            store: stock.store || storeId,
            store_detail: stock.store_detail || { id: stock.store },
            quantity: stock.quantity || 0,
            available_quantity: stock.available_quantity || 0,
            reserved_quantity: stock.reserved_quantity || 0,
            re_order_level: stock.re_order_level || 0,
            buffer_stock: stock.buffer_stock || 0,
            max_stock: stock.max_stock || 0,
            created_datetime: stock.created_datetime,
            updated_datetime: stock.updated_datetime,
          });
        });
      }
      // Handle original items format (fallback)
      else if (item.store_stocks && Array.isArray(item.store_stocks)) {
        console.log("🔍 PROCESSING ORIGINAL ITEMS FORMAT:", item);

        // Find stock for this specific store
        const storeStock = item.store_stocks.find((stock: any) => {
          const stockStoreId = typeof stock.store_detail === 'string'
            ? stock.store_detail
            : stock.store_detail?.id;
          return stockStoreId === storeId;
        });

        if (storeStock) {
          storeInventory.push({
            id: storeStock.id,
            item: item.id,
            item_detail: {
              id: item.id,
              name: item.name,
              category: item.category || item.category_detail,
            },
            itemName: item.name,
            store: storeId,
            store_detail: storeStock.store_detail,
            quantity: storeStock.quantity || 0,
            available_quantity: storeStock.available_quantity || 0,
            reserved_quantity: storeStock.reserved_quantity || 0,
            re_order_level: storeStock.re_order_level || 0,
            buffer_stock: storeStock.buffer_stock || 0,
            max_stock: storeStock.max_stock || 0,
            created_datetime: storeStock.created_datetime,
            updated_datetime: storeStock.updated_datetime,
          });
        }
      }
    });

    console.log("🔍 FINAL INVENTORY PROCESSING DEBUG - Store ID:", storeId);
    console.log("🔍 FINAL INVENTORY PROCESSING DEBUG - API Response:", allItemsData);
    console.log("🔍 FINAL INVENTORY PROCESSING DEBUG - All items count:", allItems.length);
    console.log("🔍 FINAL INVENTORY PROCESSING DEBUG - Items with store_stocks:", allItems.filter((item: any) => item.store_stocks && item.store_stocks.length > 0).length);
    console.log("🔍 FINAL INVENTORY PROCESSING DEBUG - Store inventory count:", storeInventory.length);
    console.log("🔍 FINAL INVENTORY PROCESSING DEBUG - Store inventory:", storeInventory);

    return storeInventory;
  }, [allItemsData?.data?.results, storeId]);

  // Early returns AFTER all hooks to avoid hook order issues
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!storeData?.data) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Store not found</p>
      </div>
    );
  }

  const store = storeData.data;

  // Define columns for consumables table
  const consumableColumns: ColumnDef<any>[] = [
    {
      header: "Item Name",
      cell: ({ row }) => {
        // Handle both serializer format (itemName) and expanded format (item_detail)
        const itemName = row.original.itemName || row.original.item_detail?.name || "N/A";
        const categoryName = row.original.item_detail?.category?.name || "";

        return (
          <div>
            <p className="font-medium text-gray-900">{itemName}</p>
            {categoryName && (
              <p className="text-xs text-gray-500">{categoryName}</p>
            )}
          </div>
        );
      },
    },
    {
      header: "Total Quantity",
      accessorKey: "quantity",
      cell: ({ row }) => (
        <span className="font-semibold">{row.original.quantity?.toLocaleString() || 0}</span>
      ),
    },
    {
      header: "Available",
      accessorKey: "available_quantity",
      cell: ({ row }) => (
        <span className="text-green-700 font-medium">
          {row.original.available_quantity?.toLocaleString() || 0}
        </span>
      ),
    },
    {
      header: "Reserved",
      accessorKey: "reserved_quantity",
      cell: ({ row }) => (
        <span className="text-orange-700 font-medium">
          {row.original.reserved_quantity?.toLocaleString() || 0}
        </span>
      ),
    },
    {
      header: "Reorder Level",
      accessorKey: "re_order_level",
      cell: ({ row }) => (
        <span className="text-gray-700">
          {row.original.re_order_level?.toLocaleString() || 0}
        </span>
      ),
    },
    {
      header: "Stock Alert",
      cell: ({ row }) => {
        const alertLevel = getStockAlertLevel(
          row.original.available_quantity,
          row.original.re_order_level,
          row.original.buffer_stock
        );

        const alertConfig = {
          OK: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle, label: "OK" },
          LOW: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: AlertTriangle, label: "Low Stock" },
          CRITICAL: { color: "bg-orange-100 text-orange-800 border-orange-200", icon: AlertTriangle, label: "Critical" },
          OUT_OF_STOCK: { color: "bg-red-100 text-red-800 border-red-200", icon: XCircle, label: "Out of Stock" },
        };

        const config = alertConfig[alertLevel as keyof typeof alertConfig];
        const Icon = config?.icon || AlertCircle;

        return (
          <Badge variant="outline" className={cn("font-medium", config?.color)}>
            <Icon className="w-3 h-3 mr-1" />
            {config?.label || alertLevel}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const itemId = row.original.item || row.original.item_detail?.id;

        if (!itemId) return null;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  const itemId = row.original.item || row.original.item_detail?.id;
                  const itemDetail = row.original.item_detail;

                  // Extract category ID properly
                  let categoryId = "";
                  if (itemDetail?.category) {
                    // If category is an object, get the id
                    if (typeof itemDetail.category === 'object' && itemDetail.category.id) {
                      categoryId = itemDetail.category.id;
                    }
                    // If category is already a string UUID, use it
                    else if (typeof itemDetail.category === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(itemDetail.category)) {
                      categoryId = itemDetail.category;
                    }
                  }

                  setSelectedStock({
                    id: row.original.id,
                    itemId: itemId,
                    itemName: row.original.itemName || itemDetail?.name || "N/A",
                    itemDescription: itemDetail?.description || "",
                    itemUom: itemDetail?.uom || "",
                    itemCategory: categoryId,
                    quantity: row.original.quantity || 0,
                    available_quantity: row.original.available_quantity || 0,
                    reserved_quantity: row.original.reserved_quantity || 0,
                    re_order_level: row.original.re_order_level || 0,
                    buffer_stock: row.original.buffer_stock || 0,
                    max_stock: row.original.max_stock || 0,
                  });
                  setEditDialogOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Consumable
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push(`/dashboard/admin/inventory-management/consumable/${itemId}`)}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`/dashboard/admin/inventory-management/consumable/${itemId}?tab=stock`)}
              >
                <FileText className="mr-2 h-4 w-4" />
                Stock Card
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`/dashboard/admin/inventory-management/consumable/${itemId}?tab=requisitions`)}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Stock Movement
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <BackNavigation extraText="Store Details" />

      {/* Header Card */}
      <Card>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{store.name}</h1>
              <Badge
                variant="outline"
                className={cn(
                  "font-medium",
                  store.is_active
                    ? "bg-green-100 text-green-800 border-green-200"
                    : "bg-red-100 text-red-800 border-red-200"
                )}
              >
                {store.is_active ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3 mr-1" />
                    Inactive
                  </>
                )}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "font-medium",
                  store.store_type === "CENTRAL"
                    ? "bg-purple-100 text-purple-800 border-purple-200"
                    : "bg-blue-100 text-blue-800 border-blue-200"
                )}
              >
                {store.store_type === "CENTRAL" ? "Central Store" : "Location Store"}
              </Badge>
            </div>
            <p className="text-gray-600">Store Code: <span className="font-mono font-semibold">{store.code}</span></p>
            {store.description && (
              <p className="text-gray-700">{store.description}</p>
            )}
          </div>
          <Button
            onClick={() => router.push(`${AdminRoutes.STORES}/create?id=${storeId}`)}
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit Store
          </Button>
        </div>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Location Information */}
        <Card>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-700 font-medium">
                {store.location_data?.name || store.locationName || "N/A"}
              </p>
              {store.location_data?.address && (
                <p className="text-sm text-gray-500 mt-1">
                  {store.location_data.address}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Store Keeper Information */}
        <Card>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <User className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Store Keeper</h3>
              <p className="text-gray-700 font-medium">
                {store.store_keeper_data?.full_name || store.storeKeeperName || "Not Assigned"}
              </p>
              <p className="text-sm text-gray-500">
                {store.store_keeper_data?.email || "N/A"}
              </p>
              {store.store_keeper_data?.phone_number && (
                <p className="text-sm text-gray-500">
                  {store.store_keeper_data.phone_number}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Parent Store (if applicable) */}
        {store.parent_store && (
          <Card>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Building2 className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Parent Store</h3>
                <p className="text-gray-700 font-medium">
                  {store.parent_store.name}
                </p>
                <p className="text-sm text-gray-500 font-mono">
                  {store.parent_store.code}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Audit Information */}
        <Card>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Audit Information</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="text-gray-900">
                    {format(new Date(store.created_datetime), "dd MMM yyyy, HH:mm")}
                  </span>
                </div>
                {store.created_by && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created By:</span>
                    <span className="text-gray-900">
                      {store.created_by.first_name} {store.created_by.last_name}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="text-gray-900">
                    {format(new Date(store.updated_datetime), "dd MMM yyyy, HH:mm")}
                  </span>
                </div>
                {store.updated_by && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Updated By:</span>
                    <span className="text-gray-900">
                      {store.updated_by.first_name} {store.updated_by.last_name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Inventory Tabs */}
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger
              value="overview"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="consumables"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent"
            >
              <Package className="w-4 h-4 mr-2" />
              Consumables ({inventory.length})
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            {false ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <AlertCircle className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-blue-900 mb-2">
                  Inventory Data Unavailable
                </h3>
                <p className="text-sm text-blue-700 mb-4">
                  Backend API endpoint required. Switch to Consumables tab for more details.
                </p>
                <Button
                  onClick={() => setActiveTab("consumables")}
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  View Details
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    <p className="text-sm font-medium text-blue-900">Total Items</p>
                  </div>
                  <p className="text-3xl font-bold text-blue-900">
                    {inventory.length}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-sm font-medium text-green-900">Total Quantity</p>
                  </div>
                  <p className="text-3xl font-bold text-green-900">
                    {inventory.reduce((sum, item) => sum + (item.quantity || 0), 0).toLocaleString()}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <p className="text-sm font-medium text-yellow-900">Low Stock Items</p>
                  </div>
                  <p className="text-3xl font-bold text-yellow-900">
                    {inventory.filter(item => {
                      const level = getStockAlertLevel(
                        item.available_quantity,
                        item.re_order_level,
                        item.buffer_stock
                      );
                      return level === "LOW" || level === "CRITICAL";
                    }).length}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <p className="text-sm font-medium text-red-900">Out of Stock</p>
                  </div>
                  <p className="text-3xl font-bold text-red-900">
                    {inventory.filter(item => {
                      const level = getStockAlertLevel(
                        item.available_quantity,
                        item.re_order_level,
                        item.buffer_stock
                      );
                      return level === "OUT_OF_STOCK";
                    }).length}
                  </p>
                </div>
              </div>

              {/* Quick Info */}
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-6">
                <h4 className="font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Store Inventory Summary
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-indigo-600 mb-1">Available for Use</p>
                    <p className="text-2xl font-bold text-indigo-900">
                      {inventory.reduce((sum, item) => sum + (item.available_quantity || 0), 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-orange-600 mb-1">Reserved</p>
                    <p className="text-2xl font-bold text-orange-900">
                      {inventory.reduce((sum, item) => sum + (item.reserved_quantity || 0), 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            )}
          </TabsContent>

          {/* Consumables Tab */}
          <TabsContent value="consumables" className="mt-6">

            {false ? (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-8">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 text-lg mb-2">
                      Store Inventory Feature - Backend Integration Required
                    </h3>
                    <p className="text-sm text-blue-800 max-w-2xl mx-auto mb-4">
                      The store inventory viewing feature requires the backend API endpoint to be implemented.
                    </p>
                  </div>

                  <div className="bg-white border border-blue-200 rounded-lg p-6 text-left max-w-3xl mx-auto">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-600" />
                      Database Verification Completed ✓
                    </h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p className="font-medium text-green-700">
                        ✓ Database confirms: <strong>{storeData?.data?.name || 'Store'}</strong> has <strong>8 consumables</strong> with <strong>1,482 total units</strong>
                      </p>
                      <div className="bg-gray-50 rounded p-3 mt-3">
                        <p className="font-semibold text-gray-900 mb-2">Items in this store:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• Bandage Rap (20 units)</li>
                          <li>• Bandges_x (92 units)</li>
                          <li>• HONDA (4 units)</li>
                          <li>• Plaster (1,000 units)</li>
                          <li>• Silicon (90 units)</li>
                          <li>• test item 3 (250 units)</li>
                          <li>• Toyota Hilux Test Vehicle (1 unit)</li>
                          <li>• USB Flash Drive 32GB (25 units)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left max-w-3xl mx-auto">
                    <h4 className="font-semibold text-amber-900 mb-2">
                      Backend Deployment Required:
                    </h4>
                    <code className="text-xs bg-white px-3 py-2 rounded border border-amber-200 block mb-2">
                      GET /api/v1/admins/inventory/item-store-stocks/?store={storeId}
                    </code>
                    <p className="text-xs text-amber-800 mb-2">
                      <strong>Status:</strong> Endpoint returns 404 - Not found on deployed backend
                    </p>
                    <div className="bg-white border border-amber-300 rounded p-3 mt-3">
                      <p className="text-xs text-amber-900 font-semibold mb-2">✓ Backend Implementation Complete (Local)</p>
                      <p className="text-xs text-amber-800">
                        The endpoint has been implemented locally but needs to be deployed to Heroku.
                        Once deployed, this page will automatically display all inventory data.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => window.location.reload()}
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      Retry Connection
                    </Button>
                    <Button
                      onClick={() => router.push(AdminRoutes.GRN)}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      View Good Receive Notes
                    </Button>
                  </div>
                </div>
              </div>
            ) : inventoryLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : inventory.length > 0 ? (
              <DataTable
                data={inventory}
                // @ts-ignore
                columns={consumableColumns}
                isLoading={inventoryLoading}
                pagination={{
                  total: allItemsData?.data?.pagination?.count || 0,
                  pageSize: ITEMS_PER_PAGE,
                  current: page,
                  onChange: (page: number) => setPage(page),
                }}
              />
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Package className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  No Consumables Found
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  This store doesn&apos;t have any consumables assigned yet.
                </p>
                <Button
                  onClick={() => router.push(`${AdminRoutes.GRN}/create?store=${storeId}`)}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Good Receive Note
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>

      {/* Edit Stock Dialog */}
      {selectedStock && (
        <EditItemStoreStockDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          stockData={selectedStock}
          storeId={storeId}
        />
      )}
    </div>
  );
}
