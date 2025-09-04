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
import { useMemo, useEffect } from "react";
import { FormProvider, useForm, useFieldArray } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  useGetSingleVehicleRequestQuery,
  useApproveVehicleRequestMutation,
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

  const { data, isLoading } = useGetSingleVehicleRequestQuery(
    id as string,
    !!id
  );

  const {
    approveVehicleRequest,
    isLoading: isApproving,
    isSuccess,
  } = useApproveVehicleRequestMutation(id as string);

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

  // Handle success
  useEffect(() => {
    if (isSuccess) {
      toast.success("Vehicle request approved successfully!");
      router.push("/dashboard/admin/fleet-management/vehicle-request");
    }
  }, [isSuccess, router]);

  return (
    <div className='space-y-4'>
      <BackNavigation extraText='View Vehicle Request' />
      <Card className='p-6 mx-auto space-y-5'>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          data && (
            <>
              <DescriptionCard
                label='Requesting Staff'
                description={`${
                  data?.data?.requesting_staff?.first_name || ""
                } ${data?.data?.requesting_staff?.last_name || ""}`}
              />

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
              </div>

              <h3 className='mb-2 text-lg font-bold text-yellow-500'>
                Travel Team Members ({data?.data.travel_team_members.length})
              </h3>
              <div className='grid grid-cols-4 gap-4 mb-6'>
                {data?.data.travel_team_members.map(
                  ({ id, full_name, mobile_number, email }) => (
                    <Card key={id} className='p-2 space-y-3 bg-amber-50'>
                      <p>
                        <span className='font-bold'>Name:&nbsp;</span>
                        {full_name}&nbsp;
                      </p>
                      <p>
                        <span className='font-bold'>Email:</span>
                        &nbsp;
                        {email || "N/A"}
                      </p>
                      <p>
                        <span className='font-bold'>Tel:&nbsp;</span>
                        {mobile_number || "N/A"}
                      </p>
                    </Card>
                  )
                )}
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

                  <FormButton
                    size='lg'
                    className='bg-green-500'
                    loading={isApproving}
                    disabled={isApproving}
                  >
                    {isApproving ? "Approving..." : "Approve Request"}
                  </FormButton>
                </form>
              </FormProvider>
            </>
          )
        )}
      </Card>
    </div>
  );
}
