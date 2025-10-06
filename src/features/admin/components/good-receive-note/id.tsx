"use client";

import Card from "components/Card";
import DataTable from "components/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useParams } from "next/navigation";
import { Button } from "components/ui/button";
import { BsFiletypeCsv, BsFiletypeDoc } from "react-icons/bs";
import { useGetSingleGoodReceiveNoteQuery, useDownloadGoodReceiveNote } from "@/features/admin/controllers/goodReceiveNoteController";
import { useGetSinglePurchaseOrder } from "@/features/procurement/controllers/purchaseOrderController";
import { useMemo, useState } from "react";
import Link from "next/link";

const tableColumns: ColumnDef<any>[] = [
  {
    header: "Description of Items",
    cell: ({ row }) => {
      return row.original?.item_detail?.name ||
             row.original?.description ||
             `Item ID: ${row.original?.item || row.original?.id || 'N/A'}`;
    },
  },
  {
    header: "Unit of Measurement",
    cell: ({ row }) => {
      return row.original?.item_detail?.uom ||
             row.original?.uom ||
             "Not specified";
    },
  },
  {
    header: "Quantity Ordered",
    cell: ({ row }) => row.original?.quantity || 0,
  },
  {
    header: "Unit Price",
    cell: ({ row }) => {
      const price = parseFloat(row.original?.unit_price || "0");
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
      }).format(price);
    },
  },
  {
    header: "Total Price",
    cell: ({ row }) => {
      const price = parseFloat(row.original?.total_price || "0");
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
      }).format(price);
    },
  },
  {
    header: "FCO Number",
    cell: ({ row }) => {
      return row.original?.fco_number_detail?.code ||
             row.original?.fco_number ||
             "Not specified";
    },
  },
];

export default function GoodReceiveNoteDetails() {
  const { id } = useParams();
  const [downloading, setDownloading] = useState(false);

  const { data } = useGetSingleGoodReceiveNoteQuery(id as string || "", !!id);
  const { downloadGoodReceiveNote } = useDownloadGoodReceiveNote(id as string || "");

  // Get purchase order details to fetch items
  const purchaseOrderId = data?.data?.purchase_order?.id;
  const { data: purchaseOrderData } = useGetSinglePurchaseOrder(
    purchaseOrderId || "",
    !!purchaseOrderId
  );

  const details = useMemo(() => {
    if (!data) return {};

    const grnData = data?.data;
    const purchaseOrder = grnData?.purchase_order;
    const poData = purchaseOrderData?.data;

    console.log("🔍 GRN Data:", grnData);
    console.log("🔍 Purchase Order from GRN:", purchaseOrder);
    console.log("🔍 Full PO Data:", poData);
    console.log("🔍 PO Items:", poData?.purchase_order_items);

    return {
      // GRN specific fields
      invoice_number: grnData?.invoice_number,
      waybill_number: grnData?.waybill_number,
      remark: grnData?.remark,
      created_datetime: grnData?.created_datetime,

      // Purchase Order fields
      purchase_order_number: purchaseOrder?.purchase_order_number,

      // Vendor details from full PO data
      vendor_name: poData?.vendor_detail?.company_name || purchaseOrder?.vendor_name,
      vendor_email: poData?.vendor_detail?.email,
      vendor_registration: poData?.vendor_detail?.company_registration_number,
      vendor_business_type: poData?.vendor_detail?.type_of_business,

      // Items from full PO data
      purchase_order_items: poData?.purchase_order_items || [],

      // Approval/Signature fields
      created_by: grnData?.created_by,
      approved_by: grnData?.approved_by,
      rejected_by: grnData?.rejected_by,
      approved_datetime: grnData?.approved_datetime,
      rejected_datetime: grnData?.rejected_datetime,

      // Purchase Order approval fields from full PO data
      authorized_datetime: poData?.authorized_datetime || purchaseOrder?.authorized_datetime,
      purchase_date: poData?.purchase_date,
      status_level: poData?.status_level,

      // Status from GRN
      status: grnData?.status,
    };
  }, [data, purchaseOrderData]);

  const handleDownload = async (format: 'pdf' | 'csv' = 'pdf') => {
    if (!id) return;

    setDownloading(true);
    try {
      await downloadGoodReceiveNote(format);
    } catch (error) {
      console.error('Download failed:', error);
      // You might want to show a toast notification here
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className='bg-white p-6 max-w-6xl mx-auto'>
      {/* Compact Header Section */}
      <div className='flex justify-center items-center flex-col mb-6 pb-4 border-b border-gray-200'>
        <div className='mb-3'>
          <img
            src="/imgs/logo.png"
            alt='AHNI Logo'
            className='w-32 h-auto object-contain mx-auto'
          />
        </div>
        <div className='text-center'>
          <h1 className='text-xl font-semibold text-gray-800 mb-1'>
            Achieving Health Nigeria Initiative (AHNI)
          </h1>
          <p className='text-gray-500 text-xs'>
            Healthcare Excellence Through Innovation
          </p>
        </div>
      </div>
      {/* Main Content */}
      <div className='mt-4'>
        <Card className='bg-gray-50 border border-gray-200'>
          <div className='text-center mb-4'>
            <h3 className='text-gray-800 text-lg font-semibold'>
              Goods Receive Note
            </h3>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-3'>
              <div className='flex justify-between items-center py-2 border-b border-gray-200'>
                <span className='text-sm font-medium text-gray-600'>GRN Number:</span>
                <span className='text-sm font-semibold text-gray-800'>{details?.invoice_number || 'N/A'}</span>
              </div>

              <div className='flex justify-between items-center py-2 border-b border-gray-200'>
                <span className='text-sm font-medium text-gray-600'>Receipt Date:</span>
                <span className='text-sm font-semibold text-gray-800'>
                  {details?.created_datetime ? new Date(details.created_datetime).toLocaleDateString("en-US") : 'N/A'}
                </span>
              </div>

              <div className='flex justify-between items-center py-2 border-b border-gray-200'>
                <span className='text-sm font-medium text-gray-600'>Invoice Number:</span>
                <span className='text-sm font-semibold text-gray-800'>{details?.invoice_number || 'N/A'}</span>
              </div>

              <div className='flex justify-between items-center py-2 border-b border-gray-200'>
                <span className='text-sm font-medium text-gray-600'>Waybill Number:</span>
                <span className='text-sm font-semibold text-gray-800'>{details?.waybill_number || 'N/A'}</span>
              </div>
            </div>

            <div className='space-y-3'>
              <div className='flex justify-between items-center py-2 border-b border-gray-200'>
                <span className='text-sm font-medium text-gray-600'>PO Number:</span>
                <span className='text-sm font-semibold text-gray-800'>{details?.purchase_order_number || 'N/A'}</span>
              </div>

              <div className='flex justify-between items-center py-2 border-b border-gray-200'>
                <span className='text-sm font-medium text-gray-600'>Purchase Date:</span>
                <span className='text-sm font-semibold text-gray-800'>
                  {details?.purchase_date ? new Date(details.purchase_date).toLocaleDateString("en-US") : 'N/A'}
                </span>
              </div>

              <div className='flex justify-between items-center py-2 border-b border-gray-200'>
                <span className='text-sm font-medium text-gray-600'>PO Status:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  details?.status_level === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  details?.status_level === 'APPROVED' ? 'bg-green-100 text-green-800' :
                  details?.status_level === 'REJECTED' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {details?.status_level || 'N/A'}
                </span>
              </div>

              <div className='flex justify-between items-center py-2 border-b border-gray-200'>
                <span className='text-sm font-medium text-gray-600'>GRN Status:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  details?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  details?.status === 'approved' ? 'bg-green-100 text-green-800' :
                  details?.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  details?.status === 'received' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {details?.status?.toUpperCase() || 'N/A'}
                </span>
              </div>

              {details?.remark && (
                <div className='flex justify-between items-center py-2 border-b border-gray-200'>
                  <span className='text-sm font-medium text-gray-600'>Remarks:</span>
                  <span className='text-sm font-semibold text-gray-800'>{details.remark}</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
      {/* Vendor Section */}
      <div className='bg-gray-100 border border-gray-300 rounded p-4 my-4'>
        <div className='flex justify-between items-center mb-3'>
          <h3 className='font-semibold text-gray-800'>Vendor Information</h3>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3 text-sm'>
          <div className='flex justify-between'>
            <span className='text-gray-600'>Vendor Name:</span>
            <span className='font-medium text-gray-800'>{details?.vendor_name || 'N/A'}</span>
          </div>
          {details?.vendor_email && (
            <div className='flex justify-between'>
              <span className='text-gray-600'>Email:</span>
              <span className='font-medium text-gray-800'>{details.vendor_email}</span>
            </div>
          )}
          {details?.vendor_registration && (
            <div className='flex justify-between'>
              <span className='text-gray-600'>Registration:</span>
              <span className='font-medium text-gray-800'>{details.vendor_registration}</span>
            </div>
          )}
          {details?.vendor_business_type && (
            <div className='flex justify-between'>
              <span className='text-gray-600'>Business Type:</span>
              <span className='font-medium text-gray-800'>{details.vendor_business_type}</span>
            </div>
          )}
        </div>
      </div>
      {/* Items Table */}
      <div className='my-4'>
        <h3 className='font-semibold text-gray-800 mb-3'>Purchase Order Items</h3>
        <div className='border border-gray-200 rounded overflow-hidden'>
          <DataTable
            columns={tableColumns}
            data={details?.purchase_order_items || []}
            headClass='bg-gray-50 font-medium text-sm'
          />
        </div>
      </div>

      {/* Signatures Section */}
      <div className='my-6'>
        <h3 className='font-semibold text-gray-800 mb-4'>Approvals & Signatures</h3>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <Card className='bg-white border border-gray-200 p-3'>
            <h4 className='font-medium text-gray-800 text-sm mb-2'>PO Authorization</h4>
            <div className='space-y-1 text-xs'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Status:</span>
                <span className={`px-1 py-0.5 rounded text-xs ${
                  details?.authorized_datetime ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {details?.authorized_datetime ? '✓ Authorized' : 'Pending'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Date:</span>
                <span className='font-medium text-gray-800'>
                  {details?.authorized_datetime
                    ? new Date(details.authorized_datetime).toLocaleDateString("en-US")
                    : '-'
                  }
                </span>
              </div>
            </div>
          </Card>

          <Card className='bg-white border border-gray-200 p-3'>
            <h4 className='font-medium text-gray-800 text-sm mb-2'>GRN Approval</h4>
            <div className='space-y-1 text-xs'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Status:</span>
                <span className={`px-1 py-0.5 rounded text-xs ${
                  details?.approved_datetime ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {details?.approved_datetime ? '✓ Approved' : 'Pending'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Date:</span>
                <span className='font-medium text-gray-800'>
                  {details?.approved_datetime
                    ? new Date(details.approved_datetime).toLocaleDateString("en-US")
                    : '-'
                  }
                </span>
              </div>
            </div>
          </Card>

          <Card className='bg-white border border-gray-200 p-3'>
            <h4 className='font-medium text-gray-800 text-sm mb-2'>GRN Creator</h4>
            <div className='space-y-1 text-xs'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Status:</span>
                <span className={`px-1 py-0.5 rounded text-xs ${
                  details?.created_by ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {details?.created_by ? '✓ Created' : '-'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Date:</span>
                <span className='font-medium text-gray-800'>
                  {details?.created_datetime
                    ? new Date(details.created_datetime).toLocaleDateString("en-US")
                    : '-'
                  }
                </span>
              </div>
            </div>
          </Card>

          <Card className='bg-white border border-gray-200 p-3'>
            <h4 className='font-medium text-gray-800 text-sm mb-2'>GRN Status</h4>
            <div className='space-y-1 text-xs'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Status:</span>
                <span className={`px-1 py-0.5 rounded text-xs ${
                  details?.approved_by ? 'bg-green-100 text-green-800' :
                  details?.rejected_by ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {details?.approved_by ? '✓ Approved' :
                   details?.rejected_by ? '✗ Rejected' :
                   '⏳ Pending'
                  }
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Date:</span>
                <span className='font-medium text-gray-800'>
                  {details?.approved_datetime
                    ? new Date(details.approved_datetime).toLocaleDateString("en-US")
                    : details?.rejected_datetime
                    ? new Date(details.rejected_datetime).toLocaleDateString("en-US")
                    : '-'
                  }
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex justify-end gap-2 mt-6'>
        <Link href={"file"} target='_blank' title={"Specification Document"}>
          <Button
            variant='outline'
            className='flex items-center gap-2 text-sm'
          >
            <BsFiletypeDoc size={16} />
            Specification Document
          </Button>
        </Link>

        <Button
          variant='default'
          className='flex items-center gap-2 text-sm'
          onClick={() => handleDownload('pdf')}
          disabled={downloading}
        >
          <BsFiletypeCsv size={16} />
          {downloading ? 'Downloading...' : 'Download GRN'}
        </Button>
      </div>
    </div>
  );
}
