"use client";

import { useRouter, usePathname } from "next/navigation";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import FormSelect from "components/atoms/FormSelectField";
import FormButton from "@/components/FormButton";
import { Button } from "components/ui/button";
import Card from "components/Card";
import FundRequstLayout from "./Layout";
import {
  FundRequestSchema,
  TFundRequestFormValues,
} from "@/features/programs/types/program-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import _ from "lodash";
import { Separator } from "components/ui/separator";

import FormInput from "components/atoms/FormInput";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";
// import { useGetAllPartners } from "@/features/modules/controllers/project/partners";
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

const CreateFundRequest = () => {
  const form = useForm<TFundRequestFormValues>({
    resolver: zodResolver(FundRequestSchema),
    defaultValues: {
      project: "",
      month: "",
      year: "",
      available_balance: "",
      currency: "",
      financial_year: "",
      type: "",
      location: "",
      uuid_code: "",
      location_reviewer: "",
      location_authorizer: "",
      state_reviewer: "",
      state_authorizer: "",
      hq_reviewer: "",
      hq_authorizer: "",
      hq_approver: "",
    },
  });

  const router = useRouter();

  const pathname = usePathname();

  const goBack = () => {
    router.back();
  };

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

  const { handleSubmit, watch, setValue } = form;

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

  const onSubmit: SubmitHandler<TFundRequestFormValues> = async (data) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("programFundRequest", JSON.stringify(data));
    }

    let path = pathname || "";

    path = path.substring(0, path.lastIndexOf("/"));

    path += "/create/summary";
    router.push(path);
  };

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
                label='Location Reviewer'
                name='location_reviewer'
                required
                options={userOptions}
                placeholder='Select Location Reviewer'
              />

              <FormSelect
                label='Location Authorizer'
                name='location_authorizer'
                required
                options={userOptions}
                placeholder='Select Location Authorizer'
              />

              <FormSelect
                label='State Reviewer'
                name='state_reviewer'
                required
                options={userOptions}
                placeholder='Select State Reviewer'
              />

              <FormSelect
                label='State Authorizer'
                name='state_authorizer'
                required
                options={userOptions}
                placeholder='Select State Authorizer'
              />
            </div>

            <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
              <FormSelect
                label='HQ Reviewer'
                name='hq_reviewer'
                required
                options={userOptions}
                placeholder='Select HQ Reviewer'
              />

              <FormSelect
                label='HQ Authorizer'
                name='hq_authorizer'
                required
                options={userOptions}
                placeholder='Select HQ Authorizer'
              />

              <FormSelect
                label='HQ Approver'
                name='hq_approver'
                required
                options={userOptions}
                placeholder='Select HQ Approver'
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

          <div className='flex justify-end gap-5 mt-16'>
            <Button
              type='button'
              className='bg-[#FFF2F2] text-primary dark:text-gray-500'
              onClick={goBack}
            >
              Cancel
            </Button>
            <FormButton type='submit'>Next</FormButton>
          </div>
        </form>
      </Form>
    </FundRequstLayout>
  );
};

export default CreateFundRequest;
