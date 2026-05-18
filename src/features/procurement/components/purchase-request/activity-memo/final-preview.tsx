"use client";

import AddSquareIcon from "@/components/icons/AddSquareIcon";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RouteEnum } from "@/constants/RouterConstants";
import { useMemo, useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/index";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import logoPng from "assets/imgs/logo.png";
import GoBack from "@/components/GoBack";
import { useGetActivityMemo } from "@/features/procurement/controllers/activityMemoController";
import { useGetAllConfigDropdown } from "@/features/modules/controllers/config/allConfigController";
import { useSearchParams } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query";

const Preview = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const request = searchParams.get("request");
  const created = searchParams.get("created");

  // Debug console.log commented to prevent render loops
  // console.log("Final preview - URL params:", { id, request, created });

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

  // Debug console.log commented to prevent render loops
  // console.log("Redux memo data for fallback:", reduxMemoData);

  // Get effective memo ID (from URL or Redux)
  const effectiveMemoId = id || reduxMemoData?.createdMemoId;
  // Debug console.log commented to prevent render loops
  // console.log("Effective memo ID:", effectiveMemoId);

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

  // Get initial memo data for hook parameters (before hook calls)
  const initialMemoData = (requestsDetails?.data || requestsDetails || reduxMemoData || {}) as any;

  // Use comprehensive config endpoint instead of individual calls
  const { data: allConfigData, isLoading: configLoading, error: configError } = useGetAllConfigDropdown();

  // Helper functions to find specific config items by ID
  const findBudgetLine = (id: string) => {
    return allConfigData?.data?.budget_lines?.find((item: any) => item.id === id);
  };

  const findCostCategory = (id: string) => {
    return allConfigData?.data?.cost_categories?.find((item: any) => item.id === id);
  };

  const findCostInput = (id: string) => {
    return allConfigData?.data?.cost_inputs?.find((item: any) => item.id === id);
  };

  const findFCONumber = (id: string) => {
    return allConfigData?.data?.fco_numbers?.find((item: any) => item.id === id);
  };

  const findInterventionArea = (id: string) => {
    return allConfigData?.data?.intervention_areas?.find((item: any) => item.id === id);
  };

  const findFundingSource = (id: string) => {
    return allConfigData?.data?.funding_sources?.find((item: any) => item.id === id);
  };

  // Get the configuration items based on the memo data
  const budgetLineId = apiData?.budget_line?.[0] || initialMemoData?.budget_line?.[0];
  const costCategoryId = apiData?.cost_categories?.[0] || initialMemoData?.cost_categories?.[0];
  const costInputId = apiData?.cost_input?.[0] || initialMemoData?.cost_input?.[0];
  const fcoNumberId = apiData?.fconumber?.[0] || initialMemoData?.fconumber?.[0];
  const interventionAreaId = apiData?.intervention_areas?.[0] || initialMemoData?.intervention_areas?.[0];

  // Handle funding source - it can be an array or a string
  const fundingSourceData = apiData?.funding_source || initialMemoData?.funding_source;
  const fundingSourceId = Array.isArray(fundingSourceData) ? fundingSourceData[0] : fundingSourceData;

  // Budget Line - use comprehensive config first, then enhance with API data for missing fields
  let budgetLine = findBudgetLine(budgetLineId);

  // If budget line found but missing module_name, try to get it from API response
  if (budgetLine && !budgetLine.module_name && (requestsDetails?.budget_line_details || apiData?.budget_line_details)) {
    const budgetLineDetails = requestsDetails?.budget_line_details || apiData?.budget_line_details;
    if (Array.isArray(budgetLineDetails) && budgetLineDetails.length > 0) {
      budgetLine = { ...budgetLine, ...budgetLineDetails[0] };
    } else if (budgetLineDetails && typeof budgetLineDetails === 'object') {
      budgetLine = { ...budgetLine, ...budgetLineDetails };
    }
  }

  // If budget line still not found, use budget_line_details directly from API
  if (!budgetLine && (requestsDetails?.budget_line_details || apiData?.budget_line_details)) {
    const budgetLineDetails = requestsDetails?.budget_line_details || apiData?.budget_line_details;
    if (Array.isArray(budgetLineDetails) && budgetLineDetails.length > 0) {
      budgetLine = budgetLineDetails[0];
    } else if (budgetLineDetails && typeof budgetLineDetails === 'object') {
      budgetLine = budgetLineDetails;
    }
  }
  const costCategory = findCostCategory(costCategoryId);
  const costInput = findCostInput(costInputId);
  // FCO Number - use comprehensive config first, then fallback to API data
  let fcoNumber = findFCONumber(fcoNumberId);

  // If not found in comprehensive config, try getting from the API response directly
  // Activity Memo uses fconumber_details (ManyToMany relationship)
  if (!fcoNumber && (requestsDetails?.fconumber_details || apiData?.fconumber_details)) {
    const fcoDetails = requestsDetails?.fconumber_details || apiData?.fconumber_details;
    if (Array.isArray(fcoDetails) && fcoDetails.length > 0) {
      fcoNumber = fcoDetails[0]; // Take first FCO number
    } else if (fcoDetails && typeof fcoDetails === 'object') {
      fcoNumber = fcoDetails;
    }
  }

  // Helper function to get FCO display value
  const getFCODisplay = () => {
    if (fcoNumber) {
      return fcoNumber.module_name || fcoNumber.name || fcoNumber.module_code || fcoNumber.code || fcoNumber.number;
    }

    // If still no FCO found, check if fconumber_details has multiple FCOs
    const fcoDetails = requestsDetails?.fconumber_details || apiData?.fconumber_details;
    if (Array.isArray(fcoDetails) && fcoDetails.length > 0) {
      return fcoDetails.map(fco => fco.module_name || fco.name || fco.module_code || fco.code || fco.number).filter(Boolean).join(', ');
    }

    return null;
  };

  // Helper function to get Module display value
  const getModuleDisplay = () => {
    // Get module details from the activity memo data (note: API returns "modules_details" with plural)
    const moduleDetails = requestsDetails?.modules_details || apiData?.modules_details || memoData?.modules_details;

    if (Array.isArray(moduleDetails) && moduleDetails.length > 0) {
      // Extract module names from the details array
      const moduleNames = moduleDetails.map(module => module.name || module.code).filter(Boolean);
      return moduleNames.length > 0 ? moduleNames.join(', ') : null;
    }

    return null;
  };
  const interventionArea = findInterventionArea(interventionAreaId);
  const fundingSource = findFundingSource(fundingSourceId);

  // Helper function for CC section (reviewers only)
  const getCCSection = () => {
    const ccList: string[] = [];

    // Check if this is Activity Memo (has array fields) or Purchase Request (has object fields)
    const isActivityMemo = Array.isArray(requestsDetails?.reviewed_by_details) || Array.isArray(requestsDetails?.data?.reviewed_by_details) || Array.isArray(requestsDetails?.copy_details);

    if (isActivityMemo) {
      // Activity Memo - Multiple reviewers (ManyToMany)
      // Check both 'reviewed_by_details' and 'copy_details' (alias) field names
      const reviewersArray = requestsDetails?.reviewed_by_details || requestsDetails?.copy_details || requestsDetails?.data?.reviewed_by_details || requestsDetails?.data?.copy_details;

      if (reviewersArray && reviewersArray.length > 0) {
        const reviewers = reviewersArray.map((user: any) => {
          const userName = user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim();
          const userPosition = user.position || 'N/A';
          return `${userName} (${userPosition})`;
        });
        ccList.push(...reviewers);
      }
    } else {
      // Purchase Request - Single reviewer (ForeignKey)
      const reviewerObject = requestsDetails?.reviewed_by_detail || requestsDetails?.data?.reviewed_by_detail;

      if (reviewerObject) {
        const reviewerName = reviewerObject.name || `${reviewerObject.first_name || ''} ${reviewerObject.last_name || ''}`.trim();
        const reviewerPosition = reviewerObject.position || 'N/A';
        ccList.push(`${reviewerName} (${reviewerPosition})`);
      }
    }

    return {
      ccList,
      hasAnyCC: ccList.length > 0
    };
  };

  // Helper function for Through section (authorizers only)
  const getThroughSection = () => {
    const throughList: string[] = [];

    // Check if this is Activity Memo (has array fields) or Purchase Request (has object fields)
    const isActivityMemo = Array.isArray(requestsDetails?.reviewed_by_details) || Array.isArray(requestsDetails?.data?.reviewed_by_details) || Array.isArray(requestsDetails?.copy_details);

    if (isActivityMemo) {
      // Activity Memo - Multiple authorizers (ManyToMany)
      // Check both 'authorised_by_details' and 'through_details' (alias) field names
      const authorizersArray = requestsDetails?.authorised_by_details || requestsDetails?.through_details || requestsDetails?.data?.authorised_by_details || requestsDetails?.data?.through_details;

      if (authorizersArray && authorizersArray.length > 0) {
        const authorizers = authorizersArray.map((user: any) => {
          const userName = user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim();
          const userPosition = user.position || 'N/A';
          return `${userName} (${userPosition})`;
        });
        throughList.push(...authorizers);
      }
    } else {
      // Purchase Request - Single authorizer (ForeignKey)
      const authorizerObject = requestsDetails?.authorised_by_detail || requestsDetails?.data?.authorised_by_detail;

      if (authorizerObject) {
        const authorizerName = authorizerObject.name || `${authorizerObject.first_name || ''} ${authorizerObject.last_name || ''}`.trim();
        const authorizerPosition = authorizerObject.position || 'N/A';
        throughList.push(`${authorizerName} (${authorizerPosition})`);
      }
    }

    const result = {
      throughList,
      isActivityMemo,
      hasAnyThrough: throughList.length > 0
    };

    return result;
  };

  // Helper function to get reviewer for signature section
  const getReviewerForSignature = () => {
    // Debug console.log commented to prevent render loops
    // console.log("🔍 REVIEWER FOR SIGNATURE DEBUG:");

    // Check if this is Activity Memo (has array fields) or Purchase Request (has object fields)
    const isActivityMemo = Array.isArray(requestsDetails?.reviewed_by_details) || Array.isArray(requestsDetails?.data?.reviewed_by_details);

    // console.log("Signature reviewer - isActivityMemo:", isActivityMemo);

    if (isActivityMemo) {
      // Activity Memo - Multiple reviewers (take first one for signature)
      const reviewersArray = requestsDetails?.reviewed_by_details || requestsDetails?.data?.reviewed_by_details;
      // console.log("Signature reviewer - reviewers array:", reviewersArray);

      if (reviewersArray && reviewersArray.length > 0) {
        const reviewer = reviewersArray[0];
        const reviewerName = reviewer.name || `${reviewer.first_name || ''} ${reviewer.last_name || ''}`.trim();
        // console.log("Signature reviewer - first reviewer object:", reviewer);
        // console.log("Signature reviewer - formatted name:", reviewerName);
        return reviewerName;
      }
    } else {
      // Purchase Request - Single reviewer
      const reviewerObject = requestsDetails?.reviewed_by_detail || requestsDetails?.data?.reviewed_by_detail;
      // console.log("Signature reviewer - reviewer object:", reviewerObject);

      if (reviewerObject) {
        const reviewerName = reviewerObject.name ||
               `${reviewerObject.first_name || ''} ${reviewerObject.last_name || ''}`.trim();
        // console.log("Signature reviewer - formatted name:", reviewerName);
        return reviewerName;
      }
    }

    // Fallback if no reviewer is found
    // console.log("Signature reviewer - using fallback");
    return 'Please select reviewer in form';
  };

  // Helper function to get duration/period display
  const getDurationDisplay = () => {
    // Check various possible duration fields
    if (memoData?.duration) return memoData.duration;
    if (memoData?.period) return memoData.period;
    if (memoData?.activity_period) return memoData.activity_period;

    // Try to construct from start/end dates
    if (memoData?.start_date && memoData?.end_date) {
      return `${memoData.start_date} to ${memoData.end_date}`;
    }

    // Fallback to requested date if available
    if (memoData?.requested_date) {
      const year = new Date(memoData.requested_date).getFullYear();
      return `Activity period for ${year}`;
    }

    // Final fallback
    return "Activity duration not specified";
  };

  /*
  // Debug logging - COMMENTED OUT TO PREVENT RENDER LOOPS
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
  */

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

  /*
  // MASSIVE DEBUG BLOCK - COMMENTED OUT TO PREVENT RENDER LOOPS
  console.log("=== DATA LOADING DEBUG ===");
  console.log("Expenses data to display:", expensesData);
  console.log("API data structure:", requestsDetails);
  console.log("Memo data extracted:", memoData);
  console.log("API data keys:", requestsDetails ? Object.keys(requestsDetails) : 'No API data');
  console.log("Has expenses:", expensesData.length > 0);
  console.log("ID from URL:", id);
  console.log("API loading:", requestsLoading);
  console.log("API error:", requestsError);
  console.log("=== COMPREHENSIVE CONFIG DEBUG ===");
  console.log("All Config Data:", allConfigData);
  console.log("Config Loading:", configLoading);
  console.log("Config Error:", configError);
  console.log("=== FOUND CONFIG ITEMS ===");
  console.log("Found Budget Line:", budgetLine);
  console.log("Budget Line module_name:", budgetLine?.module_name);
  console.log("Budget Line Details from API:", requestsDetails?.budget_line_details);
  console.log("Found Cost Category:", costCategory);
  console.log("Found Cost Input:", costInput);
  console.log("🔍 FCO DEBUGGING - Final Preview:");
  console.log("Found FCO Number object:", fcoNumber);
  console.log("FCO Number Details from Activity Memo API:", requestsDetails?.fconumber_details);
  console.log("FCO Number Details from Purchase Request API:", apiData?.fconumber_details);
  console.log("FCO Display Value:", getFCODisplay());
  console.log("FCO Number properties:", fcoNumber ? Object.keys(fcoNumber) : 'Not found');
  console.log("FCO Number ID being searched:", fcoNumberId);
  console.log("Comprehensive config FCO numbers available:", allConfigData?.data?.fco_numbers?.length || 0);

  // Enhanced FCO debugging
  if (requestsDetails?.fconumber_details) {
    console.log("Activity Memo FCO Details Structure:");
    requestsDetails.fconumber_details.forEach((fco: any, idx: number) => {
      console.log(`  FCO ${idx}:`, {
        module_id: fco.module_id,
        module_name: fco.module_name,
        module_code: fco.module_code,
        name: fco.name,
        code: fco.code,
        allProps: Object.keys(fco)
      });
    });
  }
  console.log("Found Intervention Area:", interventionArea);
  console.log("Found Funding Source:", fundingSource);
  console.log("=== THROUGH SECTION DEBUG ===");
  const throughDebug = getThroughSection();
  console.log("Through Section Analysis:", throughDebug);
  console.log("Is Activity Memo (arrays):", throughDebug.isActivityMemo);
  console.log("Has any through data:", throughDebug.hasAnyThrough);
  console.log("Through list:", throughDebug.throughList);
  console.log("=== ACTIVITY MEMO FIELDS DEBUG ===");
  console.log("reviewed_by_details (array):", requestsDetails?.reviewed_by_details);
  console.log("authorised_by_details (array):", requestsDetails?.authorised_by_details);
  console.log("=== PURCHASE REQUEST FIELDS DEBUG ===");
  console.log("reviewed_by_detail (object):", requestsDetails?.reviewed_by_detail);
  console.log("authorised_by_detail (object):", requestsDetails?.authorised_by_detail);
  console.log("=== DURATION/PERIOD DEBUG ===");
  console.log("Available fields for duration:", {
    duration: memoData?.duration,
    period: memoData?.period,
    activity_period: memoData?.activity_period,
    start_date: memoData?.start_date,
    end_date: memoData?.end_date,
    requested_date: memoData?.requested_date,
    activity_detail: memoData?.activity_detail,
  });
  console.log("Final duration display:", getDurationDisplay());
  console.log("=== SIGNATURE SECTION DEBUG ===");
  console.log("Reviewer for signature:", getReviewerForSignature());
  console.log("=== MEMO DATA IDs ===");
  console.log("Budget Line ID:", budgetLineId);
  console.log("Cost Category ID:", costCategoryId);
  console.log("Cost Input ID:", costInputId);
  console.log("FCO Number ID:", fcoNumberId);
  console.log("Intervention Area ID:", interventionAreaId);
  console.log("Funding Source Raw:", fundingSourceData);
  console.log("Funding Source ID (processed):", fundingSourceId);
  console.log("=== AVAILABLE CONFIG DATA COUNTS ===");
  console.log("Budget Lines available:", allConfigData?.data?.budget_lines?.length || 0);
  console.log("Cost Categories available:", allConfigData?.data?.cost_categories?.length || 0);
  console.log("Cost Inputs available:", allConfigData?.data?.cost_inputs?.length || 0);
  console.log("FCO Numbers available:", allConfigData?.data?.fco_numbers?.length || 0);
  console.log("Intervention Areas available:", allConfigData?.data?.intervention_areas?.length || 0);
  console.log("Funding Sources available:", allConfigData?.data?.funding_sources?.length || 0);
  */

  // @ts-ignore
  const grandTotal = expensesData.reduce(
    // @ts-ignore
    (sum, row) => sum + Number(row.total_cost),
    0
  );

  // Debug console.log commented to prevent render loops
  // console.log({ expense: expensesData });

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
                    {/* Display approved_by (primary recipient only) */}
                    {requestsDetails?.approved_by_details?.name ? (
                      <div className='text-lg leading-relaxed print:text-base'>
                        {requestsDetails.approved_by_details.name} ({requestsDetails.approved_by_details.position || 'N/A'})
                      </div>
                    ) : (
                      <div className='text-lg leading-relaxed print:text-base text-gray-500 italic'>Please select recipient in form</div>
                    )}
                  </div>
                </div>

                {/* CC (Reviewers) */}
                <div className='flex gap-2'>
                  <span className='font-bold min-w-[100px] text-lg print:text-base'>CC:</span>
                  <div className='flex-1 space-y-2'>
                    {(() => {
                      const ccSection = getCCSection();

                      if (ccSection.hasAnyCC) {
                        return ccSection.ccList.map((ccText: string, index: number) => (
                          <div key={`cc-${index}`} className='text-lg leading-relaxed print:text-base'>
                            {ccText}
                          </div>
                        ));
                      } else {
                        return (
                          <div className='text-lg leading-relaxed print:text-base text-gray-500 italic'>
                            Please select reviewers in form
                          </div>
                        );
                      }
                    })()}
                  </div>
                </div>

                {/* Through (Authorizers) */}
                <div className='flex gap-2'>
                  <span className='font-bold min-w-[100px] text-lg print:text-base'>Through:</span>
                  <div className='flex-1 space-y-2'>
                    {(() => {
                      const throughSection = getThroughSection();

                      if (throughSection.hasAnyThrough) {
                        return throughSection.throughList.map((throughText: string, index: number) => (
                          <div key={`through-${index}`} className='text-lg leading-relaxed print:text-base'>
                            {throughText}
                          </div>
                        ));
                      } else {
                        return (
                          <div className='text-lg leading-relaxed print:text-base text-gray-500 italic'>
                            Please select authorizers in form
                          </div>
                        );
                      }
                    })()}
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
                         : <span className="text-gray-500 italic">Creator information unavailable</span>)}
                      {' '}({requestsDetails?.created_by_details?.position || memoData?.created_by?.position || 'N/A'})
                    </div>
                  </div>
                </div>
              </div>

              {/* Budget Information */}
              <div className='grid grid-cols-2 gap-10 mb-8 mt-8 text-base print:gap-8 print:mb-6 print:mt-6 print:text-sm'>
                <div className='space-y-2'>
                  <div><span className='font-semibold'>Budget Line #:</span> {budgetLine?.name || <span className="text-gray-500 italic">Budget line not specified</span>}</div>
                  <div><span className='font-semibold'>Module:</span> {getModuleDisplay() || <span className="text-gray-500 italic">Module not specified</span>}</div>
                  <div><span className='font-semibold'>Intervention:</span> {interventionArea?.name || interventionArea?.description || <span className="text-gray-500 italic">Please select intervention area</span>}</div>
                  <div><span className='font-semibold'>Cost Grouping #:</span> {costCategory?.code || costCategory?.name || <span className="text-gray-500 italic">Cost category not specified</span>}</div>
                </div>
                <div className='space-y-2'>
                  <div><span className='font-semibold'>FCO#:</span> {getFCODisplay() || <span className="text-gray-500 italic">FCO number not specified</span>}</div>
                  <div><span className='font-semibold'>Cost Input #:</span> {costInput?.name || <span className="text-gray-500 italic">Cost input not specified</span>}</div>
                  <div><span className='font-semibold'>Funding Source:</span> {fundingSource?.name || <span className="text-gray-500 italic">Funding source not specified</span>}</div>
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
                    <td className='p-5 print:p-3'>{getDurationDisplay()}</td>
                  </tr>
                  <tr className='border-b border-black'>
                    <td className='border-r border-black p-5 bg-blue-100 font-semibold print:p-3'>FCO #:</td>
                    <td className='p-5 print:p-3'>{getFCODisplay() || <span className="text-gray-500 italic">FCO number not specified</span>}</td>
                  </tr>
                </tbody>
              </table>

              {/* Budget Information Grid */}
              <table className='w-full border-collapse text-base print:text-sm'>
                <tbody>
                  <tr className='border-b border-black'>
                    <td className='border-r border-black p-4 bg-blue-100 font-semibold w-1/2 print:p-3'>Module: {getModuleDisplay() || <span className="text-gray-500 italic font-normal">Module not specified</span>}</td>
                    <td className='p-4 bg-blue-100 font-semibold print:p-3'>Intervention: {interventionArea?.name || interventionArea?.description || <span className="text-gray-500 italic font-normal">Please select intervention area</span>}</td>
                  </tr>
                  <tr className='border-b border-black'>
                    <td className='border-r border-black p-4 bg-blue-100 font-semibold print:p-3'>Budget Line #: {budgetLine?.name || <span className="text-gray-500 italic font-normal">Budget line not specified</span>}</td>
                    <td className='p-4 bg-blue-100 font-semibold print:p-3'>Cost Grouping #: {costCategory?.code || costCategory?.name || <span className="text-gray-500 italic font-normal">Cost category not specified</span>}</td>
                  </tr>
                  <tr className='border-b border-black'>
                    <td className='border-r border-black p-4 bg-blue-100 font-semibold print:p-3'>Cost Input #: {costInput?.name || <span className="text-gray-500 italic font-normal">Cost input not specified</span>}</td>
                    <td className='p-4 bg-blue-100 font-semibold print:p-3'>Funding Source: {fundingSource?.name || <span className="text-gray-500 italic font-normal">Funding source not specified</span>}</td>
                  </tr>
                </tbody>
              </table>

              {/* Separate expenses by type */}
              {(() => {
                const goodsWorkExpenses = expensesData.filter((exp: any) =>
                  exp.expense_type === 'GOODS' || exp.expense_type === 'WORK' || (!exp.expense_type && !exp.is_service)
                );
                const serviceExpenses = expensesData.filter((exp: any) =>
                  exp.expense_type === 'SERVICE' || exp.is_service
                );

                const goodsWorkTotal = goodsWorkExpenses.reduce((sum: number, row: any) => sum + Number(row.total_cost || 0), 0);
                const serviceTotal = serviceExpenses.reduce((sum: number, row: any) => sum + Number(row.total_cost || 0), 0);

                return (
                  <>
                    {/* GOODS/WORK Section */}
                    {goodsWorkExpenses.length > 0 && (
                      <>
                        {/* Section Title (if mixed) */}
                        {serviceExpenses.length > 0 && (
                          <div className='bg-blue-300 border-b border-black p-3'>
                            <h3 className='font-bold text-lg'>GOODS / WORK ITEMS</h3>
                          </div>
                        )}

                        {/* GOODS/WORK Table Header */}
                        <div className='bg-orange-200 border-b border-black'>
                          <table className='w-full border-collapse text-base print:text-sm'>
                            <thead>
                              <tr>
                                <th className='border-r border-black p-4 font-bold text-left print:p-3' style={{width: '40%'}}>Description/Item Name</th>
                                <th className='border-r border-black p-4 font-bold text-center print:p-3' style={{width: '15%'}}>UOM</th>
                                <th className='border-r border-black p-4 font-bold text-center print:p-3' style={{width: '15%'}}>QTY</th>
                                <th className='border-r border-black p-4 font-bold text-center print:p-3' style={{width: '15%'}}>Unit cost</th>
                                <th className='p-4 font-bold text-center print:p-3' style={{width: '15%'}}>Total Cost</th>
                              </tr>
                            </thead>
                          </table>
                        </div>

                        {/* Currency Header */}
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

                        {/* GOODS/WORK Expense Rows */}
                        <table className='w-full border-collapse text-base print:text-sm'>
                          <tbody>
                            {goodsWorkExpenses.map((row: any, index: number) => (
                              <tr key={`goods-${index}`} className='border-b border-black'>
                                <td className='border-r border-black p-4 print:p-2' style={{width: '40%'}}>
                                  {row?.item_detail?.name || row?.item || "N/A"}
                                </td>
                                <td className='border-r border-black p-4 text-center print:p-2' style={{width: '15%'}}>
                                  {row?.item_detail?.uom || row?.uom || "Unit"}
                                </td>
                                <td className='border-r border-black p-4 text-center print:p-2' style={{width: '15%'}}>
                                  {row.quantity || "1"}
                                </td>
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

                        {/* Subtotal for GOODS/WORK (if mixed) */}
                        {serviceExpenses.length > 0 && (
                          <div className='bg-yellow-100 border-b border-black'>
                            <table className='w-full border-collapse'>
                              <tbody>
                                <tr>
                                  <td className='p-4 text-right font-semibold' style={{width: '85%'}}>GOODS/WORK SUBTOTAL</td>
                                  <td className='p-4 text-right font-semibold' style={{width: '15%'}}>₦ {goodsWorkTotal.toLocaleString()}.00</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}
                      </>
                    )}

                    {/* SERVICE Section */}
                    {serviceExpenses.length > 0 && (
                      <>
                        {/* Section Title (if mixed) */}
                        {goodsWorkExpenses.length > 0 && (
                          <div className='bg-blue-300 border-b border-black p-3 mt-6'>
                            <h3 className='font-bold text-lg'>SERVICE ITEMS (Personnel/Events)</h3>
                          </div>
                        )}

                        {/* SERVICE Table Header */}
                        <div className='bg-orange-200 border-b border-black'>
                          <table className='w-full border-collapse text-base print:text-sm'>
                            <thead>
                              <tr>
                                <th className='border-r border-black p-4 font-bold text-left print:p-3' style={{width: '30%'}}>Expense Item</th>
                                <th className='border-r border-black p-4 font-bold text-center print:p-3' style={{width: '15%'}}>Quantity/ # of Persons</th>
                                <th className='border-r border-black p-4 font-bold text-center print:p-3' style={{width: '10%'}}># of months</th>
                                <th className='border-r border-black p-4 font-bold text-center print:p-3' style={{width: '12%'}}># of Facilities</th>
                                <th className='border-r border-black p-4 font-bold text-center print:p-3' style={{width: '15%'}}>Unit cost</th>
                                <th className='p-4 font-bold text-center print:p-3' style={{width: '18%'}}>Total Cost</th>
                              </tr>
                            </thead>
                          </table>
                        </div>

                        {/* Currency Header for SERVICE */}
                        <div className='border-b border-black'>
                          <table className='w-full border-collapse text-base print:text-sm'>
                            <tbody>
                              <tr>
                                <td className='border-r border-black p-3 print:p-2' style={{width: '30%'}}></td>
                                <td className='border-r border-black p-3 print:p-2' style={{width: '15%'}}></td>
                                <td className='border-r border-black p-3 print:p-2' style={{width: '10%'}}></td>
                                <td className='border-r border-black p-3 print:p-2' style={{width: '12%'}}></td>
                                <td className='border-r border-black p-3 text-center font-bold print:p-2' style={{width: '15%'}}>₦</td>
                                <td className='p-3 text-center font-bold print:p-2' style={{width: '18%'}}>₦</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* SERVICE Expense Rows */}
                        <table className='w-full border-collapse text-base print:text-sm'>
                          <tbody>
                            {serviceExpenses.map((row: any, index: number) => (
                              <tr key={`service-${index}`} className='border-b border-black'>
                                <td className='border-r border-black p-4 print:p-2' style={{width: '30%'}}>
                                  {row?.item_detail?.name || row?.item || "N/A"}
                                </td>
                                <td className='border-r border-black p-4 text-center print:p-2' style={{width: '15%'}}>
                                  {row.quantity || "1"}
                                </td>
                                <td className='border-r border-black p-4 text-center print:p-2' style={{width: '10%'}}>
                                  {row.duration || "1"}
                                </td>
                                <td className='border-r border-black p-4 text-center print:p-2' style={{width: '12%'}}>
                                  {row.num_of_facility || "1"}
                                </td>
                                <td className='border-r border-black p-4 text-right print:p-2' style={{width: '15%'}}>
                                  {Number(row.unit_cost || 0).toLocaleString()}
                                </td>
                                <td className='p-4 text-right print:p-2' style={{width: '18%'}}>
                                  {Number(row.total_cost || 0).toLocaleString()}.00
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Subtotal for SERVICE (if mixed) */}
                        {goodsWorkExpenses.length > 0 && (
                          <div className='bg-yellow-100 border-b border-black'>
                            <table className='w-full border-collapse'>
                              <tbody>
                                <tr>
                                  <td className='p-4 text-right font-semibold' style={{width: '82%'}}>SERVICE SUBTOTAL</td>
                                  <td className='p-4 text-right font-semibold' style={{width: '18%'}}>₦ {serviceTotal.toLocaleString()}.00</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}
                      </>
                    )}
                  </>
                );
              })()}

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
                        <span className='font-bold text-base'>Reviewed by: {getReviewerForSignature()}</span>
                      </div>
                      <div className='mb-3'>
                        <span className='font-bold text-base'>Sign:</span>
                        <div className='h-16 mt-3'></div>
                      </div>
                      <div>
                        <span className='font-bold text-base'>Date: {memoData?.requested_date || new Date().toLocaleDateString()}</span>
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
                        <span className='font-bold text-base'>Date: {memoData?.requested_date || new Date().toLocaleDateString()}</span>
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
