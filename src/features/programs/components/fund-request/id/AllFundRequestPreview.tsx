"use client";

import { ColumnDef } from "@tanstack/react-table";
import logoPng from "assets/imgs/logo.png";
import BackNavigation from "components/atoms/BackNavigation";
import Card from "components/Card";
import DataTable from "components/Table/DataTable";
import { FundRequestPaginatedData } from "@/features/programs/types/fund-request";
import { useParams } from "next/navigation";
import { useGetAllFundRequests } from "@/features/programs/controllers/fundRequestController";
import { useGetSingleProject } from "@/features/projects/controllers/projectController";
import { useGetSingleUser } from "@/features/auth/controllers";
import { useMemo } from "react";
import { skipToken } from "@tanstack/react-query";
import { Button } from "components/ui/button";
import { Download, FileText, Printer } from "lucide-react";

import {
  Table as ShadTable,
  TableBody,
  TableCell,
  TableRow,
} from "components/ui/table";

export default function AllFundRequestPreview() {
  const { id } = useParams();

  // Ensure id is a string
  const projectId = Array.isArray(id) ? id[0] : String(id || '');

  console.log('Project ID:', projectId, 'Type:', typeof projectId);

  const { data: fundRequest, isLoading } = useGetAllFundRequests({
    project: projectId,
  });

  const { data: project } = useGetSingleProject(projectId || skipToken);

  const fundRequestLength = fundRequest?.data?.results?.length || 0;

  const totalFundRequest = fundRequest?.data?.results
    ?.map((fundReq: any) => fundReq?.total_amount || 0)
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

  // Generate signature information
  const signatureInfo = useMemo(() => {
    if (!firstFundRequest) return null;

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

    const getFullName = (userData: any) => {
      if (!userData?.data) return 'N/A';
      const { first_name, last_name } = userData.data;
      return first_name && last_name ? `${String(first_name)} ${String(last_name)}` : 'N/A';
    };

    return {
      preparedBy: {
        name: getFullName(creatorData),
        position: String(creatorData?.data?.position || 'N/A'),
        date: formatDate(firstFundRequest.created_datetime)
      },
      reviewedBy: {
        name: getFullName(locationReviewerData),
        position: String(locationReviewerData?.data?.position || 'N/A'),
        date: formatDate(firstFundRequest.updated_datetime)
      },
      authorizedBy: {
        name: getFullName(locationAuthorizerData),
        position: String(locationAuthorizerData?.data?.position || 'N/A'),
        date: formatDate(firstFundRequest.updated_datetime)
      },
      approvedBy: {
        name: getFullName(hqApproverData),
        position: String(hqApproverData?.data?.position || 'N/A'),
        date: formatDate(firstFundRequest.updated_datetime)
      }
    };
  }, [firstFundRequest, creatorData, locationReviewerData, locationAuthorizerData, hqApproverData]);

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
    if (!fundRequest?.data?.results || !project?.data) return;

    const projectTitle = project.data.title || 'Project';
    const projectId = project.data.project_id || 'Unknown';
    const fileName = `fund-request-summary-${projectId.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.txt`;

    const content = `
ACHIEVING HEALTH NIGERIA INITIATIVE (AHNI)
FUND REQUEST SUMMARY

Project Title: ${projectTitle}
Project ID: ${projectId}
Project Start Date: ${project.data.start_date || 'N/A'}
Project End Date: ${project.data.end_date || 'N/A'}
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
    if (!fundRequest?.data?.results || !project?.data) return;

    const projectTitle = project.data.title || 'Project';

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
          <h2>FUND REQUEST SUMMARY</h2>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <h3>Award/Project Title:</h3>
            <p class="highlight">${projectTitle}</p>
          </div>
          <div class="info-item">
            <h3>Project ID:</h3>
            <p>${project.data.project_id || 'N/A'}</p>
          </div>
          <div class="info-item">
            <h3>Project Start Date:</h3>
            <p>${project.data.start_date || 'N/A'}</p>
          </div>
          <div class="info-item">
            <h3>Project End Date:</h3>
            <p>${project.data.end_date || 'N/A'}</p>
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
            <div class="signature-line"></div>
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
            <div class="signature-line"></div>
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
            <div class="signature-line"></div>
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
            <div class="signature-line"></div>
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
      <Card className='py-16 print-content'>
        <div className='flex flex-col items-center'>
          <img src={(logoPng as any).src || logoPng} alt='logo' width={150} />
          <h4 className='mt-5 text-lg font-bold'>
            Achieving Health Nigeria Initiative (AHNI)
          </h4>

          <h4 className='text-red-500 font-bold mt-2'>FUND REQUEST SUMMARY</h4>

          {/* Download Buttons */}
          <div className='flex gap-4 mt-6 no-print'>
            <Button onClick={handleDownloadPDF} variant="outline" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Print/Save as PDF
            </Button>
            <Button onClick={handleDownloadReport} variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Report
            </Button>
            <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2">
              <Printer className="w-4 h-4" />
              Print Page
            </Button>
          </div>
        </div>

        <div className='border-[#DEA004] border-solid border-[2px] rounded-lg p-5 grid grid-cols-2 gap-8 mt-10'>
          <div className='space-y-3'>
            <h3 className='font-semibold'>Award/Project Title:</h3>

            <p className='font-semibold text-[#DEA004] text-xl'>
              {project?.data?.title || 'Project Title'}
            </p>
          </div>

          <div className='space-y-3'>
            <h3 className='font-semibold'>Project ID</h3>

            <p className='text-sm text-gray-500'>{project?.data?.project_id || 'N/A'}</p>
          </div>

          <div className='space-y-3'>
            <h3 className='font-semibold'>Project Start Date:</h3>

            <p className='text-sm text-gray-500'>{project?.data?.start_date || 'N/A'}</p>
          </div>

          <div className='space-y-3'>
            <h3 className='font-semibold'>Project End Date:</h3>

            <p className='text-sm text-gray-500'>{project?.data?.end_date || 'N/A'}</p>
          </div>
        </div>

        <div className='my-5'>
          <DataTable
            columns={columns}
            data={fundRequest?.data?.results || []}
            isLoading={isLoading}
            footer={true}
          />

          <div className='my-5'>
            <ShadTable>
              <TableBody>
                <TableRow>
                  <TableCell
                    style={{
                      minWidth: 90,
                      maxWidth: 90,
                    }}
                  >
                    {/* @ts-ignore */}
                    {(fundRequestLength + 1).toFixed(2)}
                  </TableCell>
                  <TableCell className='font-medium'>
                    TOTAL FUND REQUEST
                  </TableCell>
                  <TableCell>${totalFundRequest ?? "N/A"}</TableCell>
                  <TableCell
                    rowSpan={3}
                    className='text-center text-red-400 font-medium'
                  >
                    General Comment and Recommendation
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell
                    style={{
                      minWidth: 90,
                      maxWidth: 90,
                    }}
                  >
                    {/* @ts-ignore */}
                    {(fundRequestLength + 2).toFixed(2)}
                  </TableCell>
                  <TableCell className='font-medium'>BALANCE ON HAND</TableCell>
                  <TableCell>${availableBalance ?? "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{
                      minWidth: 90,
                      maxWidth: 90,
                    }}
                  >
                    {/* @ts-ignore */}
                    {(fundRequestLength + 3).toFixed(2)}
                  </TableCell>
                  <TableCell className='font-medium'>
                    AMOUNT DUE TO ACE HEAD OFFICE
                  </TableCell>
                  <TableCell>
                    {/* @ts-ignore */}${totalFundRequest - availableBalance}
                  </TableCell>
                </TableRow>
              </TableBody>
            </ShadTable>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-5 mt-5'>
          <div className='p-5 border-solid border-gray-200 border-[1px] rounded-lg flex flex-col gap-3'>
            <div>
              <h3 className='font-bold'>Sign:</h3>
              <div className='h-8 border-b border-gray-300 mt-2'></div>
            </div>

            <div className='flex items-center justify-between'>
              <h3 className='font-bold'>Prepared by:</h3>
              <div className='text-right'>
                <p className='font-semibold text-sm'>{signatureInfo?.preparedBy?.name || 'N/A'}</p>
                <p className='text-xs text-gray-600'>{signatureInfo?.preparedBy?.position || 'N/A'}</p>
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <h3 className='font-bold'>Date:</h3>
              <p className='font-semibold text-sm'>{signatureInfo?.preparedBy?.date || 'N/A'}</p>
            </div>
          </div>

          <div className='p-5 border-solid border-gray-200 border-[1px] rounded-lg flex flex-col gap-3'>
            <div>
              <h3 className='font-bold'>Sign:</h3>
              <div className='h-8 border-b border-gray-300 mt-2'></div>
            </div>

            <div className='flex items-center justify-between'>
              <h3 className='font-bold'>Reviewed by:</h3>
              <div className='text-right'>
                <p className='font-semibold text-sm'>{signatureInfo?.reviewedBy?.name || 'N/A'}</p>
                <p className='text-xs text-gray-600'>{signatureInfo?.reviewedBy?.position || 'N/A'}</p>
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <h3 className='font-bold'>Date:</h3>
              <p className='font-semibold text-sm'>{signatureInfo?.reviewedBy?.date || 'N/A'}</p>
            </div>
          </div>

          <div className='p-5 border-solid border-gray-200 border-[1px] rounded-lg flex flex-col gap-3'>
            <div>
              <h3 className='font-bold'>Sign:</h3>
              <div className='h-8 border-b border-gray-300 mt-2'></div>
            </div>

            <div className='flex items-center justify-between'>
              <h3 className='font-bold'>Authorized by:</h3>
              <div className='text-right'>
                <p className='font-semibold text-sm'>{signatureInfo?.authorizedBy?.name || 'N/A'}</p>
                <p className='text-xs text-gray-600'>{signatureInfo?.authorizedBy?.position || 'N/A'}</p>
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <h3 className='font-bold'>Date:</h3>
              <p className='font-semibold text-sm'>{signatureInfo?.authorizedBy?.date || 'N/A'}</p>
            </div>
          </div>

          <div className='p-5 border-solid border-gray-200 border-[1px] rounded-lg flex flex-col gap-3'>
            <div>
              <h3 className='font-bold'>Sign:</h3>
              <div className='h-8 border-b border-gray-300 mt-2'></div>
            </div>

            <div className='flex items-center justify-between'>
              <h3 className='font-bold'>Approved by:</h3>
              <div className='text-right'>
                <p className='font-semibold text-sm'>{signatureInfo?.approvedBy?.name || 'N/A'}</p>
                <p className='text-xs text-gray-600'>{signatureInfo?.approvedBy?.position || 'N/A'}</p>
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <h3 className='font-bold'>Date:</h3>
              <p className='font-semibold text-sm'>{signatureInfo?.approvedBy?.date || 'N/A'}</p>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}


const columns: ColumnDef<FundRequestPaginatedData>[] = [
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
    accessorFn: (data) => `$${data?.total_amount || 0}`,
    footer(props) {
      const data = props.table
        .getRowModel()
        .flatRows.map((row) => row.original);

      const sum = data
        .map((data: any) => data?.total_amount || 0)
        .reduce(
          (accumulator, value) =>
            (Number(accumulator || 0) + Number(value || 0)),
          0
        );

      return <span>${sum || 0}</span>;
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
