"use client";

import { useRouter, usePathname, useParams } from "next/navigation";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import FormSelect from "components/atoms/FormSelectField";
import FormButton from "@/components/FormButton";
import { Button } from "components/ui/button";
import Card from "components/Card";
import FundRequstLayout from "../create/Layout";
import {
  FundRequestWithActivitiesSchema,
  TFundRequestWithActivitiesFormValues,
} from "@/features/programs/types/program-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import _ from "lodash";
import { Separator } from "components/ui/separator";

import FormInput from "components/atoms/FormInput";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";
import { useFieldArray } from "react-hook-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui/table";
import { useGetAllCostCategoriesManager } from "@/features/modules/controllers/finance/costCategoryController";
import {
  useGetAllFinancialYearsManager,
  useGetFinancialYearPaginate,
} from "@/features/modules/controllers/config/financialYearController";
import {
  useGetAllLocationsManager,
  useGetLocationList,
} from "@/features/modules/controllers/config/locationController";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { useMemo, useEffect } from "react";
import { useGetSingleFundRequest, useUpdateFundRequest } from "@/features/programs/controllers/fundRequestController";
import { toast } from "sonner";

const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const startYear = 2000;
  return new Array(currentYear - startYear + 1).fill(_).map((_, i) => {
    const value = String(currentYear - i);
    return {
      label: value,
      value: value,
    };
  });
};

const getMonthOptions = () => {
  const monthsArr = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const months = monthsArr.map((month) => ({
    label: month,
    value: month,
  }));

  return months;
};

const EditFundRequest = () => {
  const { id } = useParams();
  const fundRequestId = id as string;

  const form = useForm<TFundRequestWithActivitiesFormValues>({
    resolver: zodResolver(FundRequestWithActivitiesSchema),
    defaultValues: {
      project: "",
      month: "",
      year: "",
      available_balance: "",
      currency: "",
      financial_year: "",
      type: "",
      location: "",
      reviewer: "",
      uuid_code: "",
      authorizer: "",
      approver: "",
      activities: [],
    },
  });

  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  // Fetch existing fund request data
  const { data: fundRequestData, isLoading: isFundRequestLoading } = useGetSingleFundRequest(fundRequestId);
  const { updateFundRequest, isLoading: isUpdating, isSuccess, error } = useUpdateFundRequest(fundRequestId);

  const { data: project } = useGetAllProjects({
    page: 1,
    size: 2000000,
    search: "",
  });

  const projectOptions = useMemo(
    () =>
      project?.data.results.map(({ title, id }) => ({
        label: title,
        value: id,
      })),
    [project]
  );

  const { data: financialYear } = useGetAllFinancialYearsManager({
    page: 1,
    size: 2000000,
    search: "",
  });

  const financialYearOptions = useMemo(
    () =>
      financialYear?.data.results.map(({ year, id }) => ({
        label: year,
        value: id,
      })),
    [financialYear]
  );

  const { data: location } = useGetAllLocationsManager({
    page: 1,
    size: 2000000,
    search: "",
  });

  const locationOptions = useMemo(
    () =>
      location?.data.results.map(({ name, id, unique_code }) => ({
        label: unique_code ? `${unique_code} - ${name}` : name,
        value: id,
      })),
    [location]
  );

  const { data: user } = useGetAllUsers({ page: 1, size: 2000000, search: "" });

  const userOptions = useMemo(
    () =>
      user?.data.results.map(({ first_name, last_name, id }) => ({
        label: `${first_name} ${last_name}`,
        value: id,
      })),
    [user]
  );

  const { handleSubmit, watch, setValue, reset, control } = form;

  // Activities management
  const { fields, append, remove } = useFieldArray({
    control,
    name: "activities",
  });

  // Cost categories for activities
  const { data: costCategory } = useGetAllCostCategoriesManager({
    page: 1,
    size: 2000000,
  });

  const costCategoryOptions = costCategory?.data?.results?.map(
    ({ name, id }: any) => ({
      label: name,
      value: id,
    })
  );

  // Watch the location and project fields for changes
  const selectedLocationId = watch("location");
  const selectedProjectId = watch("project");

  // Auto-fill unique_code when location or project changes
  useEffect(() => {
    if (selectedLocationId && selectedProjectId && location?.data.results && project?.data.results) {
      const selectedLocation = location.data.results.find(
        (loc) => loc.id === selectedLocationId
      );
      const selectedProject = project.data.results.find(
        (proj) => proj.id === selectedProjectId
      );
      
      if (selectedLocation?.unique_code && selectedProject?.project_id) {
        // Project ID from database (e.g., "advgfre")
        // Location code (e.g., "-02") 
        // Final format: Project ID + Location Code = "advgfre-02"
        const compositeUniqueCode = `${selectedProject.project_id}${selectedLocation.unique_code}`;
        setValue("uuid_code", compositeUniqueCode);
      } else if (selectedLocation?.unique_code) {
        // Fallback to location code only if project_id is not available
        setValue("uuid_code", selectedLocation.unique_code);
      }
    }
  }, [selectedLocationId, selectedProjectId, location, project, setValue]);

  // Populate form with existing data
  useEffect(() => {
    if (fundRequestData?.data) {
      const data = fundRequestData.data;
      reset({
        project: data.project?.id || "",
        month: data.month || "",
        year: data.year || "",
        available_balance: data.available_balance || "",
        currency: data.currency || "",
        financial_year: data.financial_year?.id || "",
        type: data.type || "",
        location: data.location?.id || "",
        reviewer: data.reviewer || "",
        uuid_code: data.uuid_code || "",
        authorizer: data.created_by || "",
        approver: data.updated_by || "",
        activities: data.activities?.map(activity => ({
          activity_description: activity.activity_description || "",
          quantity: activity.quantity?.toString() || "",
          unit_cost: activity.unit_cost || "",
          frequency: activity.frequency?.toString() || "",
          comment: activity.comment || "",
          category: activity.category?.id || "",
        })) || [],
      });
    }
  }, [fundRequestData, reset]);

  // Handle success
  useEffect(() => {
    if (isSuccess) {
      toast.success("Fund request updated successfully!");
      router.back();
    }
  }, [isSuccess, router]);

  // Handle error with specific messaging
  useEffect(() => {
    if (error) {
      const errorMessage = error.message || "Failed to update fund request. Please try again.";
      toast.error(errorMessage);
    }
  }, [error]);

  const onSubmit: SubmitHandler<TFundRequestWithActivitiesFormValues> = async (data) => {
    await updateFundRequest(data);
  };

  if (isFundRequestLoading) {
    return (
      <FundRequstLayout>
        <Card className="p-8 text-center">
          <div>Loading fund request data...</div>
        </Card>
      </FundRequstLayout>
    );
  }

  return (
    <FundRequstLayout>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className='space-y-10 py-5'>
            <FormSelect
              name='project'
              label='Project Name'
              placeholder='Select Project'
              required
              options={projectOptions}
            />

            <div className='grid grid-cols-2 gap-3 items-center'>
              <FormSelect
                label='Month'
                name='month'
                placeholder='Select Month'
                required
                options={getMonthOptions()}
              />
              <FormSelect
                label='Year'
                name='year'
                placeholder='Select Year'
                required
                options={getYearOptions()}
              />
            </div>

            <Separator />

            <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
              <FormInput
                label='Available Balance'
                name='available_balance'
                placeholder='Enter available balance'
                required
              />

              <FormSelect
                label='Currency'
                name='currency'
                required
                options={[
                  { label: "NGN", value: "NGN" },
                  { label: "USD", value: "USD" },
                ]}
                placeholder='Select Currency'
              />
            </div>

            <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
              <FormSelect
                label='Financial Year'
                name='financial_year'
                required
                options={financialYearOptions}
                placeholder='Select Financial Year'
              />

              <FormSelect
                label='Location'
                name='location'
                required
                options={locationOptions}
                placeholder='Select Location'
              />
            </div>

            <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
              <FormInput
                label='Unique Identifier Code'
                name='uuid_code'
                required
                placeholder='Auto-filled from project + location (e.g., advgfre-02)'
                disabled
              />

              <FormSelect
                label='Reviewer'
                name='reviewer'
                required
                options={userOptions}
                placeholder='Select Reviewer'
              />

              <FormSelect
                label='Authorizer'
                name='authorizer'
                required
                options={userOptions}
                placeholder='Select Authorizer'
              />

              <FormSelect
                label='Approver'
                name='approver'
                required
                options={userOptions}
                placeholder='Select Approver'
              />
            </div>

            <FormSelect
              label='Type'
              name='type'
              required
              options={[
                { label: "Main", value: "MAIN" },
                {
                  label: "Supplementary",
                  value: "SUPPLEMENTARY",
                },
              ]}
              placeholder='Select Type'
            />
          </Card>

          <Card className='space-y-10 py-5'>
            <h3 className='font-semibold text-lg'>Activities</h3>
            <Table className='border rounded-xl'>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[300px]'>Description of Activity</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Cost</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Cost Category</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell>
                      <FormInput
                        name={`activities.${index}.activity_description`}
                        placeholder='Enter activity description'
                      />
                    </TableCell>
                    <TableCell>
                      <FormInput
                        name={`activities.${index}.quantity`}
                        placeholder='Enter quantity'
                      />
                    </TableCell>
                    <TableCell>
                      <FormInput
                        name={`activities.${index}.unit_cost`}
                        placeholder='Enter unit cost'
                      />
                    </TableCell>
                    <TableCell>
                      <FormInput
                        name={`activities.${index}.frequency`}
                        placeholder='Enter frequency'
                      />
                    </TableCell>
                    <TableCell>
                      <FormSelect
                        name={`activities.${index}.category`}
                        placeholder='Select Cost Category'
                        options={costCategoryOptions}
                      />
                    </TableCell>
                    <TableCell>
                      <FormInput
                        name={`activities.${index}.comment`}
                        placeholder='Enter comment'
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        type='button'
                        variant='destructive'
                        size='sm'
                        onClick={() => remove(index)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Button
              type='button'
              variant='outline'
              className='text-[#DEA004] w-[250px]'
              onClick={() =>
                append({
                  activity_description: "",
                  quantity: "",
                  unit_cost: "",
                  frequency: "",
                  comment: "",
                  category: "",
                })
              }
            >
              {fields.length > 0 ? "Add Another Activity" : "Add Activity"}
            </Button>
          </Card>

          <div className='flex justify-end gap-5 mt-16'>
            <Button
              type='button'
              className='bg-[#FFF2F2] text-primary dark:text-gray-500'
              onClick={goBack}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <FormButton type='submit' loading={isUpdating}>
              Update Fund Request
            </FormButton>
          </div>
        </form>
      </Form>
    </FundRequstLayout>
  );
};

export default EditFundRequest;