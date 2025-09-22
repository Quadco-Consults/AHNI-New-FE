"use client";

import logoPng from "@/assets/svgs/logo-bg.svg";
import Card from "components/Card";
import DataTable from "components/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { toWords } from "number-to-words";
import { useParams } from "next/navigation";
import Link from "next/link";
// import { useGetPurchaseOrderById } from "@/features/procurement/controllers/purchaseOrderController";
// import { skipToken } from "@reduxjs/toolkit/query";
import { formatDate } from "date-fns";
import { Button } from "components/ui/button";
import { useEffect, useState } from "react";
import { BsFiletypeCsv, BsFiletypeDoc } from "react-icons/bs";
import { useGetSinglePurchaseOrder, useModifyPurchaseOrder } from "@/features/procurement/controllers";
import Image from "next/image";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Order = () => {
  const params = useParams();
  const [grandTotal, setGrandTotal] = useState("");
  const purchaseOrderId = params?.id as string;
  const { data } = useGetSinglePurchaseOrder(purchaseOrderId);
  const { modifyPurchaseOrder, isLoading: isModifying } = useModifyPurchaseOrder(purchaseOrderId);

  // Download PDF function - Client-side generation
  const handleDownloadPDF = async () => {
    try {
      toast.info('Generating PDF...');
      
      // Get the purchase order content element
      const element = document.getElementById('purchase-order-content');
      if (!element) {
        toast.error('Purchase order content not found');
        return;
      }

      // Hide action buttons during PDF generation
      const actionButtons = document.querySelector('.action-buttons') as HTMLElement;
      const originalDisplay = actionButtons?.style.display;
      if (actionButtons) {
        actionButtons.style.display = 'none';
      }

      // Wait a bit for the DOM to update
      await new Promise(resolve => setTimeout(resolve, 100));

      // Generate canvas from HTML with better options
      const canvas = await html2canvas(element, {
        scale: 1.5, // Reduced scale for better performance
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
        scrollX: 0,
        scrollY: 0
      });

      // Restore action buttons
      if (actionButtons) {
        actionButtons.style.display = originalDisplay || '';
      }

      // Validate canvas
      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        toast.error('Failed to capture content for PDF');
        return;
      }

      // Calculate dimensions for better fit
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Create PDF with proper settings
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      // Convert canvas to high-quality image
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      // Check if content fits on one page
      const pageHeight = 297; // A4 height in mm with margins
      
      if (imgHeight <= pageHeight) {
        // Single page
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      } else {
        // Multiple pages
        let sourceHeight = canvas.height;
        let position = 0;
        let pageNumber = 1;
        
        while (sourceHeight > 0) {
          const pageCanvas = document.createElement('canvas');
          const pageContext = pageCanvas.getContext('2d');
          
          pageCanvas.width = canvas.width;
          pageCanvas.height = Math.min(canvas.height * pageHeight / imgHeight, sourceHeight);
          
          if (pageContext) {
            pageContext.drawImage(
              canvas,
              0, position,
              canvas.width, pageCanvas.height,
              0, 0,
              pageCanvas.width, pageCanvas.height
            );
            
            const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);
            
            if (pageNumber > 1) {
              pdf.addPage();
            }
            
            pdf.addImage(pageImgData, 'JPEG', 0, 0, imgWidth, pageHeight);
          }
          
          sourceHeight -= pageCanvas.height;
          position += pageCanvas.height;
          pageNumber++;
        }
      }

      // Generate filename with sanitized characters
      const poNumber = data?.data?.purchase_order_number || purchaseOrderId;
      const fileName = `PO-${poNumber.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
      
      // Save the PDF
      pdf.save(fileName);
      
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  // Approval workflow handlers
  const handleApprovalAction = async (action: 'authorize' | 'approve' | 'agree') => {
    try {
      await modifyPurchaseOrder({ action });
      toast.success(`Purchase Order ${action}d successfully`);
      // Optionally refresh data or redirect
    } catch (error) {
      console.error(`${action} error:`, error);
      toast.error(`Failed to ${action} Purchase Order. Please try again.`);
    }
  };

  // Convert number to words
  const tableColumns: ColumnDef<any>[] = [
    {
      id: "deliveryLeadTime",
      header: () => <div className='bg-gray-200 p-4'>DELIVERY LEAD TIME</div>,
      columns: [
        {
          id: "leadTime",
          header: () => (
            <div className=' p-4'>{data?.data?.delivery_lead_time || "-"}</div>
          ),
          size: 120,
          columns: [
            {
              id: "fco",
              header: () => <div className='bg-gray-200 p-4'>FCO/BL</div>,
              accessorKey: "fco",
              size: 104,
            },
            {
              id: "qty1",
              header: () => <div className='bg-gray-200 p-4'>QTY</div>,
              accessorKey: "quantity",
              size: 81,
            },
            {
              id: "qty2",
              header: () => <div className='bg-gray-200 p-4'>UOM</div>,
              accessorKey: "uom",
              size: 81,
            },
          ],
        },
      ],
    },
    {
      id: "shipTo",
      header: () => <div className='bg-gray-200 p-4'>SHIP TO ADDRESS</div>,
      columns: [
        {
          id: "office",
          header: () => (
            <div className='p-4'>{data?.data?.location || "-"}</div>
          ),
          size: 120,
          columns: [
            {
              id: "description",
              header: () => (
                <div className='bg-gray-200 p-4'>
                  DESCRIPTION OF GOODS, WORKS OR SERVICES
                </div>
              ),
              accessorKey: "description",
              size: 473,

              cell: ({ row }) => {
                return <p>{row?.original?.item_detail?.description}</p>;
              },
            },
          ],
        },
      ],
    },
    {
      id: "fcoGroup",
      header: () => <div className='bg-gray-200 p-4'>FCO</div>,
      columns: [
        {
          id: "fcoCode",
          header: () => (
            <div className=' p-4'>{data?.data?.purchase_order_items?.[0]?.fco_number || "-"}</div>
          ),
          size: 120,
          columns: [
            {
              id: "unitPrice",
              header: () => <div className='bg-gray-200 p-4'>UNIT PRICE</div>,
              accessorKey: "unit_price",
              size: 160,
              cell: ({ row }) => {
                return (
                  <p>
                    ₦{Number(row?.original?.unit_price).toLocaleString()}.00
                  </p>
                );
              },
            },
          ],
        },
      ],
    },
    {
      id: "paymentTerms",
      header: () => <div className='bg-gray-200 p-4'>PAYMENT TERMS</div>,
      columns: [
        {
          id: "payment",
          header: () => (
            <div className=' p-4'>{data?.data?.payment_terms || "-"}</div>
          ),
          size: 210,
          columns: [
            {
              id: "totalPrice",
              header: () => <div className='bg-gray-200 p-4'>TOTAL PRICE</div>,
              accessorKey: "total_price",
              size: 120,
              cell: ({ row }) => {
                return (
                  <p>
                    ₦{Number(row?.original?.total_price).toLocaleString()}.00
                  </p>
                );
              },
            },
          ],
        },
      ],
    },
  ];

  const totalCost = data?.data?.purchase_order_items?.reduce(
    (sum: number, item: any) => sum + parseFloat(item.total_price || '0'),
    0
  ) || 0;

  useEffect(() => {
    if (data?.data?.purchase_order_items) {
      // Calculate the grand total
      const grandTotalNum = data?.data?.purchase_order_items?.reduce(
        (sum: number, item: any) => sum + parseFloat(item.total_price || '0'),
        0
      ) || 0;
      const grandTotalWords =
        toWords(grandTotalNum)?.toUpperCase() + " NAIRA ONLY";
      setGrandTotal(grandTotalWords);
    }
  }, [data]);

  return (
    <div className='bg-white p-8'>
      <div id='purchase-order-content'>
      <div className='flex justify-center items-center flex-col'>
        <Image src={logoPng} alt='logo' height={200} width={200} />
        <h1>Achieving Health Nigeria Initiative (AHNI)</h1>
      </div>
      <div className='mt-14 w-full flex justify-between items-center'>
        <Card className='bg-alternate border-primary'>
          <p className='text-primary text-[18px] text-center mb-4 font-semibold'>
            PURCHASE ORDER
          </p>
          <div className=''>
            <div className='flex gap-2 text-[12px]'>
              <p className=' w-[122px] font-semibold'> Purchase Date</p>
              <p className=''>
                {/* {formatDate(data?.data?.created_datetime, "dd, mm, yy")} */}
                {data?.data?.created_datetime &&
                  formatDate(data?.data?.created_datetime, "dd, MMM, yyyy")}
              </p>
            </div>
            <div className='flex gap-2 text-[12px]'>
              <p className=' w-[122px] font-semibold'>Purchase Order No.</p>
              <p className=''>{data?.data?.purchase_order_number}</p>
            </div>
          </div>
        </Card>
        <Card className='bg-alternate text-center border-primary'>
          <p className='text-primary text-[18px] mb-4 font-semibold'>
            REQUESTING UNIT/DEPT{" "}
          </p>{" "}
          <div className=''>
            <p className='font-semibold text-[12px]'>-</p>
          </div>
        </Card>
      </div>
      <div className='bg-[#BE8800] text-white font-semibold text-[20px] p-[10px] my-4'>
        Vendor: {data?.data?.vendor_detail?.company_name || 'Not Available'}
      </div>
      <div className='my-5'>
        <DataTable
          columns={tableColumns}
          data={data?.data?.purchase_order_items || []}
          headClass='p-0'
        />
      </div>
      <div className='flex flex-row-reverse gap-4'>
        {/* Grand Total Section */}
        <div className='flex-1'>
          <h3 className='font-bold text-lg'>
            Grand Total:
            <span className='font-normal ml-2'>
              ₦{totalCost?.toLocaleString()}
            </span>
          </h3>
          <div className='flex  mt-4 h-[211px] items-center border bg-gray-100  border-gray-300'>
            <div className='p-4'>
              <p className='text-[10px] p-0 text-start'>{grandTotal}</p>
            </div>
          </div>
        </div>
        <div className='text-[10px] max-w-[725px] my-4'>
          <h3 className='font-semibold'>General Conditions/Instructions</h3>
          <ul className='space-y-3 text-[10px] max-w-[725px] my-3'>
            <li>
              1. 1. The Vendor hereby undertakes not to advertise or otherwise
              make public the fact that such vendor is a supplier to AHNi;
            </li>
            <li>
              2. The Vendor shall in no other manner whatsoever use the name,
              emblem, logo or official seal/stamp of AHNi in connection with its
              business or service;
            </li>
            <li>
              3. A Check/Bank transfer for the Grand Total less withholding tax
              for Goods, Works or Services render shall be made payable to the
              Vendor upon confirmation and acceptance by AHNi;
            </li>
            <li>
              4. Payment shall be made within 10 working days after acceptance
              by AHNi and submission of payment INVOICE by the Vendor;
            </li>
            <li>
              5. This Purchase Order once issued is valid only for a period of
              60days unless it is otherwise extended in writing by AHNi;
            </li>
            <li>
              6. All Items listed in the Purchase Order are subject to Final
              Inspection and Acceptance by AHNi before payment is made to the
              Vendor;
            </li>
            <li>
              7. Withholding Tax (WHT) will be deducted from the Grand Total in
              compliance with relevant Tax Laws;
            </li>
            <li>
              8. The Vendor will carry out duties and functions as described in
              this Purchase Order and/or Scope of Work/Annex. The Scope of Work
              /Annex can be amended during the validity period of the Purchase
              Order with the Vendor&apos;s agreement. Such amended must be done in
              writing with signatures of both parties;
            </li>
            <li>
              9. It is AHNi’ s policy to comply with the laws and regulations of
              Nigeria, United State Government, European Union and the United
              Nations concerning the ineligibility of vendors, contractors, and
              service providers for reasons of FRAUD, CORRUPTION, TERRORISM,
              CHILD ABUSE and HUMAN TRAFFICKING. AHNi is prohibited from doing
              business with or providing support to any persons or entities that
              have been found to be engaged in or provide support for any such
              activities.
            </li>
          </ul>
        </div>
      </div>
      <div className=' w-full flex justify-between flex-wrap gap-8'>
        <Card className='flex-1 border-primary'>
          <p className='text-[16px] font-semibold mb-2'>Authorized By:</p>
          <div className='space-y-2'>
            <div className='flex gap-2 text-[12px]'>
              <p className=' w-[122px] font-semibold'>Signature:</p>
              <p className=''>-</p>
            </div>
            <div className='flex gap-2 text-[12px]'>
              <p className=' w-[122px] font-semibold'>Director of Finance</p>
              <p className=''> {data?.data?.authorized_by || "-"}</p>
            </div>
          </div>
        </Card>
        <Card className='flex-1 border-primary'>
          <p className='text-[16px] font-semibold mb-2'>Approved By:</p>
          <div className='space-y-2'>
            <div className='flex gap-2 text-[12px]'>
              <p className=' w-[122px] font-semibold'>Signature:</p>
              <p className=''>-</p>
            </div>
            <div className='flex gap-2 text-[12px]'>
              <p className=' w-[122px] font-semibold'>Director of Operation</p>
              <p className=''> {data?.data?.approved_by_detail || "-"}</p>
            </div>
          </div>
        </Card>{" "}
        <Card className='flex-1 border-primary'>
          <p className='text-[16px] font-semibold mb-2'>
            Agreed and Accepted By: {data?.data?.agreed_by_detail || "-"}
          </p>
          <div className='space-y-2'>
            <div className='flex gap-2 text-[12px]'>
              <p className=' w-[122px] font-semibold'>Signature:</p>
              <p className=''> {data?.data?.agreed_date || "-"}</p>
            </div>
            <div className='flex gap-2 text-[12px]'>
              <span className=' w-[122px] font-semibold'>Date</span>
              <span className=''>-</span>
            </div>
          </div>
        </Card>
      </div>
      </div>
      
      {/* Action buttons - outside of PDF content */}
      <div className='action-buttons'>
        {/* Approval Actions */}
        {data?.data?.status_level === 'PENDING' && (
          <div className='w-full flex justify-center my-6 gap-3'>
            <Button 
              onClick={() => handleApprovalAction('authorize')} 
              disabled={isModifying}
              variant="outline"
              className='border-yellow-500 text-yellow-600 hover:bg-yellow-50'
            >
              {isModifying ? 'Processing...' : 'Authorize'}
            </Button>
            <Button 
              onClick={() => handleApprovalAction('approve')} 
              disabled={isModifying}
              variant="outline"
              className='border-blue-500 text-blue-600 hover:bg-blue-50'
            >
              {isModifying ? 'Processing...' : 'Approve'}
            </Button>
            <Button 
              onClick={() => handleApprovalAction('agree')} 
              disabled={isModifying}
              variant="outline"
              className='border-green-500 text-green-600 hover:bg-green-50'
            >
              {isModifying ? 'Processing...' : 'Agree'}
            </Button>
          </div>
        )}

        <div className='w-full flex justify-end my-8 gap-3'>
        <Link href={"file"} target='_blank' title={"file"}>
          <Button
            variant='secondary'
            className='bg-[#0000001A] py-2 px-4 w-fit  rounded-2xl flex items-center justify-center overflow-hidden'
          >
            <BsFiletypeDoc size={25} className='mr-2' />
            Specification Document
          </Button>
        </Link>
        <Button variant='custom' onClick={handleDownloadPDF}>
          <span>
            <BsFiletypeCsv size={25} />
          </span>
          Download PDF
        </Button>
        <Link href={`/dashboard/procurement/purchase-order/${purchaseOrderId}/terms-and-conditions`} className=''>
          <Button>Terms and Conditions</Button>
        </Link>
        </div>
      </div>
    </div>
  );
};

export default Order;
