"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import BackNavigation from "components/atoms/BackNavigation";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelectField";
import FormTextArea from "components/atoms/FormTextArea";
import { Card, CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { AdminRoutes } from "constants/RouterConstants";
import {
  AssetMaintenanceSchema,
  TAssetMaintenanceFormData,
} from "features/admin/types/asset-maintenance";
import { useMemo, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useCreateAssetMaintenanceMutation } from "@/features/admin/controllers/assetMaintenanceController";
import { useGetAllAssetsQuery } from "@/features/admin/controllers/assetController";
import { useGetAllUsersQuery } from "@/features/auth/controllers/userController";
import { useGetAllDepartmentsQuery } from "@/features/modules/controllers/config/departmentController";
import { useGetAHNIOfficeLocations } from "@/features/modules/controllers/config/locationController";
import { toast } from "sonner";
import { useGetAllItemsQuery } from "@/features/modules/controllers";
import {
  getReviewerOptions,
  getAuthorizerOptions,
  getApproverOptions
} from "@/utils/approvalFilters";
import { filterAhniStaffOnly } from "@/utils/userFilters";
import { usePermissions } from "@/hooks/usePermissions";

const descOptions = [
  {
    label: "Complaints",
    value: "Complaints",
  },
  {
    label: "Diagnosis",
    value: "Diagnosis",
  },
];

export default function CreateAssetMaintenance() {
  // Get current user and their location context
  const { user: currentUser } = usePermissions();

  // Get current date in YYYY-MM-DD format
  const currentDate = new Date().toISOString().split('T')[0];

  // Debug logging moved to useEffect to prevent render loops
  console.log('🔍 ASSET MAINTENANCE USER DEBUG:');
  console.log('  - Current User Name:', currentUser?.first_name + ' ' + currentUser?.last_name);
  console.log('  - User Location (direct):', currentUser?.location);
  console.log('  - User Location (employee):', currentUser?.employee?.location);
  console.log('  - Final User Location:', currentUser?.location || currentUser?.employee?.location);
  console.log('  - User Department:', currentUser?.department?.name || currentUser?.employee?.department?.name);
  console.log('  - Has Employee Object:', !!currentUser?.employee);
  console.log('  - Full User Object:', currentUser);

  const form = useForm<TAssetMaintenanceFormData>({
    resolver: zodResolver(AssetMaintenanceSchema),
    mode: "onSubmit", // Only validate on submit, not on change
    reValidateMode: "onChange", // Re-validate on change after first submit
    defaultValues: {
      maintenance_datetime: currentDate,
      asset: "",
      maintenance_type: "",
      rate: "",
      cost_estimate: "",
      total_cost_estimate: "",
      description: "",
      description_type: "",
      reviewer: "",
      authorizer: "",
      approver: "",
    },
  });

  const router = useRouter();

  const { data: user } = useGetAllUsersQuery({ page: 1, size: 2000000 });

  // Filter for AHNI staff only (exclude vendors, consultants, external users)
  const ahniStaff = useMemo(
    () => filterAhniStaffOnly(user?.data?.results || []),
    [user?.data?.results]
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
  const reviewerOptions = useMemo(
    () => getReviewerOptions(ahniStaff),
    [ahniStaff]
  );

  const authorizerOptions = useMemo(
    () => getAuthorizerOptions(ahniStaff),
    [ahniStaff]
  );

  const approverOptions = useMemo(
    () => getApproverOptions(ahniStaff),
    [ahniStaff]
  );

  const { data: department } = useGetAllDepartmentsQuery({
    page: 1,
    size: 2000000,
  });

  const departmentOptions = useMemo(
    () =>
      department?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [department]
  );

  const { data: location } = useGetAHNIOfficeLocations({
    page: 1,
    size: 2000000,
  });

  const locationOptions = useMemo(
    () =>
      location?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [location]
  );

  // Get user's location for filtering assets
  const userLocation = currentUser?.location || currentUser?.employee?.location;

  // Asset categories that can be maintained (exclude services and consumables)
  const assetCategories = [
    "Vehicles",
    "IT Equipment",
    "Office Equipment",
    "Furniture",
    "Medical Equipment",
    "Communications Equipment",
    "Security Equipment"
  ];

  const { data: asset } = useGetAllItemsQuery({
    page: 1,
    size: 2000000,
    // Get all items, we'll filter client-side for better control
  });

  // Debug logging commented to prevent render loops
  // console.log('🔧 RAW ASSET DATA:', {
  //   allItems: asset?.data?.results || [],
  //   totalItems: asset?.data?.results?.length || 0,
  // });

  // Client-side filtering to only show actual assets (exclude services and consumables) AND location filtering
  const filteredAssets = useMemo(() => {
    if (!asset?.data?.results) return [];

    return asset.data.results.filter((item: any) => {
      // Debug individual item - commented to prevent render loops
      // console.log('🔍 Checking item:', {
      //   name: item.name,
      //   category: item.category,
      //   location: item.location,
      //   userLocation,
      // });

      // Get category name safely
      const categoryName = item.category?.name || item.category || '';
      const categoryNameLower = categoryName.toString().toLowerCase();

      // Filter for asset categories only
      const isAssetCategory = assetCategories.some(category =>
        categoryNameLower.includes(category.toLowerCase())
      );

      // Additional checks to exclude services and consumables
      const isNotService = !categoryNameLower.includes('service');
      const isNotConsumable = !categoryNameLower.includes('consumable');
      const isNotSupply = !categoryNameLower.includes('supply');
      const isNotMaterial = !categoryNameLower.includes('material');

      // Location filtering - check multiple location formats
      const itemLocationName = item.location?.name || item.location || '';
      const isAtUserLocation = !userLocation || // If no user location, show all
        itemLocationName === userLocation ||
        itemLocationName.includes(userLocation) ||
        userLocation.includes(itemLocationName);

      // Location check debug - commented to prevent render loops
      // console.log('🏢 Location check:', {
      //   itemName: item.name,
      //   itemLocation: itemLocationName,
      //   userLocation,
      //   isAtUserLocation,
      //   isAssetCategory,
      // });

      return isAssetCategory && isNotService && isNotConsumable && isNotSupply && isNotMaterial && isAtUserLocation;
    });
  }, [asset, userLocation]);

  // Debug logging commented to prevent render loops
  console.log('🚗 FILTERED ASSET DATA:', {
    userLocation,
    totalItemsFromAPI: asset?.data?.results?.length || 0,
    filteredAssetsCount: filteredAssets.length,
    assetCategories: filteredAssets.map((item: any) => item.category?.name).filter(Boolean),
    assetNames: filteredAssets.map((item: any) => item.name),
    filterApplied: 'location + asset categories only'
  });

  const assetOptions = useMemo(
    () =>
      filteredAssets.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [filteredAssets]
  );

  const { createAssetMaintenance, isLoading: isCreateLoading } =
    useCreateAssetMaintenanceMutation();

  // Watch rate and cost_estimate fields to auto-calculate total_cost_estimate
  const rate = form.watch("rate");
  const costEstimate = form.watch("cost_estimate");

  useEffect(() => {
    // Convert to numbers, default to 0 if empty or invalid
    const rateNum = parseFloat(rate) || 0;
    const costEstimateNum = parseFloat(costEstimate) || 0;

    // Calculate total: rate * cost_estimate
    const total = rateNum * costEstimateNum;

    // Only update if there's a valid calculation (both fields have values)
    if (rate && costEstimate) {
      const calculatedTotal = total.toString();
      const currentTotal = form.getValues("total_cost_estimate");

      // Only update if the calculated total is different from current total
      if (currentTotal !== calculatedTotal) {
        form.setValue("total_cost_estimate", calculatedTotal, {
          shouldValidate: true,
        });
      }
    }
  }, [rate, costEstimate, form]);

  const onSubmit: SubmitHandler<TAssetMaintenanceFormData> = async (data) => {
    try {
      await createAssetMaintenance(data);
      toast.success("Asset Maintenance Ticket Raised");
      router.push(AdminRoutes.INDEX_ASSET_MAINTENANCE);
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong");
    }
  };

  return (
    <div className='flex flex-col gap-y-6'>
      <BackNavigation extraText='Request Asset Maintenance' />

      {/* User Context Display */}
      {userLocation && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-bold text-blue-800 mb-2">Asset Maintenance Request</h3>
          <p className="text-gray-700">
            Select an asset from your office location that requires maintenance (vehicles, IT equipment, furniture, etc.).
          </p>
          <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded">
            <p className="text-sm text-green-700">
              <strong>Your Office Location:</strong> {userLocation}
              <span className="ml-2 text-xs text-green-600">
                ({filteredAssets.length} asset(s) available for maintenance)
              </span>
            </p>
          </div>
          {filteredAssets.length === 0 && (
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-700">
                <strong>No assets found</strong> at your location for maintenance requests.
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                Assets include: vehicles, laptops, office equipment, furniture, etc.
              </p>
            </div>
          )}
        </div>
      )}

      <Card>
        <CardContent className='py-7'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex flex-col gap-y-6'
              action=''
            >
              <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                <FormInput
                  label='Date/Time'
                  name='maintenance_datetime'
                  type='date'
                  required
                  disabled
                />

                <FormSelect
                  label='Asset'
                  name='asset'
                  placeholder={
                    !userLocation
                      ? 'Loading user location...'
                      : filteredAssets.length === 0
                      ? 'No assets available at your location'
                      : `Select Asset (${filteredAssets.length} available)`
                  }
                  required
                  options={assetOptions}
                  disabled={!userLocation || filteredAssets.length === 0}
                />

                <FormSelect
                  label='Maintenance Type '
                  name='maintenance_type'
                  placeholder='Enter Maintenance Type'
                  required
                  options={[
                    {
                      label: "CORRECTIVE",
                      value: "CORRECTIVE",
                    },
                    {
                      label: "PREVENTIVE",
                      value: "PREVENTIVE",
                    },
                  ]}
                />

                <FormInput
                  label='Rate'
                  name='rate'
                  placeholder='Enter Rate'
                  required
                />

                <FormInput
                  label='Cost Estimate'
                  name='cost_estimate'
                  placeholder='Enter Cost Estimate'
                  required
                />

                <FormInput
                  label='Total Cost Estimate'
                  name='total_cost_estimate'
                  placeholder='Auto-calculated'
                  required
                  disabled
                />
              </div>

              <div className='space-y-2 max-w-md'>
                <FormSelect
                  label='Description Type'
                  name='description_type'
                  placeholder='Select Description Type'
                  required
                  options={descOptions}
                />
              </div>

              <FormTextArea
                label='Description of Problem'
                name='description'
                placeholder='Enter Problem Description'
                required
              />
              {/* 
                            <FormTextArea
                                label="Justification for Disposal"
                                name="disposal_justification"
                                placeholder="Enter Justification"
                                required
                            /> */}

              <FormSelect
                label='Reviewer'
                name='reviewer'
                placeholder='Select Reviewer'
                required
                options={reviewerOptions}
              />

              <FormSelect
                label='Authorizer'
                name='authorizer'
                placeholder='Select Authorizer'
                required
                options={authorizerOptions}
              />

              <FormSelect
                label='Approver'
                name='approver'
                placeholder='Select Approver'
                required
                options={approverOptions}
              />

              <div className='flex justify-end'>
                <FormButton loading={isCreateLoading}>Submit</FormButton>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
