"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/atoms/FormInput";
import FormSelect from "@/components/atoms/FormSelectField";
import AddSquareIcon from "@/components/icons/AddSquareIcon";
import Card from "@/components/Card";
import GoBack from "@/components/GoBack";
import { Button } from "@/components/ui/button";
import { AdminRoutes } from "@/constants/RouterConstants";
import {
  ItemRequisitionSchema,
  TItemRequisitionFormValues,
} from "@/features/admin/types/inventory-management/item-requisition";
import { Minus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useGetAllConsumablesQuery } from "@/features/admin/controllers/consumableController";
import {
  useCreateItemRequisitionMutation,
  useEditItemRequisitionMutation,
  useGetSingleItemRequisitionQuery,
} from "@/features/admin/controllers/itemRequisitionController";
import { useGetAllDepartmentsQuery } from "@/features/modules/controllers/config/departmentController";
import { useGetAllUsersQuery, useGetUserProfile } from "@/features/auth/controllers/userController";
import { toast } from "sonner";
import { useGetAllItemsQuery } from "@/features/modules/controllers/config/itemController";
import { useGetAllStores } from "@/features/admin/controllers/storeController";
import { useGetAllEnhancedConsumables } from "@/features/admin/controllers/consumableController";
import { useGetStoreInventory } from "@/features/admin/controllers/itemStoreStockController";
import {
  getReviewerOptions,
  getAuthorizerOptions,
  getApproverOptions
} from "@/utils/approvalFilters";
import { filterAhniStaffOnly } from "@/utils/userFilters";
import { usePermissions } from "@/hooks/usePermissions";

export default function CreateItemRequisition() {
  // Get current user's profile to detect their location
  const { data: currentUserProfile } = useGetUserProfile();

  // Get current user information for auto-population
  const { user: currentUser } = usePermissions();

  // Get user department for auto-population
  const userDepartment = currentUser?.employee?.department || currentUser?.department;

  // Track selected store to filter consumables
  const [selectedStore, setSelectedStore] = useState<string>("");

  // Fetch inventory from selected store (only items available in that store)
  const { data: storeInventoryData } = useGetStoreInventory(
    selectedStore,
    !!selectedStore
  );

  // Phase 6: Use Enhanced Consumables API with location-based filtering
  const { data: consumables, isLoading: isLoadingConsumables, error: enhancedError } = useGetAllEnhancedConsumables({
    page: 1,
    size: 1000,
    expand: "store_stocks", // Get store stock information for location filtering
    enabled: !!currentUserProfile, // Only call when user profile is available
  });

  // Debug API calls
  console.log("🔍 API DEBUG - Enhanced Consumables:", {
    data: consumables,
    isLoading: isLoadingConsumables,
    error: enhancedError,
  });

  // Fallback: Legacy items API (filtered by consumables category)
  const { data: items, isLoading: isLoadingItems, error: itemsError } = useGetAllItemsQuery({
    page: 1,
    size: 2000000,
    category: "fadb6228-23de-4b04-9eac-b75940cf622f",
  });

  // Debug API calls
  console.log("🔍 API DEBUG - Legacy Items:", {
    data: items,
    isLoading: isLoadingItems,
    error: itemsError,
  });

  const { data: user } = useGetAllUsersQuery({
    page: 1,
    size: 2000000,
  });

  const { data: department } = useGetAllDepartmentsQuery({
    page: 1,
    size: 2000000,
  });

  // Phase 5: Fetch stores for selection
  const { data: storesData } = useGetAllStores({
    page: 1,
    size: 1000,
    is_active: true,
  });

  // Filter for AHNI staff only (exclude vendors, consultants, external users)
  const ahniStaff = useMemo(
    () => filterAhniStaffOnly(user?.data.results || []),
    [user?.data.results]
  );

  const userOptions = useMemo(
    () =>
      ahniStaff.map(({ first_name, last_name, id }) => ({
        label: `${first_name} ${last_name}`,
        value: id,
      })),
    [ahniStaff]
  );

  // Filtered options for approval workflow - only users with appropriate permissions
  // Fallback to all AHNI staff if no specific approvers are configured
  const reviewerOptions = useMemo(() => {
    const options = getReviewerOptions(ahniStaff);
    console.log("Reviewer options from permissions:", options);

    // If no reviewers found with permissions, use all AHNI staff as fallback
    if (options.length === 0) {
      console.log("No reviewers with permissions found, using all AHNI staff as fallback");
      return userOptions;
    }
    return options;
  }, [ahniStaff, userOptions]);

  const authorizerOptions = useMemo(() => {
    const options = getAuthorizerOptions(ahniStaff);
    console.log("Authorizer options from permissions:", options);

    // If no authorizers found with permissions, use all AHNI staff as fallback
    if (options.length === 0) {
      console.log("No authorizers with permissions found, using all AHNI staff as fallback");
      return userOptions;
    }
    return options;
  }, [ahniStaff, userOptions]);

  const approverOptions = useMemo(() => {
    const options = getApproverOptions(ahniStaff);
    console.log("Approver options from permissions:", options);

    // If no approvers found with permissions, use all AHNI staff as fallback
    if (options.length === 0) {
      console.log("No approvers with permissions found, using all AHNI staff as fallback");
      return userOptions;
    }
    return options;
  }, [ahniStaff, userOptions]);

  const { createItemRequisition, isLoading: isCreateLoading } =
    useCreateItemRequisitionMutation();

  const consumableOptions = useMemo(() => {
    // Priority: Use store-specific inventory if a store is selected
    if (selectedStore && storeInventoryData?.data?.results) {
      console.log("🔍 STORE-SPECIFIC - Using store inventory, items count:", storeInventoryData.data.results.length);

      // Filter out items with zero or negative quantity
      const availableItems = storeInventoryData.data.results.filter(
        (stock: any) => (stock.available_quantity || 0) > 0
      );

      console.log("🔍 STORE-SPECIFIC - Available items count:", availableItems.length);

      return availableItems.map((stock: any) => {
        const itemName = stock.item_detail?.name || stock.itemName || "Unknown Item";
        const availableQty = stock.available_quantity || 0;
        const categoryName = stock.item_detail?.category?.name || "N/A";

        return {
          label: `${itemName} (Available: ${availableQty} units) - ${categoryName}`,
          value: stock.item, // This is the item ID
        };
      });
    }

    // Fallback: Show empty message if store is selected but no inventory
    if (selectedStore) {
      console.log("🔍 STORE-SPECIFIC - No inventory found for selected store");
      return [];
    }

    // No store selected yet: Show location-based items
    console.log("🔍 LOCATION-BASED - No store selected, using location filtering");
    const enhancedResults = consumables?.results || consumables?.data?.results || consumables?.data?.data?.consumables;
    if (enhancedResults && enhancedResults.length > 0) {
      console.log("🔍 LOCATION-BASED - Using enhanced consumables data, items count:", enhancedResults.length);

      // Filter consumables available in user's location
      const userLocation = currentUserProfile?.data?.location?.id;
      console.log("🔍 USER LOCATION - Location ID:", userLocation);

      const locationFilteredItems = enhancedResults.filter((item: any) => {
        // If no user location, show all items
        if (!userLocation) return true;

        // If no store stocks, include item (could be assigned later)
        if (!item.store_stocks || item.store_stocks.length === 0) return true;

        // Check if item is available in user's location
        return item.store_stocks.some((stock: any) => {
          const stockLocationId = stock.store_detail?.location?.id || stock.store_detail?.location;
          return stockLocationId === userLocation && (stock.available_quantity > 0 || stock.quantity > 0);
        });
      });

      console.log("🔍 LOCATION FILTER - Filtered items count:", locationFilteredItems.length, "of", enhancedResults.length);

      return locationFilteredItems.map((item: any) => {
        const totalAvailable = item.store_stocks?.reduce(
          (sum: number, stock: any) => sum + (stock.available_quantity || stock.quantity || 0),
          0
        ) || 0;

        return {
          label: `${item.name} (Available: ${totalAvailable})`,
          value: item.id,
        };
      });
    }

    // Fallback: Use Legacy Items API if available
    if (items?.data?.results && items.data.results.length > 0) {
      console.log("🔍 LEGACY API - Using legacy items data, items count:", items.data.results.length);
      return items.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
      }));
    }

    // No data available
    console.log("🔍 FALLBACK - No data available");
    return [];
  }, [selectedStore, storeInventoryData, consumables, items, currentUserProfile]);

  const departmentOptions = useMemo(
    () =>
      department?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [department]
  );

  // Phase 5: Store options - filtered by user's location
  const storeOptions = useMemo(() => {
    console.log("🔍 STORE OPTIONS DEBUG - Raw data:", {
      storesData: storesData?.data?.results,
      currentUserProfile: currentUserProfile?.data,
      userLocation: currentUserProfile?.data?.location
    });

    if (!storesData?.data?.results) {
      console.log("⚠️ STORE OPTIONS DEBUG - No stores data available");
      return [];
    }

    const userLocation = currentUserProfile?.data?.location;

    console.log("🔍 STORE OPTIONS DEBUG - User location:", userLocation);

    // Filter stores based on user's location
    const filteredStores = storesData.data.results.filter((store: any) => {
      console.log(`🔍 STORE OPTIONS DEBUG - Checking store:`, {
        storeName: store.name,
        storeType: store.store_type,
        storeLocation: store.location,
        storeLocationId: store.location?.id,
        userLocation,
        matchesId: store.location?.id === userLocation,
        matchesDirect: store.location === userLocation
      });

      // Always include CENTRAL stores (available to everyone)
      if (store.store_type === "CENTRAL") {
        console.log(`✅ Including CENTRAL store: ${store.name}`);
        return true;
      }

      // For LOCATION stores, only show if it matches user's location
      if (store.store_type === "LOCATION" && userLocation) {
        // Check if store location matches user location (compare both ID and string)
        const matches = store.location?.id === userLocation || store.location === userLocation;
        console.log(`${matches ? '✅' : '❌'} LOCATION store ${store.name}: ${matches ? 'INCLUDED' : 'EXCLUDED'}`);
        return matches;
      }

      console.log(`❌ Excluding store ${store.name}: No location match`);
      return false;
    });

    const options = filteredStores.map((store: any) => ({
      label: `${store.name} (${store.code}) - ${store.store_type === "CENTRAL" ? "Central" : "Location"}`,
      value: String(store.id), // Ensure value is always a string
    }));

    console.log("🔍 STORE OPTIONS DEBUG - Final options:", options);

    return options;
  }, [storesData, currentUserProfile]);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data: itemRequisition } = useGetSingleItemRequisitionQuery(
    id || "",
    !!id
  );

  const { editItemRequisition, isLoading: isEditLoading } =
    useEditItemRequisitionMutation(id || "");

  const router = useRouter();

  const form = useForm<TItemRequisitionFormValues>({
    resolver: zodResolver(ItemRequisitionSchema),
    defaultValues: {
      department: userDepartment?.id || "", // Auto-populate user's department
      store: "", // Phase 5: Store selection
      reviewer: "",
      authorizer: "",
      approver: "",
      consummables: [{ consummable: "", quantity: "0" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "consummables",
  });

  const onSubmit: SubmitHandler<TItemRequisitionFormValues> = async ({
    consummables,
    ...rest
  }) => {
    try {
      const payload = {
        consummables,
        ...rest,
      };

      console.log({ payload, rest, consummables });

      if (id) {
        await editItemRequisition(payload);
        toast.success("Item Requisition Updated");
      } else {
        await createItemRequisition(payload);
        toast.success("Item Requisition Created");
      }

      router.push(AdminRoutes.ITEM_REQUISITION);
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong");
    }
  };

  // Watch store selection to filter consumables
  const storeValue = form.watch("store");
  useEffect(() => {
    setSelectedStore(storeValue);
  }, [storeValue]);

  // Auto-select store based on user's location
  useEffect(() => {
    console.log("🔍 AUTO-SELECTION EFFECT TRIGGERED:", {
      hasId: !!id,
      storeOptionsLength: storeOptions.length,
      hasUserLocation: !!currentUserProfile?.data?.location,
      conditions: {
        noId: !id,
        hasStoreOptions: storeOptions.length > 0,
        hasUserLocation: !!currentUserProfile?.data?.location,
        allConditionsMet: !id && storeOptions.length > 0 && currentUserProfile?.data?.location
      }
    });

    if (!id && storeOptions.length > 0 && currentUserProfile?.data?.location) {
      const currentValue = form.getValues("store");

      console.log("🔍 AUTO-SELECTION CONDITIONS MET - Checking form value:", currentValue);

      if (!currentValue && storesData?.data?.results) {
        const userLocation = currentUserProfile.data.location;

        console.log("🔍 STORE AUTO-SELECTION DEBUG:", {
          userLocation,
          storeOptions,
          allStores: storesData.data.results,
          currentValue
        });

        // Find the store that matches user's location (prefer LOCATION store over CENTRAL)
        const userLocationStore = storesData.data.results.find((store: any) => {
          const matches = store.store_type === "LOCATION" &&
                         (store.location?.id === userLocation || store.location === userLocation);
          console.log(`🔍 Checking store ${store.name} (${store.code}): type=${store.store_type}, location=${store.location?.id || store.location}, matches=${matches}`);
          return matches;
        });

        // If no location store found, try central store
        const centralStore = storesData.data.results.find((store: any) => {
          return store.store_type === "CENTRAL";
        });

        const storeToSelect = userLocationStore || centralStore;

        console.log("🔍 STORE SELECTION RESULT:", {
          userLocationStore,
          centralStore,
          storeToSelect
        });

        if (storeToSelect) {
          // Use setTimeout to ensure the form is fully rendered
          setTimeout(() => {
            form.setValue("store", String(storeToSelect.id), {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true
            });
            console.log(`✅ Auto-selected store: ${storeToSelect.name} (${storeToSelect.code})`);
            toast.info(`Auto-selected: ${storeToSelect.name} (${storeToSelect.code})`);
          }, 100);
        } else {
          console.log("⚠️ No suitable store found for auto-selection");
        }
      }
    }
  }, [storeOptions, form, id, currentUserProfile, storesData]);

  useEffect(() => {
    if (itemRequisition) {
      console.log({ itemRequisition });

      form.reset({
        department: itemRequisition?.data.department.id,
        store: itemRequisition?.data.store || "", // Phase 5: Include store
        reviewer: itemRequisition?.data.reviewer || "",
        authorizer: itemRequisition?.data.authorizer || "",
        approver: itemRequisition?.data.approver || "",
        consummables: itemRequisition?.data.consummables.map(
          ({ quantity, consummable }) => ({
            consummable: consummable?.id,
            quantity: String(quantity),
          })
        ),
      });
    }
  }, [itemRequisition]);

  return (
    <div className='space-y-8'>
      <div className='flex items-center gap-x-5'>
        <GoBack />
        <h4 className='text-xl font-bold'>Item Requisition</h4>
      </div>
      <Card>
        <FormProvider {...form}>
          <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
            {/* Department Display Section */}
            {userDepartment && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-lg font-bold text-blue-800 mb-2">Request Department</h3>
                <p className="text-gray-700">
                  <strong>Department:</strong> {userDepartment.name}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  This requisition will be submitted for your department.
                </p>
              </div>
            )}

            {/* Hidden department field - auto-populated */}
            <input
              type="hidden"
              {...form.register('department')}
              value={userDepartment?.id || ""}
            />

            {/* Store Selection - Must be first */}
            <div className="space-y-1 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">📦 Select Store</h3>
              <FormSelect
                label='Store'
                name='store'
                placeholder={storeOptions.length === 0 ? 'No stores available at your location' : 'Select Store'}
                options={storeOptions}
                required
              />
              {currentUserProfile?.data?.location && (
                <p className="text-xs text-gray-500 mt-1">
                  Showing stores for your location ({storeOptions.length} available)
                </p>
              )}
            </div>

            {/* Store Selection Warning */}
            {!selectedStore && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ Please select a store first. Only consumables available in the selected store will be shown.
                </p>
              </div>
            )}

            {selectedStore && consumableOptions.length === 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded p-3 mb-4">
                <p className="text-sm text-orange-800">
                  ⚠️ No consumables with available stock found in the selected store. Please contact the store keeper to add inventory.
                </p>
              </div>
            )}

            {/* Items Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-4">📋 Consumables to Requisition</h3>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className='grid grid-cols-3 items-center gap-5'
              >
                <FormSelect
                  label='Item Requested'
                  name={`consummables.${index}.consummable`}
                  placeholder={selectedStore ? 'Select Item' : 'Select store first'}
                  options={consumableOptions}
                  required
                  disabled={!selectedStore}
                />

                <FormInput
                  label='Quantity Requested'
                  name={`consummables.${index}.quantity`}
                  placeholder='Enter Quantity'
                  required
                  disabled={!selectedStore}
                />

                <Button
                  type='button'
                  variant='link'
                  onClick={() => {
                    remove(index);
                  }}
                >
                  <Minus />
                </Button>
              </div>
            ))}

            <Button
              type='button'
              onClick={() => {
                append({ consummable: "", quantity: "0" });
              }}
              disabled={!selectedStore}
            >
              <AddSquareIcon />
              Add Item
            </Button>
            </div>

            {/* Approval Workflow Section */}
            <div className='grid grid-cols-1 gap-5 md:grid-cols-2 bg-gray-50 border border-gray-200 rounded-lg p-4'>
              <h3 className="font-semibold text-gray-900 mb-2 col-span-2">👥 Approval Workflow</h3>

              <FormSelect
                label='Reviewer'
                name='reviewer'
                required
                placeholder='Select Reviewer'
                options={reviewerOptions}
              />

              <FormSelect
                label='Authorizer'
                name='authorizer'
                required
                placeholder='Select Authorizer'
                options={authorizerOptions}
              />

              <FormSelect
                label='Approver'
                name='approver'
                required
                placeholder='Select Approver'
                options={approverOptions}
              />
            </div>
            <div className='flex justify-end'>
              <FormButton
                type='submit'
                loading={isCreateLoading || isEditLoading}
              >
                {id ? "Update Item Requisition" : "Create Item Requisition"}
              </FormButton>
            </div>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
}
