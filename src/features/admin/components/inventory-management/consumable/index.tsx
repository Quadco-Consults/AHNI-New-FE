"use client";
import { useState, useMemo } from "react";
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
import { useAppSelector } from "hooks/useStore";
import { getCurrentUser } from "@/utils/auth";
import { IUser } from "@/features/auth/types/user";

export default function ConsumablesHomePage() {
  const [page, setPage] = useState(1);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false);

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

  // Define the consumables category ID
  const CONSUMABLES_CATEGORY_ID = "fadb6228-23de-4b04-9eac-b75940cf622f";

  // Fetch all items without category filter for now to debug the issue
  const { data: item, isFetching } = useGetAllItemsQuery({
    page,
    size: 20,
    // Temporarily removed category filter to show all created items
    // category: CONSUMABLES_CATEGORY_ID,
    expand: "store_stocks,store_stocks.store_detail,store_stocks.store_detail.location", // Include store stock and location information
  });

  // Filter consumables based on user access level
  const filteredConsumables = useMemo(() => {
    if (!item?.data?.results) return [];

    const allItems = item.data.results;

    // Super Admin and HQ Admin: See all items
    if (!userAccessInfo.shouldFilter) {
      console.log(`🔍 ${userAccessInfo.isSuper ? 'Super Admin' : 'HQ Admin'} - Showing all items globally:`, allItems.length);
      return allItems;
    }

    // Department Admin: Filter by user's location
    if (!userAccessInfo.userLocationId) {
      console.log('⚠️ Department Admin without location - showing no items');
      return [];
    }

    const locationFilteredItems = allItems.filter((item: any) => {
      // Check if item has store stocks in the user's location
      const hasStockInUserLocation = item.store_stocks?.some((stock: any) => {
        const storeLocationId = typeof stock.store_detail?.location === 'string'
          ? stock.store_detail.location
          : stock.store_detail?.location?.id;

        return storeLocationId === userAccessInfo.userLocationId;
      });

      return hasStockInUserLocation;
    });

    console.log(`🔍 Department Admin (Location: ${userAccessInfo.userLocationId}) - Filtered items:`, locationFilteredItems.length, 'of', allItems.length);
    return locationFilteredItems;
  }, [item?.data?.results, userAccessInfo]);

  // Debug logging to understand what items are being returned
  console.log("🔍 SUPER ADMIN DEBUG - Current User:", currentUser);
  console.log("🔍 SUPER ADMIN DEBUG - User Type:", currentUser?.user_type);
  console.log("🔍 SUPER ADMIN DEBUG - User Roles:", currentUser?.roles);
  console.log("🔍 SUPER ADMIN DEBUG - User Access Info:", userAccessInfo);
  console.log("🔍 SUPER ADMIN DEBUG - All items from API:", item?.data?.results || []);
  console.log("🔍 SUPER ADMIN DEBUG - Filtered items:", filteredConsumables);
  console.log("🔍 SUPER ADMIN DEBUG - Should show all items (no filter)?", !userAccessInfo.shouldFilter);
  console.log("🔍 SUPER ADMIN DEBUG - API loading state:", isFetching);
  console.log("🔍 SUPER ADMIN DEBUG - API error:", item?.error);
  console.log("🔍 SUPER ADMIN DEBUG - Total items count:", item?.data?.pagination?.count || 0);

  return (
    <div className="space-y-10">
      <Card className="space-y-10">
        <div className="space-y-5">
          {/* Debug notice and user access info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Debug Mode:</strong> Showing all items (category filter temporarily disabled).
                Total items: {item?.data?.pagination?.count || 0} |
                Filtered items: {filteredConsumables.length} |
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
            data={filteredConsumables}
            isLoading={isFetching}
            // @ts-ignore
            columns={consumableColums}
            pagination={{
              total: filteredConsumables.length,
              pageSize: item?.data.pagination.page_size ?? 20,
              onChange: (page: number) => setPage(page),
            }}
          />
        </TableFilters>
      </Card>

      <BulkUploadDialog
        open={bulkUploadOpen}
        onOpenChange={setBulkUploadOpen}
        categoryId={undefined}
      />

      <BulkAssignToStoreDialog
        open={bulkAssignOpen}
        onOpenChange={setBulkAssignOpen}
      />
    </div>
  );
}
