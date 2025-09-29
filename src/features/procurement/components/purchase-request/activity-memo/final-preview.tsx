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
    <div className='bg-white p-6 max-w-7xl mx-auto'>
      {/* Back Button */}
      <div className='mb-6'>
        <GoBack />
      </div>

      <section className='min-h-screen space-y-8'>
        {/* Stage Navigation */}
        <div className='flex w-full items-center justify-between gap-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 shadow-sm'>
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
            <div className='bg-white border border-gray-200 rounded-lg p-8'>
              {/* Logo and Title */}
              <div className='flex items-center justify-between mb-8'>
                <img src={(logoPng as any).src || logoPng} alt='logo' width={120} />
                <div className='flex-1 text-center'>
                  <h2 className='text-2xl font-bold text-gray-900 border-b-2 border-black pb-2 inline-block'>Internal Memo</h2>
                </div>
                <div className='w-30'></div> {/* Spacer for balance */}
              </div>

              {/* Memo Header Information */}
              <div className='space-y-3 mb-6'>
                {/* To */}
                <div className='flex'>
                  <span className='font-bold w-20 text-base'>To:</span>
                  <div className='flex-1'>
                    {/* Display approved_by (primary recipient) */}
                    {requestsDetails?.approved_by_details?.name ? (
                      <div className='text-base'>{requestsDetails.approved_by_details.name} (MD, AHNi) <span className='ml-20 text-sm text-gray-600'>{memoData?.requested_date || new Date().toLocaleDateString()}</span></div>
                    ) : (
                      <div className='text-base'>Dr. Umar Adamu (MD, AHNi) <span className='ml-20 text-sm text-gray-600'>{memoData?.requested_date || new Date().toLocaleDateString()}</span></div>
                    )}

                    {/* Display any additional recipients */}
                    {requestsDetails?.copy_details?.map((user: any, index: number) => (
                      <div key={index} className='text-sm text-gray-600 mt-1'>
                        {user.name || `${user.first_name} ${user.last_name}`} ({user.designation || 'Staff'}), {memoData?.requested_date || new Date().toLocaleDateString()}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Through */}
                <div className='flex'>
                  <span className='font-bold w-20 text-base'>Through:</span>
                  <div className='flex-1'>
                    {/* Display selected "through" users (Authoriser) */}
                    {requestsDetails?.through_details?.length > 0 ? (
                      requestsDetails.through_details.map((user: any, index: number) => (
                        <div key={index} className='text-base'>
                          {user.name || `${user.first_name} ${user.last_name}`} ({user.designation || 'Staff'}, AHNi, Abuja) <span className='ml-8 text-sm text-gray-600'>{memoData?.requested_date || new Date().toLocaleDateString()}</span>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className='text-base'>Charles Ibezim (Director of Finance, AHNi, Abuja) <span className='ml-8 text-sm text-gray-600'>{memoData?.requested_date || new Date().toLocaleDateString()}</span></div>
                        <div className='text-base'>Tine Woji (Project Lead, Global Fund, Abuja) <span className='ml-16 text-sm text-gray-600'>{memoData?.requested_date || new Date().toLocaleDateString()}</span></div>
                      </>
                    )}
                  </div>
                </div>

                {/* From */}
                <div className='flex'>
                  <span className='font-bold w-20 text-base'>From:</span>
                  <div className='flex-1'>
                    <div className='text-base'>
                      {requestsDetails?.created_by_details?.name ||
                       (memoData?.created_by?.first_name && memoData?.created_by?.last_name
                         ? `${memoData.created_by.first_name} ${memoData.created_by.last_name}`
                         : 'Dr Onyeka Ugwu')} (STA, CCF, AHNI) <span className='ml-20 text-sm text-gray-600'>{memoData?.requested_date || new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Budget Information */}
              <div className='grid grid-cols-2 gap-8 mb-6 text-sm'>
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
              <div className='mb-6'>
                <span className='font-semibold text-base'>Date:</span> <span className='text-base'>{memoData?.requested_date || "15/07/2024"}</span>
              </div>

              {/* Subject */}
              <div className='mb-6'>
                <div className='font-semibold text-base'>Subject: <span className='font-normal'>{memoData?.subject || "Activity Memo Request"}</span></div>
              </div>

              {/* Memo Content */}
              <div className='space-y-4 mb-8 text-justify leading-relaxed text-base'>
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
            <div className='bg-white border-2 border-black rounded-lg overflow-hidden'>
              {/* Logo Header */}
              <div className='border-b border-black p-4 bg-white'>
                <img src={(logoPng as any).src || logoPng} alt='logo' width={120} />
              </div>

              {/* Activity Header */}
              <div className='border-b border-black p-3 bg-blue-200'>
                <div className='font-bold text-base'>
                  Activity: {memoData?.subject || "9.2.2 Anambra State Office Admin Cost Q3(July - September 2024)"}
                </div>
              </div>

              {/* Request Details Table */}
              <table className='w-full border-collapse text-base'>
                <tbody>
                  <tr className='border-b border-black'>
                    <td className='border-r border-black p-4 bg-blue-100 font-semibold w-1/4'>Request Date:</td>
                    <td className='p-4'>{memoData?.requested_date || "15/07/2024"}</td>
                  </tr>
                  <tr className='border-b border-black'>
                    <td className='border-r border-black p-4 bg-blue-100 font-semibold'>Location:</td>
                    <td className='p-4'>{memoData?.location || "Anambra"}</td>
                  </tr>
                  <tr className='border-b border-black'>
                    <td className='border-r border-black p-4 bg-blue-100 font-semibold'>Duration:</td>
                    <td className='p-4'>Q3 (July - September 2024)</td>
                  </tr>
                  <tr className='border-b border-black'>
                    <td className='border-r border-black p-4 bg-blue-100 font-semibold'>FCO #:</td>
                    <td className='p-4'>{memoData?.fconumber?.[0] || "N-THRIP"}</td>
                  </tr>
                </tbody>
              </table>

              {/* Budget Information Grid */}
              <table className='w-full border-collapse text-base'>
                <tbody>
                  <tr className='border-b border-black'>
                    <td className='border-r border-black p-3 bg-blue-100 font-semibold w-1/2'>Module: {budgetLine?.data?.module_name || memoData?.module || "Program management"}</td>
                    <td className='p-3 bg-blue-100 font-semibold'>Intervention: {interventionArea?.data?.name || memoData?.intervention_area || "Grant management"}</td>
                  </tr>
                  <tr className='border-b border-black'>
                    <td className='border-r border-black p-3 bg-blue-100 font-semibold'>Budget Line #: {budgetLine?.data?.name || memoData?.budget_line?.[0] || "916"}</td>
                    <td className='p-3 bg-blue-100 font-semibold'>Cost Grouping #: {costCategory?.data?.code || memoData?.cost_categories?.[0] || "11"}</td>
                  </tr>
                  <tr className='border-b border-black'>
                    <td className='border-r border-black p-3 bg-blue-100 font-semibold'>Cost Input #: {costInput?.data?.name || memoData?.cost_input?.[0] || "11.1"}</td>
                    <td className='p-3 bg-blue-100 font-semibold'>Funding Source: {memoData?.funding_source || "Global Fund"}</td>
                  </tr>
                </tbody>
              </table>

              {/* Expense Table Header */}
              <div className='bg-orange-200 border-b border-black'>
                <table className='w-full border-collapse text-sm'>
                  <thead>
                    <tr>
                      <th className='border-r border-black p-3 font-bold text-left' style={{width: '40%'}}>Description/Item Name</th>
                      <th className='border-r border-black p-3 font-bold text-center' style={{width: '15%'}}>UOM</th>
                      <th className='border-r border-black p-3 font-bold text-center' style={{width: '15%'}}>Quantity</th>
                      <th className='border-r border-black p-3 font-bold text-center' style={{width: '15%'}}>Unit Cost</th>
                      <th className='p-3 font-bold text-center' style={{width: '15%'}}>Total Cost</th>
                    </tr>
                  </thead>
                </table>
              </div>

              {/* Currency Header Row */}
              <div className='border-b border-black'>
                <table className='w-full border-collapse text-sm'>
                  <tbody>
                    <tr>
                      <td className='border-r border-black p-2' style={{width: '40%'}}></td>
                      <td className='border-r border-black p-2' style={{width: '15%'}}></td>
                      <td className='border-r border-black p-2' style={{width: '15%'}}></td>
                      <td className='border-r border-black p-2 text-center font-bold' style={{width: '15%'}}>₦</td>
                      <td className='p-2 text-center font-bold' style={{width: '15%'}}>₦</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Expense Rows */}
              <table className='w-full border-collapse text-sm'>
                <tbody>
                  {expensesData.map((row: any, index: number) => (
                    <tr key={index} className='border-b border-black'>
                      <td className='border-r border-black p-3' style={{width: '40%'}}>{row?.item_detail?.name || row?.item || "N/A"}</td>
                      <td className='border-r border-black p-3 text-center' style={{width: '15%'}}>{row?.item_detail?.uom || row?.uom || "Each"}</td>
                      <td className='border-r border-black p-3 text-center' style={{width: '15%'}}>{row.quantity || "1"}</td>
                      <td className='border-r border-black p-3 text-right' style={{width: '15%'}}>
                        {Number(row.unit_cost || 0).toLocaleString()}
                      </td>
                      <td className='p-3 text-right' style={{width: '15%'}}>
                        {Number(row.total_cost || 0).toLocaleString()}.00
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Overall Total Row */}
              <div className='bg-green-200 border-b border-black'>
                <table className='w-full border-collapse text-base'>
                  <tbody>
                    <tr>
                      <td className='p-4 text-center font-bold' style={{width: '85%'}}>OVERALL TOTAL</td>
                      <td className='p-4 text-right font-bold' style={{width: '15%'}}>₦ {grandTotal?.toLocaleString()}.00</td>
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
