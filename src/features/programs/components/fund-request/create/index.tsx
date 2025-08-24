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
import { useMemo } from "react";

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
      reviewer: "",
      uuid_code: "",
      authorizer: "",
      approver: "",
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
      location?.data.results.map(({ name, id }) => ({
        label: name,
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

  const { handleSubmit } = form;

  const onSubmit: SubmitHandler<TFundRequestFormValues> = async (data) => {
    localStorage.setItem("programFundRequest", JSON.stringify(data));

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
                label='Unqiue Identifier Code'
                name='uuid_code'
                required
                placeholder='Enter Unique Identifier Code'
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
