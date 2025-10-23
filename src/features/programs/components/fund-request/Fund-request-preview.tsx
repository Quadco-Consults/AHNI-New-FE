"use client";

import { useRouter } from "next/navigation";
import FundRequstLayout from "./create/Layout";
import DataTable from "components/Table/DataTable";
import FormButton from "@/components/FormButton";
import { Button } from "components/ui/button";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { RouteEnum } from "constants/RouterConstants";

import { ColumnDef } from "@tanstack/react-table";
import {
  TFundRequestActivity,
  TFundRequestActivityFormValues,
  TFundRequestFormValues,
} from "@/features/programs/types/program-validator";
import { useGetSingleProject } from "@/features/projects/controllers";
import {
  useGetSingleFinancialYearManager,
  useGetSingleLocationManager,
} from "@/features/modules/controllers";
import { useGetSingleUser } from "@/features/auth/controllers";
import { useCreateFundRequest } from "../../controllers";
import { useGetAllCostCategories } from "@/features/modules/controllers";

export default function Summary() {
  const router = useRouter();

  const programFundRequest: TFundRequestFormValues &
    TFundRequestActivityFormValues =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("programFundRequest") || "{}")
      : {};

  const { data: project } = useGetSingleProject(programFundRequest.project);

  const { data: financialYear } = useGetSingleFinancialYearManager(
    programFundRequest.financial_year
  );

  const { data: location } = useGetSingleLocationManager(
    programFundRequest.location
  );

  // Fetch all approvers
  const { data: locationReviewer } = useGetSingleUser(programFundRequest?.location_reviewer);
  const { data: locationAuthorizer } = useGetSingleUser(programFundRequest?.location_authorizer);
  const { data: stateReviewer } = useGetSingleUser(programFundRequest?.state_reviewer);
  const { data: stateAuthorizer } = useGetSingleUser(programFundRequest?.state_authorizer);
  const { data: hqReviewer } = useGetSingleUser(programFundRequest?.hq_reviewer);
  const { data: hqAuthorizer } = useGetSingleUser(programFundRequest?.hq_authorizer);
  const { data: hqApprover } = useGetSingleUser(programFundRequest?.hq_approver);

  const { data: costCategories } = useGetAllCostCategories({
    page: 1,
    size: 1000,
  });

  const { createFundRequest, isLoading: isCreateLoading } =
    useCreateFundRequest();

  const handleSubmit = async () => {
    try {
      const res = await createFundRequest(programFundRequest);

      console.log({ res });
      if (res?.status === "success") {
        router.push(RouteEnum.PROGRAM_FUND_REQUEST);
        localStorage.removeItem("programFundRequest");
      }

      // if (typeof window !== "undefined") {
      // }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ?? error.message ?? "Something went wrong"
      );
    }
  };

  return (
    <FundRequstLayout>
      <div className='space-y-5'>
        <div className='space-y-3'>
          <h3 className='font-semibold'>Project Name</h3>
          <p className='text-sm text-gray-500'>
            {/* {programFundRequest?.} */}
          </p>
        </div>

        <div className='grid pb-5 grid-cols-2 gap-5 md:grid-cols-3'>
          <div className='space-y-3'>
            <h3 className='font-semibold'>Project ID</h3>
            <p className='text-sm text-gray-500'>{project?.data.project_id}</p>
          </div>
          <div className='space-y-3'>
            <h3 className='font-semibold'>Month</h3>
            <p className='text-sm text-gray-500'>{programFundRequest?.month}</p>
          </div>
          <div className='space-y-3'>
            <h3 className='font-semibold'>Project Start Date</h3>
            <p className='text-sm text-gray-500'>{project?.data.start_date}</p>
          </div>
          <div className='space-y-3'>
            <h3 className='font-semibold'>Project End Date</h3>
            <p className='text-sm text-gray-500'>{project?.data.end_date}</p>
          </div>
          <div className='space-y-3'>
            <h3 className='font-semibold'>Currency</h3>
            <p className='text-sm text-gray-500'>
              {programFundRequest?.currency}
            </p>
          </div>
          <div className='space-y-3'>
            <h3 className='font-semibold'>Financial Year</h3>
            <p className='text-sm text-gray-500'>{financialYear?.data.year}</p>
          </div>
          <div className='space-y-3'>
            <h3 className='font-semibold'>Location</h3>
            <p className='text-sm text-gray-500'>{location?.data.name}</p>
          </div>
          <div className='space-y-3'>
            <h3 className='font-semibold'>Type</h3>
            <p className='text-sm text-gray-500'>{programFundRequest?.type || 'N/A'}</p>
          </div>
          <div className='space-y-3'>
            <h3 className='font-semibold'>Available Balance</h3>
            <p className='text-sm text-gray-500'>{programFundRequest?.available_balance || 'N/A'}</p>
          </div>
        </div>

        <hr className='pb-5' />

        {/* Approval Workflow Section */}
        <div className='space-y-5 pb-5'>
          <h3 className='font-semibold text-lg'>Approval Workflow</h3>

          {/* Location Level */}
          <div className='border-l-4 border-blue-500 pl-4 space-y-3'>
            <h4 className='font-semibold text-blue-700'>Location Level Approvals</h4>
            <div className='grid grid-cols-2 gap-5'>
              <div className='space-y-2'>
                <p className='text-sm font-medium text-gray-600'>Location Reviewer</p>
                <p className='text-sm text-gray-900'>
                  {locationReviewer?.data?.first_name && locationReviewer?.data?.last_name
                    ? `${locationReviewer.data.first_name} ${locationReviewer.data.last_name}`
                    : 'Not assigned'}
                </p>
              </div>
              <div className='space-y-2'>
                <p className='text-sm font-medium text-gray-600'>Location Authorizer</p>
                <p className='text-sm text-gray-900'>
                  {locationAuthorizer?.data?.first_name && locationAuthorizer?.data?.last_name
                    ? `${locationAuthorizer.data.first_name} ${locationAuthorizer.data.last_name}`
                    : 'Not assigned'}
                </p>
              </div>
            </div>
          </div>

          {/* State Level */}
          <div className='border-l-4 border-green-500 pl-4 space-y-3'>
            <h4 className='font-semibold text-green-700'>State Level Approvals</h4>
            <div className='grid grid-cols-2 gap-5'>
              <div className='space-y-2'>
                <p className='text-sm font-medium text-gray-600'>State Reviewer</p>
                <p className='text-sm text-gray-900'>
                  {stateReviewer?.data?.first_name && stateReviewer?.data?.last_name
                    ? `${stateReviewer.data.first_name} ${stateReviewer.data.last_name}`
                    : 'Not assigned'}
                </p>
              </div>
              <div className='space-y-2'>
                <p className='text-sm font-medium text-gray-600'>State Authorizer</p>
                <p className='text-sm text-gray-900'>
                  {stateAuthorizer?.data?.first_name && stateAuthorizer?.data?.last_name
                    ? `${stateAuthorizer.data.first_name} ${stateAuthorizer.data.last_name}`
                    : 'Not assigned'}
                </p>
              </div>
            </div>
          </div>

          {/* HQ Level */}
          <div className='border-l-4 border-purple-500 pl-4 space-y-3'>
            <h4 className='font-semibold text-purple-700'>Headquarters Level Approvals</h4>
            <div className='grid grid-cols-3 gap-5'>
              <div className='space-y-2'>
                <p className='text-sm font-medium text-gray-600'>HQ Reviewer</p>
                <p className='text-sm text-gray-900'>
                  {hqReviewer?.data?.first_name && hqReviewer?.data?.last_name
                    ? `${hqReviewer.data.first_name} ${hqReviewer.data.last_name}`
                    : 'Not assigned'}
                </p>
              </div>
              <div className='space-y-2'>
                <p className='text-sm font-medium text-gray-600'>HQ Authorizer</p>
                <p className='text-sm text-gray-900'>
                  {hqAuthorizer?.data?.first_name && hqAuthorizer?.data?.last_name
                    ? `${hqAuthorizer.data.first_name} ${hqAuthorizer.data.last_name}`
                    : 'Not assigned'}
                </p>
              </div>
              <div className='space-y-2'>
                <p className='text-sm font-medium text-gray-600'>HQ Final Approver</p>
                <p className='text-sm text-gray-900'>
                  {hqApprover?.data?.first_name && hqApprover?.data?.last_name
                    ? `${hqApprover.data.first_name} ${hqApprover.data.last_name}`
                    : 'Not assigned'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <hr className='pb-5' />

        <h3 className='space-y-3 py-3 font-semibold'>Activities</h3>
      </div>

      <DataTable
        data={programFundRequest?.activities || []}
        columns={columns(costCategories?.data?.results || [])}
        isLoading={false}
      />

      <div className='flex justify-end gap-5 mt-16'>
        <Button
          type='button'
          className='bg-[#FFF2F2] text-primary dark:text-gray-500'
          onClick={() => router.back()}
        >
          Back
        </Button>
        <FormButton
          onClick={handleSubmit}
          type='submit'
          suffix={<ChevronRight size={14} />}
          loading={isCreateLoading}
          disabled={isCreateLoading}
        >
          Submit Request
        </FormButton>
      </div>
    </FundRequstLayout>
  );
}

const columns = (costCategories: any[]): ColumnDef<TFundRequestActivity>[] => {
  return [
    {
      header: "S/N",
      accessorFn: (data, index) => `${index}`,
      size: 80,
    },

    {
      header: "Description of Activity",
      id: "description",
      accessorKey: "activity_description",
      size: 200,
      footer: "GRAND TOTAL",
    },

    {
      header: "Amount",
      id: "amount",
      size: 200,
      cell: ({ row }) => {
        const activity = row.original;
        // Calculate amount if not provided: unit_cost * quantity * frequency
        const amount = activity.amount ||
          (Number(activity.unit_cost || 0) *
           Number(activity.quantity || 0) *
           Number(activity.frequency || 0));
        return amount ? amount.toLocaleString() : '-';
      },
    },

    {
      header: "Unit Cost",
      id: "unit_cost",
      accessorKey: "unit_cost",
      size: 200,
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return value ? Number(value).toLocaleString() : '-';
      },
    },
    {
      header: "Frequency",
      id: "frequency",
      accessorKey: "frequency",
      size: 200,
    },
    {
      header: "Cost Category",
      accessorKey: "category",
      size: 200,
      cell: ({ row }) => {
        const category = row.original.category;
        // If category is an object, return the name
        if (typeof category === 'object' && category !== null) {
          return (category as any).name || (category as any).category_name || '-';
        }
        // If it's a string (ID), look it up in costCategories
        if (typeof category === 'string') {
          const found = costCategories.find((cat) => cat.id === category);
          return found?.name || found?.category_name || category;
        }
        return '-';
      },
    },

    {
      header: "Comments",
      id: "comments",
      accessorKey: "comment",
      size: 200,
    },
  ];
};
