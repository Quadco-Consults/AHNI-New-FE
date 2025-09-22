"use client";

import AddSquareIcon from "components/icons/AddSquareIcon";
import Card from "components/Card";
import { Button } from "components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "components/ui/table";
import { RouteEnum } from "constants/RouterConstants";
import { useMemo, useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "store/index";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import logoPng from "@/assets/svgs/logo-bg.svg";
import { useGetActivityMemo } from "@/features/procurement/controllers/activityMemoController";
import { useGetSingleBudgetLine } from "@/features/modules/controllers/finance/budgetLineController";
import { useGetSingleCostCategory } from "@/features/modules/controllers/finance/costCategoryController";
import { useGetSingleCostInput } from "@/features/modules/controllers/finance/costInputController";
import { useGetSingleActivityPlan } from "@/features/programs/controllers/activityPlanController";
import { useSearchParams } from "next/navigation";
import { useGetSingleFCONumber } from "@/features/modules/controllers/finance/fcoNumberController";
import { useGetSingleInterventionArea } from "@/features/modules/controllers/program/interventionAreaController";
import { skipToken } from "@reduxjs/toolkit/query";

const Preview = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const request = searchParams.get("request");
  const created = searchParams.get("created");

  console.log("Final preview - URL params:", { id, request, created });

  // State to handle hydration mismatch
  const [isClient, setIsClient] = useState(false);
  const [reduxMemoData, setReduxMemoData] = useState(null);

  // Get Redux data as fallback (only on client)
  const activityMemoData = useSelector((state: RootState) => state.activity.activity);

  // Handle hydration and client-side data
  useEffect(() => {
    setIsClient(true);
    if (activityMemoData.length > 0) {
      setReduxMemoData(activityMemoData[activityMemoData.length - 1]);
    }
  }, [activityMemoData]);

  console.log("Redux memo data for fallback:", reduxMemoData);

  // Get effective memo ID (from URL or Redux)
  const effectiveMemoId = id || reduxMemoData?.createdMemoId;
  console.log("Effective memo ID:", effectiveMemoId);

  // Auto-redirect to correct URL if we have Redux data but missing URL params
  useEffect(() => {
    if (!id && reduxMemoData?.createdMemoId && created !== "true") {
      console.log("Auto-redirecting with memo ID from Redux:", reduxMemoData.createdMemoId);
      router.replace(`${RouteEnum.FINAL_PREVIEW}?id=${reduxMemoData.createdMemoId}&created=true`);
    }
  }, [id, reduxMemoData?.createdMemoId, created, router]);

  const { data: requestsDetails, error: requestsError, isLoading: requestsLoading } = useGetActivityMemo(id as string, !!id);

  // Extract data from nested structure - try both direct and data property (before conditional returns)
  const apiData = requestsDetails?.data || requestsDetails;

  // Call all hooks at the top level, before any conditional returns
  const { data: budgetLine } = useGetSingleBudgetLine(
    apiData?.budget_line?.[0] ?? skipToken
  );

  const { data: costCategory } = useGetSingleCostCategory(
    apiData?.cost_categories?.[0] ?? skipToken
  );

  const { data: costInput } = useGetSingleCostInput(
    apiData?.cost_input?.[0] ?? skipToken
  );

  const { data: activityPlan } = useGetSingleActivityPlan(
    apiData?.activity ?? skipToken
  );

  const { data: fcoNumber } = useGetSingleFCONumber(
    apiData?.fconumber?.[0] ?? skipToken
  );

  const { data: interventionArea } = useGetSingleInterventionArea(
    apiData?.intervention_areas?.[0] ?? skipToken
  );

  // Debug logging
  console.log("=== FINAL PREVIEW DEBUG ===");
  console.log("URL ID:", id);
  console.log("Request param:", request);
  console.log("Created param:", created);
  console.log("API Response:", requestsDetails);
  console.log("API Error:", requestsError);
  console.log("API Loading:", requestsLoading);
  console.log("Redux memo data:", reduxMemoData);
  console.log("=== USER DETAILS DEBUG ===");
  console.log("approved_by_details:", requestsDetails?.approved_by_details);
  console.log("copy_details:", requestsDetails?.copy_details);
  console.log("through_details:", requestsDetails?.through_details);
  console.log("reviewed_by_details:", requestsDetails?.reviewed_by_details);
  console.log("created_by_details:", requestsDetails?.created_by_details);

  // Show loading or error states (after all hooks are called)
  if (requestsLoading) {
    return (
      <div className='bg-white p-8 flex justify-center items-center min-h-screen'>
        <div>Loading activity memo details...</div>
      </div>
    );
  }

  if (requestsError) {
    return (
      <div className='bg-white p-8 flex justify-center items-center min-h-screen'>
        <div className="text-red-500">
          <h3>Error loading activity memo</h3>
          <p>{(requestsError as any)?.message || 'Unknown error occurred'}</p>
          <p className="text-sm mt-2">ID: {id}</p>
        </div>
      </div>
    );
  }

  // Use API data if available, otherwise fallback to Redux data (only on client)
  const expensesData = requestsDetails?.data?.expenses || requestsDetails?.expenses || reduxMemoData?.expenses || [];
  console.log("Expenses data to display:", expensesData);
  console.log("API data structure:", requestsDetails);
  console.log("API data keys:", requestsDetails ? Object.keys(requestsDetails) : 'No API data');

  // @ts-ignore
  const grandTotal = expensesData.reduce(
    // @ts-ignore
    (sum, row) => sum + Number(row.total_cost),
    0
  );

  console.log({ expense: expensesData });

  return (
    <div className='bg-white p-8'>
      <section className='min-h-screen space-y-8'>
        <div className='flex w-full items-center justify-end gap-4'>
          {created === "true" && effectiveMemoId && effectiveMemoId !== "null" && (
            <Link
              className='w-fit'
              href={{
                pathname: RouteEnum.CREATE_PURCHASE_REQUEST,
                search: `?request=${effectiveMemoId}`,
              }}
            >
              <Button className='flex gap-2 py-6'>
                <AddSquareIcon />
                New Purchase Request
              </Button>
            </Link>
          )}
          {created === "true" && (!effectiveMemoId || effectiveMemoId === "null") && (
            <div className="text-red-500 text-sm">
              Cannot create purchase request: Missing activity memo ID
              <br />
              <small>Debug: id={id}, reduxId={reduxMemoData?.createdMemoId}, created={created}, hasReduxData={!!reduxMemoData}</small>
            </div>
          )}
          {!created || created !== "true" ? (
            <div className="text-blue-500 text-sm">
              Activity Memo Preview
              <br />
              <small>Debug: created={created}, id={id}</small>
            </div>
          ) : null}{" "}
          {created !== "true" && (
            <Link
              className='w-fit'
              href={RouteEnum.PURCHASE_REQUEST_DETAILS.replace(":id", request as string)}
            >
              <Button className='flex gap-2 py-6'>View Purchase Request</Button>
            </Link>
          )}{" "}
        </div>

        {/* Header Section */}
        <div className='flex justify-center items-center flex-col mb-8'>
          <img src={logoPng} alt='logo' width={150} />
          <h1 className='text-xl font-bold mt-4'>Internal Memo</h1>
        </div>

        {/* To/Through/From Section */}
        <div className='mb-6'>
          <div className='grid gap-4'>
            <div>
              <strong>To:</strong>
              <div className='ml-8 space-y-1'>
                {/* Display approved_by (primary recipient) */}
                {requestsDetails?.approved_by_details?.name && (
                  <div>{requestsDetails.approved_by_details.name} (MD, AHNi)</div>
                )}

                {/* Display reviewed_by (through recipients) */}
                {requestsDetails?.reviewed_by_details?.map((user: any, index: number) => (
                  <div key={index}>
                    {user.name || `${user.first_name} ${user.last_name}`}
                    {user.designation ? ` (${user.designation})` : ''}
                  </div>
                ))}

                {/* Display copy recipients if any */}
                {requestsDetails?.copy_details?.map((user: any, index: number) => (
                  <div key={index}>
                    {user.name || `${user.first_name} ${user.last_name}`}
                    {user.designation ? ` (${user.designation})` : ''}
                  </div>
                ))}

                {/* Fallback - show message if no recipients */}
                {(!requestsDetails?.approved_by_details?.name &&
                  !requestsDetails?.reviewed_by_details?.length &&
                  !requestsDetails?.copy_details?.length) && (
                  <div>No recipients found</div>
                )}
              </div>
            </div>

            <div>
              <strong>Through:</strong>
              <div className='ml-8'>
                {/* Display selected "through" users */}
                {requestsDetails?.through_details?.length > 0 ? (
                  requestsDetails.through_details.map((user: any, index: number) => (
                    <div key={index}>{user.first_name} {user.last_name} ({user.designation || 'Staff'})</div>
                  ))
                ) : requestsDetails?.reviewed_by_details?.length > 0 ? (
                  requestsDetails.reviewed_by_details.map((user: any, index: number) => (
                    <div key={index}>{user.name || `${user.first_name} ${user.last_name}`}</div>
                  ))
                ) : reduxMemoData?.through?.length > 0 ? (
                  <div>Selected users</div>
                ) : (
                  <div>N/A</div>
                )}
              </div>
            </div>

            <div>
              <strong>From:</strong>
              <div className='ml-8'>
                {requestsDetails?.created_by_details?.name ||
                 (apiData?.created_by?.first_name && apiData?.created_by?.last_name
                   ? `${apiData.created_by.first_name} ${apiData.created_by.last_name}`
                   : apiData?.created_by) ||
                 reduxMemoData?.created_by ||
                 "Staff"}
                {apiData?.requested_date && ` - ${apiData.requested_date}`}
              </div>
            </div>
          </div>
        </div>
        {/* Budget Information Section - Matching Sample Format */}
        <div className='mb-6'>
          <div className='grid grid-cols-2 gap-x-8 gap-y-2 text-sm'>
            <div><strong>Budget Line #:</strong> {budgetLine?.data?.name || "916"}</div>
            <div><strong>FCO#:</strong> {apiData?.fconumber_details?.[0]?.module_code || "N-THRIP"}</div>

            <div><strong>Module:</strong> Program management</div>
            <div><strong>Intervention:</strong> {interventionArea?.data?.code || "Grant management"}</div>

            <div><strong>Cost Grouping #:</strong> {costCategory?.data?.code || "11.0"}</div>
            <div><strong>Cost Input #:</strong> {costInput?.data?.name || "11.1"}</div>
          </div>
        </div>

        {/* Date and Subject */}
        <div className='mb-6'>
          <div className='text-sm'>
            <strong>Date:</strong> {apiData?.requested_date || reduxMemoData?.requested_date || new Date().toLocaleDateString()}
          </div>
          <div className='mt-4'>
            <strong>Subject:</strong> {apiData?.subject || reduxMemoData?.subject || "Activity Memo Request"}
          </div>
        </div>

        {/* Memo Content */}
        <div className='mb-8 text-justify leading-relaxed'>
          {apiData?.comment || reduxMemoData?.comment ||
            "To ensure smooth, efficient, and uninterrupted service delivery/program implementation, this request is submitted for approval to implement operational cost items as per the attached expense breakdown."}
        </div>
        {/* Expenses Table - Matching Sample Format */}
        <div className='mt-8'>
          <div className='border border-gray-400'>
            {/* Table Header */}
            <div className='bg-blue-100 border-b border-gray-400'>
              <div className='grid grid-cols-6 gap-0'>
                <div className='p-2 border-r border-gray-400 text-center font-semibold text-sm'>Expense Item</div>
                <div className='p-2 border-r border-gray-400 text-center font-semibold text-sm'>Quantity</div>
                <div className='p-2 border-r border-gray-400 text-center font-semibold text-sm'># of days</div>
                <div className='p-2 border-r border-gray-400 text-center font-semibold text-sm'># Frequency</div>
                <div className='p-2 border-r border-gray-400 text-center font-semibold text-sm'>Unit cost</div>
                <div className='p-2 text-center font-semibold text-sm'>Total Cost</div>
              </div>
            </div>

            {/* Table Body */}
            {expensesData.map((row, index) => (
              <div key={index} className='border-b border-gray-400 last:border-b-0'>
                <div className='grid grid-cols-6 gap-0'>
                  <div className='p-2 border-r border-gray-400 text-sm'>{row?.item_detail?.name || row?.item || "N/A"}</div>
                  <div className='p-2 border-r border-gray-400 text-center text-sm'>{row.quantity || "N/A"}</div>
                  <div className='p-2 border-r border-gray-400 text-center text-sm'>{row.num_of_days || "N/A"}</div>
                  <div className='p-2 border-r border-gray-400 text-center text-sm'>{row.frequency || "N/A"}</div>
                  <div className='p-2 border-r border-gray-400 text-right text-sm'>
                    {Number(row.unit_cost || 0).toLocaleString()}
                  </div>
                  <div className='p-2 text-right text-sm font-semibold'>
                    ₦ {Number(row.total_cost || 0).toLocaleString()}.00
                  </div>
                </div>
              </div>
            ))}

            {/* Total Row */}
            <div className='bg-green-100 border-t-2 border-gray-600'>
              <div className='grid grid-cols-6 gap-0'>
                <div className='p-2 text-center font-bold text-sm col-span-5'>
                  OVERALL TOTAL
                </div>
                <div className='p-2 text-right font-bold text-sm'>
                  ₦ {grandTotal?.toLocaleString()}.00
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Signature Section - Matching Sample Format */}
        <div className='mt-12 space-y-6'>
          <div className='grid grid-cols-3 gap-8'>
            {/* Prepared By - The person creating the request */}
            <div className='space-y-2'>
              <div className='text-sm'>
                <strong>Prepared by:</strong> {
                  requestsDetails?.created_by_details?.name ||
                  (apiData?.created_by?.first_name && apiData?.created_by?.last_name
                    ? `${apiData.created_by.first_name} ${apiData.created_by.last_name}`
                    : 'Request Creator')
                }
              </div>
              <div className='h-12 border-b border-gray-400 flex items-end'>
                <span className='text-xs text-gray-500'>Sign:</span>
              </div>
              <div className='text-sm'>
                <strong>Date:</strong> {apiData?.requested_date || new Date().toLocaleDateString()}
              </div>
            </div>

            {/* Reviewed By - The person we send through */}
            <div className='space-y-2'>
              <div className='text-sm'>
                <strong>Reviewed by:</strong> {
                  requestsDetails?.reviewed_by_details?.[0]?.name ||
                  (requestsDetails?.reviewed_by_details?.[0]?.first_name && requestsDetails?.reviewed_by_details?.[0]?.last_name
                    ? `${requestsDetails.reviewed_by_details[0].first_name} ${requestsDetails.reviewed_by_details[0].last_name}`
                    : 'Reviewer')
                }
              </div>
              <div className='h-12 border-b border-gray-400 flex items-end'>
                <span className='text-xs text-gray-500'>Sign:</span>
              </div>
              <div className='text-sm'>
                <strong>Date:</strong> {new Date().toLocaleDateString()}
              </div>
            </div>

            {/* Approved By - The person we sent to */}
            <div className='space-y-2'>
              <div className='text-sm'>
                <strong>Approved by:</strong> {
                  requestsDetails?.approved_by_details?.name ||
                  (apiData?.approved_by?.first_name && apiData?.approved_by?.last_name
                    ? `${apiData.approved_by.first_name} ${apiData.approved_by.last_name}`
                    : 'Approver')
                }
              </div>
              <div className='h-12 border-b border-gray-400 flex items-end'>
                <span className='text-xs text-gray-500'>Sign:</span>
              </div>
              <div className='text-sm'>
                <strong>Date:</strong> {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Preview;
