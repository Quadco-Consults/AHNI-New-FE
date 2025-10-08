"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useGetPurchaseRequestById } from "@/features/procurement/controllers/purchaseRequestController";
import { useGetActivityMemo } from "@/features/procurement/controllers/activityMemoController";
import { LoadingSpinner } from "components/Loading";
import Card from "components/Card";
import GoBack from "components/GoBack";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "components/ui/table";

import logoPng from "assets/imgs/logo.png";
import { BsFiletypeDoc } from "react-icons/bs";
import { Button } from "components/ui/button";
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

  console.log("=== PURCHASE REQUEST DEBUG ===");
  console.log("Purchase request data:", data);
  console.log("Activity memo ID:", activityMemoId);
  console.log("Activity memo data:", activityMemoData);
  console.log("Items structure:", data?.data?.items);
  console.log("=== USER FIELDS DEBUG ===");
  console.log("requested_by_detail:", data?.data?.requested_by_detail);
  console.log("reviewed_by_detail:", data?.data?.reviewed_by_detail);
  console.log("authorised_by_detail:", data?.data?.authorised_by_detail);
  console.log("approved_by_detail:", data?.data?.approved_by_detail);
  console.log("All purchase request fields:", data?.data ? Object.keys(data.data) : 'No data');
  if (data?.data?.items?.[0]) {
    console.log("First item full:", data.data.items[0]);
    console.log("First item keys:", Object.keys(data.data.items[0]));
    console.log("item field:", data.data.items[0].item);
    console.log("item_detail field:", data.data.items[0].item_detail);
    console.log("FCO details:", data.data.items[0].fconumber_details);
    console.log("FCO number:", data.data.items[0].fco_number);
  }

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
    <section className='min-h-screen bg-white p-4 max-w-6xl mx-auto print:p-0 print:max-w-full print:min-h-0'>
      {/* Back Button and Download Button - Hidden on Print */}
      <div className='mb-4 flex items-center justify-between print:hidden'>
        <GoBack />
        <Button
          onClick={handleDownloadPDF}
          className='flex items-center gap-2 bg-green-600 hover:bg-green-700'
        >
          <Icon icon="solar:download-bold" fontSize={20} />
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
      <div className='bg-white border border-gray-200 rounded-lg p-6 mb-6 page-break-avoid print:p-3 print:mb-3 print:border-0'>
        <div className='flex justify-center items-center flex-col'>
          <img
            src={(logoPng as any).src || logoPng}
            alt='AHNI Logo'
            width={80}
            className='mb-4 print:mb-2'
          />
          <h1 className='text-lg font-bold text-gray-800 mb-2 print:text-base print:mb-1'>Achieving Health Nigeria Initiative (AHNI)</h1>
          <p className='text-gray-600 text-xs text-center'>23 Celina Ayom Crescent, Cadastral Zone B09, behind NAF Conference Center, Jabi, Abuja</p>
          <p className='text-gray-600 text-xs'>Tel: +234-09-4615555 / +234-09-461500 | Fax: +234-09-4615511</p>
        </div>
        <div className='mt-6 text-center print:mt-3'>
          <h2 className='text-lg font-bold text-gray-800 py-2 px-4 border border-gray-300 rounded inline-block print:text-base print:py-1 print:px-2'>
            PURCHASE REQUEST FORM
          </h2>
        </div>
      </div>
      {/* Request Information Section */}
      <div className='bg-white border border-gray-200 rounded-lg p-4 mb-6 page-break-avoid print:p-2 print:mb-3 print:border-gray-400'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-base font-semibold text-gray-800'>Request Information</h3>
          <div className='bg-gray-100 text-gray-800 px-3 py-1 rounded border border-gray-300'>
            <span className='font-medium text-sm'>Ref: {data?.data?.ref_number}</span>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <div className='bg-gray-50 rounded p-3 border border-gray-200'>
            <div className='text-center'>
              <h4 className='font-medium text-gray-700 mb-1 text-sm'>Date of Request</h4>
              <p className='text-gray-900 font-medium text-sm'>{data?.data?.date_of_request || 'N/A'}</p>
            </div>
          </div>

          <div className='bg-gray-50 rounded p-3 border border-gray-200'>
            <div className='text-center'>
              <h4 className='font-medium text-gray-700 mb-1 text-sm'>Date Required</h4>
              <p className='text-gray-900 font-medium text-sm'>{data?.data?.date_required || 'N/A'}</p>
            </div>
          </div>

          <div className='bg-gray-50 rounded p-3 border border-gray-200'>
            <div className='text-center'>
              <h4 className='font-medium text-gray-700 mb-1 text-sm'>Requesting Dept.</h4>
              <p className='text-gray-900 font-medium text-sm'>{safeRender(data?.data?.requesting_department_detail?.name)}</p>
            </div>
          </div>

          <div className='bg-gray-50 rounded p-3 border border-gray-200'>
            <div className='text-center'>
              <h4 className='font-medium text-gray-700 mb-1 text-sm'>Deliver To</h4>
              <p className='text-gray-900 font-medium text-sm'>{safeRender(data?.data?.location_detail?.name)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table Section */}
      <div className='bg-white border border-gray-200 rounded-lg p-4 mb-6'>
        <div className='mb-4'>
          <h3 className='text-base font-semibold text-gray-800 mb-1'>Items & Services</h3>
          <p className='text-gray-600 text-xs'>Detailed breakdown of requested items and services</p>
        </div>

        <div className='overflow-x-auto border border-gray-200 rounded'>
          <Table>
            <TableHeader>
              <TableRow className='bg-gray-50'>
                <TableCell className='text-center font-medium text-gray-700 text-xs'>S/N</TableCell>
                <TableCell className='font-medium text-gray-700 text-xs'>Description of items/services</TableCell>
                <TableCell className='text-center font-medium text-gray-700 text-xs'>UOM</TableCell>
                <TableCell className='text-center font-medium text-gray-700 text-xs'>FCO</TableCell>
                <TableCell className='text-center font-medium text-gray-700 text-xs'>Category</TableCell>
                <TableCell className='text-center font-medium text-gray-700 text-xs'>Quantity</TableCell>
                <TableCell className='text-center font-medium text-gray-700 text-xs'>Unit Cost</TableCell>
                <TableCell className='text-center font-medium text-gray-700 text-xs'>Total Cost</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* @ts-ignore */}
              {data?.data?.items.map((row, index) => (
                <TableRow
                  className={`hover:bg-gray-25 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}
                  key={index}
                >
                  <TableCell className='text-center font-medium text-gray-700 text-xs'>{index + 1}</TableCell>
                  <TableCell className='text-left font-medium text-xs'>
                    {/* Prioritize item_detail.name over raw item UUID */}
                    {row.item_detail?.name || row.item_detail?.description || 'N/A'}
                  </TableCell>
                  <TableCell className='text-center text-gray-600 text-xs'>{row.item_detail?.uom || row.uom || 'Each'}</TableCell>
                  <TableCell className='text-center text-gray-600 text-xs'>
                    {/* Display FCO/Activity No from activity memo data or item data */}
                    {(() => {
                      // First try: FCO details from activity memo
                      if (activityMemoData?.data?.fconumber_details && activityMemoData.data.fconumber_details.length > 0) {
                        return activityMemoData.data.fconumber_details.map((fco: any, idx: number) => (
                          <span key={idx}>
                            {fco?.module_code || fco?.code || fco?.name}
                            {idx + 1 < (activityMemoData.data.fconumber_details?.length || 0) && ", "}
                          </span>
                        ));
                      }

                      // Second try: FCO details from purchase request item
                      if (row?.fconumber_details && row.fconumber_details.length > 0) {
                        return row.fconumber_details.map((fco: any, idx: number) => (
                          <span key={idx}>
                            {fco?.module_code || fco?.code || fco?.name}
                            {idx + 1 < (row.fconumber_details?.length || 0) && ", "}
                          </span>
                        ));
                      }

                      // Third try: Activity detail from activity memo
                      if (activityMemoData?.data?.activity_detail?.code) {
                        return activityMemoData.data.activity_detail.code;
                      }

                      // Fourth try: fco_number array (if it contains IDs, show count)
                      if (Array.isArray(row?.fco_number) && row.fco_number.length > 0) {
                        return `${row.fco_number.length} FCO(s)`;
                      }

                      // Fifth try: Simple FCO field from item
                      if (row?.fco) {
                        return row.fco;
                      }

                      // Fallbacks for other possible fields
                      if (row?.activity_number) return row.activity_number;
                      if (row?.fconumber) return row.fconumber;

                      return "N/A";
                    })()}
                  </TableCell>
                  <TableCell className='text-center text-gray-600 text-xs'>{safeRender(row.item_detail?.category) !== 'N/A' ? safeRender(row.item_detail?.category) : safeRender(row.category) !== 'N/A' ? safeRender(row.category) : 'General'}</TableCell>
                  <TableCell className='text-center font-medium text-xs'>{row.quantity}</TableCell>
                  <TableCell className='text-center font-medium text-xs'>
                    ₦ {Number(row.unit_cost).toLocaleString()}.00
                  </TableCell>
                  <TableCell className='text-center font-semibold text-xs'>
                    ₦ {Number(row.amount || row.amaount || row.sub_total_amount || 0).toLocaleString()}.00
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Total Section */}
        <div className='mt-4 flex justify-end'>
          <div className='bg-gray-100 border border-gray-300 text-gray-800 px-4 py-2 rounded'>
            <div className='flex items-center gap-3'>
              <span className='text-sm font-semibold'>Grand Total:</span>
              <span className='text-sm font-bold'>₦ {grandTotal?.toLocaleString()}.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Records Section */}
      <div className='bg-white border border-gray-200 rounded-lg p-4 mb-6'>
        <div className='mb-4'>
          <h3 className='text-base font-semibold text-gray-800 mb-1'>Approval Workflow</h3>
          <p className='text-gray-600 text-xs'>Signature records and approval status</p>
        </div>

        {/* 4-level approval structure */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Requested By */}
          <div className='bg-gray-50 border border-gray-200 rounded p-3'>
            <h4 className='font-medium text-gray-800 mb-3 text-sm'>
              Requested By
            </h4>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <span className='font-medium text-xs w-12 text-gray-700'>Name:</span>
                <span className='text-xs text-gray-900 font-medium'>
                  {data?.data?.requested_by_detail?.name ||
                   (data?.data?.requested_by_detail?.first_name && data?.data?.requested_by_detail?.last_name
                    ? `${data.data.requested_by_detail.first_name} ${data.data.requested_by_detail.last_name}`
                    : data?.data?.requested_by_detail?.email || 'N/A')
                  }
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='font-medium text-xs w-12 text-gray-700'>Date:</span>
                <span className='text-xs text-gray-900'>{formatDate(data?.data?.requested_date || data?.data?.request_date || data?.data?.date_of_request)}</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='font-medium text-xs w-12 text-gray-700'>Sign:</span>
                <span className='text-xs text-gray-600'>_________________________</span>
              </div>
            </div>
          </div>

          {/* Reviewed By */}
          <div className='bg-gray-50 border border-gray-200 rounded p-3'>
            <h4 className='font-medium text-gray-800 mb-3 text-sm'>
              Reviewed By
            </h4>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <span className='font-medium text-xs w-12 text-gray-700'>Name:</span>
                <span className='text-xs text-gray-900 font-medium'>
                  {data?.data?.reviewed_by_detail?.name ||
                   (data?.data?.reviewed_by_detail?.first_name && data?.data?.reviewed_by_detail?.last_name
                    ? `${data.data.reviewed_by_detail.first_name} ${data.data.reviewed_by_detail.last_name}`
                    : data?.data?.reviewed_by_detail?.email || 'N/A')
                  }
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='font-medium text-xs w-12 text-gray-700'>Date:</span>
                <span className='text-xs text-gray-900'>{formatDate(data?.data?.reviewed_date)}</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='font-medium text-xs w-12 text-gray-700'>Sign:</span>
                <span className='text-xs text-gray-600'>_________________________</span>
              </div>
            </div>
          </div>

          {/* Authorised By */}
          <div className='bg-gray-50 border border-gray-200 rounded p-3'>
            <h4 className='font-medium text-gray-800 mb-3 text-sm'>
              Authorised By
            </h4>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <span className='font-medium text-xs w-12 text-gray-700'>Name:</span>
                <span className='text-xs text-gray-900 font-medium'>
                  {data?.data?.authorised_by_detail?.name ||
                   (data?.data?.authorised_by_detail?.first_name && data?.data?.authorised_by_detail?.last_name
                    ? `${data.data.authorised_by_detail.first_name} ${data.data.authorised_by_detail.last_name}`
                    : data?.data?.authorised_by_detail?.email || 'N/A')
                  }
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='font-medium text-xs w-12 text-gray-700'>Date:</span>
                <span className='text-xs text-gray-900'>{formatDate(data?.data?.authorised_date)}</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='font-medium text-xs w-12 text-gray-700'>Sign:</span>
                <span className='text-xs text-gray-600'>_________________________</span>
              </div>
            </div>
          </div>

          {/* Approved By */}
          <div className='bg-gray-50 border border-gray-200 rounded p-3'>
            <h4 className='font-medium text-gray-800 mb-3 text-sm'>
              Approved By
            </h4>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <span className='font-medium text-xs w-12 text-gray-700'>Name:</span>
                <span className='text-xs text-gray-900 font-medium'>
                  {data?.data?.approved_by_detail?.name ||
                   (data?.data?.approved_by_detail?.first_name && data?.data?.approved_by_detail?.last_name
                    ? `${data.data.approved_by_detail.first_name} ${data.data.approved_by_detail.last_name}`
                    : data?.data?.approved_by_detail?.email || 'N/A')
                  }
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='font-medium text-xs w-12 text-gray-700'>Date:</span>
                <span className='text-xs text-gray-900'>{formatDate(data?.data?.approved_date)}</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='font-medium text-xs w-12 text-gray-700'>Sign:</span>
                <span className='text-xs text-gray-600'>_________________________</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specification Document Section */}
      <div className='bg-white border border-gray-200 rounded-lg p-4'>
        <div className='mb-3'>
          <h3 className='text-base font-semibold text-gray-800 mb-1'>Specification Document</h3>
          <p className='text-gray-600 text-xs'>Additional documentation and specifications</p>
        </div>

        {data?.data?.specification_document ? (
          <Link href={data.data.specification_document} target='_blank' title={"Specification Document"}>
            <div className='bg-gray-50 border border-gray-200 py-3 px-4 rounded flex items-center gap-3 cursor-pointer hover:bg-gray-100 transition-colors'>
              <div className='bg-gray-600 text-white p-2 rounded'>
                <BsFiletypeDoc size={16} />
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
              <BsFiletypeDoc size={16} />
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
