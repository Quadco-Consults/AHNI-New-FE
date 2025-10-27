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
import logoPng from "assets/imgs/logo.png";
import GoBack from "components/GoBack";
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

  // Stage management for 2-stage view
  const [currentStage, setCurrentStage] = useState(1); // 1 = Memo, 2 = Expense Breakdown

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

  if (requestsError && !reduxMemoData) {
    return (
      <div className='bg-white p-8 flex justify-center items-center min-h-screen'>
        <div className="text-red-500">
          <h3>Error loading activity memo</h3>
          <p>{(requestsError as any)?.message || 'Unknown error occurred'}</p>
          <p className="text-sm mt-2">ID: {id}</p>
          <p className="text-sm mt-2">Note: If you just created this memo, please try refreshing the page in a few seconds.</p>
        </div>
      </div>
    );
  }

  // Use API data if available, otherwise fallback to Redux data (only on client)
  const expensesData = requestsDetails?.data?.expenses || requestsDetails?.expenses || reduxMemoData?.expenses || [];

  // More robust data extraction
  const memoData = (requestsDetails?.data || requestsDetails || reduxMemoData || {}) as any;

  console.log("=== DATA LOADING DEBUG ===");
  console.log("Expenses data to display:", expensesData);
  console.log("API data structure:", requestsDetails);
  console.log("Memo data extracted:", memoData);
  console.log("API data keys:", requestsDetails ? Object.keys(requestsDetails) : 'No API data');
  console.log("Has expenses:", expensesData.length > 0);
  console.log("ID from URL:", id);
  console.log("API loading:", requestsLoading);
  console.log("API error:", requestsError);

  // @ts-ignore
  const grandTotal = expensesData.reduce(
    // @ts-ignore
    (sum, row) => sum + Number(row.total_cost),
    0
  );

  console.log({ expense: expensesData });

  return (
    <div className='bg-white p-6 max-w-7xl mx-auto print:p-0 print:max-w-full'>
      {/* Back Button */}
      <div className='mb-6 print:hidden'>
        <GoBack />
      </div>

      <section className='min-h-screen space-y-8 print:space-y-6 print:min-h-0'>
        {/* Stage Navigation */}
        <div className='flex w-full items-center justify-between gap-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 shadow-sm print:hidden'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-3'>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-semibold ${
                currentStage === 1 ? 'bg-blue-500 text-white' : 'bg-blue-200 text-blue-700'
              }`}>
                1
              </div>
              <span className={`text-base font-medium ${currentStage === 1 ? 'text-blue-700' : 'text-gray-500'}`}>
                Activity Memo
              </span>
            </div>

            <div className='w-12 h-0.5 bg-gray-300'></div>

            <div className='flex items-center gap-3'>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-semibold ${
                currentStage === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              <span className={`text-base font-medium ${currentStage === 2 ? 'text-blue-700' : 'text-gray-500'}`}>
                Expense Breakdown
              </span>
            </div>
          </div>

          <div className='flex items-center gap-4'>
            {/* Stage 2 - Create PR Button (shown only on stage 2) */}
            {currentStage === 2 && created === "true" && effectiveMemoId && effectiveMemoId !== "null" && (
              <Link
                className='w-fit'
                href={{
                  pathname: RouteEnum.CREATE_PURCHASE_REQUEST,
                  search: `?request=${effectiveMemoId}`,
                }}
              >
                <Button className='flex gap-2 bg-green-600 hover:bg-green-700 px-4 py-2'>
                  <AddSquareIcon />
                  Create Purchase Request
                </Button>
              </Link>
            )}

            {/* Stage Navigation Buttons */}
            {currentStage === 1 && (
              <Button
                onClick={() => setCurrentStage(2)}
                className='flex gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2'
              >
                Next: View Expenses →
              </Button>
            )}

            {currentStage === 2 && (
              <Button
                onClick={() => setCurrentStage(1)}
                variant="outline"
                className='flex gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 px-4 py-2'
              >
                ← Previous: View Memo
              </Button>
            )}

          </div>
        </div>

        {/* Stage 1: Internal Memo Format */}
        {currentStage === 1 && (
          <>
            {/* Memo Header */}
            <div className='bg-white border border-gray-200 rounded-lg p-12 page-break-avoid print:p-8 print:border-0'>
              {/* Logo and Title */}
              <div className='flex items-center justify-between mb-10 print:mb-6'>
                <img src={(logoPng as any).src || logoPng} alt='logo' width={140} className='print:w-32' />
                <div className='flex-1 text-center'>
                  <h2 className='text-3xl font-bold text-gray-900 border-b-2 border-black pb-2 inline-block print:text-2xl'>Internal Memo</h2>
                </div>
                <div className='w-35'></div> {/* Spacer for balance */}
              </div>

              {/* Memo Header Information */}
              <div className='space-y-5 mb-8 print:space-y-4 print:mb-6'>
                {/* To */}
                <div className='flex gap-2'>
                  <span className='font-bold min-w-[100px] text-lg print:text-base'>To:</span>
                  <div className='flex-1'>
                    {/* Display approved_by (primary recipient) */}
                    {requestsDetails?.approved_by_details?.name ? (
                      <div className='text-lg leading-relaxed print:text-base'>{requestsDetails.approved_by_details.name} (MD, AHNI)</div>
                    ) : (
                      <div className='text-lg leading-relaxed print:text-base'>Dr. Umar Adamu (MD, AHNI)</div>
                    )}

                    {/* Display any additional recipients */}
                    {requestsDetails?.copy_details?.map((user: any, index: number) => (
                      <div key={index} className='text-base text-gray-700 mt-2 print:text-sm'>
                        {user.name || `${user.first_name} ${user.last_name}`} ({user.designation || 'Staff'})
                      </div>
                    ))}
                  </div>
                </div>

                {/* Through */}
                <div className='flex gap-2'>
                  <span className='font-bold min-w-[100px] text-lg print:text-base'>Through:</span>
                  <div className='flex-1 space-y-2'>
                    {/* Display selected "through" users (Authoriser) */}
                    {requestsDetails?.through_details?.length > 0 ? (
                      requestsDetails.through_details.map((user: any, index: number) => (
                        <div key={index} className='text-lg leading-relaxed print:text-base'>
                          {user.name || `${user.first_name} ${user.last_name}`} ({user.designation || 'Staff'}, AHNI, Abuja)
                        </div>
                      ))
                    ) : (
                      <>
                        <div className='text-lg leading-relaxed print:text-base'>Charles Ibezim (Director of Finance, AHNI, Abuja)</div>
                        <div className='text-lg leading-relaxed print:text-base'>Tine Woji (Project Lead, Global Fund, Abuja)</div>
                      </>
                    )}
                  </div>
                </div>

                {/* From */}
                <div className='flex gap-2'>
                  <span className='font-bold min-w-[100px] text-lg print:text-base'>From:</span>
                  <div className='flex-1'>
                    <div className='text-lg leading-relaxed print:text-base'>
                      {requestsDetails?.created_by_details?.name ||
                       (memoData?.created_by?.first_name && memoData?.created_by?.last_name
                         ? `${memoData.created_by.first_name} ${memoData.created_by.last_name}`
                         : 'Dr Onyeka Ugwu')} (STA, CCF, AHNI)
                    </div>
                  </div>
                </div>
              </div>

              {/* Budget Information */}
              <div className='grid grid-cols-2 gap-10 mb-8 mt-8 text-base print:gap-8 print:mb-6 print:mt-6 print:text-sm'>
                <div className='space-y-2'>
                  <div><span className='font-semibold'>Budget Line #:</span> {budgetLine?.data?.name || memoData?.budget_line?.[0] || "916"}</div>
                  <div><span className='font-semibold'>Module:</span> {budgetLine?.data?.module_name || memoData?.module || "Program management"}</div>
                  <div><span className='font-semibold'>Intervention:</span> {interventionArea?.data?.name || memoData?.intervention_area || "Grant management"}</div>
                  <div><span className='font-semibold'>Cost Grouping #:</span> {costCategory?.data?.code || memoData?.cost_categories?.[0] || "11.0"}</div>
                </div>
                <div className='space-y-2'>
                  <div><span className='font-semibold'>FCO#:</span> {fcoNumber?.data?.module_code || memoData?.fconumber?.[0] || "N-THRIP"}</div>
                  <div><span className='font-semibold'>Cost Input #:</span> {costInput?.data?.name || memoData?.cost_input?.[0] || "11.1"}</div>
                  <div><span className='font-semibold'>Funding Source:</span> {memoData?.funding_source || "Global Fund"}</div>
                </div>
              </div>

              {/* Date */}
              <div className='mb-6 print:mb-4'>
                <span className='font-semibold text-lg print:text-base'>Date:</span> <span className='text-lg print:text-base ml-2'>{memoData?.requested_date || "15/07/2024"}</span>
              </div>

              {/* Subject */}
              <div className='mb-8 print:mb-6'>
                <div className='font-semibold text-lg print:text-base'>Subject: <span className='font-normal'>{memoData?.subject || "Activity Memo Request"}</span></div>
              </div>

              {/* Memo Content */}
              <div className='space-y-6 mb-10 text-justify leading-loose text-lg print:space-y-4 print:mb-8 print:leading-relaxed print:text-base'>
                {memoData?.comment ? (
                  <div dangerouslySetInnerHTML={{ __html: memoData.comment.replace(/\n/g, '<br />') }} />
                ) : (
                  <>
                    <p>
                      To ensure smooth, efficient, and uninterrupted service delivery/program implementation, this request is submitted for approval to implement operational cost items as per the attached expense breakdown.
                    </p>

                    <p>
                      This is therefore a request to approve
                      <span className='font-bold'> ₦{grandTotal?.toLocaleString() || '0'}.00</span> for the items listed in the expense breakdown.
                    </p>

                    <p>
                      Please find attached the activity budget for your review and approval.
                    </p>

                    <p className='mt-3'>
                      Thank you.
                    </p>
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {/* Stage 2: Expense Breakdown Table matching document format */}
        {currentStage === 2 && (
          <>
            {/* Complete Document Structure with borders */}
            <div className='bg-white border-2 border-black rounded-lg overflow-hidden print:border print:rounded-none'>
              {/* Logo Header */}
              <div className='border-b border-black p-6 bg-white print:p-4'>
                <img src={(logoPng as any).src || logoPng} alt='logo' width={140} className='print:w-32' />
              </div>

              {/* Activity Header */}
              <div className='border-b border-black p-4 bg-blue-200 print:p-3'>
                <div className='font-bold text-lg print:text-base'>
                  Activity: {memoData?.subject || "9.2.2 Anambra State Office Admin Cost Q3(July - September 2024)"}
                </div>
              </div>

              {/* Request Details Table */}
              <table className='w-full border-collapse text-lg print:text-base'>
                <tbody>
                  <tr className='border-b border-black'>
                    <td className='border-r border-black p-5 bg-blue-100 font-semibold w-1/4 print:p-3'>Request Date:</td>
                    <td className='p-5 print:p-3'>{memoData?.requested_date || "15/07/2024"}</td>
                  </tr>
                  <tr className='border-b border-black'>
                    <td className='border-r border-black p-5 bg-blue-100 font-semibold print:p-3'>Location:</td>
                    <td className='p-5 print:p-3'>{memoData?.location || "Anambra"}</td>
                  </tr>
                  <tr className='border-b border-black'>
                    <td className='border-r border-black p-5 bg-blue-100 font-semibold print:p-3'>Duration:</td>
                    <td className='p-5 print:p-3'>Q3 (July - September 2024)</td>
                  </tr>
                  <tr className='border-b border-black'>
                    <td className='border-r border-black p-5 bg-blue-100 font-semibold print:p-3'>FCO #:</td>
                    <td className='p-5 print:p-3'>{memoData?.fconumber?.[0] || "N-THRIP"}</td>
                  </tr>
                </tbody>
              </table>

              {/* Budget Information Grid */}
              <table className='w-full border-collapse text-base print:text-sm'>
                <tbody>
                  <tr className='border-b border-black'>
                    <td className='border-r border-black p-4 bg-blue-100 font-semibold w-1/2 print:p-3'>Module: {budgetLine?.data?.module_name || memoData?.module || "Program management"}</td>
                    <td className='p-4 bg-blue-100 font-semibold print:p-3'>Intervention: {interventionArea?.data?.name || memoData?.intervention_area || "Grant management"}</td>
                  </tr>
                  <tr className='border-b border-black'>
                    <td className='border-r border-black p-4 bg-blue-100 font-semibold print:p-3'>Budget Line #: {budgetLine?.data?.name || memoData?.budget_line?.[0] || "916"}</td>
                    <td className='p-4 bg-blue-100 font-semibold print:p-3'>Cost Grouping #: {costCategory?.data?.code || memoData?.cost_categories?.[0] || "11"}</td>
                  </tr>
                  <tr className='border-b border-black'>
                    <td className='border-r border-black p-4 bg-blue-100 font-semibold print:p-3'>Cost Input #: {costInput?.data?.name || memoData?.cost_input?.[0] || "11.1"}</td>
                    <td className='p-4 bg-blue-100 font-semibold print:p-3'>Funding Source: {memoData?.funding_source || "Global Fund"}</td>
                  </tr>
                </tbody>
              </table>

              {/* Expense Table Header */}
              <div className='bg-orange-200 border-b border-black'>
                <table className='w-full border-collapse text-base print:text-sm'>
                  <thead>
                    <tr>
                      <th className='border-r border-black p-4 font-bold text-left print:p-3' style={{width: '40%'}}>Description/Item Name</th>
                      <th className='border-r border-black p-4 font-bold text-center print:p-3' style={{width: '15%'}}>UOM</th>
                      <th className='border-r border-black p-4 font-bold text-center print:p-3' style={{width: '15%'}}>Quantity</th>
                      <th className='border-r border-black p-4 font-bold text-center print:p-3' style={{width: '15%'}}>Unit Cost</th>
                      <th className='p-4 font-bold text-center print:p-3' style={{width: '15%'}}>Total Cost</th>
                    </tr>
                  </thead>
                </table>
              </div>

              {/* Currency Header Row */}
              <div className='border-b border-black'>
                <table className='w-full border-collapse text-base print:text-sm'>
                  <tbody>
                    <tr>
                      <td className='border-r border-black p-3 print:p-2' style={{width: '40%'}}></td>
                      <td className='border-r border-black p-3 print:p-2' style={{width: '15%'}}></td>
                      <td className='border-r border-black p-3 print:p-2' style={{width: '15%'}}></td>
                      <td className='border-r border-black p-3 text-center font-bold print:p-2' style={{width: '15%'}}>₦</td>
                      <td className='p-3 text-center font-bold print:p-2' style={{width: '15%'}}>₦</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Expense Rows */}
              <table className='w-full border-collapse text-base print:text-sm'>
                <tbody>
                  {expensesData.map((row: any, index: number) => (
                    <tr key={index} className='border-b border-black'>
                      <td className='border-r border-black p-4 print:p-2' style={{width: '40%'}}>{row?.item_detail?.name || row?.item || "N/A"}</td>
                      <td className='border-r border-black p-4 text-center print:p-2' style={{width: '15%'}}>{row?.item_detail?.uom || row?.uom || "Each"}</td>
                      <td className='border-r border-black p-4 text-center print:p-2' style={{width: '15%'}}>{row.quantity || "1"}</td>
                      <td className='border-r border-black p-4 text-right print:p-2' style={{width: '15%'}}>
                        {Number(row.unit_cost || 0).toLocaleString()}
                      </td>
                      <td className='p-4 text-right print:p-2' style={{width: '15%'}}>
                        {Number(row.total_cost || 0).toLocaleString()}.00
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Overall Total Row */}
              <div className='bg-green-200 border-b border-black'>
                <table className='w-full border-collapse text-lg print:text-base'>
                  <tbody>
                    <tr>
                      <td className='p-5 text-center font-bold print:p-3' style={{width: '85%'}}>OVERALL TOTAL</td>
                      <td className='p-5 text-right font-bold print:p-3' style={{width: '15%'}}>₦ {grandTotal?.toLocaleString()}.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Signature Section */}
              <table className='w-full border-collapse text-sm'>
                <tbody>
                  <tr>
                    <td className='border-r border-black p-6 align-top' style={{width: '33.33%'}}>
                      <div className='mb-3'>
                        <span className='font-bold text-base'>Prepared by: {
                          requestsDetails?.created_by_details?.name ||
                          (memoData?.created_by?.first_name && memoData?.created_by?.last_name
                            ? `${memoData.created_by.first_name} ${memoData.created_by.last_name}`
                            : 'Request Creator')
                        }</span>
                      </div>
                      <div className='mb-3'>
                        <span className='font-bold text-base'>Sign:</span>
                        <div className='h-16 mt-3'></div>
                      </div>
                      <div>
                        <span className='font-bold text-base'>Date: {memoData?.requested_date || new Date().toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className='border-r border-black p-6 align-top' style={{width: '33.33%'}}>
                      <div className='mb-3'>
                        <span className='font-bold text-base'>Reviewed by: {
                          requestsDetails?.copy_details?.[0]?.name ||
                          (requestsDetails?.copy_details?.[0]?.first_name && requestsDetails?.copy_details?.[0]?.last_name
                            ? `${requestsDetails.copy_details[0].first_name} ${requestsDetails.copy_details[0].last_name}`
                            : 'Reviewer')
                        }</span>
                      </div>
                      <div className='mb-3'>
                        <span className='font-bold text-base'>Sign:</span>
                        <div className='h-16 mt-3'></div>
                      </div>
                      <div>
                        <span className='font-bold text-base'>Date: {new Date().toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className='p-6 align-top' style={{width: '33.33%'}}>
                      <div className='mb-3'>
                        <span className='font-bold text-base'>Approved by: {
                          requestsDetails?.approved_by_details?.name ||
                          (memoData?.approved_by?.first_name && memoData?.approved_by?.last_name
                            ? `${memoData.approved_by.first_name} ${memoData.approved_by.last_name}`
                            : 'Approver')
                        }</span>
                      </div>
                      <div className='mb-3'>
                        <span className='font-bold text-base'>Sign:</span>
                        <div className='h-16 mt-3'></div>
                      </div>
                      <div>
                        <span className='font-bold text-base'>Date: {new Date().toLocaleDateString()}</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Preview;
