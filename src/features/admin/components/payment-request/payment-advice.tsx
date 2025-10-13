"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useGetSinglePaymentRequestQuery } from "@/features/admin/controllers/paymentRequestController";
import { LoadingSpinner } from "components/Loading";
import logoPng from "assets/imgs/logo.png";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { PrinterIcon, DownloadIcon, ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PaymentAdvice() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const { data, isLoading } = useGetSinglePaymentRequestQuery(id || "", !!id);

  // Format currency
  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(num);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Trigger print which allows user to save as PDF
    window.print();
  };

  if (isLoading) {
    return (
      <div className='bg-white p-8 flex justify-center items-center min-h-screen'>
        <LoadingSpinner />
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className='bg-white p-8 flex justify-center items-center min-h-screen'>
        <div className="text-red-500">Error loading payment request data</div>
      </div>
    );
  }

  const paymentRequest = data.data;

  return (
    <div className='bg-white p-6 max-w-7xl mx-auto print:p-0 print:max-w-full'>
      {/* Action Buttons - Hidden on Print */}
      <div className='mb-6 flex items-center justify-between print:hidden'>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back
        </Button>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="flex items-center gap-2"
          >
            <PrinterIcon className="w-4 h-4" />
            Print
          </Button>
          <Button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <DownloadIcon className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Payment Advice Document */}
      <div className='bg-white border-2 border-black rounded-lg overflow-hidden print:border print:rounded-none'>
        {/* Logo Header */}
        <div className='border-b-2 border-black p-6 bg-white flex items-center justify-between print:p-4'>
          <img src={(logoPng as any).src || logoPng} alt='logo' width={140} className='print:w-32' />
          <div className='text-right'>
            <h1 className='text-3xl font-bold text-gray-900 print:text-2xl'>PAYMENT ADVICE</h1>
            <p className='text-sm text-gray-600 mt-1'>Ref: {paymentRequest.id.substring(0, 8).toUpperCase()}</p>
          </div>
        </div>

        {/* Payment Request Details */}
        <table className='w-full border-collapse text-base print:text-sm'>
          <tbody>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-blue-100 font-semibold w-1/4 print:p-3'>Payment Date:</td>
              <td className='p-4 print:p-3'>{format(new Date(paymentRequest.payment_date), "dd MMMM yyyy")}</td>
            </tr>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-blue-100 font-semibold print:p-3'>Payment Type:</td>
              <td className='p-4 print:p-3'>{paymentRequest.payment_type_display}</td>
            </tr>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-blue-100 font-semibold print:p-3'>Status:</td>
              <td className='p-4 print:p-3'>
                <span className='font-semibold text-green-700'>{paymentRequest.status}</span>
              </td>
            </tr>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-blue-100 font-semibold print:p-3'>Requested By:</td>
              <td className='p-4 print:p-3'>{paymentRequest.requested_by?.full_name || "N/A"}</td>
            </tr>
            {paymentRequest.payment_type === "PURCHASE_ORDER" && paymentRequest.purchase_order && (
              <tr className='border-b border-black'>
                <td className='border-r border-black p-4 bg-blue-100 font-semibold print:p-3'>Purchase Order:</td>
                <td className='p-4 print:p-3'>{paymentRequest.purchase_order.purchase_order_number}</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Payment Reason */}
        {paymentRequest.payment_reason && (
          <div className='border-b border-black p-4 bg-yellow-50 print:p-3'>
            <p className='font-semibold text-base mb-2'>Payment Reason:</p>
            <p className='text-base leading-relaxed'>{paymentRequest.payment_reason}</p>
          </div>
        )}

        {/* Payment Items Header */}
        <div className='bg-orange-200 border-b border-black'>
          <table className='w-full border-collapse text-base print:text-sm'>
            <thead>
              <tr>
                <th className='border-r border-black p-4 font-bold text-left print:p-3' style={{width: '5%'}}>S/N</th>
                <th className='border-r border-black p-4 font-bold text-left print:p-3' style={{width: '25%'}}>Payee Name</th>
                <th className='border-r border-black p-4 font-bold text-left print:p-3' style={{width: '20%'}}>Bank Name</th>
                <th className='border-r border-black p-4 font-bold text-center print:p-3' style={{width: '20%'}}>Account Number</th>
                <th className='p-4 font-bold text-right print:p-3' style={{width: '30%'}}>Amount</th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Payment Items */}
        <table className='w-full border-collapse text-base print:text-sm'>
          <tbody>
            {paymentRequest.payment_items?.map((item: any, index: number) => (
              <tr key={item.id} className='border-b border-black'>
                <td className='border-r border-black p-4 text-center print:p-3' style={{width: '5%'}}>{index + 1}</td>
                <td className='border-r border-black p-4 print:p-3' style={{width: '25%'}}>{item.payment_to}</td>
                <td className='border-r border-black p-4 print:p-3' style={{width: '20%'}}>{item.bank_name}</td>
                <td className='border-r border-black p-4 text-center font-mono print:p-3' style={{width: '20%'}}>{item.account_number}</td>
                <td className='p-4 text-right font-semibold print:p-3' style={{width: '30%'}}>
                  {formatCurrency(item.amount_in_figures)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total Amount */}
        <div className='bg-green-200 border-b-2 border-black'>
          <table className='w-full border-collapse text-lg print:text-base'>
            <tbody>
              <tr>
                <td className='p-5 text-left font-bold print:p-3' style={{width: '70%'}}>TOTAL AMOUNT</td>
                <td className='p-5 text-right font-bold text-xl print:p-3 print:text-lg' style={{width: '30%'}}>
                  {formatCurrency(paymentRequest.total_amount)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Amount in Words */}
        <div className='border-b border-black p-4 bg-gray-50 print:p-3'>
          <p className='text-base'>
            <span className='font-semibold'>Amount in Words: </span>
            <span className='italic'>
              {paymentRequest.payment_items?.[0]?.amount_in_words || "N/A"}
            </span>
          </p>
        </div>

        {/* Approval History Section */}
        {paymentRequest.approvals?.length > 0 && (
          <>
            <div className='bg-blue-100 border-b border-black p-3 print:p-2'>
              <h3 className='font-bold text-base'>APPROVAL TRAIL</h3>
            </div>

            <table className='w-full border-collapse text-sm'>
              <tbody>
                <tr>
                  {paymentRequest.approvals.map((approval: any, index: number) => (
                    <td
                      key={approval.id}
                      className={`p-6 align-top print:p-4 ${index < paymentRequest.approvals.length - 1 ? 'border-r border-black' : ''}`}
                      style={{width: `${100 / paymentRequest.approvals.length}%`}}
                    >
                      <div className='mb-3'>
                        <span className='font-bold text-base'>{approval.approval_level}: {approval.user?.full_name || "N/A"}</span>
                      </div>
                      <div className='mb-3'>
                        <span className='font-bold text-base'>Sign:</span>
                        <div className='h-16 mt-3 border-b border-gray-400'></div>
                      </div>
                      <div>
                        <span className='font-bold text-base'>Date: {format(new Date(approval.created_datetime), "dd/MM/yyyy")}</span>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </>
        )}

        {/* Footer Note */}
        <div className='p-4 bg-gray-100 text-center text-sm print:p-3'>
          <p className='text-gray-700'>
            This is a computer-generated document. Generated on {format(new Date(), "dd MMMM yyyy 'at' HH:mm")}
          </p>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          @page {
            size: A4;
            margin: 0.5cm;
          }

          .print\\:hidden {
            display: none !important;
          }

          .print\\:border {
            border-width: 1px !important;
          }

          .print\\:rounded-none {
            border-radius: 0 !important;
          }

          .print\\:p-0 {
            padding: 0 !important;
          }

          .print\\:max-w-full {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
