"use client";
import { useState, useMemo, useEffect } from "react";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Store } from "lucide-react";
import Link from "next/link";
import DataTable from "@/components/Table/DataTable";
import { consumableColums } from "@/features/admin/components/table-columns/inventory-management/consumables";
import TableFilters from "@/components/Table/TableFilters";
import { useGetAllItemsQuery } from "@/features/modules/controllers/config/itemController";
import { useGetAllEnhancedConsumables, useGetAllConsumables } from "@/features/admin/controllers/consumableController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import BulkUploadDialog from "./BulkUploadDialog";
import BulkAssignToStoreDialog from "./BulkAssignToStoreDialog";
import { useAppSelector } from "hooks/useStore";
import { getCurrentUser } from "@/utils/auth";
import { IUser } from "@/features/auth/types/user";

export default function ConsumablesHomePage() {
  const [page, setPage] = useState(1);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false);

  // Pagination settings
  const ITEMS_PER_PAGE = 15;

  // Get current user information for location-based filtering
  const currentUser: IUser | null = useAppSelector((state) => state.auth.user) || getCurrentUser();

  // Debug user loading issue
  console.log("🔍 USER LOADING DEBUG - Redux State User:", useAppSelector((state) => state.auth.user));
  console.log("🔍 USER LOADING DEBUG - LocalStorage User:", getCurrentUser());
  console.log("🔍 USER LOADING DEBUG - Final Current User:", currentUser);

  // Determine user access level and location filtering
  const userAccessInfo = useMemo(() => {
    if (!currentUser) {
      return { isSuper: false, isHQ: false, userLocationId: null, shouldFilter: true };
    }

    const userType = currentUser.user_type?.toUpperCase();
    const userLocationId = typeof currentUser.location === 'string'
      ? currentUser.location
      : currentUser.location?.id;

    // TEMPORARY FIX: If user data is incomplete/empty, treat as super admin
    const hasIncompleteUserData = !userType || !currentUser.id || userType === undefined;
    if (hasIncompleteUserData) {
      console.log("⚠️ TEMPORARY FIX: User data incomplete, treating as Super Admin");
      return { isSuper: true, isHQ: false, userLocationId: null, shouldFilter: false };
    }

    // Super Admin: Can see all consumables globally
    const isSuper = currentUser.is_superuser ||
                   userType === 'SUPERADMIN' ||
                   userType === 'SUPER_ADMIN' ||
                   currentUser.roles?.some((role: any) =>
                     role.name?.toLowerCase().includes('super') ||
                     role.name?.toLowerCase().includes('global')
                   );

    // HQ Admin: AHNI HQ admin officers can see consumables in all stores
    const isHQLocation = currentUser.location?.name?.toLowerCase().includes('headquarters') ||
                        currentUser.location?.name?.toLowerCase().includes('hq');

    const isHQAdmin = !isSuper && (
      (userType === 'ADMIN' && isHQLocation) ||
      currentUser.designation?.toLowerCase().includes('hq') ||
      currentUser.position?.name?.toLowerCase().includes('headquarters') ||
      currentUser.roles?.some((role: any) =>
        role.name?.toLowerCase().includes('hq') ||
        role.name?.toLowerCase().includes('headquarters')
      )
    );

    // State Admin Officers: Limited to their state office stores only
    const shouldFilter = !isSuper && !isHQAdmin;

    console.log("🔍 CONSUMABLES ACCESS CONTROL DEBUG:", {
      userType,
      userLocationId,
      userLocationName: currentUser.location?.name,
      isSuper,
      isHQLocation,
      isHQAdmin,
      shouldFilter,
      accessLevel: isSuper ? 'SUPER_ADMIN' : isHQAdmin ? 'HQ_ADMIN' : 'STATE_ADMIN'
    });

    return { isSuper, isHQ: isHQAdmin, userLocationId, shouldFilter };
  }, [currentUser]);

  // Smart consumable category detection
  const isConsumableCategory = (categoryName: string) => {
    if (!categoryName) return false;
    const name = categoryName.toLowerCase();

    // Keywords that indicate consumable categories
    const consumableKeywords = [
      'consumables', 'consumable', 'supplies', 'medical', 'office',
      'cleaning', 'laboratory', 'lab', 'it consumables', 'stationery'
    ];

    // Exclude pure asset categories
    const assetKeywords = ['vehicles', 'equipment', 'furniture', 'machinery'];

    const hasConsumableKeyword = consumableKeywords.some(keyword => name.includes(keyword));
    const hasAssetKeyword = assetKeywords.some(keyword => name.includes(keyword));

    // Include if it has consumable keywords, exclude if it's clearly an asset
    if (name.includes('medical equipment')) return false; // Medical Equipment is an asset
    if (name.includes('it equipment')) return false; // IT Equipment is an asset

    return hasConsumableKeyword || (!hasAssetKeyword && name.includes('medical'));
  };

  // Use enhanced consumables endpoint with store-aware filtering
  const { data: consumablesData, isFetching, error: enhancedError } = useGetAllEnhancedConsumables({
    page: page,
    size: ITEMS_PER_PAGE, // Use proper server-side pagination
    search: "",
    expand: "store_stocks", // Enhanced API already includes store details
    enabled: true,
    // Note: Server-side location filtering is handled by the backend based on user permissions
  });

  // Check if enhanced API returned valid data with results
  const hasEnhancedResults = consumablesData?.data?.results && consumablesData.data.results.length > 0;
  const enhancedApiSuccessButEmpty = consumablesData?.data && (!consumablesData.data.results || consumablesData.data.results.length === 0);

  // Determine fallback logic
  const shouldUseLegacy = !consumablesData || enhancedError || enhancedApiSuccessButEmpty;

  // Try original consumables API as secondary fallback
  const { data: originalConsumablesData, isFetching: isFetchingOriginal } = useGetAllConsumables({
    page: page,
    size: ITEMS_PER_PAGE, // Use proper server-side pagination
    search: "",
    enabled: shouldUseLegacy, // Only fetch when needed
  });

  // Fetch actual store stocks data from the working endpoint
  const { data: storeStocksData, isFetching: isFetchingStoreStocks } = useQuery({
    queryKey: ["item-store-stocks", "all-consumables"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get("/admins/inventory/item-store-stocks/", {
          params: {
            page: 1,
            size: 1000,
            expand: "item_detail,item_detail.category,store_detail,store_detail.location"
          }
        });
        return response.data;
      } catch (error) {
        console.error("Store stocks fetch error:", error);
        throw error;
      }
    },
    enabled: true,
    refetchOnWindowFocus: false,
  });

  // Fallback to legacy items API if both enhanced and original consumables APIs fail
  const shouldUseLegacyItems = shouldUseLegacy && !originalConsumablesData;

  const { data: legacyItemsData, isFetching: isFetchingLegacy } = useGetAllItemsQuery({
    page: page,
    size: ITEMS_PER_PAGE, // Use proper server-side pagination
    expand: "store_stocks,store_stocks.store_detail,store_stocks.store_detail.location,category",
    enabled: shouldUseLegacyItems, // Fetch if enhanced and original APIs failed
    _timestamp: Date.now(), // Cache bust to ensure fresh data
  });

  // Determine the best data source to use
  const hasOriginalResults = originalConsumablesData?.data?.results && originalConsumablesData.data.results.length > 0;
  const hasLegacyResults = legacyItemsData?.data?.results && legacyItemsData.data.results.length > 0;

  // Priority: Enhanced API > Original Consumables API > Legacy Items API
  const item = hasEnhancedResults
    ? consumablesData
    : hasOriginalResults
      ? originalConsumablesData
      : legacyItemsData;

  const isLoading = isFetching || (shouldUseLegacy && isFetchingOriginal) || (shouldUseLegacyItems && isFetchingLegacy) || isFetchingStoreStocks;

  // Debug API responses with detailed structure analysis
  console.log("🔍 COMPREHENSIVE API FALLBACK DEBUG", {
    enhancedAPI: {
      data: consumablesData,
      error: enhancedError,
      isFetching,
      hasData: !!consumablesData?.data,
      hasResults: hasEnhancedResults,
      successButEmpty: enhancedApiSuccessButEmpty,
      dataLength: consumablesData?.data?.results?.length || 0
    },
    originalConsumablesAPI: {
      data: originalConsumablesData,
      enabled: shouldUseLegacy,
      isFetching: isFetchingOriginal,
      hasData: !!originalConsumablesData?.data,
      hasResults: hasOriginalResults,
      dataLength: originalConsumablesData?.data?.results?.length || 0,
      sampleItem: originalConsumablesData?.data?.results?.[0] ? {
        name: originalConsumablesData.data.results[0].name,
        hasStoreStocks: !!originalConsumablesData.data.results[0].store_stocks,
        storeStocksLength: originalConsumablesData.data.results[0].store_stocks?.length || 0,
        itemKeys: Object.keys(originalConsumablesData.data.results[0])
      } : null
    },
    legacyItemsAPI: {
      data: legacyItemsData,
      enabled: shouldUseLegacyItems,
      isFetching: isFetchingLegacy,
      hasData: !!legacyItemsData?.data,
      hasResults: hasLegacyResults,
      dataLength: legacyItemsData?.data?.results?.length || 0,
      sampleItem: legacyItemsData?.data?.results?.[0] ? {
        name: legacyItemsData.data.results[0].name,
        hasStoreStocks: !!legacyItemsData.data.results[0].store_stocks,
        storeStocksLength: legacyItemsData.data.results[0].store_stocks?.length || 0,
        itemKeys: Object.keys(legacyItemsData.data.results[0])
      } : null
    },
    storeStocksAPI: {
      data: storeStocksData,
      isFetching: isFetchingStoreStocks,
      hasData: !!storeStocksData?.data,
      dataLength: storeStocksData?.data?.results?.length || 0,
      sampleStoreStock: storeStocksData?.data?.results?.[0] ? {
        itemName: storeStocksData.data.results[0].item_detail?.name,
        storeName: storeStocksData.data.results[0].store_detail?.name,
        quantity: storeStocksData.data.results[0].quantity,
        availableQuantity: storeStocksData.data.results[0].available_quantity,
        itemId: storeStocksData.data.results[0].item,
        storeId: storeStocksData.data.results[0].store,
        keys: Object.keys(storeStocksData.data.results[0])
      } : null
    },
    finalSelection: {
      usingAPI: hasEnhancedResults ? 'Enhanced API' : hasOriginalResults ? 'Original Consumables API' : 'Legacy Items API',
      item: item,
      hasData: !!item?.data,
      dataLength: item?.data?.results?.length || 0,
      isLoading,
      sampleFinalItem: item?.data?.results?.[0] ? {
        name: item.data.results[0].name,
        hasStoreStocks: !!item.data.results[0].store_stocks,
        storeStocksLength: item.data.results[0].store_stocks?.length || 0,
        itemKeys: Object.keys(item.data.results[0])
      } : null
    }
  });

  // Process consumables for Master Catalog view with store distribution
  const filteredConsumables = useMemo(() => {
    console.log("🔍 FILTERING DEBUG - Starting data processing", {
      hasItemData: !!item?.data,
      hasResults: !!item?.data?.results,
      resultsLength: item?.data?.results?.length || 0,
      hasEnhancedResults,
      hasOriginalResults,
      hasLegacyResults,
      hasStoreStocksData: !!storeStocksData?.data?.results,
      storeStocksCount: storeStocksData?.data?.results?.length || 0,
      shouldUseLegacy,
      shouldUseLegacyItems,
      userAccessInfo
    });

    // If no item data but we have store stocks data, try to build consumables from store stocks
    if (!item?.data?.results && storeStocksData?.data?.results) {
      console.log("🔍 FALLBACK STRATEGY - No items data, building from store stocks data");

      // Group store stocks by item to create unique consumables
      const itemsFromStoreStocks = new Map();

      storeStocksData.data.results.forEach((stock: any) => {
        const itemId = stock.item_detail?.id || stock.item;
        const itemName = stock.item_detail?.name || `Item ${itemId}`;
        const categoryName = stock.item_detail?.category?.name || stock.item_detail?.category_detail?.name || '';

        // Only include consumable items
        if (categoryName && !isConsumableCategory(categoryName)) {
          return; // Skip non-consumable items
        }

        if (!itemsFromStoreStocks.has(itemId)) {
          itemsFromStoreStocks.set(itemId, {
            id: itemId,
            name: itemName,
            category: stock.item_detail?.category || stock.item_detail?.category_detail,
            store_stocks: [],
            created_by: stock.item_detail?.created_by,
            max_stock: stock.item_detail?.max_stock,
            expiry_date: stock.item_detail?.expiry_date
          });
        }

        itemsFromStoreStocks.get(itemId).store_stocks.push(stock);
      });

      const itemsArray = Array.from(itemsFromStoreStocks.values());
      console.log("🔍 BUILT ITEMS FROM STORE STOCKS:", itemsArray.length, "items");

      if (itemsArray.length > 0) {
        // Process these items the same way
        return itemsArray.map((item: any) => {
          const storeStocks = item.store_stocks || [];
          const totalQuantity = storeStocks.reduce((sum: number, stock: any) => sum + (stock.quantity || 0), 0);
          const totalAvailable = storeStocks.reduce((sum: number, stock: any) => sum + (stock.available_quantity || 0), 0);

          return {
            ...item,
            store_stocks: storeStocks,
            total_quantity: totalQuantity,
            total_available: totalAvailable,
            stores_count: storeStocks.length,
            quantity: totalQuantity,
            available_quantity: totalAvailable,
          };
        });
      }
    }

    if (!item?.data?.results) {
      console.log("🔍 FILTERING DEBUG - No data found, returning empty array");
      return [];
    }

    const allItems = item.data.results;

    // If using enhanced API, items should already be filtered to consumables only
    let consumableItems = allItems;

    // If using legacy items API (not enhanced or original consumables), filter by category
    if (!hasEnhancedResults && !hasOriginalResults) {
      consumableItems = allItems.filter((item: any) => {
        const categoryName = item.category?.name || item.category_detail?.name || '';
        return isConsumableCategory(categoryName);
      });
    }

    console.log(`🔍 SMART FILTERING - Total items: ${allItems.length}, Consumables: ${consumableItems.length}`);
    console.log(`🔍 Using ${hasEnhancedResults ? 'Enhanced API' : hasOriginalResults ? 'Original Consumables API' : 'Legacy Items API'}`);
    console.log(`🔍 Consumable categories found:`, [...new Set(consumableItems.map((item: any) => item.category?.name || item.category_detail?.name))]);

    // Merge consumable items with actual store stocks data
    const processedItems = consumableItems.map((item: any) => {
      // Find all store stocks for this item from the dedicated store stocks API
      const itemStoreStocks = storeStocksData?.data?.results?.filter((stock: any) =>
        stock.item === item.id || stock.item_detail?.id === item.id
      ) || [];

      // Also use any store_stocks that came with the item (if available)
      const originalStoreStocks = item.store_stocks || [];

      // Use the dedicated API data if available, otherwise fall back to original
      const storeStocks = itemStoreStocks.length > 0 ? itemStoreStocks : originalStoreStocks;

      // Debug individual item structure
      console.log(`🔍 ITEM MERGE DEBUG - Processing item: ${item.name}`, {
        itemId: item.id,
        hasOriginalStoreStocks: originalStoreStocks.length > 0,
        foundDedicatedStoreStocks: itemStoreStocks.length,
        finalStoreStocksCount: storeStocks.length,
        itemStoreStocksData: itemStoreStocks,
        originalStoreStocksData: originalStoreStocks,
        finalStoreStocksData: storeStocks
      });

      // Calculate totals from merged store stocks
      const totalQuantity = item.total_quantity_across_stores ||
        storeStocks.reduce((sum: number, stock: any) => sum + (stock.quantity || 0), 0);
      const totalAvailable = item.total_available_across_stores ||
        storeStocks.reduce((sum: number, stock: any) => sum + (stock.available_quantity || 0), 0);

      console.log(`🔍 QUANTITY CALCULATION for ${item.name}:`, {
        storeStocksCount: storeStocks.length,
        calculatedTotal: storeStocks.reduce((sum: number, stock: any) => sum + (stock.quantity || 0), 0),
        calculatedAvailable: storeStocks.reduce((sum: number, stock: any) => sum + (stock.available_quantity || 0), 0),
        finalTotalQuantity: totalQuantity,
        finalTotalAvailable: totalAvailable
      });

      // Transform store stocks to expected format if they came from dedicated API
      const transformedStoreStocks = storeStocks.map((stock: any) => {
        if (stock.item_detail && stock.store_detail) {
          // This is from dedicated API - transform to expected format
          return {
            ...stock,
            store_detail: stock.store_detail
          };
        }
        // This is already in expected format
        return stock;
      });

      return {
        ...item,
        store_stocks: transformedStoreStocks,
        total_quantity: totalQuantity,
        total_available: totalAvailable,
        stores_count: transformedStoreStocks.length,
        // For legacy compatibility
        quantity: totalQuantity,
        available_quantity: totalAvailable,
      };
    });

    // If using enhanced API, location-based filtering is already handled by the backend
    if (hasEnhancedResults) {
      console.log(`🔍 Enhanced API - Server-side filtering applied. Items returned: ${processedItems.length}`);
      return processedItems;
    }

    // Legacy API: Apply client-side location-based filtering for department admins
    if (!userAccessInfo.shouldFilter) {
      console.log(`🔍 ${userAccessInfo.isSuper ? 'Super Admin' : 'HQ Admin'} - Master Catalog showing all consumables globally:`, processedItems.length);
      return processedItems;
    }

    // Department Admin: Filter to show only items available in their location
    if (!userAccessInfo.userLocationId) {
      console.log('⚠️ Department Admin without location - showing no items');
      return [];
    }

    const locationFilteredItems = processedItems.filter((item: any) => {
      // Show items that have stock in the user's location OR unassigned items
      if (!item.store_stocks || item.store_stocks.length === 0) {
        return true; // Show unassigned items (they can potentially be assigned)
      }

      return item.store_stocks.some((stock: any) => {
        const storeLocationId = typeof stock.store_detail?.location === 'string'
          ? stock.store_detail.location
          : stock.store_detail?.location?.id;
        return storeLocationId === userAccessInfo.userLocationId;
      });
    });

    console.log(`🔍 Legacy API - Department Admin (Location: ${userAccessInfo.userLocationId}) - Master Catalog filtered items:`, locationFilteredItems.length, 'of', processedItems.length);
    return locationFilteredItems;
  }, [item?.data?.results, userAccessInfo, hasEnhancedResults, enhancedApiSuccessButEmpty, hasOriginalResults, storeStocksData?.data?.results]);

  // Server-side pagination - no client-side slicing needed
  const displayedConsumables = filteredConsumables;

  // Calculate total pages from API response
  const totalPages = Math.ceil((item?.data?.pagination?.count || item?.data?.paginator?.count || 0) / ITEMS_PER_PAGE);
  const totalItems = item?.data?.pagination?.count || item?.data?.paginator?.count || 0;

  console.log("🔍 SERVER-SIDE PAGINATION DEBUG", {
    currentPage: page,
    itemsPerPage: ITEMS_PER_PAGE,
    displayedItems: displayedConsumables.length,
    totalItems: totalItems,
    totalPages: totalPages,
    apiPaginationData: item?.data?.pagination || item?.data?.paginator,
    sampleDisplayedItems: displayedConsumables.slice(0, 2).map(item => ({
      name: item.name,
      id: item.id,
      stores_count: item.stores_count,
      total_quantity: item.total_quantity
    }))
  });

  // Reset to page 1 when API data changes (e.g., when user access changes)
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(1);
    }
  }, [totalItems, page, totalPages]);

  // Debug logging to understand what items are being returned
  console.log("🔍 SUPER ADMIN DEBUG - Current User:", currentUser);
  console.log("🔍 SUPER ADMIN DEBUG - User Type:", currentUser?.user_type);
  console.log("🔍 SUPER ADMIN DEBUG - User Roles:", currentUser?.roles);
  console.log("🔍 SUPER ADMIN DEBUG - User Access Info:", userAccessInfo);
  console.log("🔍 SUPER ADMIN DEBUG - All items from API:", item?.data?.results || []);
  console.log("🔍 SUPER ADMIN DEBUG - Filtered items:", filteredConsumables);
  console.log("🔍 SUPER ADMIN DEBUG - Should show all items (no filter)?", !userAccessInfo.shouldFilter);
  console.log("🔍 SUPER ADMIN DEBUG - API loading state:", isLoading);
  console.log("🔍 SUPER ADMIN DEBUG - Enhanced API data:", consumablesData);
  console.log("🔍 SUPER ADMIN DEBUG - Legacy API data:", legacyItemsData);
  console.log("🔍 SUPER ADMIN DEBUG - Final item data:", item);
  console.log("🔍 SUPER ADMIN DEBUG - Total items count:", item?.data?.pagination?.count || 0);

  return (
    <div className="space-y-10">
      <Card className="space-y-10">
        <div className="space-y-5">
          {/* Debug notice and user access info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>API Status:</strong> {
                  hasEnhancedResults ? '✅ Enhanced API (Active)' :
                  hasOriginalResults ? '✅ Original Consumables API (Active)' :
                  hasLegacyResults ? '⚠️ Legacy Items API (Fallback)' :
                  (storeStocksData?.data?.results?.length || 0) > 0 ? '🔄 Store Stocks API (Building from Store Data)' :
                  enhancedApiSuccessButEmpty ? '⚠️ Enhanced API (Empty Results)' :
                  enhancedError ? '❌ Enhanced API (Error)' :
                  '❌ No Data Sources Available'
                } |
                Total items: {totalItems} |
                Consumables shown: {displayedConsumables.length} |
                Page: {page}/{totalPages} ({ITEMS_PER_PAGE} per page) |
                User Access: {userAccessInfo.isSuper ? 'Super Admin (Global)' : userAccessInfo.isHQ ? 'HQ Admin (Global)' : `Department Admin (Location: ${userAccessInfo.userLocationId || 'None'})`}
              </p>
            </div>
          )}

          {/* User access level indicator for non-debug environments */}
          {process.env.NODE_ENV !== 'development' && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-sm text-gray-700">
                <strong>Access Level:</strong> {
                  userAccessInfo.isSuper
                    ? '🌐 Super Admin - Global Access'
                    : userAccessInfo.isHQ
                    ? '🏢 HQ Admin - All Locations'
                    : `📍 Department Admin - ${currentUser?.location || 'Location Restricted'}`
                } |
                <strong>Items:</strong> {totalItems} (Page {page} of {totalPages})
              </p>
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
        <TableFilters>
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
              current: page,
              onChange: (page: number) => setPage(page),
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
    </div>
  );
}
