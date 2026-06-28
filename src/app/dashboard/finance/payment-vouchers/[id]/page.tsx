"use client";

import { use, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Printer,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { useReactToPrint } from "react-to-print";

import {
  useGetPaymentVoucher,
  getPaymentVoucherStatusColor,
  formatCurrencyAmount,
  downloadPaymentVoucherPDF,
} from "@/features/finance/controllers/paymentVoucherController";

// Convert number to words (Naira)
const numberToWords = (num: number): string => {
  if (num === 0) return "Zero Naira Only";

  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const thousands = ["", "Thousand", "Million", "Billion"];

  const convertHundreds = (n: number): string => {
    let str = "";
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 10 && n < 20) {
      str += teens[n - 10] + " ";
    } else if (n >= 20 || n < 10) {
      if (n >= 20) {
        str += tens[Math.floor(n / 10)] + " ";
        n %= 10;
      }
      if (n > 0) {
        str += ones[n] + " ";
      }
    }
    return str.trim();
  };

  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);

  let result = "";
  let thousandCounter = 0;
  let tempNum = integerPart;

  while (tempNum > 0) {
    const chunk = tempNum % 1000;
    if (chunk !== 0) {
      const chunkWords = convertHundreds(chunk);
      result = chunkWords + (thousands[thousandCounter] ? " " + thousands[thousandCounter] : "") + " " + result;
    }
    tempNum = Math.floor(tempNum / 1000);
    thousandCounter++;
  }

  result = result.trim() + " Naira";

  if (decimalPart > 0) {
    result += " and " + convertHundreds(decimalPart) + " Kobo";
  }

  return result.trim() + " Only";
};

export default function PaymentVoucherDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);

  // Fetch payment voucher details
  const { data: pvData, isLoading } = useGetPaymentVoucher(id);
  const pv = pvData as any;

  // Print handler
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Payment-Voucher-${pv?.pv_number}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 15mm 12mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          font-size: 11px;
        }
        .no-print { display: none !important; }
        table { page-break-inside: avoid; }
      }
    `,
  });

  // Download PDF handler
  const handleDownloadPDF = async () => {
    try {
      toast.loading("Generating PDF...");
      await downloadPaymentVoucherPDF(id, pv?.pv_number);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download PDF. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading payment voucher...</p>
        </div>
      </div>
    );
  }

  if (!pv) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-2">Payment Voucher Not Found</h2>
        <Button onClick={() => router.push("/dashboard/finance/payment-vouchers")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Payment Vouchers
        </Button>
      </div>
    );
  }

  // Get line items or create single line from totals
  const lineItems = pv.line_items && pv.line_items.length > 0
    ? pv.line_items
    : [{
        line_number: 1,
        account_code: pv.chart_account_details?.account_code || '',
        description: pv.payment_description || 'Payment',
        amount: pv.gross_amount,
        is_deduction: false
      }];

  return (
    <div className="space-y-4 p-4">
      {/* Header - No Print */}
      <div className="flex items-center justify-between no-print">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard/finance/payment-vouchers")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{pv.pv_number}</h1>
            <p className="text-sm text-muted-foreground">Payment Voucher</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadPDF}
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Badge variant={getPaymentVoucherStatusColor(pv.status)}>
            {pv.status_display}
          </Badge>
        </div>
      </div>

      {/* Printable Payment Voucher Template */}
      <div ref={printRef} className="bg-white max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="border border-gray-300">
          {/* Logo and Organization Header */}
          <div className="text-center py-3 border-b border-gray-300">
            <div className="flex items-center justify-center mb-2">
              <img src="/imgs/logo.png" alt="AHNI Logo" className="h-16 w-auto" />
            </div>
            <div className="font-semibold text-sm">Achieving Health Nigeria Initiative (AHNI)</div>
            <div className="text-xs text-gray-600">30 Anthony Enahoro Street, Utako, Abuja, Nigeria</div>
          </div>

          {/* Title */}
          <div className="text-center py-2 border-b border-gray-300">
            <h2 className="text-base font-bold">CHECK PAYMENT VOUCHER</h2>
          </div>

          {/* Payable To and Voucher Details */}
          <div className="border-b border-gray-300">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="border-r border-gray-300 py-1.5 px-2 text-xs font-medium w-20">Payable to</td>
                  <td className="bg-green-50 py-1.5 px-2 text-sm font-semibold">{pv.payee_name}</td>
                  <td className="border-l border-gray-300 py-1.5 px-2 text-xs font-medium w-28">Voucher Date</td>
                  <td className="border-l border-gray-300 py-1.5 px-2 font-mono text-xs">
                    {new Date(pv.payment_date).toLocaleDateString('en-GB')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Comments and Currency/Check No */}
          <div className="border-b border-gray-300">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="border-r border-gray-300 py-1.5 px-2 text-xs font-medium w-20 align-top">Comments</td>
                  <td className="bg-green-50 py-1.5 px-2 text-xs" rowSpan={2}>
                    {pv.payment_description || pv.notes || 'Payment as per approved request'}
                  </td>
                  <td className="border-l border-gray-300 py-1.5 px-2 text-xs font-medium w-28">Currency</td>
                  <td className="border-l border-gray-300 py-1.5 px-2 font-mono text-xs">
                    {pv.currency || 'Naira'}
                  </td>
                </tr>
                <tr>
                  <td className="border-r border-gray-300"></td>
                  <td className="border-l border-gray-300 py-1.5 px-2 text-xs font-medium">Check no</td>
                  <td className="border-l border-gray-300 py-1.5 px-2 font-mono text-xs">
                    {pv.payment_reference || pv.cheque_number || '-'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Line Items Table */}
          <div className="border-b border-gray-300">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border-r border-gray-300 py-1 px-2 text-left text-xs font-semibold w-20">FCO</th>
                  <th className="border-r border-gray-300 py-1 px-2 text-left text-xs font-semibold w-24">Activity Code</th>
                  <th className="border-r border-gray-300 py-1 px-2 text-left text-xs font-semibold w-24">Account Code</th>
                  <th className="border-r border-gray-300 py-1 px-2 text-left text-xs font-semibold">Description</th>
                  <th className="py-1 px-2 text-right text-xs font-semibold w-28">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-green-50">
                {lineItems.map((item: any, index: number) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="border-r border-gray-300 py-1.5 px-2 text-xs font-mono">
                      {pv.fco || (index === 0 ? pv.project_details?.project_id || '' : '')}
                    </td>
                    <td className="border-r border-gray-300 py-1.5 px-2 text-xs font-mono">
                      {pv.activity_code || ''}
                    </td>
                    <td className="border-r border-gray-300 py-1.5 px-2 text-xs font-mono">
                      {item.account_code || ''}
                    </td>
                    <td className="border-r border-gray-300 py-1.5 px-2 text-xs">
                      {item.description}
                    </td>
                    <td className="py-1.5 px-2 text-xs text-right font-mono">
                      {item.amount < 0 || item.is_deduction
                        ? `(${formatCurrencyAmount(Math.abs(item.amount)).replace('₦', '')})`
                        : formatCurrencyAmount(item.amount).replace('₦', '')}
                    </td>
                  </tr>
                ))}
                {/* Empty rows to match template */}
                {[...Array(Math.max(0, 6 - lineItems.length))].map((_, i) => (
                  <tr key={`empty-${i}`} className="border-b border-gray-200">
                    <td className="border-r border-gray-300 py-2 px-2">&nbsp;</td>
                    <td className="border-r border-gray-300 py-2 px-2">&nbsp;</td>
                    <td className="border-r border-gray-300 py-2 px-2">&nbsp;</td>
                    <td className="border-r border-gray-300 py-2 px-2">&nbsp;</td>
                    <td className="py-2 px-2">&nbsp;</td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="border-t-2 border-gray-400 font-bold">
                  <td className="border-r border-gray-300 py-1.5 px-2" colSpan={4}></td>
                  <td className="py-1.5 px-2 text-right font-mono text-xs">
                    {formatCurrencyAmount(pv.gross_amount).replace('₦', '')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Amount in Words */}
          <div className="border-b border-gray-300 py-2 px-2 bg-green-50">
            <span className="text-xs font-semibold italic">Amount in Words: </span>
            <span className="text-xs italic">
              {pv.amount_in_words || numberToWords(parseFloat(pv.gross_amount) || 0)}
            </span>
          </div>

          {/* Signature Section */}
          <div>
            <table className="w-full">
              <tbody>
                <tr>
                  {/* Prepared By */}
                  <td className="border-r border-b border-gray-300 py-2 px-2 align-top w-1/2">
                    <div className="text-xs space-y-0.5">
                      <div className="font-semibold">Signed:</div>
                      <div><span className="font-medium">Prepared by:</span> {pv.prepared_by_details?.name || '-'}</div>
                      <div><span className="font-medium">Designation:</span> {pv.prepared_by_details?.designation || 'Senior Accountant'}</div>
                      <div><span className="font-medium">Date:</span> {pv.prepared_date ? new Date(pv.prepared_date).toLocaleDateString('en-GB') : '-'}</div>
                    </div>
                  </td>
                  {/* Reviewed By */}
                  <td className="border-b border-gray-300 py-2 px-2 align-top w-1/2">
                    <div className="text-xs space-y-0.5">
                      <div className="font-semibold">Signed:</div>
                      <div><span className="font-medium">Reviewed by:</span> {pv.reviewed_by_details?.name || '-'}</div>
                      <div><span className="font-medium">Designation:</span> {pv.reviewed_by_details?.designation || 'Finance Manager'}</div>
                      <div><span className="font-medium">Date:</span> {pv.reviewed_date ? new Date(pv.reviewed_date).toLocaleDateString('en-GB') : '-'}</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  {/* Authorised By */}
                  <td className="border-r border-gray-300 py-2 px-2 align-top">
                    <div className="text-xs space-y-0.5">
                      <div className="font-semibold">Signed:</div>
                      <div><span className="font-medium">Authorised by:</span> {pv.authorised_by_details?.name || '-'}</div>
                      <div><span className="font-medium">Designation:</span> {pv.authorised_by_details?.designation || 'Director of Finance'}</div>
                      <div><span className="font-medium">Date:</span> {pv.authorised_date ? new Date(pv.authorised_date).toLocaleDateString('en-GB') : '-'}</div>
                    </div>
                  </td>
                  {/* Approved By */}
                  <td className="py-2 px-2 align-top">
                    <div className="text-xs space-y-0.5">
                      <div className="font-semibold">Signed:</div>
                      <div><span className="font-medium">Approved by:</span> {pv.approved_by_details?.name || '-'}</div>
                      <div><span className="font-medium">Designation:</span> {pv.approved_by_details?.designation || 'Managing Director'}</div>
                      <div><span className="font-medium">Date:</span> {pv.approved_date ? new Date(pv.approved_date).toLocaleDateString('en-GB') : '-'}</div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
