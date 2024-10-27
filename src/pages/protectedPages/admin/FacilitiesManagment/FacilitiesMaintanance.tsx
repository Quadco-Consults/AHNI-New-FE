import { zodResolver } from "@hookform/resolvers/zod";
import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import FormTextArea from "atoms/FormTextArea";
import { Button } from "components/ui/button";
import { Card, CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useCreateFacilityMutation } from "services/adminApi/faciityMaintenance";
import DepartmentsAPI from "services/configs/departments";
import LocationAPi from "services/configs/locationApi";
import { useFacilitiesQuery } from "services/module-programs";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  facility: z.string().min(1, "Facility is required"),
  maintenance_type: z.string().min(1, "Maintenance type is required"),
  description_of_problem: z.string().min(1, "Description is required"),
});

type FormValues = z.infer<typeof formSchema>;

const FacilitiesMaintanance = () => {
  const form = useForm<FormValues>({
    defaultValues: {
      facility: "",
      maintenance_type: "",
      description_of_problem: "",
    },
    resolver: zodResolver(formSchema),
  });

  const { data } = useFacilitiesQuery({});
  const { data: departments } = DepartmentsAPI.useGetDepartmentPaginateQuery({
    params: { no_paginate: true },
  });
  const { data: locations } = LocationAPi.useGetLocationListQuery({
    params: { no_paginate: true },
  });

  const [createFacility, { isLoading }] = useCreateFacilityMutation();

  const drivedData = useMemo(() => {
    return data?.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  }, [data]);
  const departmentData = useMemo(() => {
    return departments?.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  }, [departments]);
  const locationData = useMemo(() => {
    return locations?.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  }, [locations]);

  const onSubmit = async (data: FormValues) => {
    try {
      await createFacility(data).unwrap();
      toast.success("Facility Maintenance Ticket Created");
      form.reset();
    } catch (error) {
      toast.error("Failed to create facility maintenance ticket");
    }
  };

  return (
    <div className="flex flex-col gap-y-6">
      <BackNavigation extraText="Maintenance Ticket" />
      <Card>
        <CardContent className="py-7">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-y-6"
              action=""
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <FormInput label="Name of Staff" name="" required />
                <FormSelect
                  label="Department"
                  name="department"
                  required
                  options={departmentData}
                />
                <FormSelect
                  label="Location"
                  name="location"
                  required
                  options={locationData}
                />
                <FormInput
                  label="Date/Time"
                  type="datetime-local"
                  name=""
                  required
                />
                <FormSelect
                  label="Facility "
                  name="facility"
                  required
                  options={drivedData}
                />
                <FormInput
                  label="Maintenance Type "
                  name="maintenance_type"
                  required
                />
                <FormInput label="Rate" name="rate" required />
                <FormInput label="Cost Estimate" name="" required />
                <FormInput label="Total Cost Estimate" name="" required />
              </div>

              <div className="space-y-2 max-w-md">
                <FormSelect
                  label="Description"
                  name=""
                  required
                  options={[
                    { label: "Complaints", value: "complaints" },
                    { label: "Diagnosis", value: "diagnosis" },
                  ]}
                />
                <FormTextArea
                  placeholder="Enter description"
                  name="description"
                />
              </div>
              <FormTextArea
                label="Description of Problem"
                name="description_of_problem"
                required
              />

              <Form {...form}>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <FormTextArea
                        name=""
                        label="Justification for Disposal"
                        placeholder="This can be repaired and we donate it to CBOs"
                      />
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        <FormSelect
                          name=""
                          placeholder="Select approval"
                          options={APPROVAL_PROCESS}
                        />
                        <FormSelect
                          name=""
                          placeholder="Select name"
                          options={APPROVAL_PROCESS}
                        />
                      </div>
                      <Button variant="custom" type="button">
                        Approve
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <FormTextArea
                        name=""
                        label="GT CT Approval"
                        placeholder="This can be repaired and we donate it to CBOs"
                      />
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        <FormSelect
                          name=""
                          placeholder="Select approval"
                          options={APPROVAL_PROCESS}
                        />
                        <FormSelect
                          name=""
                          placeholder="Select name"
                          options={APPROVAL_PROCESS}
                        />
                      </div>
                      <Button variant="custom" type="button">
                        Approve
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <FormTextArea
                        name=""
                        label="CCM Approval"
                        placeholder="This can be repaired and we donate it to CBOs"
                      />
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        <FormSelect
                          name=""
                          placeholder="Select approval"
                          options={APPROVAL_PROCESS}
                        />
                        <FormSelect
                          name=""
                          placeholder="Select name"
                          options={APPROVAL_PROCESS}
                        />
                      </div>
                      <Button variant="custom" type="button">
                        Approve
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <FormTextArea name="" label="Remarks" />
                      <FormSelect
                        name=""
                        placeholder="Select approval"
                        options={APPROVAL_PROCESS}
                      />
                      <Button variant="custom" type="button">
                        Approve
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>

              <div className="flex justify-end">
                <FormButton loading={isLoading}>Raise Request</FormButton>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacilitiesMaintanance;

export const APPROVAL_PROCESS = [
  { label: "Request", value: "request" },
  { label: "Reviewer", value: "reviewer" },
  { label: "Authorizer", value: "authorizer" },
  { label: "Approver", value: "approver" },
];
