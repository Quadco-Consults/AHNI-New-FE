"use client";

import logoPng from "@/assets/svgs/logo-bg.svg";
import Card from "components/Card";
import DataTable from "components/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useParams } from "next/navigation";
import { Button } from "components/ui/button";
import { BsFiletypeCsv, BsFiletypeDoc } from "react-icons/bs";
import { useGetSingleGoodReceiveNoteQuery } from "@/features/admin/controllers/goodReceiveNoteController";
import { useMemo } from "react";
import Link from "next/link";

const tableColumns: ColumnDef<any>[] = [
  {
    header: "Description of Items",
    cell: ({ row }) => row.original?.item_detail?.name || "N/A",
  },
  {
    header: "Unit of Measurement",
    cell: ({ row }) => row.original?.item_detail?.uom || "N/A",
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
    cell: ({ row }) => row.original?.fco_number_detail?.code || "N/A",
  },
];

export default function GoodReceiveNoteDetails() {
  const { id } = useParams();

  const { data } = useGetSingleGoodReceiveNoteQuery(id || "", !!id);

  const details = useMemo(() => {
    if (!data) return {};

    const grnData = data?.data;
    const purchaseOrder = grnData?.purchase_order;
    const vendor = purchaseOrder?.vendor_detail;

    return {
      // GRN specific fields
      invoice_number: grnData?.invoice_number,
      waybill_number: grnData?.waybill_number,
      remark: grnData?.remark,
      created_datetime: grnData?.created_datetime,
      
      // Purchase Order fields
      purchase_order_number: purchaseOrder?.purchase_order_number,
      purchase_date: purchaseOrder?.purchase_date,
      status_level: purchaseOrder?.status_level,
      
      // Vendor details
      vendor_name: vendor?.company_name,
      vendor_email: vendor?.email,
      vendor_registration: vendor?.company_registration_number,
      vendor_business_type: vendor?.type_of_business,
      
      // Items
      purchase_order_items: purchaseOrder?.purchase_order_items || [],
      
      // Approval/Signature fields
      created_by: grnData?.created_by,
      accepted_by: grnData?.accepted_by,
      rejected_by: grnData?.rejected_by,
      accepted_datetime: grnData?.accepted_datetime,
      rejected_datetime: grnData?.rejected_datetime,
      
      // Purchase Order approval fields
      authorized_by: purchaseOrder?.authorized_by,
      authorized_datetime: purchaseOrder?.authorized_datetime,
      approved_date: purchaseOrder?.approved_date,
      agreed_date: purchaseOrder?.agreed_date,
    };
  }, [data]);

  return (
    <div className='bg-white p-8'>
      <div className='flex justify-center items-center flex-col'>
        <img src={logoPng} alt='logo' width={200} />
        <h1>Achieving Health Nigeria Initiative (AHNI)</h1>
      </div>
      <div className='mt-5'>
        <Card className='bg-alternate border-primary'>
          <h3 className='text-primary text-[18px] text-center mb-4 font-semibold'>
            Goods Receive Note
          </h3>

          <div className='space-y-5'>
            <div className='flex gap-2'>
              <p className='font-semibold'>Goods Receive Note Number:</p>
              <p>{details?.invoice_number || 'N/A'}</p>
            </div>

            <div className='flex gap-2'>
              <p className='font-semibold'>Receipt Date:</p>
              <p>{details?.created_datetime ? new Date(details.created_datetime).toLocaleDateString("en-US") : 'N/A'}</p>
            </div>

            <div className='flex gap-2'>
              <p className='font-semibold'>Invoice Number:</p>
              <p>{details?.invoice_number || 'N/A'}</p>
            </div>

            <div className='flex gap-2'>
              <p className='font-semibold'>Waybill Number:</p>
              <p>{details?.waybill_number || 'N/A'}</p>
            </div>

            <div className='flex gap-2'>
              <p className='font-semibold'>Purchase Order Number:</p>
              <p>{details?.purchase_order_number || 'N/A'}</p>
            </div>

            <div className='flex gap-2'>
              <p className='font-semibold'>Purchase Date:</p>
              <p>{details?.purchase_date ? new Date(details.purchase_date).toLocaleDateString("en-US") : 'N/A'}</p>
            </div>

            <div className='flex gap-2'>
              <p className='font-semibold'>Status:</p>
              <p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  details?.status_level === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  details?.status_level === 'APPROVED' ? 'bg-green-100 text-green-800' :
                  details?.status_level === 'REJECTED' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {details?.status_level || 'N/A'}
                </span>
              </p>
            </div>

            {details?.remark && (
              <div className='flex gap-2'>
                <p className='font-semibold'>Remarks:</p>
                <p>{details.remark}</p>
              </div>
            )}
          </div>
        </Card>
      </div>
      <div className='bg-[#BE8800] text-white font-semibold text-[20px] p-[10px] my-4'>
        <div className='flex justify-between items-center flex-wrap'>
          <span>Vendor: {details?.vendor_name || 'N/A'}</span>
          {details?.vendor_email && (
            <span className='text-sm font-normal'>Email: {details.vendor_email}</span>
          )}
        </div>
        {(details?.vendor_registration || details?.vendor_business_type) && (
          <div className='text-sm font-normal mt-1'>
            {details?.vendor_registration && <span>Reg: {details.vendor_registration}</span>}
            {details?.vendor_business_type && details?.vendor_registration && <span> | </span>}
            {details?.vendor_business_type && <span>Type: {details.vendor_business_type}</span>}
          </div>
        )}
      </div>
      <div className='my-5'>
        <DataTable 
          columns={tableColumns} 
          data={details?.purchase_order_items || []} 
          headClass='p-0' 
        />
      </div>

      <div className=' w-full flex justify-between flex-wrap gap-8'>
        <Card className='flex-1 border-primary'>
          <p className='text-[16px] font-semibold mb-2'>Procurement Officer</p>
          <div className='space-y-2'>
            <div className='flex gap-2 text-[12px]'>
              <p className=' w-[122px] font-semibold'>Signature:</p>
              <p className=''>{details?.authorized_by ? '✓ Authorized' : 'Pending'}</p>
            </div>

            <div className='flex gap-2 text-[12px]'>
              <p className=' w-[122px] font-semibold'>Date:</p>
              <p className=''>
                {details?.authorized_datetime 
                  ? new Date(details.authorized_datetime).toLocaleDateString("en-US")
                  : '-'
                }
              </p>
            </div>
          </div>
        </Card>

        <Card className='flex-1 border-primary'>
          <p className='text-[16px] font-semibold mb-2'>Purchase Order Approver</p>
          <div className='space-y-2'>
            <div className='flex gap-2 text-[12px]'>
              <p className=' w-[122px] font-semibold'>Signature:</p>
              <p className=''>{details?.approved_date ? '✓ Approved' : 'Pending'}</p>
            </div>

            <div className='flex gap-2 text-[12px]'>
              <p className=' w-[122px] font-semibold'>Date:</p>
              <p className=''>
                {details?.approved_date 
                  ? new Date(details.approved_date).toLocaleDateString("en-US")
                  : '-'
                }
              </p>
            </div>
          </div>
        </Card>

        <Card className='flex-1 border-primary'>
          <p className='text-[16px] font-semibold mb-2'>
            GRN Created By:
          </p>
          <div className='space-y-2'>
            <div className='flex gap-2 text-[12px]'>
              <p className=' w-[122px] font-semibold'>Signature:</p>
              <p className=''>{details?.created_by ? '✓ Created' : '-'}</p>
            </div>
            <div className='flex gap-2 text-[12px]'>
              <p className=' w-[122px] font-semibold'>Date:</p>
              <p className=''>
                {details?.created_datetime 
                  ? new Date(details.created_datetime).toLocaleDateString("en-US")
                  : '-'
                }
              </p>
            </div>
          </div>
        </Card>

        <Card className='flex-1 border-primary'>
          <p className='text-[16px] font-semibold mb-2'>Goods Acceptance Status:</p>
          <div className='space-y-2'>
            <div className='flex gap-2 text-[12px]'>
              <p className=' w-[122px] font-semibold'>Status:</p>
              <p className=''>
                {details?.accepted_by ? (
                  <span className='text-green-600 font-semibold'>✓ Accepted</span>
                ) : details?.rejected_by ? (
                  <span className='text-red-600 font-semibold'>✗ Rejected</span>  
                ) : (
                  <span className='text-yellow-600 font-semibold'>⏳ Pending</span>
                )}
              </p>
            </div>
            <div className='flex gap-2 text-[12px]'>
              <p className=' w-[122px] font-semibold'>Date:</p>
              <p className=''>
                {details?.accepted_datetime 
                  ? new Date(details.accepted_datetime).toLocaleDateString("en-US")
                  : details?.rejected_datetime
                  ? new Date(details.rejected_datetime).toLocaleDateString("en-US")
                  : '-'
                }
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className='flex justify-end my-8 gap-3'>
        <Link href={"file"} target='_blank' title={"file"}>
          <Button
            variant='secondary'
            className='bg-[#0000001A] py-2 px-4 w-fit  rounded-2xl flex items-center justify-center overflow-hidden'
          >
            <BsFiletypeDoc size={25} className='mr-2' />
            Specification Document
          </Button>
        </Link>

        <Button variant='custom'>
          <span>
            <BsFiletypeCsv size={25} />
          </span>
          Download
        </Button>
      </div>
    </div>
  );
}
