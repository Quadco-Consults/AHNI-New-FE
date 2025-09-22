"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useGetPurchaseRequestById, useModifyPurchaseRequest } from "@/features/procurement/controllers/purchaseRequestController";
import { useGetActivityMemo } from "@/features/procurement/controllers/activityMemoController";
import { useGetUserProfile } from "@/features/auth/controllers/userController";
import { LoadingSpinner } from "components/Loading";
import Card from "components/Card";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "components/ui/table";

import logoPng from "@/assets/svgs/logo-bg.svg";
import { BsFiletypeDoc } from "react-icons/bs";
import { toast } from "sonner";
import { useState } from "react";
import ApprovalNotifications from "../ApprovalNotifications";
const PurchaseRequesttDetails = () => {
  const { id } = useParams();
  const [isApproving, setIsApproving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { data, isLoading, refetch } = useGetPurchaseRequestById(id as string);
  const { data: currentUser } = useGetUserProfile();

  // Helper function to extract user name
  const getUserName = (user: any): string => {
    if (!user) return 'N/A';

    // If it's a string (likely an ID), return N/A as we need to fetch the user details
    if (typeof user === 'string' || typeof user === 'number') {
      return 'User ID: ' + user; // Showing ID temporarily until we can fetch user details
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
  const { modifyPurchaseRequest, isLoading: isModifying, isSuccess: isModifySuccess } = useModifyPurchaseRequest(id as string);

  // Get the activity memo ID from the purchase request
  const activityMemoId = data?.data?.request_memo;

  // Fetch activity memo data if we have the ID
  const { data: activityMemoData } = useGetActivityMemo(activityMemoId as string, !!activityMemoId);

  // Handle status updates from approval workflow
  const handleStatusUpdate = () => {
    refetch();
    setRefreshKey(prev => prev + 1);
  };

  console.log("=== PURCHASE REQUEST DEBUG ===");
  console.log("Purchase request data:", data);
  console.log("Current user:", currentUser);
  console.log("Activity memo ID:", activityMemoId);
  console.log("Activity memo data:", activityMemoData);
  console.log("Items structure:", data?.data?.items);
  console.log("=== USER FIELDS DEBUG ===");
  console.log("requested_by:", data?.data?.requested_by);
  console.log("reviewed_by:", data?.data?.reviewed_by);
  console.log("authorized_by:", data?.data?.authorized_by);
  console.log("approved_by:", data?.data?.approved_by);
  console.log("All purchase request fields:", data?.data ? Object.keys(data.data) : 'No data');
  if (data?.data?.items?.[0]) {
    console.log("First item:", data.data.items[0]);
    console.log("First item keys:", Object.keys(data.data.items[0]));
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
    <section className='min-h-screen space-y-8 bg-white p-8'>
      {/* Header with Notifications */}
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Purchase Request Details</h1>
        <div className="flex items-center gap-4">
          <ApprovalNotifications
            purchaseRequestData={data}
            currentUser={currentUser}
            onActionTaken={handleStatusUpdate}
          />
          <Link href={`/dashboard/procurement/purchase-request/${id}/edit`}>
            <Button variant="outline" size="sm">
              Edit Request
            </Button>
          </Link>
        </div>
      </div>
      <div className='flex justify-center items-center flex-col'>
        <img src={logoPng} alt='logo' width={200} />
        <h1>Achieving Health Nigeria Initiative (AHNI)</h1>
      </div>
      <h2 className='text-center'>PURCHASE REQUEST FORM</h2>
      <div>
        {" "}
        <div className='flex items-center justify-end'>
          <h3 className='flex gap-2 p-2 bg-alternate border border-primary rounded'>
            <strong>Ref:</strong>
            {/* @ts-ignore */}
            {data?.data?.ref_number}
          </h3>
        </div>
        <Card className='border-primary space-y-3 mt-8 w-full mx-auto'>
          <div className='flex justify-between'>
            <div className='flex flex-col gap-3'>
              <div className='flex flex-col items-center gap-5'>
                <h4 className='w-full max-w-[151px] font-medium text-[14px]'>
                  Date of Request
                </h4>
                {/* @ts-ignore */}

                <h4> {data?.data?.date_of_request}</h4>
              </div>
            </div>{" "}
            <div className='flex flex-col gap-3'>
              <div className='flex flex-col items-center gap-5'>
                <h4 className='w-full max-w-[151px] font-medium text-[14px]'>
                  Date Required
                </h4>
                {/* @ts-ignore */}

                <h4>{data?.data?.date_required}</h4>
              </div>
            </div>{" "}
            <div className='flex flex-col gap-3'>
              <div className='flex flex-col items-center gap-5'>
                <h4 className='w-full max-w-[151px] font-medium text-[14px]'>
                  Requesting Dept.{" "}
                </h4>
                {/* @ts-ignore */}
                <h4>{data?.data?.requesting_department_detail?.name}</h4>
              </div>
            </div>{" "}
            <div className='flex flex-col gap-3'>
              <div className='flex flex-col items-center gap-5'>
                <h4 className='w-full max-w-[151px] font-medium text-[14px]'>
                  Deliver
                </h4>
                {/* @ts-ignore */}
                <h4>{data?.data?.location_detail?.name}</h4>
              </div>
            </div>{" "}
          </div>
        </Card>
      </div>

      <div className='mt-8'>
        <Table>
          <TableHeader>
            <TableRow className='text-center'>
              <TableCell>S/N</TableCell>
              <TableCell>Description of items/services</TableCell>
              <TableCell>FCO/Activity No</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Unit Cost</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* @ts-ignore */}
            {data?.data?.items.map((row, index) => (
              <TableRow className='text-center' key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.item_detail?.name || row.item}</TableCell>
                <TableCell className='text-center'>
                  {/* Display FCO/Activity No from activity memo data */}
                  {(() => {
                    // First try: FCO details from activity memo
                    if (activityMemoData?.data?.fconumber_details?.length > 0) {
                      return activityMemoData.data.fconumber_details.map((fco, idx) => (
                        <span key={idx}>
                          {fco?.module_code || fco?.code || fco?.name}
                          {idx + 1 < activityMemoData.data.fconumber_details.length && ", "}
                        </span>
                      ));
                    }

                    // Second try: FCO details from purchase request item
                    if (row?.fconumber_details?.length > 0) {
                      return row.fconumber_details.map((fco, idx) => (
                        <span key={idx}>
                          {fco?.module_code || fco?.code || fco?.name}
                          {idx + 1 < row.fconumber_details.length && ", "}
                        </span>
                      ));
                    }

                    // Third try: Activity detail from activity memo
                    if (activityMemoData?.data?.activity_detail?.code) {
                      return activityMemoData.data.activity_detail.code;
                    }

                    // Fourth try: Simple FCO field from item
                    if (row?.fco) {
                      return row.fco;
                    }

                    // Fallbacks for other possible fields
                    if (row?.fco_number) return row.fco_number;
                    if (row?.activity_number) return row.activity_number;
                    if (row?.fconumber) return row.fconumber;

                    return "N/A";
                  })()}
                </TableCell>
                <TableCell>{row.quantity}</TableCell>
                <TableCell>
                  ₦ {Number(row.unit_cost).toLocaleString()}.00
                </TableCell>
                <TableCell>
                  ₦ {Number(row.amount).toLocaleString()}.00
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className='flex items-center justify-center w-fit gap-20 px-5 py-3 border rounded-lg border-primary text-primary ml-auto mt-6'>
        <h4>Total:</h4>
        <span>₦ {grandTotal?.toLocaleString()}.00</span>
      </div>

      {/* Signature Records Section */}
      <div className='mt-8 bg-gray-50 p-6 rounded-lg'>
        <h3 className='text-lg font-semibold mb-6 text-gray-900'>Signature Records</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='bg-white p-4 rounded-lg border border-gray-200 space-y-3'>
            <div className='flex items-center justify-between mb-2'>
              <p className='font-semibold text-gray-700'>Request Initiation</p>
              <Badge className='bg-green-500/20 text-green-700 px-2 py-1 text-xs'>
                {data?.data?.requested_by ? 'Signed' : 'Pending'}
              </Badge>
            </div>
            <div className='flex items-center gap-5'>
              <h4 className='w-full max-w-[100px] text-sm text-gray-600'>Name:</h4>
              <h4 className='text-sm font-medium'>{getUserName(data?.data?.requested_by)}</h4>
            </div>
            <div className='flex items-center gap-5'>
              <h4 className='w-full max-w-[100px] text-sm text-gray-600'>Date:</h4>
              <h4 className='text-sm'>{formatDate(data?.data?.requested_date || data?.data?.request_date || data?.data?.date_of_request)}</h4>
            </div>
            <div className='flex items-center gap-5'>
              <h4 className='w-full max-w-[100px] text-sm text-gray-600'>Signature:</h4>
              <h4 className='text-sm italic text-gray-700'>{getUserName(data?.data?.requested_by)}</h4>
            </div>
          </div>
          <div className='bg-white p-4 rounded-lg border border-gray-200 space-y-3'>
            <div className='flex items-center justify-between mb-2'>
              <p className='font-semibold text-gray-700'>Review</p>
              <Badge className={`px-2 py-1 text-xs ${data?.data?.reviewed_by ? 'bg-green-500/20 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                {data?.data?.reviewed_by ? 'Signed' : 'Pending'}
              </Badge>
            </div>
            <div className='flex items-center gap-5'>
              <h4 className='w-full max-w-[100px] text-sm text-gray-600'>Name:</h4>
              <h4 className='text-sm font-medium'>{getUserName(data?.data?.reviewed_by)}</h4>
            </div>
            <div className='flex items-center gap-5'>
              <h4 className='w-full max-w-[100px] text-sm text-gray-600'>Date:</h4>
              <h4 className='text-sm'>{formatDate(data?.data?.reviewed_date)}</h4>
            </div>
            <div className='flex items-center gap-5'>
              <h4 className='w-full max-w-[100px] text-sm text-gray-600'>Signature:</h4>
              <h4 className='text-sm italic text-gray-700'>{getUserName(data?.data?.reviewed_by)}</h4>
            </div>
          </div>
          <div className='bg-white p-4 rounded-lg border border-gray-200 space-y-3'>
            <div className='flex items-center justify-between mb-2'>
              <p className='font-semibold text-gray-700'>Authorization</p>
              <Badge className={`px-2 py-1 text-xs ${data?.data?.authorized_by ? 'bg-green-500/20 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                {data?.data?.authorized_by ? 'Signed' : 'Pending'}
              </Badge>
            </div>
            <div className='flex items-center gap-5'>
              <h4 className='w-full max-w-[100px] text-sm text-gray-600'>Name:</h4>
              <h4 className='text-sm font-medium'>{getUserName(data?.data?.authorized_by)}</h4>
            </div>
            <div className='flex items-center gap-5'>
              <h4 className='w-full max-w-[100px] text-sm text-gray-600'>Date:</h4>
              <h4 className='text-sm'>{formatDate(data?.data?.authorized_date)}</h4>
            </div>
            <div className='flex items-center gap-5'>
              <h4 className='w-full max-w-[100px] text-sm text-gray-600'>Signature:</h4>
              <h4 className='text-sm italic text-gray-700'>{getUserName(data?.data?.authorized_by)}</h4>
            </div>
          </div>
          <div className='bg-white p-4 rounded-lg border border-gray-200 space-y-3'>
            <div className='flex items-center justify-between mb-2'>
              <p className='font-semibold text-gray-700'>Final Approval</p>
              <Badge className={`px-2 py-1 text-xs ${data?.data?.approved_by ? 'bg-green-500/20 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                {data?.data?.approved_by ? 'Signed' : 'Pending'}
              </Badge>
            </div>
            <div className='flex items-center gap-5'>
              <h4 className='w-full max-w-[100px] text-sm text-gray-600'>Name:</h4>
              <h4 className='text-sm font-medium'>{getUserName(data?.data?.approved_by)}</h4>
            </div>
            <div className='flex items-center gap-5'>
              <h4 className='w-full max-w-[100px] text-sm text-gray-600'>Date:</h4>
              <h4 className='text-sm'>{formatDate(data?.data?.approved_date)}</h4>
            </div>
            <div className='flex items-center gap-5'>
              <h4 className='w-full max-w-[100px] text-sm text-gray-600'>Signature:</h4>
              <h4 className='text-sm italic text-gray-700'>{getUserName(data?.data?.approved_by)}</h4>
            </div>
          </div>
        </div>
      </div>

      <div className=''>
        {data?.data?.specification_document ? (
          <Link href={data.data.specification_document} target='_blank' title={"Specification Document"}>
            <div className='bg-[#0000001A] py-2 px-4 w-fit  rounded-2xl flex items-center justify-center overflow-hidden cursor-pointer hover:bg-[#00000030] transition-colors'>
              <BsFiletypeDoc size={40} className='mr-2' />
              Specification Document
            </div>
          </Link>
        ) : (
          <div className='bg-[#0000001A] py-2 px-4 w-fit  rounded-2xl flex items-center justify-center overflow-hidden opacity-50'>
            <BsFiletypeDoc size={40} className='mr-2' />
            No Specification Document
          </div>
        )}
      </div>

    </section>
  );
};

export default PurchaseRequesttDetails;
