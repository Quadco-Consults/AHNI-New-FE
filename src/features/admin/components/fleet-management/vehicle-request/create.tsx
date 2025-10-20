"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BackNavigation from "components/atoms/BackNavigation";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelectField";
import FormCombobox from "components/FormCombobox";
import { Card, CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { Button } from "components/ui/button";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType, largeDailogScreen } from "constants/dailogs";
// import { userSelector } from "store/assets";
import { toast } from "sonner";
import { useGetAllUsersQuery, useGetUserProfile } from "@/features/auth/controllers/userController";
import { filterAhniStaffOnly } from "@/utils/userFilters";
// import { useGetAllLocationsQuery } from "@/features/modules/controllers/config/locationController";
import {
  TVehicleRequestFormValues,
  VehicleRequestSchema,
} from "features/admin/types/fleet-management/vehicle-request";
import { useEffect, useMemo } from "react";
import FormTextArea from "components/atoms/FormTextArea";
import {
  useCreateVehicleRequestMutation,
  useEditVehicleRequestMutation,
  useGetSingleVehicleRequestQuery,
} from "@/features/admin/controllers/vehicleRequestController";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminRoutes } from "constants/RouterConstants";
import { addTeamMembers, clearTeamMembers } from "store/admin/team-members";
import { useGetAllProjectsQuery } from "@/features/projects/controllers/projectController";
import { useGetAllActivityPlansQuery } from "@/features/programs/controllers/activityPlanController";
import { useGetAllItemsQuery } from "@/features/modules/controllers/config/itemController";
import VendorsAPI from "@/features/procurement/controllers/vendorController";
import { useGetAllLocationsManager } from "@/features/modules/controllers/config/locationController";
import { CATEGORY_IDS } from "@/constants/categories";

const NewVehicleRequest = () => {
  const form = useForm<TVehicleRequestFormValues>({
    resolver: zodResolver(VehicleRequestSchema),
    defaultValues: {
      location: "",
      travel_destination: "",
      departure_point: "",
      return_point: "",
      departure_datetime: "",
      return_datetime: "",
      travel_team_members: [],
      supervisor: "",
      recommendations: "",
      purpose_of_travel: "",
      project: "",
      activity: "",
      request_type: "",
      vendor: "",
      asset_vehicle: "",
    },
  });

  const dispatch = useAppDispatch();
  const router = useRouter();

  const searchParams = useSearchParams();
  const id = searchParams?.get("id");

  const { data: project } = useGetAllProjectsQuery({
    page: 1,
    size: 2000000,
  });

  const projectOptions = useMemo(
    () =>
      project?.data?.results?.map(({ title, id }) => ({
        label: title,
        value: id,
      })),
    [project]
  );

  // Watch the selected project to filter activities
  const selectedProject = form.watch("project");

  const { data: activity } = useGetAllActivityPlansQuery({
    page: 1,
    size: 2000000,
    project: selectedProject, // Filter activities by selected project
  });

  const activityOptions = useMemo(
    () =>
      activity?.data?.results?.map(({ activity_name, id }) => ({
        label: activity_name,
        value: id,
      })),
    [activity]
  );

  console.log({ activity, activityOptions, selectedProject });

  // Fetch all users and filter to AHNI staff on frontend
  const { data: user, isLoading: isUsersLoading, error: usersError } = useGetAllUsersQuery({
    page: 1,
    size: 2000000,
  });

  console.log("👤 Users Query Debug:", {
    user,
    isLoading: isUsersLoading,
    error: usersError,
    hasData: !!user,
    hasResults: !!user?.results,
    hasDataResults: !!(user as any)?.data?.results,
    resultsLength: user?.results?.length || 0,
    dataResultsLength: (user as any)?.data?.results?.length || 0,
  });

  // Fetch current user profile for auto-populating location
  const { data: currentUserProfile, isLoading: isProfileLoading } = useGetUserProfile();

  console.log("🔍 Vehicle Request - Current User Profile:", {
    currentUserProfile,
    isProfileLoading,
    location: currentUserProfile?.data?.location,
    hasLocation: !!currentUserProfile?.data?.location,
    allProfileData: currentUserProfile?.data
  });

  const userOptions = useMemo(
    () => {
      const allUsers = (user as any)?.data?.results || user?.results || [];
      console.log("👤 Supervisor Filter Debug:", {
        totalUsers: allUsers.length,
        sampleUserTypes: allUsers.slice(0, 5).map((u: any) => ({ name: `${u.first_name} ${u.last_name}`, user_type: u.user_type }))
      });

      // Use the same filter as TeamMemberSelection for consistency
      const ahniUsers = filterAhniStaffOnly(allUsers);

      console.log("👤 After filtering:", {
        filteredCount: ahniUsers.length,
        sampleFiltered: ahniUsers.slice(0, 3).map((u: any) => ({ name: `${u.first_name} ${u.last_name}`, user_type: u.user_type }))
      });

      return ahniUsers.map(({ first_name, last_name, id }: any) => ({
        label: `${first_name} ${last_name}`,
        value: id,
      }));
    },
    [user]
  );

  const { data: locations } = useGetAllLocationsManager({
    page: 1,
    size: 2000000,
  });

  const locationOptions = useMemo(
    () =>
      locations?.data?.results?.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [locations]
  );

  // Watch selected location for filtering assets
  const selectedLocation = form.watch("location");

  // Fetch all vehicle assets using the items endpoint with vehicle category
  const { data: asset } = useGetAllItemsQuery({
    page: 1,
    size: 500,
    search: "",
    category: CATEGORY_IDS.VEHICLE, // b0983944-f926-4141-8e28-093960d75246
    expand: "category,assignee,asset_type,project,donor,asset_condition,location,classification,implementer",
  });

  const assetVehicleOptions = useMemo(
    () => {
      try {
        const allAssets = asset?.data?.results || [];

        console.log("🚗 Vehicle Assets Debug:", {
          totalAssets: allAssets.length,
          selectedLocation,
          sampleAsset: allAssets[0],
          rawAssetData: asset,
        });

        // Filter assets by location if one is selected
        // Category filtering is already handled by the API query
        const filteredAssets = allAssets.filter((assetItem: any) => {
          // If no location is selected, show all vehicles
          if (!selectedLocation) return true;

          // Filter by location - check if asset's location matches selected location
          const locationMatch = assetItem.location?.id === selectedLocation || assetItem.location === selectedLocation;

          console.log(`🔍 Vehicle "${assetItem.name}":`, {
            hasLocation: !!assetItem.location,
            locationId: assetItem.location?.id || assetItem.location,
            selectedLocation,
            locationMatch
          });

          return locationMatch;
        });

        console.log("✅ Filtered vehicle assets:", filteredAssets.length);

        const options = filteredAssets.map(({ name, id, code, plate_number }: any) => ({
          label: `${name}${plate_number ? ` (${plate_number})` : ''}${code ? ` - ${code}` : ''}`,
          value: id,
        }));

        console.log("🚙 Vehicle dropdown options:", options.length, "vehicles");
        options.forEach((opt, idx) => {
          console.log(`  ${idx + 1}. ${opt.label} (ID: ${opt.value})`);
        });

        return options;
      } catch (error) {
        console.error("Error filtering asset vehicles:", error);
        return [];
      }
    },
    [asset, selectedLocation]
  );

  const { data: vendor } = VendorsAPI.useGetVendorsQuery({
    page: 1,
    size: 2000000,
  });

  const vendorOptions = useMemo(
    () =>
      vendor?.data.results.map(({ company_name, id }) => ({
        label: company_name,
        value: id,
      })),
    [vendor]
  );

  const requestType = form.watch("request_type");

  const { createVehicleRequest, isLoading: isCreateLoading } =
    useCreateVehicleRequestMutation();

  const { editVehicleRequest, isLoading: isEditLoading } =
    useEditVehicleRequestMutation(id);
  console.log(form.getValues());

  const onSubmit: SubmitHandler<TVehicleRequestFormValues> = async (data) => {
    console.log("📝 Form submission data:", data);
    console.log("👥 Team members from store:", teamMembers);
    console.log("👥 Team member FULL objects:", JSON.stringify(teamMembers, null, 2));
    console.log("👥 Team member IDs being sent:", data.travel_team_members);

    // Check each team member ID against available users
    const allUsers = (user as any)?.data?.results || user?.results || [];
    console.log("👤 Total users available:", allUsers.length);
    console.log("👤 Sample users:", allUsers.slice(0, 3).map((u: any) => ({ id: u.id, name: `${u.first_name} ${u.last_name}`, user_type: u.user_type })));

    data.travel_team_members.forEach((memberId, idx) => {
      const userExists = allUsers.find((u: any) => u.id === memberId);
      console.log(`👤 Team member ${idx + 1} (ID: ${memberId}):`, userExists ? `✅ Found - ${userExists.first_name} ${userExists.last_name}` : '❌ NOT FOUND IN DATABASE');
    });

    try {
      if (id) {
        await editVehicleRequest(data);
        toast.success("Updated Vehicle Request");
      } else {
        await createVehicleRequest(data);
        toast.success("Vehicle Request Submitted");
      }

      router.push(AdminRoutes.INDEX_VEHICLE_REQUEST);
    } catch (error: any) {
      console.error("❌ Submission error:", error);
      console.error("Error details:", error?.response?.data || error?.data);
      toast.error(error?.data?.message ?? error?.response?.data?.message ?? "Something went wrong");
    }
  };

  const onTeamClick = () => {
    dispatch(
      openDialog({
        type: DialogType.AddTeamMenbers,
        dialogProps: {
          ...largeDailogScreen,
        },
      })
    );
  };

  const { teamMembers } = useAppSelector((state) => state.teamMember);

  // Clear team members when creating a new request (not editing)
  useEffect(() => {
    if (!id) {
      dispatch(clearTeamMembers());
    }
  }, [id, dispatch]); // Clear when id changes (from edit to create)

  useEffect(() => {
    form.setValue(
      "travel_team_members",
      teamMembers.map(({ id }) => id)
    );
  }, [teamMembers, form]);

  // Auto-populate location from logged-in user's profile
  useEffect(() => {
    const currentLocation = form.getValues("location");

    console.log("🔍 Location Auto-fill Check:", {
      hasProfile: !!currentUserProfile?.data,
      location: currentUserProfile?.data?.location,
      locationOptions: locationOptions,
      locationOptionsLength: locationOptions?.length,
      isEditing: !!id,
      currentFormValue: currentLocation,
      alreadySet: !!currentLocation
    });

    // Only set if not editing, not already set, and have necessary data
    if (!id && !currentLocation && currentUserProfile?.data?.location && locationOptions && locationOptions.length > 0) {
      // Handle both object and string location formats
      const locationValue = typeof currentUserProfile.data.location === 'object'
        ? currentUserProfile.data.location.id
        : currentUserProfile.data.location;

      // Find matching location option by name or ID
      const matchingLocation = locationOptions.find((opt: any) =>
        opt.value === locationValue ||
        opt.label === locationValue ||
        opt.label === currentUserProfile.data.location
      );

      if (matchingLocation) {
        console.log("✅ Auto-populating location with ID:", matchingLocation.value, "Label:", matchingLocation.label);
        // Use a timeout to ensure form is fully initialized
        setTimeout(() => {
          form.setValue("location", matchingLocation.value, {
            shouldValidate: false,
            shouldDirty: false,
            shouldTouch: false
          });
        }, 100);
      } else {
        console.warn("⚠️ Could not find matching location option for:", locationValue);
        console.log("Available location options:", locationOptions);
      }
    }
  }, [currentUserProfile, locationOptions, form, id]);

  // Reset activity field when project changes
  useEffect(() => {
    if (selectedProject && !id) {
      // Only reset if creating a new request (not editing)
      form.setValue("activity", "");
    }
  }, [selectedProject, form, id]);

  const { data: vehicleRequest } = useGetSingleVehicleRequestQuery(
    id || "",
    !!id
  );

  useEffect(() => {
    if (vehicleRequest) {
      const {
        location,
        travel_destination,
        departure_point,
        return_point,
        departure_datetime,
        return_datetime,
        travel_team_members,
        supervisor,
        recommendations,
        purpose_of_travel,
        project,
        activity,
        request_type,
        vendor,
        asset_vehicle,
      } = vehicleRequest.data;

      form.reset({
        location: location.id,
        travel_destination,
        departure_point,
        return_point,
        departure_datetime,
        return_datetime,
        supervisor: supervisor.id,
        recommendations,
        purpose_of_travel,
        project: project?.id || "",
        activity: activity?.id || "",
        request_type: request_type || "",
        vendor: vendor?.id || "",
        asset_vehicle: asset_vehicle?.id || "",
      });

      // Ensure team members have the correct structure for the form display
      const formattedTeamMembers = travel_team_members.map((member: any) => ({
        ...member,
        // Handle both snake_case and camelCase naming from API
        first_name: member.first_name || member.full_name?.split(' ')[0] || member.fullName?.split(' ')[0] || '',
        last_name: member.last_name || member.full_name?.split(' ').slice(1).join(' ') || member.fullName?.split(' ').slice(1).join(' ') || '',
        full_name: member.full_name || member.fullName || `${member.first_name} ${member.last_name}`,
        fullName: member.fullName || member.full_name || `${member.first_name} ${member.last_name}`,
        designation: member.designation || member.position || '',
        mobile_number: member.mobile_number || '',
      }));

      dispatch(addTeamMembers(formattedTeamMembers));
    }
  }, [vehicleRequest, form, dispatch]);
  console.log({ activityOptions });

  return (
    <div>
      <BackNavigation extraText='Vehicle Request' />
      <div>
        <Card>
          <CardContent className='py-8'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='grid grid-cols-2 gap-10'
              >
                <FormSelect
                  label='Location'
                  name='location'
                  placeholder='Select Location'
                  required
                  options={locationOptions}
                />

                <FormSelect
                  label='Project'
                  name='project'
                  placeholder='Select Project'
                  required
                  options={projectOptions}
                />

                <FormSelect
                  label='Activity'
                  name='activity'
                  placeholder={selectedProject ? 'Select Activity' : 'Select a project first'}
                  required
                  options={activityOptions}
                  disabled={!selectedProject}
                />

                <FormSelect
                  label='Request Type'
                  name='request_type'
                  placeholder='Select Request Type'
                  required
                  options={[
                    { label: "AHNI Asset", value: "AHNI_ASSET" },
                    { label: "Vendor", value: "VENDOR" },
                  ]}
                />

                {/* {requestType === "ASSET" && (
                                    <FormSelect
                                        label="Asset Vehicle"
                                        name="_"
                                        placeholder="Select Asset Vehicle"
                                        required
                                        options={assetOptions}
                                    />
                                )} */}

                {requestType === "VENDOR" && (
                  <FormSelect
                    label='Vendors'
                    name='vendor'
                    placeholder='Select Vendor'
                    required
                    options={vendorOptions}
                  />
                )}

                {requestType === "AHNI_ASSET" && (
                  <FormSelect
                    label='Asset Vehicle'
                    name='asset_vehicle'
                    placeholder='Select Asset Vehicle'
                    required
                    options={assetVehicleOptions}
                  />
                )}

                <div className='grid grid-cols-2 gap-5'>
                  <FormInput
                    label='Destination of Travel'
                    name='travel_destination'
                    placeholder='Enter Travel Destination'
                    required
                  />

                  <FormInput
                    label='Point of Departure'
                    name='departure_point'
                    placeholder='Enter Departure Point'
                    required
                  />
                </div>

                <div className='grid grid-cols-3 gap-5'>
                  <FormInput
                    label='Point of Return'
                    name='return_point'
                    placeholder='Enter Return Point'
                    required
                  />

                  <FormInput
                    label='Date of Departure'
                    name='departure_datetime'
                    type='date'
                    required
                  />

                  <FormInput
                    label='Date of Return'
                    name='return_datetime'
                    type='date'
                    required
                  />
                </div>
                <div>
                  <p className='my-2 font-semibold'>
                    Travel Team Members ({teamMembers?.length})
                  </p>

                  <div className='grid grid-cols-4 gap-5 '>
                    {teamMembers.map(
                      (member) => {
                        const {
                          id,
                          first_name,
                          last_name,
                          designation,
                          position,
                          mobile_number,
                        } = member;

                        // Helper to extract position from object or string
                        const getPosition = () => {
                          if (designation) {
                            return typeof designation === 'object'
                              ? designation?.name || designation?.title || ''
                              : designation;
                          }
                          if (position) {
                            return typeof position === 'object'
                              ? position?.name || position?.title || ''
                              : position;
                          }
                          return 'N/A';
                        };

                        return (
                          <div className='p-3 bg-yellow-100' key={id}>
                            <p>
                              <span className='font-semibold'>Name:&nbsp;</span>
                              {`${first_name} ${last_name}`}
                            </p>
                            <p>
                              <span className='font-semibold'>
                                Position:&nbsp;
                              </span>
                              {getPosition()}
                            </p>
                            <p>
                              <span className='font-semibold'>Tel:&nbsp;</span>
                              {mobile_number || 'N/A'}
                            </p>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                <Button
                  onClick={() => onTeamClick()}
                  type='button'
                  className='w-3/12 text-[#DEA004] bg-white border '
                >
                  Click to select team members
                </Button>

                <FormCombobox
                  label='Supervisor'
                  name='supervisor'
                  placeholder='Select Supervisor'
                  searchPlaceholder='Search supervisor...'
                  required
                  options={userOptions}
                  emptyText='No supervisor found.'
                />
                <FormTextArea
                  label='Recommendations'
                  name='recommendations'
                  placeholder='Enter Recommendations'
                  required
                />
                <FormTextArea
                  label='Purpose of travel'
                  name='purpose_of_travel'
                  placeholder='Enter Purpose'
                  required
                />

                <div className='ml-auto'>
                  <FormButton
                    loading={isCreateLoading || isEditLoading}
                    type='submit'
                  >
                    Submit
                  </FormButton>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewVehicleRequest;
