"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "components/ui/table";
import { LoadingSpinner } from "components/Loading";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Icon } from "@iconify/react";
import { cn } from "lib/utils";
import { useGetManualBidPrequalificationsBySolicitation } from "@/features/procurement/controllers/manualBidCbaPrequalificationController";
import { useGetSolicitationSubmission } from "@/features/procurement/controllers/vendorBidSubmissionsController";

interface SummaryOfTechnicalPrequalificationProps {
  solicitationId?: string;
}

const SummaryOfTechnicalPrequalification = ({
  solicitationId
}: SummaryOfTechnicalPrequalificationProps) => {
  const { data: submissionData, isLoading: submissionLoading } = useGetSolicitationSubmission(solicitationId as string, !!solicitationId);
  const { data: prequalificationData, isLoading: prequalificationLoading } = useGetManualBidPrequalificationsBySolicitation(solicitationId as string, !!solicitationId);

  // State for evaluation data from localStorage
  const [evaluationData, setEvaluationData] = useState<any[]>([]);
  const [hasLocalStorageData, setHasLocalStorageData] = useState(false);

  // Load evaluation data from localStorage
  useEffect(() => {
    if (!solicitationId) return;

    const loadEvaluationData = () => {
      const storedEvaluations = JSON.parse(localStorage.getItem('vendor_evaluations') || '[]');

      // Filter evaluations for this solicitation
      const solicitationEvaluations = storedEvaluations.filter((evaluation: any) =>
        evaluation.solicitation_id === solicitationId
      );

      // Group evaluations by vendor
      const vendorEvaluations = solicitationEvaluations.reduce((acc: any, evaluation: any) => {
        const vendorId = evaluation.vendor_submission_id;
        if (!acc[vendorId]) {
          acc[vendorId] = {
            vendor_id: vendorId,
            vendor_data: evaluation.vendor_data,
            technical: null,
            financial: null,
            summary: null
          };
        }

        if (evaluation.stage === "TECHNICAL") {
          acc[vendorId].technical = evaluation;
        } else if (evaluation.stage === "FINANCIAL") {
          acc[vendorId].financial = evaluation;
        } else if (evaluation.stage === "COMPLETED") {
          acc[vendorId].summary = evaluation;
        }

        return acc;
      }, {});

      const evaluationArray = Object.values(vendorEvaluations);
      setEvaluationData(evaluationArray);
      setHasLocalStorageData(evaluationArray.length > 0);

      console.log("📊 Evaluation Tab - Loaded Data:", {
        solicitationEvaluations,
        evaluationArray,
        hasData: evaluationArray.length > 0
      });
    };

    loadEvaluationData();
  }, [solicitationId]);

  // Function to generate summary in new tab
  const generateSummaryTab = (evaluationData: any[], solicitationId: string) => {
    const summaryHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Financial Prequalification Summary - RFQ ${solicitationId}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: white; color: black; }
        .header { text-align: center; margin-bottom: 30px; }
        h1 { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        h2 { font-size: 18px; font-weight: bold; margin-bottom: 20px; }
        .summary-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .summary-table th, .summary-table td { border: 2px solid #333; padding: 12px; text-align: center; }
        .summary-table th { background-color: #f5f5f5; font-weight: bold; }
        .status-badge { padding: 6px 12px; border-radius: 6px; font-weight: bold; font-size: 12px; }
        .status-passed { background-color: #d4edda; color: #155724; }
        .status-failed { background-color: #f8d7da; color: #721c24; }
        .status-pending { background-color: #fff3cd; color: #856404; }
        .status-qualified { background-color: #d1ecf1; color: #0c5460; font-size: 14px; }
        .status-not-qualified { background-color: #f5c6cb; color: #721c24; font-size: 14px; }
        .statistics { display: flex; justify-content: space-around; margin-top: 30px; }
        .stat-box { text-align: center; padding: 20px; border: 2px solid #ddd; border-radius: 8px; min-width: 150px; }
        .stat-number { font-size: 36px; font-weight: bold; margin-bottom: 5px; }
        .stat-label { font-size: 14px; color: #666; }
        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
        @media print { body { margin: 20px; } .no-print { display: none; } }
    </style>
</head>
<body>
    <div class="header">
        <h1>STAGE 2- FINANCIAL PREQUALIFICATION SUMMARY</h1>
        <h2>OVERALL ASSESSMENT STATUS</h2>
        <p><strong>RFQ ID:</strong> ${solicitationId}</p>
        <p><strong>Date Generated:</strong> ${new Date().toLocaleDateString()}</p>
    </div>
    <table class="summary-table">
        <thead>
            <tr>
                <th>S/N</th><th>BIDDER NAME</th><th>TECHNICAL STATUS</th><th>FINANCIAL STATUS</th><th>OVERALL ASSESSMENT STATUS</th>
            </tr>
        </thead>
        <tbody>
            ${evaluationData.map((vendor: any, index: number) => {
                const technicalStatus = vendor.technical?.overall_status || "PENDING";
                const financialStatus = vendor.financial?.overall_status || "PENDING";
                const overallStatus = vendor.summary?.evaluation_summary?.overall_status ||
                                    (technicalStatus === "PASSED" && financialStatus === "PASSED" ? "FULLY_QUALIFIED" : "NOT_QUALIFIED");
                return `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${vendor.vendor_data?.company_name || "Unknown Vendor"}</td>
                        <td><span class="status-badge status-${technicalStatus.toLowerCase()}">${technicalStatus}</span></td>
                        <td><span class="status-badge status-${financialStatus.toLowerCase()}">${financialStatus}</span></td>
                        <td><span class="status-badge status-${overallStatus.toLowerCase().replace('_', '-')}">${overallStatus}</span></td>
                    </tr>
                `;
            }).join('')}
        </tbody>
    </table>
    <div class="statistics">
        <div class="stat-box" style="border-color: #28a745;">
            <div class="stat-number" style="color: #28a745;">
                ${evaluationData.filter(v => (v.summary?.evaluation_summary?.overall_status === "FULLY_QUALIFIED") || (v.technical?.overall_status === "PASSED" && v.financial?.overall_status === "PASSED")).length}
            </div>
            <div class="stat-label">Fully Qualified</div>
        </div>
        <div class="stat-box" style="border-color: #dc3545;">
            <div class="stat-number" style="color: #dc3545;">
                ${evaluationData.filter(v => (v.summary?.evaluation_summary?.overall_status === "NOT_QUALIFIED") || (v.technical?.overall_status === "FAILED" || v.financial?.overall_status === "FAILED")).length}
            </div>
            <div class="stat-label">Not Qualified</div>
        </div>
        <div class="stat-box" style="border-color: #ffc107;">
            <div class="stat-number" style="color: #ffc107;">
                ${evaluationData.filter(v => !v.technical || !v.financial).length}
            </div>
            <div class="stat-label">Pending Evaluation</div>
        </div>
    </div>
    <div class="footer">
        <p>Generated on ${new Date().toLocaleString()}</p>
        <p>RFQ Financial Prequalification Summary Report</p>
    </div>
    <script>window.onload = function() { window.print(); };</script>
</body>
</html>
    `;
    const newTab = window.open('', '_blank');
    if (newTab) {
      newTab.document.write(summaryHTML);
      newTab.document.close();
    }
  };

  if (!solicitationId) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-2">No solicitation data available</p>
        <p className="text-sm text-gray-400">
          Prequalification summary will appear here once vendors submit their bids.
        </p>
      </div>
    );
  }

  if (submissionLoading || prequalificationLoading) {
    return <LoadingSpinner />;
  }

  const vendors = submissionData?.data?.data?.results || [];
  const prequalifications = prequalificationData?.data?.results || [];

  // Helper function to check if criteria passed from localStorage evaluation data
  const didCriteriaPassFromEvaluation = (vendorId: string, criteriaIndex: number, stage: 'TECHNICAL' | 'FINANCIAL') => {
    if (!hasLocalStorageData) return false;

    const vendorEvaluation = evaluationData.find((v: any) => v.vendor_id === vendorId);
    if (!vendorEvaluation) return false;

    const stageData = stage === 'TECHNICAL' ? vendorEvaluation.technical : vendorEvaluation.financial;
    if (!stageData?.criteria_results) return false;

    // Check if specific criteria passed based on index
    return stageData.criteria_results[criteriaIndex]?.passed || false;
  };

  // Helper function to check if criteria passed from API data (fallback)
  const didCriteriaPass = (vendor: any, criteriaName: string, stage: 'TECHNICAL' | 'FINANCIAL') => {
    if (!Array.isArray(prequalifications)) return false;
    const prequalification = prequalifications.find((pq: any) => pq.vendor === vendor?.vendor?.company_name);
    return prequalification?.prequalification?.[stage]?.some(
      (item: any) => item?.criteria === criteriaName && item?.passed
    );
  };

  // Function to get vendor evaluation status
  const getVendorEvaluationStatus = (vendorId: string, stage: 'TECHNICAL' | 'FINANCIAL') => {
    if (!hasLocalStorageData) return "PENDING";

    const vendorEvaluation = evaluationData.find((v: any) => v.vendor_id === vendorId);
    if (!vendorEvaluation) return "PENDING";

    const stageData = stage === 'TECHNICAL' ? vendorEvaluation.technical : vendorEvaluation.financial;
    return stageData?.overall_status || "PENDING";
  };

  const technicalCriteria = [
    "COMPLETENESS AND CONFORMITY TO TENDER REQUIREMENT",
    "ESSENTIAL AND LEGAL REGISTRATION DOCUMENT",
    "TAX CLEARANCE",
    "GOOD FINANCIAL BUSINESS PRACTICE",
    "BANK REFERENCE",
    "ORIGINAL EQUIPMENT MANUFACTURER(OEM) AUTHORIZATION TO DEAL",
    "PREVIOUS JOB EXPERIENCE",
  ];

  const financialCriteria = [
    "FINANCIAL BID OPENING TO ASSESS CONFORMITY TO FINANCIAL QUOTATION LISTED 8",
  ];

  return (
    <>
      <div>
        <div className='p-4 w-full h-[70px] flex justify-between items-center text-xl'>
          <h3 className='w-[250px] whitespace-nowrap text-red-500 font-medium'>
            STAGE 1 - TECHNICAL PREQUALIFICATION SUMMARY
          </h3>
          <div className=' items-center justify-start ml-6'>
            <p className='font-semibold'> OVERALL ASSESSMENT STATUS</p>
          </div>
        </div>
        <div className='my-8'>
          {hasLocalStorageData ? (
            // Enhanced table with actual evaluation data
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-center font-semibold">S/N</th>
                    <th className="border border-gray-300 px-4 py-2 text-center font-semibold">BIDDER NAME</th>
                    <th className="border border-gray-300 px-4 py-2 text-center font-semibold">CRITERIA 1</th>
                    <th className="border border-gray-300 px-4 py-2 text-center font-semibold">CRITERIA 2</th>
                    <th className="border border-gray-300 px-4 py-2 text-center font-semibold">CRITERIA 3</th>
                    <th className="border border-gray-300 px-4 py-2 text-center font-semibold">CRITERIA 4</th>
                    <th className="border border-gray-300 px-4 py-2 text-center font-semibold">CRITERIA 5</th>
                    <th className="border border-gray-300 px-4 py-2 text-center font-semibold">CRITERIA 6</th>
                    <th className="border border-gray-300 px-4 py-2 text-center font-semibold">CRITERIA 7</th>
                    <th className="border border-gray-300 px-4 py-2 text-center font-semibold">OVERALL ASSESSMENT STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {evaluationData.map((vendor: any, index: number) => {
                    const technicalStatus = getVendorEvaluationStatus(vendor.vendor_id, 'TECHNICAL');

                    return (
                      <tr key={vendor.vendor_id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          {vendor.vendor_data?.company_name || "Unknown Vendor"}
                        </td>
                        {technicalCriteria.map((criteria, idx) => (
                          <td key={idx} className="border border-gray-300 px-4 py-2 text-center">
                            <input
                              type='checkbox'
                              checked={didCriteriaPassFromEvaluation(vendor.vendor_id, idx, 'TECHNICAL')}
                              readOnly
                              className='w-5 h-5 cursor-not-allowed'
                            />
                          </td>
                        ))}
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <Badge
                            className={cn(
                              "px-3 py-1 rounded-lg text-xs font-medium",
                              technicalStatus === "PASSED" && "bg-green-100 text-green-700",
                              technicalStatus === "FAILED" && "bg-red-100 text-red-700",
                              technicalStatus === "PENDING" && "bg-yellow-100 text-yellow-700"
                            )}
                          >
                            {technicalStatus}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            // Fallback to original table
            <Table>
              <TableHeader>
                <TableRow className='text-center'>
                  <TableHead className='max-w-[100px] text-center'>S/N</TableHead>
                  <TableHead className='w-[150px] text-center'>BIDDER NAME</TableHead>
                  <TableHead className='text-center'>CRITERIA 1</TableHead>
                  <TableHead className='text-center'>CRITERIA 2</TableHead>
                  <TableHead className='text-center'>CRITERIA 3</TableHead>
                  <TableHead className='text-center'>CRITERIA 4</TableHead>
                  <TableHead className='text-center'>CRITERIA 5</TableHead>
                  <TableHead className='text-center'>CRITERIA 6</TableHead>
                  <TableHead className='text-center'>CRITERIA 7</TableHead>
                  <TableHead className='text-center'>OVERALL ASSESSMENT STATUS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map((vendor: any, index: number) => {
                  const prequalification = Array.isArray(prequalifications) ?
                    prequalifications.find((pq: any) => pq.vendor === vendor?.vendor?.company_name) : null;

                  return (
                    <TableRow className='text-start' key={index}>
                      <TableCell className='max-w-[400px] text-center'>
                        {index + 1}
                      </TableCell>
                      <TableCell className='max-w-[400px]'>
                        {vendor?.vendor?.company_name}
                      </TableCell>
                      {technicalCriteria.map((criteria, idx) => (
                        <TableCell key={idx} className='text-center'>
                          <input
                            type='checkbox'
                            checked={didCriteriaPass(vendor, criteria, 'TECHNICAL')}
                            readOnly
                            className='w-5 h-5 cursor-not-allowed'
                          />
                        </TableCell>
                      ))}
                      <TableCell className='text-center'>
                        {prequalification?.overall_status ||
                          (vendor?.vendor?.status === "Approved" ? "QUALIFIED" :
                           vendor?.vendor?.status === "Fail" ? "DISQUALIFIED" : "PENDING")}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {vendors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className='text-center text-gray-500'>
                      No vendor submissions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Stage 1 Summary Statistics */}
        {hasLocalStorageData && (
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border">
              <div className="text-2xl font-bold text-green-700">
                {evaluationData.filter(v => v.technical?.overall_status === "PASSED").length}
              </div>
              <div className="text-sm text-green-600">Technical Passed</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg border">
              <div className="text-2xl font-bold text-red-700">
                {evaluationData.filter(v => v.technical?.overall_status === "FAILED").length}
              </div>
              <div className="text-sm text-red-600">Technical Failed</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg border">
              <div className="text-2xl font-bold text-yellow-700">
                {evaluationData.filter(v => !v.technical || v.technical?.overall_status === "PENDING").length}
              </div>
              <div className="text-sm text-yellow-600">Pending Technical</div>
            </div>
          </div>
        )}

        <div className='p-4 w-full h-[70px] flex justify-between items-center text-xl'>
          <h3 className='w-[250px] whitespace-nowrap text-red-500 font-medium'>
            STAGE 2- FINANCIAL PREQUALIFICATION SUMMARY
          </h3>
          <div className=' items-center justify-start ml-6'>
            <p className='font-semibold'>OVERALL ASSESSMENT STATUS</p>
          </div>
        </div>

        {/* Enhanced Financial Summary with localStorage Data */}
        {hasLocalStorageData ? (
          <div className='mt-8'>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-center font-semibold">S/N</th>
                    <th className="border border-gray-300 px-4 py-2 text-center font-semibold">BIDDER NAME</th>
                    <th className="border border-gray-300 px-4 py-2 text-center font-semibold">CRITERIA 1</th>
                    <th className="border border-gray-300 px-4 py-2 text-center font-semibold">OVERALL ASSESSMENT STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {evaluationData.map((vendor: any, index: number) => {
                    const financialStatus = getVendorEvaluationStatus(vendor.vendor_id, 'FINANCIAL');

                    return (
                      <tr key={vendor.vendor_id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          {vendor.vendor_data?.company_name || "Unknown Vendor"}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <input
                            type='checkbox'
                            checked={didCriteriaPassFromEvaluation(vendor.vendor_id, 0, 'FINANCIAL')}
                            readOnly
                            className='w-5 h-5 cursor-not-allowed'
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <Badge
                            className={cn(
                              "px-3 py-1 rounded-lg text-xs font-medium",
                              financialStatus === "PASSED" && "bg-green-100 text-green-700",
                              financialStatus === "FAILED" && "bg-red-100 text-red-700",
                              financialStatus === "PENDING" && "bg-yellow-100 text-yellow-700"
                            )}
                          >
                            {financialStatus}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Stage 2 Summary Statistics */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg border">
                <div className="text-2xl font-bold text-green-700">
                  {evaluationData.filter(v => v.financial?.overall_status === "PASSED").length}
                </div>
                <div className="text-sm text-green-600">Financial Passed</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg border">
                <div className="text-2xl font-bold text-red-700">
                  {evaluationData.filter(v => v.financial?.overall_status === "FAILED").length}
                </div>
                <div className="text-sm text-red-600">Financial Failed</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg border">
                <div className="text-2xl font-bold text-yellow-700">
                  {evaluationData.filter(v => !v.financial || v.financial?.overall_status === "PENDING").length}
                </div>
                <div className="text-sm text-yellow-600">Pending Financial</div>
              </div>
            </div>

            {/* Overall Summary Statistics */}
            <div className="mt-8">
              <h4 className="text-lg font-bold text-center mb-4">OVERALL EVALUATION SUMMARY</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg border">
                  <div className="text-2xl font-bold text-green-700">
                    {evaluationData.filter(v =>
                      (v.summary?.evaluation_summary?.overall_status === "FULLY_QUALIFIED") ||
                      (v.technical?.overall_status === "PASSED" && v.financial?.overall_status === "PASSED")
                    ).length}
                  </div>
                  <div className="text-sm text-green-600">Fully Qualified</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg border">
                  <div className="text-2xl font-bold text-red-700">
                    {evaluationData.filter(v =>
                      (v.summary?.evaluation_summary?.overall_status === "NOT_QUALIFIED") ||
                      (v.technical?.overall_status === "FAILED" || v.financial?.overall_status === "FAILED")
                    ).length}
                  </div>
                  <div className="text-sm text-red-600">Not Qualified</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg border">
                  <div className="text-2xl font-bold text-yellow-700">
                    {evaluationData.filter(v =>
                      !v.technical || !v.financial
                    ).length}
                  </div>
                  <div className="text-sm text-yellow-600">Pending Evaluation</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Fallback to original API-based table when no localStorage data
          <div className='mt-8'>
            <Table>
              <TableHeader>
                <TableRow className='text-center'>
                  <TableHead className='w-[50px] text-center'>S/N</TableHead>
                  <TableHead className='w-[150px] text-center'>BIDDER NAME</TableHead>
                  <TableHead className='text-center'>CRITERIA 1</TableHead>
                  <TableHead className='w-[200px] text-center'>
                    OVERALL ASSESSMENT STATUS
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map((vendor: any, index: number) => {
                  const prequalification = Array.isArray(prequalifications) ?
                    prequalifications.find((pq: any) => pq.vendor === vendor?.vendor?.company_name) : null;

                  return (
                    <TableRow className='text-start' key={index}>
                      <TableCell className='text-center'>{index + 1}</TableCell>
                      <TableCell className='max-w-[400px]'>
                        {vendor?.vendor?.company_name}
                      </TableCell>
                      {financialCriteria.map((criteria, idx) => (
                        <TableCell key={idx} className='text-center'>
                          <div className='max-w-[70px] ml-auto'>
                            <input
                              type='checkbox'
                              checked={didCriteriaPass(vendor, criteria, 'FINANCIAL')}
                              readOnly
                              className='w-5 h-5 cursor-not-allowed'
                            />
                          </div>
                        </TableCell>
                      ))}
                      <TableCell className='text-center'>
                        {prequalification?.overall_status ||
                          (vendor?.bid_details?.status === "PASSED" ? "QUALIFIED" :
                           vendor?.bid_details?.status === "FAIL" ? "DISQUALIFIED" : "PENDING")}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {vendors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className='text-center text-gray-500'>
                      No vendor submissions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
};

export default SummaryOfTechnicalPrequalification;