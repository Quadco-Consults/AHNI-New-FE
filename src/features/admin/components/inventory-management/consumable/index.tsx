"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Store } from "lucide-react";
import Link from "next/link";
import DataTable from "@/components/Table/DataTable";
import { consumableColums } from "@/features/admin/components/table-columns/inventory-management/consumables";
import TableFilters from "@/components/Table/TableFilters";
import { useGetAllItemsQuery } from "@/features/modules/controllers/config/itemController";
import BulkUploadDialog from "./BulkUploadDialog";
import BulkAssignToStoreDialog from "./BulkAssignToStoreDialog";
import ConsumableFilters, { ConsumableFilters as ConsumableFiltersType } from "./ConsumableFilters";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { toast } from "sonner";

const DEFAULT_FILTERS: ConsumableFiltersType = {
  category__name: "all",
  stock_status: "all",
  store: "all",
};

export default function ConsumablesHomePage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState<ConsumableFiltersType>(DEFAULT_FILTERS);
  const [creatingSubcategories, setCreatingSubcategories] = useState(false);
  const [analyzingItems, setAnalyzingItems] = useState(false);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("⏱️ Search debounce complete, updating debouncedSearch:", searchQuery);
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to page 1 when searching
      setQueryTimestamp(Date.now()); // Force new query
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search handler
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  // Filter handler
  const handleFilterChange = useCallback((newFilters: ConsumableFiltersType) => {
    console.log("🔧 Filter changed:", newFilters);
    setFilters(newFilters);
    setPage(1); // Reset to page 1 when filters change
    setQueryTimestamp(Date.now()); // Force new query
  }, []);

  // Pagination settings
  const ITEMS_PER_PAGE = 15;

  // Consumables category UUID - filters all items by Consumables category
  const CONSUMABLES_CATEGORY_UUID = "fadb6228-23de-4b04-9eac-b75940cf622f";

  // Create a unique timestamp to force refetch on search/filter/page changes
  const [queryTimestamp, setQueryTimestamp] = useState(Date.now());

  /**
   * Filtering Strategy:
   * - Search: Backend filtering (API supports search on name & description)
   * - Category: Backend filtering (API supports category filter)
   * - Store: Client-side filtering (we merge store stocks data on frontend)
   *
   * We only fetch all items (size=1000) when filtering by store,
   * otherwise we use normal pagination with backend search.
   */
  const isClientSideFiltering = (filters.store && filters.store !== "all" && filters.store !== "");

  // Fetch consumable items - backend now supports search!
  const { data: consumablesData, isFetching: itemsFetching } = useGetAllItemsQuery({
    page: isClientSideFiltering ? 1 : page,
    size: isClientSideFiltering ? 1000 : ITEMS_PER_PAGE,
    search: debouncedSearch, // Backend search on name and description
    category: CONSUMABLES_CATEGORY_UUID,
    category__name: filters.category__name && filters.category__name !== "" && filters.category__name !== "all" ? filters.category__name : undefined,
    expand: "category",
    enabled: true,
    _timestamp: queryTimestamp,
  });

  // Fetch ALL item-store-stocks to get store assignments for consumables
  const { data: storeStocksData, isFetching: stocksFetching } = useQuery({
    queryKey: ["consumable-store-stocks", queryTimestamp],
    queryFn: async () => {
      const response = await AxiosWithToken.get("admins/inventory/item-store-stocks/", {
        params: {
          page: 1,
          size: 10000, // Get all store stocks
          expand: "store_detail,store_detail.location,item_detail",
        },
      });
      return response.data;
    },
    enabled: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
    cacheTime: 0,
  });

  const isFetching = itemsFetching || stocksFetching;

  // Force refetch only when search or filters change (not on every page change)
  useEffect(() => {
    console.log("🔄 Triggering refetch due to search/filter change:", {
      debouncedSearch,
      filters
    });
    setQueryTimestamp(Date.now());
  }, [debouncedSearch, filters.category__name, filters.stock_status, filters.store]);

  // Debug all params
  useEffect(() => {
    console.log("🔍 CONSUMABLES PAGE - DEBUG:", {
      page,
      searchQuery,
      debouncedSearch,
      filters,
      isFetching,
      resultsCount: consumablesData?.data?.results?.length || 0,
      totalItems: consumablesData?.data?.pagination?.count || consumablesData?.data?.paginator?.count || 0,
    });
  }, [page, searchQuery, debouncedSearch, filters, isFetching, consumablesData]);

  // Check if API returned valid data with results
  const hasResults = (consumablesData as any)?.data?.results && (consumablesData as any).data.results.length > 0;

  const isLoading = isFetching;

  // Debug API response
  console.log("🔍 CONSUMABLES API DEBUG", {
    data: consumablesData,
    isFetching,
    hasData: !!consumablesData?.data,
    hasResults,
    dataLength: consumablesData?.data?.results?.length || 0
  });

  // Debug first item's store_stocks
  if (consumablesData?.data?.results && consumablesData.data.results.length > 0) {
    const firstItem = consumablesData.data.results[0];
    console.log("🔍 FIRST ITEM DEBUG:", {
      name: firstItem.name,
      id: firstItem.id,
      store_stocks: firstItem.store_stocks,
      store_stocks_length: firstItem.store_stocks?.length || 0,
      has_store_stocks: !!firstItem.store_stocks && firstItem.store_stocks.length > 0,
    });
  }

  // Process consumables for display - merge items with store stocks
  const filteredConsumables = useMemo(() => {
    const results = (consumablesData as any)?.data?.results;
    if (!results) {
      return [];
    }

    // Get all store stocks and group by item ID
    const allStoreStocks = (storeStocksData as any)?.data?.results || [];
    console.log("🔍 ALL STORE STOCKS FETCHED:", allStoreStocks.length);

    // Debug first stock to see store_detail structure
    if (allStoreStocks.length > 0) {
      console.log("🔍 FIRST STOCK SAMPLE:", {
        stock: allStoreStocks[0],
        store_detail: allStoreStocks[0].store_detail,
        store: allStoreStocks[0].store,
        storeName: allStoreStocks[0].store_detail?.name,
      });
    }

    const stocksByItem = new Map<string, any[]>();
    allStoreStocks.forEach((stock: any) => {
      const itemId = stock.item || stock.item_detail?.id;
      if (itemId) {
        if (!stocksByItem.has(itemId)) {
          stocksByItem.set(itemId, []);
        }
        stocksByItem.get(itemId)!.push(stock);
      }
    });

    console.log("🔍 STOCKS GROUPED BY ITEM:", stocksByItem.size, "unique items");

    // Process items with merged store stocks data
    let processedItems = results.map((consumableItem: any) => {
      // Get store stocks for this item from the map
      const storeStocks = stocksByItem.get(consumableItem.id) || [];
      const storeQuantitySum = storeStocks.reduce((sum: number, stock: any) => sum + (stock.quantity || 0), 0);
      const storeAvailableSum = storeStocks.reduce((sum: number, stock: any) => sum + (stock.available_quantity || 0), 0);

      // If item has stores, use sum from stores. Otherwise, use original item quantity
      const totalQuantity = storeStocks.length > 0 ? storeQuantitySum : (consumableItem.quantity || 0);
      const totalAvailable = storeStocks.length > 0 ? storeAvailableSum : (consumableItem.available_quantity || 0);

      return {
        ...consumableItem,
        store_stocks: storeStocks,
        total_quantity: totalQuantity,
        total_available: totalAvailable,
        stores_count: storeStocks.length,
        quantity: totalQuantity,
        available_quantity: totalAvailable,
      };
    });

    // Backend now handles search filtering, so we only need client-side store filtering
    // Client-side store filtering (since we merge store stocks data on frontend)
    if (filters.store && filters.store !== "all" && filters.store !== "") {
      console.log("🏪 Applying store filter:", filters.store);
      const beforeFilter = processedItems.length;
      processedItems = processedItems.filter((item: any) => {
        const storeStocks = item.store_stocks || [];
        const hasStore = storeStocks.some((stock: any) => {
          const stockStoreId = stock.store_detail?.id || stock.store;
          return stockStoreId === filters.store;
        });
        return hasStore;
      });
      console.log(`🏪 Store filter results: ${beforeFilter} items → ${processedItems.length} items`);
    }

    console.log("✅ Final filtered items:", processedItems.length);

    // Debug first processed item
    if (processedItems.length > 0) {
      console.log("🔍 FIRST PROCESSED ITEM:", {
        name: processedItems[0].name,
        store_stocks: processedItems[0].store_stocks,
        store_stocks_length: processedItems[0].store_stocks?.length || 0,
      });
    }

    return processedItems;
  }, [consumablesData, storeStocksData, filters.store]);

  // Client-side pagination when filtering, server-side otherwise
  const displayedConsumables = isClientSideFiltering
    ? filteredConsumables.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
    : filteredConsumables;

  // Calculate total pages - use filtered count when client-side filtering
  const totalItems = isClientSideFiltering
    ? filteredConsumables.length
    : ((consumablesData as any)?.data?.pagination?.count || (consumablesData as any)?.data?.paginator?.count || 0);
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Reset to page 1 when total items changes (e.g., when filters are applied)
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      console.log("⚠️ Current page exceeds total pages, resetting to page 1");
      setPage(1);
    }
  }, [totalItems, page, totalPages]);

  // Function to analyze items and create relevant subcategories
  const analyzeAndCreateSubcategories = async () => {
    setAnalyzingItems(true);

    try {
      toast.info("Analyzing your consumable items...");
      console.log("🔍 Fetching all consumables to analyze...");

      // First, get all existing categories to find the max serial_number
      console.log("📊 Fetching existing categories to determine serial numbers...");
      const categoriesResponse = await AxiosWithToken.get("config/category/", {
        params: {
          page: 1,
          size: 1000,
        },
      });

      const existingCategories = categoriesResponse.data?.data?.results || categoriesResponse.data?.results || [];
      const maxSerialNumber = existingCategories.reduce((max: number, cat: any) => {
        const serial = cat.serial_number || 0;
        return serial > max ? serial : max;
      }, 0);

      console.log(`📊 Found ${existingCategories.length} existing categories, max serial_number: ${maxSerialNumber}`);
      let nextSerialNumber = maxSerialNumber + 1;

      // Fetch all consumables
      const response = await AxiosWithToken.get("config/items/", {
        params: {
          category: CONSUMABLES_CATEGORY_UUID,
          size: 1000,
          page: 1,
        },
      });

      const items = response.data?.data?.results || [];
      console.log(`📦 Found ${items.length} consumable items`);

      // Keywords to identify categories
      const categoryKeywords: Record<string, string[]> = {
        "Office Consumable": ["pen", "paper", "folder", "stapler", "file", "envelope", "notebook", "marker"],
        "Kitchen Consumable": ["soup", "coffee", "tea", "cup", "disposable", "tissue"],
        "Office Equipment": ["desk", "chair", "table", "cabinet", "conference"],
        "IT Equipment": ["photocopying", "printer", "toner", "machine"],
        "HVAC Equipment": ["air conditioning", "hvac", "split"],
        "Water Equipment": ["water treatment", "water system"],
      };

      // Analyze items
      const neededCategories = new Set<string>();
      items.forEach((item: any) => {
        const itemName = item.name.toLowerCase();
        for (const [category, keywords] of Object.entries(categoryKeywords)) {
          if (keywords.some(keyword => itemName.includes(keyword))) {
            neededCategories.add(category);
            console.log(`📌 "${item.name}" → ${category}`);
            break;
          }
        }
      });

      console.log(`\n✅ Need to create ${neededCategories.size} subcategories:`, Array.from(neededCategories));

      // Create the needed subcategories
      toast.info(`Creating ${neededCategories.size} subcategories based on your items...`);

      const categoryDescriptions: Record<string, string> = {
        "Office Consumable": "Office supplies and stationery",
        "Kitchen Consumable": "Kitchen supplies and disposables",
        "Office Equipment": "Office furniture and equipment",
        "IT Equipment": "IT equipment and machines",
        "HVAC Equipment": "Heating, ventilation, and air conditioning",
        "Water Equipment": "Water treatment and management systems",
      };

      let created = 0;
      let failed = 0;
      const errors: string[] = [];

      // Pre-assign serial numbers for each category
      const categoriesWithSerialNumbers = Array.from(neededCategories).map((categoryName, index) => ({
        name: categoryName,
        serialNumber: nextSerialNumber + index,
      }));

      console.log("📋 Categories to create:", categoriesWithSerialNumbers);

      for (const categoryInfo of categoriesWithSerialNumbers) {
        try {
          const code = categoryInfo.name.split(" ").map(w => w[0]).join("").toUpperCase();
          console.log(`📝 Creating: ${categoryInfo.name} (${code}) with serial_number: ${categoryInfo.serialNumber}...`);

          // Try without serial_number - let backend handle it
          const payload: any = {
            name: categoryInfo.name,
            description: categoryDescriptions[categoryInfo.name] || "",
            code: `CON-${code}`,
            parent: CONSUMABLES_CATEGORY_UUID,
            job_category: "GOODS",
          };

          console.log("📤 Sending payload:", payload);
          await AxiosWithToken.post("config/category/", payload);

          created++;
          console.log(`✅ Created: ${categoryInfo.name}`);
        } catch (error: any) {
          failed++;
          const errorMsg = error.response?.data?.message || error.response?.data?.name?.[0] || error.message;
          console.error(`❌ Failed to create ${categoryInfo.name}:`, errorMsg);
          errors.push(`${categoryInfo.name}: ${errorMsg}`);
        }
      }

      console.log(`📊 Summary: Created ${created}, Failed ${failed}`);

      if (created > 0) {
        toast.success(`Successfully created ${created} subcategories!`);
        toast.info("Refreshing page...");
        setTimeout(() => window.location.reload(), 1000);
      } else if (failed > 0) {
        toast.error(`Failed to create subcategories. Check console for details.`);
      }
    } catch (error: any) {
      toast.error("Failed to analyze items");
      console.error("❌ Error:", error);
    } finally {
      setAnalyzingItems(false);
    }
  };

  // Function to create consumable subcategories
  const createConsumableSubcategories = async () => {
    const subcategories = [
      { name: "Office Consumable", description: "Office supplies and stationery", code: "CON-OFF" },
      { name: "Medical Consumable", description: "Medical supplies and equipment", code: "CON-MED" },
      { name: "IT Consumable", description: "IT supplies and accessories", code: "CON-IT" },
      { name: "Lab Consumable", description: "Laboratory supplies and chemicals", code: "CON-LAB" },
      { name: "Cleaning Consumable", description: "Cleaning supplies and materials", code: "CON-CLN" },
      { name: "Kitchen Consumable", description: "Kitchen supplies and utensils", code: "CON-KIT" },
      { name: "Safety Consumable", description: "Safety equipment and gear", code: "CON-SAF" },
    ];

    setCreatingSubcategories(true);

    try {
      console.log("🚀 Starting to create subcategories...");
      console.log("📂 Parent category UUID:", CONSUMABLES_CATEGORY_UUID);
      toast.info("Creating consumable subcategories...");

      let created = 0;
      let failed = 0;
      const errors: string[] = [];

      for (const subcategory of subcategories) {
        try {
          console.log(`📝 Creating: ${subcategory.name} with code: ${subcategory.code}...`);
          const response = await AxiosWithToken.post("config/category/", {
            name: subcategory.name,
            description: subcategory.description,
            code: subcategory.code,
            parent: CONSUMABLES_CATEGORY_UUID,
            // Don't send serial_number - let backend auto-generate it properly
          });
          created++;
          console.log(`✅ Created: ${subcategory.name}`, response.data);
        } catch (error: any) {
          failed++;
          const errorMsg = error.response?.data?.message || error.response?.data?.name?.[0] || error.message || "Unknown error";
          console.error(`❌ Failed to create ${subcategory.name}:`, error.response?.data || error.message);
          errors.push(`${subcategory.name}: ${errorMsg}`);
        }
      }

      console.log(`📊 Summary: Created ${created}, Failed ${failed}`);

      if (created > 0) {
        toast.success(`Successfully created ${created} consumable subcategories!`);
        if (failed === 0) {
          toast.info("You can now edit items to assign them to these subcategories");
          // Refresh the page to show the new categories in filters
          setTimeout(() => window.location.reload(), 1000);
        } else {
          toast.warning(`Created ${created}, but ${failed} failed. Check console for details.`);
        }
      } else {
        toast.error(`Failed to create all subcategories. Errors: ${errors.join(", ")}`);
      }
    } catch (error: any) {
      toast.error("Failed to create subcategories");
      console.error("❌ Fatal error:", error);
    } finally {
      setCreatingSubcategories(false);
    }
  };

  return (
    <div className="space-y-10">
      <Card className="space-y-10">
        <div className="space-y-5">
          {/* Debug notice */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
              <p className="text-sm text-blue-800">
                <strong>API Status:</strong> {hasResults ? '✅ Items API with Category Filter (Active)' : '⚠️ No Results'} |
                Total consumables: {totalItems} |
                Shown: {displayedConsumables.length} |
                Page: {page}/{totalPages} ({ITEMS_PER_PAGE} per page)
              </p>
              <p className="text-xs text-blue-600">
                Showing all consumables (including items without store stocks). Supports purchase request workflow.
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-blue-200">
                <Button
                  size="sm"
                  variant="default"
                  onClick={analyzeAndCreateSubcategories}
                  disabled={analyzingItems}
                  className="text-xs bg-green-600 hover:bg-green-700"
                >
                  {analyzingItems ? "Analyzing..." : "🤖 Auto-Create Subcategories"}
                </Button>
                <p className="text-xs text-blue-600">
                  Analyzes your items and creates relevant subcategories automatically
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setBulkAssignOpen(true)}
            >
              <Store size={20} />
              Assign to Store
            </Button>
            <Button
              variant="outline"
              onClick={() => setBulkUploadOpen(true)}
            >
              <Upload size={20} />
              Bulk Upload
            </Button>
            <Link href="/dashboard/admin/inventory-management/consumable/create">
              <Button>
                <Plus size={20} />
                Add Consumable
              </Button>
            </Link>
          </div>
        </div>
        <TableFilters
          onSearchChange={handleSearchChange}
          filterAction={() => setFilterDialogOpen(true)}
        >
          {/* Additional debugging for table data */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
              <strong>TABLE DEBUG:</strong>
              Passing {displayedConsumables.length} items to DataTable |
              isLoading: {isLoading ? 'true' : 'false'} |
              Columns: {consumableColums.length} |
              Total from API: {totalItems} |
              Sample item keys: {displayedConsumables[0] ? Object.keys(displayedConsumables[0]).join(', ') : 'No items'}
            </div>
          )}
          <DataTable
            data={displayedConsumables}
            isLoading={isLoading}
            // @ts-ignore
            columns={consumableColums}
            pagination={{
              total: totalItems,
              pageSize: ITEMS_PER_PAGE,
              page: page,
              onChange: (newPage: number) => {
                console.log("📄 Pagination onChange:", { from: page, to: newPage });
                setPage(newPage);
              },
            }}
          />
        </TableFilters>
      </Card>

      <BulkUploadDialog
        open={bulkUploadOpen}
        onOpenChange={setBulkUploadOpen}
        categoryId={undefined} // Uses smart category detection now
      />

      <BulkAssignToStoreDialog
        open={bulkAssignOpen}
        onOpenChange={setBulkAssignOpen}
      />

      <ConsumableFilters
        open={filterDialogOpen}
        onOpenChange={setFilterDialogOpen}
        currentFilters={filters}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
}
