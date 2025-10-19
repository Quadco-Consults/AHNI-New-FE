"use client";

import logoPng from "@/assets/svgs/logo-bg.svg";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatDate } from "date-fns";
import { Button } from "components/ui/button";
import { useEffect, useState } from "react";
import { useGetSinglePurchaseOrder } from "@/features/procurement/controllers";
import Image from "next/image";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { toWords } from "number-to-words";
import { Icon } from "@iconify/react";

const Order = () => {
  const params = useParams();
  const [grandTotal, setGrandTotal] = useState("");
  const purchaseOrderId = params?.id as string;
  const { data } = useGetSinglePurchaseOrder(purchaseOrderId);

  // Download PDF function - Client-side generation
  const handleDownloadPDF = async () => {
    try {
      toast.info('Generating PDF...');

      const element = document.getElementById('purchase-order-content');
      if (!element) {
        toast.error('Purchase order content not found');
        return;
      }

      const actionButtons = document.querySelector('.action-buttons') as HTMLElement;
      const originalDisplay = actionButtons?.style.display;
      if (actionButtons) {
        actionButtons.style.display = 'none';
      }

      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      if (actionButtons) {
        actionButtons.style.display = originalDisplay || '';
      }

      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        toast.error('Failed to capture content for PDF');
        return;
      }

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pageHeight = 297;

      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      } else {
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

      const poNumber = data?.data?.purchase_order_number || purchaseOrderId;
      const fileName = `PO-${poNumber.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;

      pdf.save(fileName);

      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  const totalCost = data?.data?.purchase_order_items?.reduce(
    (sum: number, item: any) => sum + parseFloat(item.total_price || '0'),
    0
  ) || 0;

  useEffect(() => {
    if (data?.data?.purchase_order_items) {
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
    <section className='min-h-screen bg-gray-50 p-4 max-w-7xl mx-auto print:p-0 print:max-w-full print:min-h-0 print:bg-white'>
      {/* Back Button and Download Button - Hidden on Print */}
      <div className='mb-4 flex items-center justify-between print:hidden'>
        <Link href='/dashboard/procurement/purchase-order'>
          <Button variant='outline' className='flex items-center gap-2'>
            <Icon icon="solar:arrow-left-bold" fontSize={16} />
            Back to List
          </Button>
        </Link>
        <Button
          onClick={handleDownloadPDF}
          className='flex items-center gap-2 bg-green-600 hover:bg-green-700'
        >
          <Icon icon="solar:download-bold" fontSize={20} />
          Download PDF
        </Button>
      </div>

      {/* Printable Content */}
      <div id='purchase-order-content' className='bg-white shadow-lg print:shadow-none'>
        {/* Header Section */}
        <div className='bg-white p-8 border-b-4 border-primary'>
          {/* Logo and Organization Details - Centered */}
          <div className='flex flex-col items-center justify-center mb-6'>
            <Image
              src={logoPng}
              alt='AHNI Logo'
              width={150}
              height={150}
              className='mb-5'
            />
            <div className='text-center space-y-2'>
              <h1 className='text-4xl font-bold mb-3 text-gray-900'>Achieving Health Nigeria Initiative (AHNI)</h1>
              <p className='text-base text-gray-700 leading-relaxed max-w-3xl font-medium'>
                23 Celina Ayom Crescent, Cadastral Zone B09, behind NAF Conference Center, Jabi, Abuja
              </p>
              <div className='flex items-center justify-center gap-6 text-base text-gray-700 font-medium'>
                <span>Tel: +234-09-4615555 / +234-09-461500</span>
                <span className='text-primary font-bold'>•</span>
                <span>Fax: +234-09-4615511</span>
              </div>
            </div>
          </div>

          {/* Purchase Order Title and Number */}
          <div className='border-t-2 border-gray-300 pt-6 flex justify-between items-center'>
            <div className='flex-1'></div>
            <div className='text-center'>
              <div className='bg-primary text-white px-8 py-4 rounded-lg inline-block'>
                <h2 className='text-4xl font-bold'>PURCHASE ORDER</h2>
              </div>
            </div>
            <div className='flex-1 flex justify-end'>
              <div className='bg-primary text-white px-5 py-3 rounded-lg shadow-md'>
                <p className='text-xs font-semibold uppercase opacity-90'>PO Number</p>
                <p className='text-xl font-bold'>{data?.data?.purchase_order_number}</p>
              </div>
            </div>
          </div>
        </div>

        {/* PO Details and Vendor Section */}
        <div className='grid grid-cols-2 gap-6 p-6 border-b-2 border-gray-200'>
          {/* Vendor To */}
          <div>
            <div className='bg-primary/10 border-l-4 border-primary p-4 rounded'>
              <h3 className='text-primary font-bold text-lg mb-3 flex items-center gap-2'>
                <Icon icon="solar:user-bold" fontSize={20} />
                VENDOR TO
              </h3>
              <div className='space-y-2'>
                <div>
                  <p className='text-xs text-gray-600 uppercase font-semibold'>Company Name</p>
                  <p className='text-base font-bold text-gray-900'>{data?.data?.vendor_detail?.company_name || 'N/A'}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-600 uppercase font-semibold'>Registration Number</p>
                  <p className='text-sm text-gray-900'>{data?.data?.vendor_detail?.company_registration_number || 'N/A'}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-600 uppercase font-semibold'>Email Address</p>
                  <p className='text-sm text-gray-900'>{data?.data?.vendor_detail?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-600 uppercase font-semibold'>Business Type</p>
                  <p className='text-sm text-gray-900'>{data?.data?.vendor_detail?.type_of_business || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Order Details */}
          <div>
            <div className='bg-gray-50 border border-gray-300 p-4 rounded'>
              <h3 className='text-gray-800 font-bold text-lg mb-3 flex items-center gap-2'>
                <Icon icon="solar:document-text-bold" fontSize={20} />
                ORDER DETAILS
              </h3>
              <div className='space-y-3'>
                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <p className='text-xs text-gray-600 uppercase font-semibold'>Purchase Date</p>
                    <p className='text-sm font-bold text-gray-900'>
                      {data?.data?.purchase_date ? formatDate(data.data.purchase_date, "dd MMM, yyyy") : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className='text-xs text-gray-600 uppercase font-semibold'>Status</p>
                    <span className='inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300'>
                      {data?.data?.status_level || 'N/A'}
                    </span>
                  </div>
                </div>

                <div>
                  <p className='text-xs text-gray-600 uppercase font-semibold'>Delivery Location</p>
                  <p className='text-sm font-bold text-gray-900'>{data?.data?.location || 'AHNI Office - Abuja'}</p>
                </div>

                <div>
                  <p className='text-xs text-gray-600 uppercase font-semibold'>Payment Terms</p>
                  <p className='text-sm font-bold text-gray-900'>{data?.data?.payment_terms || 'Net 30 Days'}</p>
                </div>

                {data?.data?.comment && (
                  <div>
                    <p className='text-xs text-gray-600 uppercase font-semibold'>Comments</p>
                    <p className='text-sm text-gray-900'>{data.data.comment}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Items Table Section */}
        <div className='p-6'>
          <h3 className='text-xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
            <Icon icon="solar:list-bold" fontSize={24} />
            ORDER ITEMS
          </h3>

          <div className='overflow-x-auto border-2 border-gray-300 rounded-lg'>
            <table className='w-full'>
              <thead>
                <tr className='bg-primary text-white'>
                  <th className='text-center font-bold text-sm p-4 border-r border-primary-light'>S/N</th>
                  <th className='text-left font-bold text-sm p-4 border-r border-primary-light'>Item Description</th>
                  <th className='text-center font-bold text-sm p-4 border-r border-primary-light'>Quantity</th>
                  <th className='text-center font-bold text-sm p-4 border-r border-primary-light'>UOM</th>
                  <th className='text-right font-bold text-sm p-4 border-r border-primary-light'>Unit Price (₦)</th>
                  <th className='text-right font-bold text-sm p-4'>Amount (₦)</th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.purchase_order_items?.map((item: any, index: number) => (
                  <tr
                    key={item.id}
                    className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className='text-center font-semibold text-gray-700 p-4 border-r border-gray-200'>{index + 1}</td>
                    <td className='text-left p-4 border-r border-gray-200'>
                      <p className='font-bold text-gray-900 text-sm'>
                        {item.item_detail?.name || 'Item'}
                      </p>
                      {item.item_detail?.description && (
                        <p className='text-xs text-gray-600 mt-1'>{item.item_detail.description}</p>
                      )}
                      {item.description && (
                        <p className='text-xs text-gray-600 mt-1'>{item.description}</p>
                      )}
                    </td>
                    <td className='text-center font-semibold text-gray-900 p-4 border-r border-gray-200'>{item.quantity}</td>
                    <td className='text-center text-gray-700 p-4 border-r border-gray-200 uppercase text-sm'>
                      {item.uom || item.item_detail?.uom || 'EA'}
                    </td>
                    <td className='text-right font-semibold text-gray-900 p-4 border-r border-gray-200'>
                      {Number(item.unit_price).toLocaleString()}.00
                    </td>
                    <td className='text-right font-bold text-gray-900 p-4 text-base'>
                      {Number(item.total_price).toLocaleString()}.00
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className='bg-primary text-white'>
                  <td colSpan={5} className='p-4 text-right font-bold text-lg'>GRAND TOTAL (NGN):</td>
                  <td className='p-4 text-right font-bold text-2xl'>₦ {totalCost?.toLocaleString()}.00</td>
                </tr>
                <tr className='bg-primary/10'>
                  <td colSpan={6} className='p-4'>
                    <div className='flex items-start gap-2'>
                      <span className='text-sm font-semibold text-gray-700 whitespace-nowrap'>Amount in Words:</span>
                      <span className='text-sm font-bold text-primary uppercase'>{grandTotal}</span>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className='p-6 bg-gray-50 border-t-2 border-gray-200'>
          <div className='flex justify-between items-center mb-3'>
            <h3 className='text-lg font-bold text-gray-800 flex items-center gap-2'>
              <Icon icon="solar:document-text-bold" fontSize={20} />
              TERMS & CONDITIONS (Summary)
            </h3>
            <Link href={`/dashboard/procurement/purchase-order/${purchaseOrderId}/terms-and-conditions`} target='_blank'>
              <Button variant='outline' className='flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-white print:hidden'>
                <Icon icon="solar:document-bold" fontSize={18} />
                View Full Terms & Conditions
              </Button>
            </Link>
          </div>

          <div className='bg-white border border-gray-300 rounded-lg p-5'>
            <p className='text-xs text-gray-600 italic mb-4 bg-blue-50 border-l-4 border-primary p-3 rounded'>
              <Icon icon="solar:info-circle-bold" fontSize={16} className='inline mr-2' />
              The following are key highlights. For complete legal terms, please click "View Full Terms & Conditions" above.
            </p>

            <ul className='space-y-2.5 text-sm text-gray-700 leading-relaxed'>
              <li className='flex gap-2'>
                <span className='font-bold min-w-[20px] text-primary'>1.</span>
                <span>The Vendor hereby undertakes not to advertise or otherwise make public the fact that such vendor is a supplier to AHNI.</span>
              </li>
              <li className='flex gap-2'>
                <span className='font-bold min-w-[20px] text-primary'>2.</span>
                <span>The Vendor shall in no other manner whatsoever use the name, emblem, logo or official seal/stamp of AHNI in connection with its business or service.</span>
              </li>
              <li className='flex gap-2'>
                <span className='font-bold min-w-[20px] text-primary'>3.</span>
                <span>A Check/Bank transfer for the Grand Total less withholding tax for Goods, Works or Services render shall be made payable to the Vendor upon confirmation and acceptance by AHNI.</span>
              </li>
              <li className='flex gap-2'>
                <span className='font-bold min-w-[20px] text-primary'>4.</span>
                <span>Payment shall be made within 10 working days after acceptance by AHNI and submission of payment INVOICE by the Vendor.</span>
              </li>
              <li className='flex gap-2'>
                <span className='font-bold min-w-[20px] text-primary'>5.</span>
                <span>This Purchase Order once issued is valid only for a period of 60 days unless it is otherwise extended in writing by AHNI.</span>
              </li>
              <li className='flex gap-2'>
                <span className='font-bold min-w-[20px] text-primary'>6.</span>
                <span>All Items listed in the Purchase Order are subject to Final Inspection and Acceptance by AHNI before payment is made to the Vendor.</span>
              </li>
              <li className='flex gap-2'>
                <span className='font-bold min-w-[20px] text-primary'>7.</span>
                <span>Withholding Tax (WHT) will be deducted from the Grand Total in compliance with relevant Tax Laws.</span>
              </li>
              <li className='flex gap-2'>
                <span className='font-bold min-w-[20px] text-primary'>8.</span>
                <span>The Vendor will carry out duties and functions as described in this Purchase Order and/or Scope of Work/Annex. The Scope of Work/Annex can be amended during the validity period of the Purchase Order with the Vendor's agreement. Such amendment must be done in writing with signatures of both parties.</span>
              </li>
              <li className='flex gap-2'>
                <span className='font-bold min-w-[20px] text-primary'>9.</span>
                <span>It is AHNI's policy to comply with the laws and regulations of Nigeria, United States Government, European Union and the United Nations concerning the ineligibility of vendors, contractors, and service providers for reasons of FRAUD, CORRUPTION, TERRORISM, CHILD ABUSE and HUMAN TRAFFICKING. AHNI is prohibited from doing business with or providing support to any persons or entities that have been found to be engaged in or provide support for any such activities.</span>
              </li>
            </ul>

            <div className='mt-4 pt-4 border-t border-gray-300'>
              <p className='text-xs text-gray-600 text-center'>
                By accepting this Purchase Order, the Vendor agrees to be bound by all terms and conditions outlined in the complete
                <Link href={`/dashboard/procurement/purchase-order/${purchaseOrderId}/terms-and-conditions`} target='_blank' className='text-primary font-semibold hover:underline ml-1'>
                  Standard Purchase Order Terms and Conditions
                </Link>.
              </p>
            </div>
          </div>
        </div>

        {/* Approval Signatures Section */}
        <div className='p-6 border-t-2 border-gray-200'>
          <h3 className='text-lg font-bold text-gray-800 mb-4 flex items-center gap-2'>
            <Icon icon="solar:verified-check-bold" fontSize={24} />
            APPROVAL SIGNATURES
          </h3>

          <div className='grid grid-cols-3 gap-6'>
            {/* Reviewed By */}
            <div className='border-2 border-primary/30 rounded-lg p-5 bg-primary/5'>
              <div className='text-center mb-4'>
                <div className='bg-primary text-white py-2 px-4 rounded-lg inline-block'>
                  <h4 className='font-bold text-sm uppercase'>Reviewed By</h4>
                </div>
              </div>
              <div className='space-y-4'>
                <div className='bg-white border border-gray-300 rounded p-4'>
                  <p className='text-xs text-gray-600 mb-2 uppercase font-semibold'>Name</p>
                  <p className='text-lg font-bold text-gray-900'>
                    {data?.data?.reviewed_by_detail?.name || 'Pending Review'}
                  </p>
                </div>
                <div className='bg-white border border-gray-300 rounded p-4'>
                  <p className='text-xs text-gray-600 mb-2 uppercase font-semibold'>Date</p>
                  <p className='text-base font-bold text-primary'>
                    {data?.data?.reviewed_datetime ? formatDate(data.data.reviewed_datetime, "dd MMM, yyyy") : '_______________'}
                  </p>
                </div>
                {data?.data?.reviewed_by_detail?.name && (
                  <div className='bg-green-50 border border-green-300 rounded p-3 text-center'>
                    <Icon icon="solar:verified-check-bold" fontSize={24} className='inline text-green-600 mb-1' />
                    <p className='text-xs font-semibold text-green-700'>Digitally Approved</p>
                  </div>
                )}
              </div>
            </div>

            {/* Authorized By */}
            <div className='border-2 border-primary/30 rounded-lg p-5 bg-primary/5'>
              <div className='text-center mb-4'>
                <div className='bg-primary text-white py-2 px-4 rounded-lg inline-block'>
                  <h4 className='font-bold text-sm uppercase'>Authorized By</h4>
                </div>
              </div>
              <div className='space-y-4'>
                <div className='bg-white border border-gray-300 rounded p-4'>
                  <p className='text-xs text-gray-600 mb-2 uppercase font-semibold'>Name</p>
                  <p className='text-lg font-bold text-gray-900'>
                    {data?.data?.authorized_by_detail?.name || 'Pending Authorization'}
                  </p>
                </div>
                <div className='bg-white border border-gray-300 rounded p-4'>
                  <p className='text-xs text-gray-600 mb-2 uppercase font-semibold'>Date</p>
                  <p className='text-base font-bold text-primary'>
                    {data?.data?.authorized_datetime ? formatDate(data.data.authorized_datetime, "dd MMM, yyyy") : '_______________'}
                  </p>
                </div>
                {data?.data?.authorized_by_detail?.name && (
                  <div className='bg-green-50 border border-green-300 rounded p-3 text-center'>
                    <Icon icon="solar:verified-check-bold" fontSize={24} className='inline text-green-600 mb-1' />
                    <p className='text-xs font-semibold text-green-700'>Digitally Approved</p>
                  </div>
                )}
              </div>
            </div>

            {/* Approved By */}
            <div className='border-2 border-primary/30 rounded-lg p-5 bg-primary/5'>
              <div className='text-center mb-4'>
                <div className='bg-primary text-white py-2 px-4 rounded-lg inline-block'>
                  <h4 className='font-bold text-sm uppercase'>Approved By</h4>
                </div>
              </div>
              <div className='space-y-4'>
                <div className='bg-white border border-gray-300 rounded p-4'>
                  <p className='text-xs text-gray-600 mb-2 uppercase font-semibold'>Name</p>
                  <p className='text-lg font-bold text-gray-900'>
                    {data?.data?.approved_by_detail?.name || 'Pending Approval'}
                  </p>
                </div>
                <div className='bg-white border border-gray-300 rounded p-4'>
                  <p className='text-xs text-gray-600 mb-2 uppercase font-semibold'>Date</p>
                  <p className='text-base font-bold text-primary'>
                    {data?.data?.approved_date ? formatDate(data.data.approved_date, "dd MMM, yyyy") : '_______________'}
                  </p>
                </div>
                {data?.data?.approved_by_detail?.name && (
                  <div className='bg-green-50 border border-green-300 rounded p-3 text-center'>
                    <Icon icon="solar:verified-check-bold" fontSize={24} className='inline text-green-600 mb-1' />
                    <p className='text-xs font-semibold text-green-700'>Digitally Approved</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='bg-primary/10 border-t-2 border-primary p-4 text-center'>
          <p className='text-sm text-gray-700 font-semibold'>This is a computer-generated purchase order and is valid without signature.</p>
          <p className='text-xs text-gray-600 mt-1'>For inquiries, please contact the procurement department at procurement@ahni.org</p>
        </div>
      </div> {/* End of printable content */}
    </section>
  );
};

export default Order;
