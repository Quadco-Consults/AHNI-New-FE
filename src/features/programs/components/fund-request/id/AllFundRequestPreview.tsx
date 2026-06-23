"use client";

import { ColumnDef } from "@tanstack/react-table";
import logoPng from "assets/imgs/logo.png";
import BackNavigation from "@/components/BackNavigation";
import Card from "@/components/Card";
import DataTable from "@/components/Table/DataTable";
import { FundRequestPaginatedData } from "@/features/programs/types/fund-request";
import { useParams } from "next/navigation";
import { useGetAllFundRequests } from "@/features/programs/controllers/fundRequestController";
import { useGetSingleProject, useGetAllProjects } from "@/features/projects/controllers/projectController";
import { useGetSingleUser } from "@/features/auth/controllers";
import { useMemo } from "react";
import { skipToken } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Download, FileText, Printer } from "lucide-react";

import {
  Table as ShadTable,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";

export default function AllFundRequestPreview() {
  const { id } = useParams();

  // Ensure id is a string and decode it
  const projectId = Array.isArray(id) ? id[0] : String(id || '');
  const decodedId = decodeURIComponent(projectId);

  // Helper function to check if string is a valid UUID
  const isValidUUID = (str: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  const isUUID = isValidUUID(decodedId);

  // If it's a UUID, fetch project directly
  const { data: projectById } = useGetSingleProject(
    decodedId,
    isUUID
  );

  // If it's not a UUID, search projects by project_id
  const { data: projectsBySearch } = useGetAllProjects({
    page: 1,
    size: 10,
    search: decodedId,
    enabled: !isUUID && !!decodedId
  });

  // Determine which project to use
  const project = isUUID
    ? projectById
    : projectsBySearch?.data?.results?.find(p => p.project_id === decodedId);

  // Use project UUID if we have it
  const projectUUID = project?.id || (isUUID ? decodedId : null);

  const fundRequestParams = projectUUID
    ? { project: projectUUID, size: 1000, enabled: true }
    : { search: decodedId, size: 1000, enabled: !!decodedId };

  const { data: fundRequest, isLoading } = useGetAllFundRequests(fundRequestParams);

  const fundRequestLength = fundRequest?.data?.results?.length || 0;

  // Helper function to get currency symbol
  const getCurrencySymbol = (fundReq: any) => {
    return fundReq?.currency_display?.symbol || fundReq?.currency || '$';
  };

  // Get the primary currency from the first fund request
  const primaryCurrency = fundRequest?.data?.results?.[0] ?
    getCurrencySymbol(fundRequest.data.results[0]) : '$';

  const totalFundRequest = fundRequest?.data?.results
    ?.map((fundReq: any) => fundReq?.total_disbursement_amount || 0)
    ?.reduce(
      (accumulator, value) =>
        Number(accumulator || 0) + Number(value || 0),
      0
    ) || 0;

  const availableBalance = fundRequest?.data?.results
    ?.map((fundReq: any) => fundReq?.available_balance || 0)
    ?.reduce(
      (accumulator, value) =>
        Number(accumulator || 0) + Number(value || 0),
      0
    ) || 0;

  // Get the first fund request to extract approval user IDs
  const firstFundRequest = fundRequest?.data?.results?.[0];

  // Only fetch user data if we have valid IDs
  const creatorId = firstFundRequest?.created_by;
  const locationReviewerId = firstFundRequest?.location_reviewer;
  const locationAuthorizerId = firstFundRequest?.location_authorizer;
  const hqApproverId = firstFundRequest?.hq_approver;

  const { data: creatorData } = useGetSingleUser(
    creatorId && typeof creatorId === 'string' ? creatorId : skipToken
  );
  const { data: locationReviewerData } = useGetSingleUser(
    locationReviewerId && typeof locationReviewerId === 'string' ? locationReviewerId : skipToken
  );
  const { data: locationAuthorizerData } = useGetSingleUser(
    locationAuthorizerId && typeof locationAuthorizerId === 'string' ? locationAuthorizerId : skipToken
  );
  const { data: hqApproverData } = useGetSingleUser(
    hqApproverId && typeof hqApproverId === 'string' ? hqApproverId : skipToken
  );

  // Generate signature information from approval_workflow data
  const signatureInfo = useMemo(() => {
    if (!firstFundRequest?.approval_workflow) return null;

    const formatDate = (dateString?: string) => {
      if (!dateString) return 'N/A';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      } catch {
        return String(dateString);
      }
    };

    // Find specific workflow steps
    const locationReview = firstFundRequest.approval_workflow.find(step => step.step === 'location_review');
    const locationAuth = firstFundRequest.approval_workflow.find(step => step.step === 'location_authorization');
    const hqReview = firstFundRequest.approval_workflow.find(step => step.step === 'hq_review');
    const hqApproval = firstFundRequest.approval_workflow.find(step => step.step === 'hq_approval');

    return {
      preparedBy: {
        name: firstFundRequest.created_by_details?.name || 'N/A',
        position: 'Program Officer', // From API data
        date: formatDate(firstFundRequest.created_datetime)
      },
      reviewedBy: {
        name: locationReview?.approver_details?.name || firstFundRequest.location_reviewer_detail?.name || 'N/A',
        position: 'Location Reviewer',
        date: formatDate(locationReview?.date)
      },
      authorizedBy: {
        name: locationAuth?.approver_details?.name || firstFundRequest.location_authorizer_detail?.name || 'N/A',
        position: 'Location Authorizer',
        date: formatDate(locationAuth?.date)
      },
      approvedBy: {
        name: hqApproval?.approver_details?.name || firstFundRequest.hq_approver_detail?.name || 'N/A',
        position: 'HQ Approver',
        date: formatDate(hqApproval?.date)
      }
    };
  }, [firstFundRequest]);

  // Download functionality
  const handlePrint = () => {
    // Add print-friendly styles and trigger print
    const printStyles = `
      <style>
        @media print {
          body * { visibility: hidden; }
          .print-content, .print-content * { visibility: visible; }
          .print-content { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
          .page-break { page-break-before: always; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          .signature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .signature-box { border: 1px solid #ccc; padding: 15px; margin: 10px 0; }
        }
      </style>
    `;

    const head = document.head.innerHTML;
    document.head.innerHTML = head + printStyles;

    // Mark the content area for printing
    const contentElement = document.querySelector('.print-content');
    if (contentElement) {
      window.print();
    }
  };

  const handleDownloadReport = () => {
    if (!fundRequest?.data?.results || !project) return;

    const projectTitle = project.title || 'Project';
    const projectId = project.project_id || 'Unknown';
    const fileName = `fund-request-summary-${projectId.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.txt`;

    const content = `
ACHIEVING HEALTH NIGERIA INITIATIVE (AHNI)
FUND REQUEST SUMMARY

Project Title: ${projectTitle}
Project ID: ${projectId}
Project Start Date: ${project.start_date || 'N/A'}
Project End Date: ${project.end_date || 'N/A'}
Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}

=====================================
FUND REQUEST DETAILS
=====================================

${fundRequest.data.results.map((request, index) => `
${index + 1}. Location: ${typeof request.location === 'object' ? request.location?.name : request.location || 'N/A'}
   Amount: $${request.total_amount || 0}
   Unique ID: ${request.uuid_code || 'N/A'}
   Status: ${request.status || 'N/A'}
   Created: ${new Date(request.created_datetime).toLocaleDateString()}
   Month: ${request.month || 'N/A'}
   Currency: ${request.currency || 'USD'}
`).join('')}

=====================================
SUMMARY
=====================================

Total Fund Requests: ${fundRequestLength}
Total Amount Requested: $${totalFundRequest}
Balance on Hand: $${availableBalance}
Amount Due to ACE Head Office: $${totalFundRequest - availableBalance}

=====================================
APPROVAL SIGNATURES
=====================================

Prepared by: ${signatureInfo?.preparedBy?.name || 'N/A'}
Position: ${signatureInfo?.preparedBy?.position || 'N/A'}
Date: ${signatureInfo?.preparedBy?.date || 'N/A'}

Reviewed by: ${signatureInfo?.reviewedBy?.name || 'N/A'}
Position: ${signatureInfo?.reviewedBy?.position || 'N/A'}
Date: ${signatureInfo?.reviewedBy?.date || 'N/A'}

Authorized by: ${signatureInfo?.authorizedBy?.name || 'N/A'}
Position: ${signatureInfo?.authorizedBy?.position || 'N/A'}
Date: ${signatureInfo?.authorizedBy?.date || 'N/A'}

Approved by: ${signatureInfo?.approvedBy?.name || 'N/A'}
Position: ${signatureInfo?.approvedBy?.position || 'N/A'}
Date: ${signatureInfo?.approvedBy?.date || 'N/A'}

=====================================
Report generated by AHNI Fund Request System
${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = () => {
    if (!fundRequest?.data?.results || !project) return;

    const projectTitle = project.title || 'Project';

    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Fund Request Summary - ${projectTitle}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #000; }
          .header { text-align: center; margin-bottom: 30px; }
          .header h1 { color: #000; margin: 10px 0; font-size: 20px; }
          .header h2 { color: #dc2626; margin: 5px 0; font-size: 16px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; border: 2px solid #DEA004; padding: 20px; }
          .info-item h3 { font-weight: bold; margin-bottom: 8px; font-size: 14px; }
          .info-item p { color: #666; margin: 0; font-size: 12px; }
          .info-item .highlight { color: #DEA004; font-weight: bold; }
          .table-container { margin: 20px 0; }
          .fund-table { width: 100%; border-collapse: collapse; font-size: 12px; }
          .fund-table th, .fund-table td { border: 1px solid #000; padding: 8px; text-align: left; }
          .fund-table th { background-color: #f5f5f5; font-weight: bold; }
          .summary-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 12px; }
          .summary-table td { border: 1px solid #000; padding: 8px; }
          .summary-table .total-row { font-weight: bold; }
          .signature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 30px 0; }
          .signature-box { border: 1px solid #ccc; padding: 15px; font-size: 12px; }
          .signature-line { border-bottom: 1px solid #000; height: 30px; margin: 10px 0; }
          .signature-info { display: flex; justify-content: space-between; margin: 5px 0; }
          .footer { text-align: center; margin-top: 50px; font-size: 10px; color: #666; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Achieving Health Nigeria Initiative (AHNI)</h1>
          <p style="font-size: 11px; margin: 5px 0; color: #666;">No. 30 Anthony Enahoro Street, Utako District, Abuja, Nigeria</p>
          <p style="font-size: 10px; margin: 5px 0; color: #666;">Tel: +234-09-4615555 / +234-09-461500 | Fax: +234-09-4615511 | Email: info@ahnigeria.org.ng</p>
          <h2>APPROVAL</h2>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <h3>Award/Project Title:</h3>
            <p class="highlight">${projectTitle}</p>
          </div>
          <div class="info-item">
            <h3>Project ID:</h3>
            <p>${project.project_id || 'N/A'}</p>
          </div>
          <div class="info-item">
            <h3>Project Start Date:</h3>
            <p>${project.start_date || 'N/A'}</p>
          </div>
          <div class="info-item">
            <h3>Project End Date:</h3>
            <p>${project.end_date || 'N/A'}</p>
          </div>
        </div>

        <div class="table-container">
          <table class="fund-table">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Location</th>
                <th>Fund Request For This Period</th>
                <th>Unique Identifier Code</th>
              </tr>
            </thead>
            <tbody>
              ${fundRequest.data.results.map((request, index) => `
                <tr>
                  <td>${(index + 1).toFixed(2)}</td>
                  <td>${typeof request.location === 'object' ? request.location?.name : request.location || 'N/A'}</td>
                  <td>$${request.total_amount || 0}</td>
                  <td>${request.uuid_code || 'N/A'}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td>${(fundRequestLength + 1).toFixed(2)}</td>
                <td><strong>GRAND TOTAL</strong></td>
                <td><strong>$${totalFundRequest}</strong></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        <table class="summary-table">
          <tr class="total-row">
            <td>${(fundRequestLength + 1).toFixed(2)}</td>
            <td><strong>TOTAL FUND REQUEST</strong></td>
            <td><strong>$${totalFundRequest}</strong></td>
            <td rowspan="3" style="text-align: center; vertical-align: middle; color: #dc2626; font-weight: bold;">General Comment and Recommendation</td>
          </tr>
          <tr>
            <td>${(fundRequestLength + 2).toFixed(2)}</td>
            <td><strong>BALANCE ON HAND</strong></td>
            <td><strong>$${availableBalance}</strong></td>
          </tr>
          <tr>
            <td>${(fundRequestLength + 3).toFixed(2)}</td>
            <td><strong>AMOUNT DUE TO ACE HEAD OFFICE</strong></td>
            <td><strong>$${totalFundRequest - availableBalance}</strong></td>
          </tr>
        </table>

        <div class="signature-grid">
          <div class="signature-box">
            <div class="signature-info">
              <strong>Prepared by:</strong>
              <div>
                <div><strong>${signatureInfo?.preparedBy?.name || 'N/A'}</strong></div>
                <div style="font-size: 10px;">${signatureInfo?.preparedBy?.position || 'N/A'}</div>
              </div>
            </div>
            <div class="signature-info">
              <strong>Date:</strong>
              <span>${signatureInfo?.preparedBy?.date || 'N/A'}</span>
            </div>
          </div>

          <div class="signature-box">
            <div class="signature-info">
              <strong>Reviewed by:</strong>
              <div>
                <div><strong>${signatureInfo?.reviewedBy?.name || 'N/A'}</strong></div>
                <div style="font-size: 10px;">${signatureInfo?.reviewedBy?.position || 'N/A'}</div>
              </div>
            </div>
            <div class="signature-info">
              <strong>Date:</strong>
              <span>${signatureInfo?.reviewedBy?.date || 'N/A'}</span>
            </div>
          </div>

          <div class="signature-box">
            <div class="signature-info">
              <strong>Authorized by:</strong>
              <div>
                <div><strong>${signatureInfo?.authorizedBy?.name || 'N/A'}</strong></div>
                <div style="font-size: 10px;">${signatureInfo?.authorizedBy?.position || 'N/A'}</div>
              </div>
            </div>
            <div class="signature-info">
              <strong>Date:</strong>
              <span>${signatureInfo?.authorizedBy?.date || 'N/A'}</span>
            </div>
          </div>

          <div class="signature-box">
            <div class="signature-info">
              <strong>Approved by:</strong>
              <div>
                <div><strong>${signatureInfo?.approvedBy?.name || 'N/A'}</strong></div>
                <div style="font-size: 10px;">${signatureInfo?.approvedBy?.position || 'N/A'}</div>
              </div>
            </div>
            <div class="signature-info">
              <strong>Date:</strong>
              <span>${signatureInfo?.approvedBy?.date || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div class="footer">
          <p>Generated by AHNI Fund Request System - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
          <p>Achieving Health Nigeria Initiative - Fund Request Management</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <>
      <BackNavigation />
      <Card className='py-12 print-content'>
        <div className='flex flex-col items-center mb-8'>
          <div className='relative mb-6'>
            <img src={(logoPng as any).src || logoPng} alt='logo' width={120} className='drop-shadow-md' />
          </div>
          <div className='text-center space-y-4'>
            <h1 className='text-2xl font-bold text-gray-800 tracking-wide'>
              Achieving Health Nigeria Initiative (AHNI)
            </h1>
            <div className='flex items-center justify-center gap-2'>
              <div className='h-px bg-red-300 w-12'></div>
              <h2 className='text-red-600 font-bold text-xl tracking-wider uppercase'>
                Approval
              </h2>
              <div className='h-px bg-red-300 w-12'></div>
            </div>
          </div>

          {/* Download Buttons */}
          <div className='flex flex-wrap justify-center gap-4 mt-10 no-print'>
            <Button onClick={handleDownloadPDF} variant="outline" className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 px-6 py-2 rounded-lg">
              <FileText className="w-4 h-4" />
              Print/Save as PDF
            </Button>
            <Button onClick={handleDownloadReport} variant="outline" className="flex items-center gap-2 hover:bg-green-50 hover:border-green-300 transition-all duration-200 px-6 py-2 rounded-lg">
              <Download className="w-4 h-4" />
              Download Report
            </Button>
            <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 px-6 py-2 rounded-lg">
              <Printer className="w-4 h-4" />
              Print Page
            </Button>
          </div>
        </div>

        <div className='border-yellow-darker border-solid border-[2px] rounded-lg p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 bg-gradient-to-br from-amber-50 to-orange-50'>
          <div className='space-y-2'>
            <h3 className='font-semibold text-gray-700 text-sm uppercase tracking-wide'>Award/Project Title:</h3>
            <p className='font-bold text-yellow-darker text-xl leading-tight'>
              {project?.title || 'Project Title'}
            </p>
          </div>

          <div className='space-y-2'>
            <h3 className='font-semibold text-gray-700 text-sm uppercase tracking-wide'>Project ID:</h3>
            <p className='text-lg font-medium text-gray-800'>{project?.project_id || 'N/A'}</p>
          </div>

          <div className='space-y-2'>
            <h3 className='font-semibold text-gray-700 text-sm uppercase tracking-wide'>Project Start Date:</h3>
            <p className='text-lg font-medium text-gray-800'>{project?.start_date || 'N/A'}</p>
          </div>

          <div className='space-y-2'>
            <h3 className='font-semibold text-gray-700 text-sm uppercase tracking-wide'>Project End Date:</h3>
            <p className='text-lg font-medium text-gray-800'>{project?.end_date || 'N/A'}</p>
          </div>
        </div>

        <div className='my-8 space-y-6'>
          {/* Fund Request Table */}
          <div className='bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden'>
            <div className='px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50'>
              <h3 className='text-lg font-semibold text-gray-800 flex items-center gap-2'>
                <div className='w-1 h-6 bg-blue-500 rounded-full'></div>
                Fund Request Details
              </h3>
              <p className='text-sm text-gray-600 mt-1'>Detailed breakdown of fund requests by location</p>
            </div>
            <div className='p-6'>
              <DataTable
                columns={getColumns(primaryCurrency)}
                data={fundRequest?.data?.results || []}
                isLoading={isLoading}
                footer={true}
              />
            </div>
          </div>

          {/* Summary Table */}
          <div className='bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden'>
            <div className='px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50'>
              <h3 className='text-lg font-semibold text-gray-800 flex items-center gap-2'>
                <div className='w-1 h-6 bg-green-500 rounded-full'></div>
                Financial Summary
              </h3>
              <p className='text-sm text-gray-600 mt-1'>Comprehensive financial calculations and balances</p>
            </div>
            <div className='p-6'>
              <ShadTable>
                <TableBody>
                  <TableRow className='hover:bg-gray-50'>
                    <TableCell className='font-medium text-gray-600 w-24'>
                      {(fundRequestLength + 1).toFixed(2)}
                    </TableCell>
                    <TableCell className='font-semibold text-gray-800'>
                      TOTAL FUND REQUEST
                    </TableCell>
                    <TableCell className='font-bold text-green-600 text-lg'>
                      {primaryCurrency}{totalFundRequest.toLocaleString()}
                    </TableCell>
                    <TableCell
                      rowSpan={3}
                      className='text-center text-red-500 font-medium border-l-2 border-red-200 bg-red-50 px-6 py-8'
                    >
                      <div className='text-sm'>
                        General Comment and<br />Recommendation
                      </div>
                    </TableCell>
                  </TableRow>

                  <TableRow className='hover:bg-gray-50'>
                    <TableCell className='font-medium text-gray-600 w-24'>
                      {(fundRequestLength + 2).toFixed(2)}
                    </TableCell>
                    <TableCell className='font-semibold text-gray-800'>BALANCE ON HAND</TableCell>
                    <TableCell className='font-bold text-blue-600 text-lg'>
                      {primaryCurrency}{availableBalance.toLocaleString()}
                    </TableCell>
                  </TableRow>

                  <TableRow className='hover:bg-gray-50 border-b-2 border-gray-300'>
                    <TableCell className='font-medium text-gray-600 w-24'>
                      {(fundRequestLength + 3).toFixed(2)}
                    </TableCell>
                    <TableCell className='font-semibold text-gray-800'>
                      AMOUNT DUE TO ACE HEAD OFFICE
                    </TableCell>
                    <TableCell className='font-bold text-orange-600 text-lg'>
                      {primaryCurrency}{(totalFundRequest - availableBalance).toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </ShadTable>
            </div>
          </div>
        </div>

        {/* Approval Signatures Section */}
        <div className='mt-8'>
          <div className='bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden'>
            <div className='px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50'>
              <h3 className='text-lg font-semibold text-gray-800 flex items-center gap-2'>
                <div className='w-1 h-6 bg-purple-500 rounded-full'></div>
                Approvals
              </h3>
              <p className='text-sm text-gray-600 mt-1'>Fund request approval workflow</p>
            </div>
            <div className='p-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Prepared By */}
                <div className='bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-5 space-y-3'>
                  <div className='flex justify-between items-start'>
                    <span className='text-sm font-medium text-blue-700'>Prepared by:</span>
                    <div className='text-right'>
                      <p className='font-semibold text-sm text-gray-800'>{signatureInfo?.preparedBy?.name || 'N/A'}</p>
                      <p className='text-xs text-gray-600 italic'>{signatureInfo?.preparedBy?.position || 'N/A'}</p>
                    </div>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm font-medium text-blue-700'>Date:</span>
                    <span className='font-semibold text-sm text-gray-800'>{signatureInfo?.preparedBy?.date || 'N/A'}</span>
                  </div>
                </div>

                {/* Reviewed By */}
                <div className='bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-5 space-y-3'>
                  <div className='flex justify-between items-start'>
                    <span className='text-sm font-medium text-green-700'>Reviewed by:</span>
                    <div className='text-right'>
                      <p className='font-semibold text-sm text-gray-800'>{signatureInfo?.reviewedBy?.name || 'N/A'}</p>
                      <p className='text-xs text-gray-600 italic'>{signatureInfo?.reviewedBy?.position || 'N/A'}</p>
                    </div>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm font-medium text-green-700'>Date:</span>
                    <span className='font-semibold text-sm text-gray-800'>{signatureInfo?.reviewedBy?.date || 'N/A'}</span>
                  </div>
                </div>

                {/* Authorized By */}
                <div className='bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-5 space-y-3'>
                  <div className='flex justify-between items-start'>
                    <span className='text-sm font-medium text-orange-700'>Authorized by:</span>
                    <div className='text-right'>
                      <p className='font-semibold text-sm text-gray-800'>{signatureInfo?.authorizedBy?.name || 'N/A'}</p>
                      <p className='text-xs text-gray-600 italic'>{signatureInfo?.authorizedBy?.position || 'N/A'}</p>
                    </div>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm font-medium text-orange-700'>Date:</span>
                    <span className='font-semibold text-sm text-gray-800'>{signatureInfo?.authorizedBy?.date || 'N/A'}</span>
                  </div>
                </div>

                {/* Approved By */}
                <div className='bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-5 space-y-3'>
                  <div className='flex justify-between items-start'>
                    <span className='text-sm font-medium text-purple-700'>Approved by:</span>
                    <div className='text-right'>
                      <p className='font-semibold text-sm text-gray-800'>{signatureInfo?.approvedBy?.name || 'N/A'}</p>
                      <p className='text-xs text-gray-600 italic'>{signatureInfo?.approvedBy?.position || 'N/A'}</p>
                    </div>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm font-medium text-purple-700'>Date:</span>
                    <span className='font-semibold text-sm text-gray-800'>{signatureInfo?.approvedBy?.date || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}


const getColumns = (currency: string): ColumnDef<FundRequestPaginatedData>[] => [
  {
    header: "S/N",
    accessorFn: (_, index) => `${(index + 1).toFixed(2)}`,
    size: 80,
  },

  {
    header: "Location",
    id: "location",
    accessorFn: (row) => {
      const location = row.location;
      if (typeof location === 'string') return location;
      if (location && typeof location === 'object' && 'name' in location) {
        return String(location.name) || 'N/A';
      }
      return 'N/A';
    },
    size: 200,
    footer: () => <span>GRAND TOTAL</span>,
  },

  {
    header: "Fund Request For This Period",
    id: "amount",
    accessorFn: (data) => {
      const amount = data?.total_disbursement_amount || 0;
      return `${currency}${Number(amount).toLocaleString()}`;
    },
    footer(props) {
      const data = props.table
        .getRowModel()
        .flatRows.map((row) => row.original);

      const sum = data
        .map((data: any) => data?.total_disbursement_amount || 0)
        .reduce(
          (accumulator, value) =>
            (Number(accumulator || 0) + Number(value || 0)),
          0
        );

      return <span>{currency}{sum.toLocaleString()}</span>;
    },
    size: 200,
  },

  {
    header: "Unique Identifier Code",
    id: "uuid_code",
    accessorFn: (data) => data?.uuid_code || 'N/A',
    size: 200,
  },
];
