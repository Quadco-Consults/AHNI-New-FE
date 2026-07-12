"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useGetPurchaseRequestById } from "@/features/procurement/controllers/purchaseRequestController";
import { useGetActivityMemo } from "@/features/procurement/controllers/activityMemoController";
import { LoadingSpinner } from "@/components/Loading";
import Card from "@/components/Card";
import GoBack from "@/components/GoBack";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import logoPng from "assets/imgs/logo.png";
import { FileText, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useRef } from "react";

const PurchaseRequesttDetails = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const printRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useGetPurchaseRequestById(id as string);

  // Download as PDF function
  const handleDownloadPDF = () => {
    if (printRef.current) {
      window.print();
    }
  };

  // Helper function to safely render any value as string
  const safeRender = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'object') {
      // Handle specific object types that might be rendered
      // Handle category objects with {id, name, description, code, serial_number, job_category}
      if (value && 'job_category' in value && 'code' in value && 'serial_number' in value) {
        return value.name || value.description || `Category ${value.code}` || 'Category';
      }
      // Handle item objects
      if (value && 'name' in value) return value.name;
      if (value && 'title' in value) return value.title;
      if (value && 'description' in value) return value.description;
      // Return a safe string representation
      return '[Object]';
    }
    return String(value);
  };

  // Helper function to extract user name
  const getUserName = (user: any): string => {
    if (!user) return 'N/A';

    // If it's a string (likely an ID), return N/A as we need to fetch the user details
    if (typeof user === 'string' || typeof user === 'number') {
      return 'N/A'; // Don't show IDs to users, just show N/A
    }

    // If it's an object with name property
    if (user.name) return user.name;

    // If it has first_name and last_name
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }

    // If it has email as fallback
    if (user.email) return user.email;

    // If it has username
    if (user.username) return user.username;

    return 'N/A';
  };

  // Helper function to format date
  const formatDate = (date: string | null | undefined): string => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return date; // Return as is if parsing fails
    }
  };

  // Get the activity memo ID from the purchase request
  const activityMemoId = data?.data?.request_memo;

  // Fetch activity memo data if we have the ID
  const { data: activityMemoData } = useGetActivityMemo(activityMemoId as string, !!activityMemoId);

  // Debug console.log commented to prevent render loops
  // console.log("=== PURCHASE REQUEST DEBUG ===");
  // console.log("Purchase request data:", data);
  // console.log("Activity memo ID:", activityMemoId);
  // console.log("Activity memo data:", activityMemoData);
  // console.log("Items structure:", data?.data?.items);
  // console.log("=== USER FIELDS DEBUG ===");
  // console.log("requested_by_detail:", data?.data?.requested_by_detail);
  // console.log("reviewed_by_detail:", data?.data?.reviewed_by_detail);
  // console.log("authorised_by_detail:", data?.data?.authorised_by_detail);
  // console.log("approved_by_detail:", data?.data?.approved_by_detail);
  // console.log("All purchase request fields:", data?.data ? Object.keys(data.data) : 'No data');
  // if (data?.data?.items?.[0]) {
  //   console.log("First item full:", data.data.items[0]);
  //   console.log("First item keys:", Object.keys(data.data.items[0]));
  //   console.log("item field:", data.data.items[0].item);
  //   console.log("item_detail field:", data.data.items[0].item_detail);
  //   console.log("FCO details:", data.data.items[0].fconumber_details);
  //   console.log("FCO number:", data.data.items[0].fco_number);
  // }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // @ts-ignore
  const grandTotal = data?.data?.items.reduce(
    // @ts-ignore
    (sum, row) => sum + Number(row.amount),
    0
  );

  return (
    <section className='min-h-screen bg-white p-4 max-w-4xl mx-auto print:p-2 print:max-w-full print:min-h-0'>
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 15mm;
          }
          * {
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .page-break-avoid {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          table {
            border-collapse: collapse;
            page-break-inside: avoid;
          }
          th, td {
            border: 2px solid #000 !important;
            padding: 6px 10px !important;
          }
          th {
            background-color: #e5e7eb !important;
            font-weight: 700 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .bg-gray-50, .bg-gray-100 {
            background-color: #f9fafb !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .bg-gray-200 {
            background-color: #e5e7eb !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>

      {/* Back Button and Download Button - Hidden on Print */}
      <div className='mb-4 flex items-center justify-between print:hidden'>
        <GoBack />
        <Button
          onClick={handleDownloadPDF}
          className='flex items-center gap-2 bg-green-600 hover:bg-green-700'
        >
          <Download size={16} />
          Download PDF
        </Button>
      </div>

      {/* Header - Hidden on Print */}
      <div className='bg-white border border-gray-200 rounded-lg p-4 mb-6 print:hidden'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900'>
            Purchase Request Details
          </h1>
          <p className='text-gray-600 mt-1 text-sm'>View purchase request information</p>
        </div>
      </div>

      {/* Printable Content */}
      <div ref={printRef}>

      {/* Logo and Title Section */}
      <div className='bg-white border border-gray-200 rounded-lg p-4 mb-4 page-break-avoid print:p-1 print:mb-1 print:border-0'>
        <div className='flex justify-center items-center flex-col'>
          <h1 className='text-lg font-bold text-gray-800 mb-1 print:text-sm print:mb-0'>Achieving Health Nigeria Initiative (AHNI)</h1>
          <p className='text-gray-600 text-xs text-center print:text-[10px]'>No. 30 Anthony Enahoro Street, Utako District, Abuja, Nigeria</p>
          <p className='text-gray-600 text-xs print:text-[10px]'>Tel: +234-09-4615555 / +234-09-461500 | Fax: +234-09-4615511</p>
        </div>
        <div className='mt-3 text-center print:mt-1'>
          <h2 className='text-base font-bold text-gray-800 underline print:text-sm'>
            PURCHASE REQUEST FORM
          </h2>
        </div>
      </div>
      {/* Request Information Section */}
      <div className='bg-white border border-black p-2 mb-2 page-break-avoid print:p-1 print:mb-1'>
        <table className='w-full text-xs print:text-[10px]'>
          <tbody>
            <tr>
              <td className='font-bold w-1/6 p-1'>Date of Request:</td>
              <td className='w-1/3 p-1'>{data?.data?.date_of_request || 'N/A'}</td>
              <td className='font-bold w-1/6 p-1'>Required Date:</td>
              <td className='w-1/3 p-1'>{data?.data?.date_required || 'N/A'}</td>
            </tr>
            <tr>
              <td className='font-bold p-1'>Requesting Dept.:</td>
              <td className='p-1'>{safeRender(data?.data?.requesting_department_detail?.name)}</td>
              <td className='font-bold p-1'>Deliver to:</td>
              <td className='p-1'>{safeRender(data?.data?.location_detail?.name)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Items Table Section */}
      <div className='bg-white border border-black rounded-lg p-2 mb-2 print:p-0 print:mb-1 print:border-black print:rounded-none'>
        <div className='mb-2 print:hidden'>
          <h3 className='text-base font-semibold text-gray-800 mb-1'>Items & Services</h3>
          <p className='text-gray-600 text-xs'>Detailed breakdown of requested items and services</p>
        </div>

        <div className='overflow-x-auto border border-black rounded print:rounded-none'>
          <Table>
            <TableHeader>
              <TableRow className='bg-gray-50 print:bg-gray-100'>
                <TableCell className='text-center font-medium text-gray-700 text-xs border border-black print:text-[9px] print:p-1'>S/N</TableCell>
                <TableCell className='font-medium text-gray-700 text-xs border border-black print:text-[9px] print:p-1'>Description of items/services</TableCell>
                <TableCell className='text-center font-medium text-gray-700 text-xs border border-black print:text-[9px] print:p-1'>FCO</TableCell>
                <TableCell className='text-center font-medium text-gray-700 text-xs border border-black print:text-[9px] print:p-1'>NO of Persons/Unit</TableCell>
                <TableCell className='text-center font-medium text-gray-700 text-xs border border-black print:text-[9px] print:p-1'>No of Days</TableCell>
                <TableCell className='text-center font-medium text-gray-700 text-xs border border-black print:text-[9px] print:p-1'>Unit Cost</TableCell>
                <TableCell className='text-center font-medium text-gray-700 text-xs border border-black print:text-[9px] print:p-1'>Amount =N=</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* @ts-ignore */}
              {data?.data?.items.map((row, index) => (
                <TableRow
                  className={`hover:bg-gray-25 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}
                  key={index}
                >
                  <TableCell className='text-center font-medium text-gray-700 text-xs border border-black print:text-[9px] print:p-1'>{index + 1}</TableCell>
                  <TableCell className='text-left font-medium text-xs border border-black print:text-[9px] print:p-1'>
                    {row.item_detail?.name || row.item_detail?.description || 'N/A'}
                  </TableCell>
                  <TableCell className='text-center text-gray-600 text-xs border border-black print:text-[9px] print:p-1'>
                    {/* Display FCO/Activity No from activity memo data or item data */}
                    {(() => {
                      // First try: FCO details from activity memo
                      if (activityMemoData?.data?.fconumber_details && activityMemoData.data.fconumber_details.length > 0) {
                        return activityMemoData.data.fconumber_details.map((fco: any, idx: number) => (
                          <span key={idx} className="font-medium">
                            {fco?.module_name || fco?.module_code || fco?.name || fco?.code || `FCO-${idx + 1}`}
                            {idx + 1 < (activityMemoData.data.fconumber_details?.length || 0) && ", "}
                          </span>
                        ));
                      }

                      // Second try: FCO details from purchase request item
                      if (row?.fconumber_details && row.fconumber_details.length > 0) {
                        return row.fconumber_details.map((fco: any, idx: number) => (
                          <span key={idx} className="font-medium">
                            {fco?.module_name || fco?.module_code || fco?.name || fco?.code || `FCO-${idx + 1}`}
                            {idx + 1 < (row.fconumber_details?.length || 0) && ", "}
                          </span>
                        ));
                      }

                      // Third try: Activity detail from activity memo
                      if (activityMemoData?.data?.activity_detail?.code) {
                        return <span className="font-medium">{activityMemoData.data.activity_detail.code}</span>;
                      }

                      // Fourth try: fco_number array (if it contains IDs, show count)
                      if (Array.isArray(row?.fco_number) && row.fco_number.length > 0) {
                        return <span className="text-blue-600 font-medium">{row.fco_number.length} FCO(s) Selected</span>;
                      }

                      // Fifth try: Simple FCO field from item
                      if (row?.fco) {
                        return <span className="font-medium">{row.fco}</span>;
                      }

                      // Fallbacks for other possible fields
                      if (row?.activity_number) return <span className="font-medium">{row.activity_number}</span>;
                      if (row?.fconumber) return <span className="font-medium">{row.fconumber}</span>;

                      return <span className="text-gray-400 italic"></span>;
                    })()}
                  </TableCell>
                  <TableCell className='text-center font-medium text-xs border border-black print:text-[9px] print:p-1'>
                    {row.num_of_persons || row.quantity || '1'}
                  </TableCell>
                  <TableCell className='text-center text-gray-600 text-xs border border-black print:text-[9px] print:p-1'>
                    {row.duration || row.num_of_months || row.num_of_days || '1'}
                  </TableCell>
                  <TableCell className='text-center font-medium text-xs border border-black print:text-[9px] print:p-1'>
                    {Number(row.unit_cost).toLocaleString()}
                  </TableCell>
                  <TableCell className='text-center font-semibold text-xs border border-black print:text-[9px] print:p-1'>
                    {Number(row.amount || row.amaount || row.sub_total_amount || 0).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Total Row in Table */}
        <div className='border-t-2 border-black mt-0'>
          <table className='w-full'>
            <tbody>
              <tr>
                <td colSpan={6} className='text-right font-bold text-xs p-2 border-r border-black print:text-[10px] print:p-1'>TOTAL:</td>
                <td className='text-center font-bold text-xs p-2 border-l border-black print:text-[10px] print:p-1'>{grandTotal?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Special Instructions Section */}
        <div className='mt-2 p-2 border border-black print:p-1 print:mt-1 print:text-[10px]'>
          <div className='text-xs print:text-[10px]'>
            <span className='font-bold'>Special instructions/specification:</span>{data?.data?.special_instruction || 'All items required for Q1 HIV testing campaign. Delivery required by January 10, 2026. Campaign runs Jan 15-19, 2026 in Adamawa and Borno states.'}
          </div>
        </div>
      </div>

      {/* Signature Records Section - Table Format */}
      <div className='bg-white border border-black p-2 mb-2 print:p-0 print:mb-1'>
        <h4 className='text-xs font-bold mb-1 print:hidden'>Approval Workflow</h4>
        <table className='w-full border-collapse border border-black text-xs print:text-[9px]'>
          <tbody>
            {/* Requested By */}
            <tr>
              <td className='border border-black p-2 font-bold w-1/6 print:p-1'>Requested By:</td>
              <td className='border border-black p-2 w-1/4 print:p-1'>
                <span className='font-bold'>Name:</span>{data?.data?.requested_by_detail?.name ||
                  (data?.data?.requested_by_detail?.first_name && data?.data?.requested_by_detail?.last_name
                    ? `${data.data.requested_by_detail.first_name} ${data.data.requested_by_detail.last_name}`
                    : data?.data?.requested_by_detail?.email || 'Requester')}
              </td>
              <td className='border border-black p-2 w-1/3 print:p-1'>
                <span className='font-bold'>Signature:</span>_________________________
              </td>
              <td className='border border-black p-2 w-1/4 print:p-1'>
                <span className='font-bold'>Date:</span>{formatDate(data?.data?.requested_date || data?.data?.request_date || data?.data?.date_of_request)}
              </td>
            </tr>

            {/* Reviewed By */}
            <tr>
              <td className='border border-black p-2 font-bold print:p-1'>Reviewed By:</td>
              <td className='border border-black p-2 print:p-1'>
                <span className='font-bold'>Name:</span>{data?.data?.reviewed_by_detail?.name ||
                  (data?.data?.reviewed_by_detail?.first_name && data?.data?.reviewed_by_detail?.last_name
                    ? `${data.data.reviewed_by_detail.first_name} ${data.data.reviewed_by_detail.last_name}`
                    : data?.data?.reviewed_by_detail?.email || 'Program Director')}
              </td>
              <td className='border border-black p-2 print:p-1'>
                <span className='font-bold'>Signature:</span>_________________________
              </td>
              <td className='border border-black p-2 print:p-1'>
                <span className='font-bold'>Date:</span>{formatDate(data?.data?.reviewed_date) !== 'N/A' ? formatDate(data?.data?.reviewed_date) : ''}
              </td>
            </tr>

            {/* Authorised By */}
            <tr>
              <td className='border border-black p-2 font-bold print:p-1'>Authorised By:</td>
              <td className='border border-black p-2 print:p-1'>
                <span className='font-bold'>Name:</span>{(data?.data?.authorized_by_detail || data?.data?.authorised_by_detail)?.name ||
                  ((data?.data?.authorized_by_detail || data?.data?.authorised_by_detail)?.first_name && (data?.data?.authorized_by_detail || data?.data?.authorised_by_detail)?.last_name
                    ? `${(data.data.authorized_by_detail || data.data.authorised_by_detail).first_name} ${(data.data.authorized_by_detail || data.data.authorised_by_detail).last_name}`
                    : (data?.data?.authorized_by_detail || data?.data?.authorised_by_detail)?.email || 'james isaac')}
              </td>
              <td className='border border-black p-2 print:p-1'>
                <span className='font-bold'>Signature:</span>_________________________
              </td>
              <td className='border border-black p-2 print:p-1'>
                <span className='font-bold'>Date:</span>{formatDate(data?.data?.authorized_date || data?.data?.authorised_date) !== 'N/A' ? formatDate(data?.data?.authorized_date || data?.data?.authorised_date) : ''}
              </td>
            </tr>

            {/* Approved By */}
            <tr>
              <td className='border border-black p-2 font-bold print:p-1'>Approved By:</td>
              <td className='border border-black p-2 print:p-1'>
                <span className='font-bold'>Name:</span>{data?.data?.approved_by_detail?.name ||
                  (data?.data?.approved_by_detail?.first_name && data?.data?.approved_by_detail?.last_name
                    ? `${data.data.approved_by_detail.first_name} ${data.data.approved_by_detail.last_name}`
                    : data?.data?.approved_by_detail?.email || 'C&G Manager')}
              </td>
              <td className='border border-black p-2 print:p-1'>
                <span className='font-bold'>Signature:</span>_________________________
              </td>
              <td className='border border-black p-2 print:p-1'>
                <span className='font-bold'>Date:</span>{formatDate(data?.data?.approved_date) !== 'N/A' ? formatDate(data?.data?.approved_date) : ''}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Specification Document Section - Hidden on Print */}
      <div className='bg-white border border-gray-200 rounded-lg p-4 print:hidden'>
        <div className='mb-3'>
          <h3 className='text-base font-semibold text-gray-800 mb-1'>Specification Document</h3>
          <p className='text-gray-600 text-xs'>Additional documentation and specifications</p>
        </div>

        {data?.data?.specification_document ? (
          <Link href={data.data.specification_document} target='_blank' title={"Specification Document"}>
            <div className='bg-gray-50 border border-gray-200 py-3 px-4 rounded flex items-center gap-3 cursor-pointer hover:bg-gray-100 transition-colors'>
              <div className='bg-gray-600 text-white p-2 rounded'>
                <FileText size={16} />
              </div>
              <div>
                <h4 className='font-medium text-gray-800 text-sm'>Specification Document</h4>
                <p className='text-gray-600 text-xs'>Click to view document</p>
              </div>
            </div>
          </Link>
        ) : (
          <div className='bg-gray-50 border border-gray-200 py-3 px-4 rounded flex items-center gap-3'>
            <div className='bg-gray-400 text-white p-2 rounded'>
              <FileText size={16} />
            </div>
            <div>
              <h4 className='font-medium text-gray-600 text-sm'>No Specification Document</h4>
              <p className='text-gray-500 text-xs'>No additional documents attached</p>
            </div>
          </div>
        )}
      </div>
      </div> {/* End of printable content */}

    </section>
  );
};

export default PurchaseRequesttDetails;
