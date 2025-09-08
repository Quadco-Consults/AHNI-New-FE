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
  FacilityMaintenanceSchema,
  TFacilityMaintenanceFormValues,
} from "features/admin/types/facility-management/facility-maintenance";
import { useEffect, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useGetAllUsersQuery } from "@/features/auth/controllers";
import {
  useGetAllFacilityQuery,
  useGetAllLocationsQuery,
} from "@/features/modules/controllers";
import {
  useCreateFacilityMaintenanceMutation,
  useGetSingleFacilityMaintenanceQuery,
  useModifyFacilityMaintenanceMutation,
} from "@/features/admin/controllers";

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
  const form = useForm<TFacilityMaintenanceFormValues>({
    resolver: zodResolver(FacilityMaintenanceSchema),
    defaultValues: {
      maintenance_datetime: "",
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
    },
  });

  const router = useRouter();

  const searchParams = useSearchParams();
  const id = searchParams?.get("id");

  const { data: user } = useGetAllUsersQuery({
    page: 1,
    size: 2000000,
    search: "",
  });

  const userOptions = useMemo(
    () =>
      user?.data?.results?.map((userItem: any) => ({
        label: `${userItem.first_name} ${userItem.last_name}`,
        value: userItem.id,
      })),
    [user]
  );

  const { data: facility } = useGetAllFacilityQuery({
    page: 1,
    size: 2000000,
    search: "",
  });

  const facilityOptions = useMemo(
    () =>
      facility?.data?.results?.map((facilityItem: any) => ({
        label: facilityItem.name,
        value: facilityItem.id,
      })),
    [facility]
  );

  const { data: location } = useGetAllLocationsQuery({
    page: 1,
    size: 2000000,
    search: "",
  });

  const locationOptions = useMemo(
    () =>
      location?.data?.results?.map((locationItem: any) => ({
        label: locationItem.name,
        value: locationItem.id,
      })),
    [location]
  );

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
      toast.error(error?.data?.message ?? "Something went wrong");
    }
  };

  const { data: facilityMaintenance } = useGetSingleFacilityMaintenanceQuery(
    id || "",
    !!id
  );

  useEffect(() => {
    if (facilityMaintenance) {
      const { data } = facilityMaintenance;

      form.reset({
        maintenance_datetime: data.maintenance_datetime,
        facility: data.facility.id,
        location: data.location.id,
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
              <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                <FormInput
                  label='Date/Time'
                  name='maintenance_datetime'
                  type='date'
                  required
                />

                <FormSelect
                  label='Facility '
                  name='facility'
                  placeholder='Select Facility'
                  required
                  options={facilityOptions}
                />

                <FormSelect
                  label='Location'
                  name='location'
                  placeholder='Select Location'
                  required
                  options={locationOptions}
                />

                <FormSelect
                  label='Maintenance Type '
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
                  placeholder='Enter Total Cost Estimate'
                  required
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
                options={userOptions}
              />

              <FormSelect
                label='Authorizer'
                name='authorizer'
                placeholder='Select Authorizer'
                required
                options={userOptions}
              />

              <FormSelect
                label='Approver'
                name='approver'
                placeholder='Select Approver'
                required
                options={userOptions}
              />

              <div className='flex justify-end'>
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
