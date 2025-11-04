"use client";

import { useRouter } from "next/navigation";
import FundRequstLayout from "./create/Layout";
import DataTable from "components/Table/DataTable";
import FormButton from "@/components/FormButton";
import { Button } from "components/ui/button";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { RouteEnum } from "constants/RouterConstants";
import {
  FundRequestDisplayUtils,
  validateFundRequestData,
} from "@/features/programs/utils/fundRequestDisplayUtils";

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
import { useGetProjectDisbursementSummary } from "@/features/finance/controllers/projectFinanceController";

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

  // Fetch project disbursement summary for validation
  const { data: disbursementSummary, isLoading: isDisbursementLoading } = useGetProjectDisbursementSummary(
    programFundRequest?.project || ""
  );

  const { createFundRequest, isLoading: isCreateLoading } =
    useCreateFundRequest();

  const handleSubmit = async () => {
    try {
      console.log("Submitting fund request with data:", programFundRequest);

      // Validate data before submission - including project disbursement checks
      const validation = validateFundRequestData(
        programFundRequest,
        disbursementSummary?.data ? {
          total_disbursements: disbursementSummary.data.total_disbursements,
          remaining_budget: disbursementSummary.data.remaining_budget,
        } : undefined
      );
      if (!validation.isValid) {
        toast.error(`Validation failed: ${validation.errors.join(", ")}`);
        return;
      }

      // The createFundRequest function now handles the transformation internally
      const res = await createFundRequest(programFundRequest);

      console.log("Fund request submission response:", { res });

      if (res?.status === true || res?.data?.id) {
        toast.success("Fund request submitted successfully!");
        router.push(RouteEnum.PROGRAM_FUND_REQUEST);
        localStorage.removeItem("programFundRequest");
      } else {
        throw new Error("Unexpected response format from server");
      }
    } catch (error: any) {
      console.error("Fund request submission error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to submit fund request. Please try again.";

      toast.error(errorMessage);
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
            <p className='text-sm text-gray-500'>{(financialYear?.data as any)?.year}</p>
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
          <div className='space-y-3'>
            <h3 className='font-semibold'>New Request Amount</h3>
            <p className='text-sm text-gray-500'>
              {FundRequestDisplayUtils.formatCurrency(
                FundRequestDisplayUtils.calculateActivitiesTotal(programFundRequest?.activities || []),
                programFundRequest?.currency || 'NGN'
              )}
            </p>
          </div>
        </div>

        <hr className='pb-5' />

        {/* Project Disbursement Summary Section */}
        <div className='space-y-5 pb-5'>
          <h3 className='font-semibold text-lg'>Project Budget Overview</h3>

          {isDisbursementLoading ? (
            <div className='bg-gray-50 p-4 rounded-lg'>
              <p className='text-sm text-gray-500'>Loading project disbursement data...</p>
            </div>
          ) : disbursementSummary?.data ? (
            <div className='bg-blue-50 p-4 rounded-lg space-y-3'>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                <div>
                  <p className='text-xs font-medium text-gray-600 uppercase tracking-wide'>Current Disbursements</p>
                  <p className='text-lg font-semibold text-blue-800'>
                    {FundRequestDisplayUtils.formatCurrency(disbursementSummary.data.total_disbursements, programFundRequest?.currency || 'NGN')}
                  </p>
                </div>
                <div>
                  <p className='text-xs font-medium text-gray-600 uppercase tracking-wide'>New Request</p>
                  <p className='text-lg font-semibold text-orange-800'>
                    {FundRequestDisplayUtils.formatCurrency(
                      FundRequestDisplayUtils.calculateActivitiesTotal(programFundRequest?.activities || []),
                      programFundRequest?.currency || 'NGN'
                    )}
                  </p>
                </div>
                <div>
                  <p className='text-xs font-medium text-gray-600 uppercase tracking-wide'>Remaining Budget</p>
                  <p className='text-lg font-semibold text-green-800'>
                    {FundRequestDisplayUtils.formatCurrency(disbursementSummary.data.remaining_budget, programFundRequest?.currency || 'NGN')}
                  </p>
                </div>
                <div>
                  <p className='text-xs font-medium text-gray-600 uppercase tracking-wide'>Budget Utilization</p>
                  <p className='text-lg font-semibold text-purple-800'>
                    {disbursementSummary.data.disbursement_percentage.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Budget Status Indicator */}
              {(() => {
                const newRequestAmount = FundRequestDisplayUtils.calculateActivitiesTotal(programFundRequest?.activities || []);
                const afterRequestRemaining = disbursementSummary.data.remaining_budget - newRequestAmount;

                if (afterRequestRemaining < 0) {
                  return (
                    <div className='bg-red-100 border-l-4 border-red-500 p-3 rounded'>
                      <div className='flex items-center'>
                        <div className='text-red-700'>
                          <p className='font-medium'>⚠️ Budget Exceeded</p>
                          <p className='text-sm'>
                            This request would exceed the project budget by{' '}
                            {FundRequestDisplayUtils.formatCurrency(Math.abs(afterRequestRemaining), programFundRequest?.currency || 'NGN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                } else if (afterRequestRemaining < disbursementSummary.data.remaining_budget * 0.1) {
                  return (
                    <div className='bg-yellow-100 border-l-4 border-yellow-500 p-3 rounded'>
                      <div className='flex items-center'>
                        <div className='text-yellow-700'>
                          <p className='font-medium'>⚠️ Low Budget Remaining</p>
                          <p className='text-sm'>
                            After this request, only{' '}
                            {FundRequestDisplayUtils.formatCurrency(afterRequestRemaining, programFundRequest?.currency || 'NGN')}{' '}
                            will remain in the project budget.
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div className='bg-green-100 border-l-4 border-green-500 p-3 rounded'>
                      <div className='flex items-center'>
                        <div className='text-green-700'>
                          <p className='font-medium'>✅ Budget Available</p>
                          <p className='text-sm'>
                            After this request,{' '}
                            {FundRequestDisplayUtils.formatCurrency(afterRequestRemaining, programFundRequest?.currency || 'NGN')}{' '}
                            will remain in the project budget.
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }
              })()}
            </div>
          ) : (
            <div className='bg-yellow-50 p-4 rounded-lg'>
              <p className='text-sm text-yellow-700'>
                ⚠️ Unable to load project disbursement data. Validation will use basic available balance check.
              </p>
            </div>
          )}
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
                  {FundRequestDisplayUtils.getUserDisplayName(locationReviewer)}
                </p>
              </div>
              <div className='space-y-2'>
                <p className='text-sm font-medium text-gray-600'>Location Authorizer</p>
                <p className='text-sm text-gray-900'>
                  {FundRequestDisplayUtils.getUserDisplayName(locationAuthorizer)}
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
                  {FundRequestDisplayUtils.getUserDisplayName(stateReviewer)}
                </p>
              </div>
              <div className='space-y-2'>
                <p className='text-sm font-medium text-gray-600'>State Authorizer</p>
                <p className='text-sm text-gray-900'>
                  {FundRequestDisplayUtils.getUserDisplayName(stateAuthorizer)}
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
                  {FundRequestDisplayUtils.getUserDisplayName(hqReviewer)}
                </p>
              </div>
              <div className='space-y-2'>
                <p className='text-sm font-medium text-gray-600'>HQ Authorizer</p>
                <p className='text-sm text-gray-900'>
                  {FundRequestDisplayUtils.getUserDisplayName(hqAuthorizer)}
                </p>
              </div>
              <div className='space-y-2'>
                <p className='text-sm font-medium text-gray-600'>HQ Final Approver</p>
                <p className='text-sm text-gray-900'>
                  {FundRequestDisplayUtils.getUserDisplayName(hqApprover)}
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
        columns={columns((costCategories as any)?.data?.results || []) as any}
        isLoading={false}
      />

      {/* Grand Total Row */}
      <div className='mt-4 flex justify-end'>
        <div className='bg-gray-50 p-4 rounded-lg min-w-[300px]'>
          <div className='flex justify-between items-center'>
            <span className='font-semibold text-lg'>Total Disbursement:</span>
            <span className='font-bold text-xl text-primary'>
              {FundRequestDisplayUtils.formatCurrency(
                FundRequestDisplayUtils.calculateActivitiesTotal(programFundRequest?.activities || []),
                programFundRequest?.currency || 'NGN'
              )}
            </span>
          </div>
        </div>
      </div>

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
      accessorFn: (_, index) => `${index}`,
      size: 80,
    },

    {
      header: "Description of Activity",
      id: "description",
      accessorKey: "activity_description",
      size: 200,
      footer: "TOTAL DISBURSEMENT",
    },

    {
      header: "Amount",
      id: "amount",
      size: 200,
      cell: ({ row }) => {
        const activity = row.original;
        // Calculate amount using utility function
        const amount = FundRequestDisplayUtils.calculateActivitiesTotal([activity]);
        return FundRequestDisplayUtils.formatCurrency(amount, 'NGN');
      },
    },

    {
      header: "Unit Cost",
      id: "unit_cost",
      accessorKey: "unit_cost",
      size: 200,
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return value ? FundRequestDisplayUtils.formatCurrency(value, 'NGN') : '-';
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
        return FundRequestDisplayUtils.getCategoryName(category, costCategories);
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
