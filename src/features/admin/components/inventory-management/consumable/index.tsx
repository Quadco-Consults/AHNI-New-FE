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
import { useGetAllEnhancedConsumables } from "@/features/admin/controllers/consumableController";
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
    const userLocationId = currentUser.location;

    // TEMPORARY FIX: If user data is incomplete/empty, treat as super admin
    const hasIncompleteUserData = !userType || !currentUser.id || userType === undefined;
    if (hasIncompleteUserData) {
      console.log("⚠️ TEMPORARY FIX: User data incomplete, treating as Super Admin");
      return { isSuper: true, isHQ: false, userLocationId: null, shouldFilter: false };
    }

    // Super Admin: Can see all consumables globally
    const isSuper = userType === 'SUPERADMIN' ||
                   userType === 'SUPER_ADMIN' ||
                   userType === 'ADMIN' || // Treating all ADMIN types as potentially super for now
                   currentUser.roles?.some((role: any) =>
                     role.name?.toLowerCase().includes('super') ||
                     role.name?.toLowerCase().includes('global') ||
                     role.name?.toLowerCase().includes('admin')
                   );

    // HQ Admin: Can see all consumables globally (determine by role or specific designation)
    const isHQ = !isSuper && (
      userType === 'ADMIN' && (
        currentUser.designation?.toLowerCase().includes('hq') ||
        currentUser.position?.toLowerCase().includes('headquarters') ||
        currentUser.roles?.some((role: any) =>
          role.name?.toLowerCase().includes('hq') ||
          role.name?.toLowerCase().includes('headquarters')
        )
      )
    );

    // Department Admin: Limited to their location/office
    const shouldFilter = !isSuper && !isHQ;

    console.log("🔍 SUPER ADMIN DETECTION DEBUG:", {
      userType,
      isUserTypeSuperAdmin: userType === 'SUPERADMIN',
      isUserTypeAdmin: userType === 'ADMIN',
      userRoles: currentUser.roles?.map(r => r.name),
      hasAdminRole: currentUser.roles?.some((role: any) => role.name?.toLowerCase().includes('admin')),
      isSuper,
      isHQ,
      shouldFilter,
      userLocationId
    });

    return { isSuper, isHQ, userLocationId, shouldFilter };
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
  const { data: consumablesData, isFetching } = useGetAllEnhancedConsumables({
    page: 1, // Get all items, we'll paginate client-side
    size: 100, // Increased to get more items for filtering
    expand: "store_stocks", // Enhanced API already includes store details
    // Note: Server-side location filtering is handled by the backend based on user permissions
  });

  // Fallback to legacy items API if enhanced API is not available
  const { data: legacyItemsData, isFetching: isFetchingLegacy } = useGetAllItemsQuery({
    page,
    size: 100,
    expand: "store_stocks,store_stocks.store_detail,store_stocks.store_detail.location",
    enabled: !consumablesData, // Only fetch if enhanced API didn't work
  });

  // Use enhanced data if available, otherwise fallback to legacy
  const item = consumablesData || legacyItemsData;
  const isLoading = isFetching || isFetchingLegacy;

  // Process consumables for Master Catalog view with store distribution
  const filteredConsumables = useMemo(() => {
    if (!item?.data?.results) return [];

    const allItems = item.data.results;

    // If using enhanced API, items should already be filtered to consumables only
    let consumableItems = allItems;

    // If using legacy API (fallback), filter to only consumable items based on category
    if (legacyItemsData && !consumablesData) {
      consumableItems = allItems.filter((item: any) => {
        const categoryName = item.category?.name || item.category_detail?.name || '';
        return isConsumableCategory(categoryName);
      });
    }

    console.log(`🔍 SMART FILTERING - Total items: ${allItems.length}, Consumables: ${consumableItems.length}`);
    console.log(`🔍 Using ${consumablesData ? 'Enhanced API' : 'Legacy API (fallback)'}`);
    console.log(`🔍 Consumable categories found:`, [...new Set(consumableItems.map((item: any) => item.category?.name || item.category_detail?.name))]);

    // For Master Catalog, we want to show consumable types with their store distribution
    const processedItems = consumableItems.map((item: any) => {
      const storeStocks = item.store_stocks || [];

      // Enhanced API provides total_quantity_across_stores, fallback to calculation
      const totalQuantity = item.total_quantity_across_stores ||
        storeStocks.reduce((sum: number, stock: any) => sum + (stock.quantity || 0), 0);
      const totalAvailable = item.total_available_across_stores ||
        storeStocks.reduce((sum: number, stock: any) => sum + (stock.available_quantity || 0), 0);

      return {
        ...item,
        store_stocks: storeStocks,
        total_quantity: totalQuantity,
        total_available: totalAvailable,
        stores_count: storeStocks.length,
        // For legacy compatibility
        quantity: totalQuantity,
        available_quantity: totalAvailable,
      };
    });

    // If using enhanced API, location-based filtering is already handled by the backend
    if (consumablesData) {
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
  }, [item?.data?.results, userAccessInfo, consumablesData, legacyItemsData]);

  // Client-side pagination
  const paginatedConsumables = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredConsumables.slice(startIndex, endIndex);
  }, [filteredConsumables, page, ITEMS_PER_PAGE]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredConsumables.length / ITEMS_PER_PAGE);

  // Reset to page 1 when filteredConsumables changes (e.g., when user access changes)
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(1);
    }
  }, [filteredConsumables.length, page, totalPages]);

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
                <strong>Enhanced Consumable API:</strong> {consumablesData ? '✅ Using Enhanced API' : '⚠️ Fallback to Legacy API'} |
                Total items: {item?.data?.pagination?.count || 0} |
                Consumables found: {filteredConsumables.length} |
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
                <strong>Items:</strong> {filteredConsumables.length}
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
          <DataTable
            data={paginatedConsumables}
            isLoading={isLoading}
            // @ts-ignore
            columns={consumableColums}
            pagination={{
              total: filteredConsumables.length,
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
