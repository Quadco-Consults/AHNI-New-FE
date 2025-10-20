"use client";

import BackNavigation from "components/atoms/BackNavigation";
import FormButton from "@/components/FormButton";
import FormSelect from "components/atoms/FormSelect";
import FormTextArea from "components/atoms/FormTextArea";
import DeleteIcon from "components/icons/DeleteIcon";
import DescriptionCard from "components/DescriptionCard";
import { LoadingSpinner } from "components/Loading";
import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import { format } from "date-fns";
import { PlusIcon } from "lucide-react";
import { useMemo, useEffect, useState } from "react";
import { FormProvider, useForm, useFieldArray } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  useGetSingleVehicleRequestQuery,
  useApproveVehicleRequestMutation,
  useRejectVehicleRequestMutation,
} from "@/features/admin/controllers/vehicleRequestController";
import { useGetAllUsersQuery } from "@/features/auth/controllers/userController";
import {
  VehicleRequestApprovalSchema,
  TVehicleRequestApprovalFormValues,
} from "@/features/admin/types/fleet-management/vehicle-request";
import { useGetAllItemsQuery } from "@/features/modules/controllers";

export default function VehicleRequestDetails() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [rejectComment, setRejectComment] = useState("");

  // Helper function to safely render object or string values
  const renderValue = (value: any, fallback: string = "N/A"): string => {
    if (!value) return fallback;
    if (typeof value === 'object') {
      return value?.name || value?.title || fallback;
    }
    return String(value);
  };

  const { data, isLoading } = useGetSingleVehicleRequestQuery(
    id as string,
    !!id
  );

  const {
    approveVehicleRequest,
    isLoading: isApproving,
    isSuccess,
  } = useApproveVehicleRequestMutation(id as string);

  const {
    rejectVehicleRequest,
    isLoading: isRejecting,
    isSuccess: isRejectSuccess,
  } = useRejectVehicleRequestMutation(id as string);

  const form = useForm<TVehicleRequestApprovalFormValues>({
    resolver: zodResolver(VehicleRequestApprovalSchema),
    defaultValues: {
      vehicles: [{ vehicle: "", driver: "" }],
      comment: "",
    },
  });

  // Auto-populate form when data loads
  useEffect(() => {
    if (data?.data?.vehicle_assignments && data.data.vehicle_assignments.length > 0) {
      // Map existing vehicle assignments to form format
      const existingAssignments = data.data.vehicle_assignments.map((assignment: any) => ({
        vehicle: assignment.vehicle,
        driver: assignment.assigned_driver,
      }));
      
      form.reset({
        vehicles: existingAssignments,
        comment: "",
      });
    }
  }, [data, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "vehicles",
  });

  // Fetch vehicles with category filter for "vehicle"
  const { data: vehicleData } = useGetAllItemsQuery({
    page: 1,
    size: 2000000,
    category: "b0983944-f926-4141-8e28-093960d75246",
  });

  const vehicleOptions = useMemo(
    () =>
      vehicleData?.data?.results?.map((item: any) => ({
        label: item.name,
        value: item.id,
      })) || [],
    [vehicleData]
  );

  // Fetch drivers (users)
  const { data: driverData } = useGetAllUsersQuery({ page: 1, size: 2000000 });

  const driverOptions = useMemo(
    () =>
      driverData?.data?.results?.map((user: any) => ({
        label: `${user.first_name} ${user.last_name}`,
        value: user.id,
      })) || [],
    [driverData]
  );

  const onSubmit = async (formData: TVehicleRequestApprovalFormValues) => {
    try {
      // Send vehicle-driver pairs directly as expected by backend
      const payload = {
        vehicles: formData.vehicles, // Array of {vehicle: "id", driver: "id"} objects
        comment: formData.comment,
      };

      await approveVehicleRequest(payload);
    } catch (error) {
      console.error("Approval failed:", error);
      toast.error("Failed to approve vehicle request. Please try again.");
    }
  };

  const addVehicle = () => {
    append({ vehicle: "", driver: "" });
  };

  const removeVehicle = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onReject = async () => {
    try {
      await rejectVehicleRequest(rejectComment);
    } catch (error) {
      console.error("Rejection failed:", error);
      toast.error("Failed to reject vehicle request. Please try again.");
    }
  };

  // Handle success
  useEffect(() => {
    if (isSuccess) {
      toast.success("Vehicle request approved successfully!");
      router.push("/dashboard/admin/fleet-management/vehicle-request");
    }
  }, [isSuccess, router]);

  // Handle reject success
  useEffect(() => {
    if (isRejectSuccess) {
      toast.success("Vehicle request rejected successfully!");
      router.push("/dashboard/admin/fleet-management/vehicle-request");
    }
  }, [isRejectSuccess, router]);

  // Check if request is already processed (approved or rejected)
  const isRequestProcessed = data?.data?.status?.toLowerCase() === 'approved' ||
                             data?.data?.status?.toLowerCase() === 'rejected';

  return (
    <div className='space-y-4'>
      <BackNavigation extraText='View Vehicle Request' />
      <Card className='p-6 mx-auto space-y-5'>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          data && (
            <>
              {/* Enhanced Requesting Staff Details */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-lg font-bold text-blue-800 mb-3">Requesting Staff Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Name</p>
                    <p className="text-base">{`${data?.data?.requesting_staff?.first_name || ""} ${data?.data?.requesting_staff?.last_name || ""}`}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Email</p>
                    <p className="text-base">{data?.data?.requesting_staff?.email || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Department</p>
                    <p className="text-base">{renderValue(data?.data?.requesting_staff?.department)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Position</p>
                    <p className="text-base">{renderValue(data?.data?.requesting_staff?.position) || renderValue(data?.data?.requesting_staff?.designation)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Mobile Number</p>
                    <p className="text-base">{data?.data?.requesting_staff?.mobile_number || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Location</p>
                    <p className="text-base">{renderValue(data?.data?.requesting_staff?.location)}</p>
                  </div>
                </div>
              </div>

              {/* Enhanced Supervisor Details */}
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="text-lg font-bold text-green-800 mb-3">Supervisor Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Name</p>
                    <p className="text-base">{`${data?.data?.supervisor?.first_name || ""} ${data?.data?.supervisor?.last_name || ""}`}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Email</p>
                    <p className="text-base">{data?.data?.supervisor?.email || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Department</p>
                    <p className="text-base">{renderValue(data?.data?.supervisor?.department)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Position</p>
                    <p className="text-base">{renderValue(data?.data?.supervisor?.position) || renderValue(data?.data?.supervisor?.designation)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Mobile Number</p>
                    <p className="text-base">{data?.data?.supervisor?.mobile_number || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Location</p>
                    <p className="text-base">{renderValue(data?.data?.supervisor?.location)}</p>
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-3 gap-5 mb-6'>
                <DescriptionCard
                  label='Location'
                  description={data?.data.location.name}
                />

                <DescriptionCard
                  label='Date of Request'
                  description={format(
                    data?.data.created_datetime,
                    "dd-MMM-yyyy"
                  )}
                />

                <DescriptionCard
                  label='Travel Destination'
                  description={data?.data.travel_destination}
                />

                <DescriptionCard
                  label='Departure Date'
                  description={format(
                    data?.data.departure_datetime,
                    "dd-MMM-yyyy"
                  )}
                />

                <DescriptionCard
                  label='Return Date'
                  description={format(
                    data?.data.return_datetime,
                    "dd-MMM-yyyy"
                  )}
                />

                <DescriptionCard
                  label='Point of Departure'
                  description={data?.data.departure_point}
                />

                <DescriptionCard
                  label='Purpose of Travel'
                  description={data?.data.purpose_of_travel || 'General travel'}
                />
              </div>

              {/* Enhanced Travel Team Members */}
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h3 className="text-lg font-bold text-amber-800 mb-3">
                  Travel Team Members ({data?.data.travel_team_members.length})
                </h3>
                <div className='grid grid-cols-2 gap-4'>
                  {data?.data.travel_team_members.map(
                    ({ id, full_name, mobile_number, email, department, position, designation, location }) => (
                      <Card key={id} className='p-4 bg-white border border-amber-300 shadow-sm'>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Name</p>
                            <p className="text-base font-medium text-gray-900">{full_name || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Email</p>
                            <p className="text-base text-gray-700">{email || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Mobile Number</p>
                            <p className="text-base text-gray-700">{mobile_number || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Department</p>
                            <p className="text-base text-gray-700">{renderValue(department)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Position</p>
                            <p className="text-base text-gray-700">{renderValue(position) || renderValue(designation)}</p>
                          </div>
                          {location && (
                            <div>
                              <p className="text-sm font-semibold text-gray-600">Location</p>
                              <p className="text-base text-gray-700">{renderValue(location)}</p>
                            </div>
                          )}
                        </div>
                      </Card>
                    )
                  )}
                </div>
              </div>

              <FormProvider {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='space-y-5'
                >
                  <h3 className='mb-2 text-lg font-bold'>
                    {data?.data?.vehicle_assignments?.length ? 'Update Vehicle Assignments' : 'Assign Vehicles & Drivers'}
                  </h3>

                  {(data?.data?.vehicle_assignments?.length ?? 0) > 0 && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-sm text-blue-700 font-medium">
                        ℹ️ Existing assignments have been loaded. You can modify or add new assignments below.
                      </p>
                    </div>
                  )}

                  {fields.map((field, index) => {
                    // Find the corresponding vehicle assignment for display name
                    const currentVehicleId = form.watch(`vehicles.${index}.vehicle`);
                    const vehicleAssignment = data?.data?.vehicle_assignments?.find(
                      (assignment: any) => assignment.vehicle === currentVehicleId
                    );

                    return (
                      <div key={field.id} className='flex items-center gap-5'>
                        <div className="flex-1">
                          <FormSelect
                            name={`vehicles.${index}.vehicle`}
                            className='w-full'
                            placeholder='Select Vehicle'
                            options={vehicleOptions}
                            label={index === 0 ? "Vehicle" : ""}
                          />
                          {vehicleAssignment && (
                            <p className="text-xs text-gray-600 mt-1">
                              Current: {vehicleAssignment.vehicle_name}
                            </p>
                          )}
                        </div>

                        <div className="flex-1">
                          <FormSelect
                            name={`vehicles.${index}.driver`}
                            className='w-full'
                            placeholder='Select Driver'
                            options={driverOptions}
                            label={index === 0 ? "Driver" : ""}
                          />
                          {vehicleAssignment && (
                            <p className="text-xs text-gray-600 mt-1">
                              Current: {vehicleAssignment.driver_name}
                            </p>
                          )}
                        </div>

                        <Button
                          type='button'
                          variant='ghost'
                          onClick={() => removeVehicle(index)}
                          disabled={fields.length === 1}
                          className='mt-6'
                        >
                          <DeleteIcon />
                        </Button>
                      </div>
                    );
                  })}

                  <Button type='button' onClick={addVehicle}>
                    Add Vehicle <PlusIcon />
                  </Button>

                  <FormTextArea
                    label='Comment'
                    name='comment'
                    placeholder='Enter Comment (Optional)'
                  />

                  {/* Action Buttons Section */}
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-gray-800">Request Actions</h4>
                      <div className="px-3 py-1 rounded-full text-sm font-medium" style={{
                        backgroundColor: data?.data?.status?.toLowerCase() === 'approved' ? '#dcfce7' :
                                       data?.data?.status?.toLowerCase() === 'rejected' ? '#fee2e2' : '#fef3c7',
                        color: data?.data?.status?.toLowerCase() === 'approved' ? '#166534' :
                               data?.data?.status?.toLowerCase() === 'rejected' ? '#991b1b' : '#92400e'
                      }}>
                        Status: {data?.data?.status || 'Pending'}
                      </div>
                    </div>

                    {isRequestProcessed && (
                      <div className="mb-4 p-3 bg-gray-50 border border-gray-300 rounded">
                        <p className="text-sm text-gray-700 font-medium">
                          ℹ️ This request has already been {data?.data?.status?.toLowerCase()}. No further action can be taken.
                        </p>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <FormButton
                        size='lg'
                        className='bg-green-500 hover:bg-green-600'
                        loading={isApproving}
                        disabled={isApproving || isRejecting || isRequestProcessed}
                      >
                        {isApproving ? "Approving..." : "Approve Request"}
                      </FormButton>

                      <Button
                        type="button"
                        size='lg'
                        className='bg-red-500 hover:bg-red-600 text-white'
                        disabled={isApproving || isRejecting || isRequestProcessed}
                        onClick={onReject}
                      >
                        {isRejecting ? "Rejecting..." : "Reject Request"}
                      </Button>
                    </div>

                    {/* Reject Comment Field */}
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <label htmlFor="rejectComment" className="block text-sm font-medium text-red-800 mb-2">
                        Rejection Comment (Optional)
                      </label>
                      <textarea
                        id="rejectComment"
                        value={rejectComment}
                        onChange={(e) => setRejectComment(e.target.value)}
                        placeholder="Enter reason for rejection (optional)"
                        className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        rows={3}
                      />
                      <p className="text-xs text-red-600 mt-1">
                        This comment will be visible to the requesting staff if provided.
                      </p>
                    </div>
                  </div>
                </form>
              </FormProvider>
            </>
          )
        )}
      </Card>
    </div>
  );
}
