"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import BackNavigation from "@/components/BackNavigation";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelectField";
import FormTextArea from "@/components/FormTextArea";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { AdminRoutes } from "@/constants/RouterConstants";
import {
  FacilityMaintenanceSchema,
  TFacilityMaintenanceFormValues,
} from "@/features/admin/types/facility-management/facility-maintenance";
import { useEffect, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useGetAllUsersQuery } from "@/features/auth/controllers";
import {
  useGetAllFacilityQuery,
} from "@/features/modules/controllers";
import {
  useGetAHNIOfficeLocations
} from "@/features/modules/controllers/config/locationController";
import {
  useCreateFacilityMaintenanceMutation,
  useGetSingleFacilityMaintenanceQuery,
  useModifyFacilityMaintenanceMutation,
} from "@/features/admin/controllers";
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

const maintenanceTypeOptions = [
  {
    label: "Corrective",
    value: "CORRECTIVE",
  },
  {
    label: "Preventive",
    value: "PREVENTIVE",
  },
];

export default function CreateFacilityManagementTicket() {
  // Get current user information for auto-population
  const { user: currentUser } = usePermissions();

  // Get current date in YYYY-MM-DD format
  const currentDate = new Date().toISOString().split('T')[0];

  // Get user's office location for context display
  // Try multiple location sources
  const userLocation = currentUser?.employee?.location ||
                      currentUser?.location ||
                      currentUser?.department?.location ||
                      currentUser?.employee?.department?.location;


  const router = useRouter();

  const searchParams = useSearchParams();
  const id = searchParams?.get("id");

  const { data: user } = useGetAllUsersQuery({
    page: 1,
    size: 2000000,
    search: "",
  });

  // Filter for AHNI staff only (exclude vendors, consultants, external users)
  const ahniStaff = useMemo(
    () => filterAhniStaffOnly(user?.data?.results || []),
    [user?.data?.results]
  );

  const userOptions = useMemo(
    () =>
      ahniStaff.map((userItem: any) => ({
        label: `${userItem.first_name} ${userItem.last_name}`,
        value: userItem.id,
      })),
    [ahniStaff]
  );

  // Filtered options for approval workflow - only users with appropriate permissions
  // Fallback to all AHNI staff if no specific approvers are configured
  const reviewerOptions = useMemo(() => {
    const options = getReviewerOptions(ahniStaff);
    // If no reviewers found with permissions, use all AHNI staff as fallback
    if (options.length === 0) {
      return userOptions;
    }
    return options;
  }, [ahniStaff, userOptions]);

  const authorizerOptions = useMemo(() => {
    const options = getAuthorizerOptions(ahniStaff);
    // If no authorizers found with permissions, use all AHNI staff as fallback
    if (options.length === 0) {
      return userOptions;
    }
    return options;
  }, [ahniStaff, userOptions]);

  const approverOptions = useMemo(() => {
    const options = getApproverOptions(ahniStaff);
    // If no approvers found with permissions, use all AHNI staff as fallback
    if (options.length === 0) {
      return userOptions;
    }
    return options;
  }, [ahniStaff, userOptions]);

  // Get all facilities first to see what's available
  const { data: facility, isLoading: facilityLoading, error: facilityError } = useGetAllFacilityQuery({
    page: 1,
    size: 2000000,
    search: "", // Get all facilities to debug
  });

  // Get all AHNI office locations to match user location string to UUID
  const { data: locations, isLoading: locationsLoading } = useGetAHNIOfficeLocations({
    page: 1,
    size: 2000000,
    search: "",
  });

  // Handle both string and object locations, match string to UUID from API
  const effectiveLocation = useMemo(() => {
    if (typeof userLocation === 'string' && locations?.data?.results) {
      // Try to find matching location UUID by name
      const matchingLocation = locations.data.results.find((loc: any) =>
        loc.name === userLocation ||
        loc.name.includes(userLocation) ||
        userLocation.includes(loc.name)
      );

      if (matchingLocation) {
        return {
          id: matchingLocation.id,
          name: matchingLocation.name,
        };
      } else {
        // Fallback: use first available AHNI office or create a meaningful default
        const firstAvailableLocation = locations.data.results[0];
        if (firstAvailableLocation) {
          return {
            id: firstAvailableLocation.id,
            name: firstAvailableLocation.name + ' (Fallback for: ' + userLocation + ')',
          };
        } else {
          return {
            id: 'no-location-available',
            name: userLocation + ' (No UUID match found)',
          };
        }
      }
    } else if (userLocation && typeof userLocation === 'object') {
      // Location is an object, use as-is
      return userLocation;
    } else {
      // No location found, create fallback based on department
      return {
        id: 'default-office-location',
        name: `${currentUser?.employee?.department?.name || currentUser?.department?.name || 'AHNI'} Office`,
      };
    }
  }, [userLocation, locations, currentUser]);

  const form = useForm<TFacilityMaintenanceFormValues>({
    resolver: zodResolver(FacilityMaintenanceSchema),
    defaultValues: {
      maintenance_datetime: currentDate,
      facility: "",
      maintenance_type: "",
      rate: "",
      cost_estimate: "",
      total_cost_estimate: "",
      description: "",
      problem_description: "",
      reviewer: "",
      authorizer: "",
      approver: "",
      location: effectiveLocation?.id || "", // Auto-populate with user's office location
    },
  });

  const facilityOptions = useMemo(() => {
    if (!facility?.data?.results) {
      return [];
    }

    // Filter for AHNI facilities client-side
    const ahniFacilities = facility.data.results.filter((facilityItem: any) =>
      facilityItem.name && facilityItem.name.toLowerCase().includes('ahni')
    );

    return ahniFacilities.map((facilityItem: any) => ({
      label: facilityItem.name, // e.g., "AHNI Adamawa State Office - Office Building"
      value: facilityItem.id,
    }));
  }, [facility]);

  const { createFacilityMaintenance, isLoading: isCreateLoading } =
    useCreateFacilityMaintenanceMutation();

  const { modifyFacilityMaintenance, isLoading: isModifyLoading } =
    useModifyFacilityMaintenanceMutation(id || "");

  const onSubmit: SubmitHandler<TFacilityMaintenanceFormValues> = async (
    data
  ) => {
    try {
      if (id) {
        await modifyFacilityMaintenance(data);
        toast.success("Facility Maintenance Ticket Updated");
      } else {
        await createFacilityMaintenance(data);
        toast.success("Facility Maintenance Ticket Raised");
      }
      router.push(AdminRoutes.INDEX_FACILITY_MAINTENANCE);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message ||
                          error?.data?.message ||
                          error?.message ||
                          "Something went wrong";
      toast.error(errorMessage);
    }
  };

  const { data: facilityMaintenance } = useGetSingleFacilityMaintenanceQuery(
    id || "",
    !!id
  );

  // Auto-calculate total cost estimate when rate or cost estimate changes
  // Also auto-populate location when facility is selected
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'rate' || name === 'cost_estimate') {
        const rate = parseFloat(value.rate || '0');
        const costEstimate = parseFloat(value.cost_estimate || '0');
        const totalCostEstimate = rate * costEstimate;

        // Only update if both values are valid numbers and result is not NaN
        if (!isNaN(rate) && !isNaN(costEstimate) && !isNaN(totalCostEstimate)) {
          form.setValue('total_cost_estimate', totalCostEstimate.toString(), {
            shouldValidate: false,
            shouldDirty: false,
          });
        }
      }

      // Location is auto-populated from user's office location
      // No need to change it when facility is selected since it represents
      // the user's office location making the request
    });

    return () => subscription.unsubscribe();
  }, [form, facility]);

  useEffect(() => {
    if (facilityMaintenance) {
      const { data } = facilityMaintenance;

      form.reset({
        maintenance_datetime: data.maintenance_datetime,
        facility: data.facility.id,
        location: data.facility.location?.id || data.location?.id || "", // Get location from facility
        maintenance_type: data.maintenance_type,
        rate: data.rate,
        cost_estimate: data.cost_estimate,
        total_cost_estimate: data.total_cost_estimate,
        description: data.description,
        problem_description: data.problem_description,
        reviewer: "",
        authorizer: "",
        approver: "",
      });
    }
  }, [facilityMaintenance, form]);

  return (
    <div className='flex flex-col gap-y-6'>
      <BackNavigation extraText='Request Facility Maintenance' />
      <Card>
        <CardContent className='py-7'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex flex-col gap-y-6'
              action=''
            >
              {/* AHNI Office Facility Maintenance */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-lg font-bold text-blue-800 mb-2">AHNI Office Facility Maintenance Request</h3>
                <p className="text-gray-700">
                  Select the AHNI office facility that needs maintenance from the dropdown below.
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  All AHNI office locations are available for facility maintenance requests.
                </p>
                {effectiveLocation && (
                  <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded">
                    <p className="text-sm text-green-700">
                      <strong>Request Location:</strong> {effectiveLocation.name || effectiveLocation.id}
                      <span className="ml-2 text-xs text-green-600">(Your office location)</span>
                    </p>
                  </div>
                )}
              </div>

              <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                <FormInput
                  label='Date/Time'
                  name='maintenance_datetime'
                  type='date'
                  required
                  disabled
                />

                <FormSelect
                  label='AHNI Office Facility'
                  name='facility'
                  placeholder={
                    facilityLoading
                      ? 'Loading facilities...'
                      : facilityError
                      ? 'Error loading facilities'
                      : facilityOptions?.length > 0
                      ? 'Select AHNI Office Facility'
                      : 'No AHNI facilities found'
                  }
                  required
                  options={facilityOptions}
                  disabled={facilityLoading || !facilityOptions || facilityOptions.length === 0}
                />

                <FormSelect
                  label='Maintenance Type'
                  name='maintenance_type'
                  placeholder='Select Maintenance Type'
                  required
                  options={maintenanceTypeOptions}
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
                  placeholder='Auto-calculated (Rate × Cost Estimate)'
                  required
                  disabled
                  className="bg-gray-100"
                />
              </div>

              <div className='space-y-2 max-w-md'>
                <FormSelect
                  label='Description'
                  name='description'
                  placeholder='Select Description'
                  required
                  options={descOptions}
                />
              </div>

              <FormTextArea
                label='Description of Problem'
                name='problem_description'
                placeholder='Enter Problem Description'
                required
              />

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

              <div className='flex justify-end gap-4'>
                <FormButton
                  size='lg'
                  loading={isCreateLoading || isModifyLoading}
                >
                  Submit
                </FormButton>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
