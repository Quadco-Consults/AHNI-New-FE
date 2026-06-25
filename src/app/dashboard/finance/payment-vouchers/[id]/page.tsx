"use client";

import { use, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Printer,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  User,
  Calendar,
  DollarSign,
  Building2,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { useReactToPrint } from "react-to-print";

import {
  useGetPaymentVoucher,
  getPaymentVoucherStatusColor,
  formatPVNumber,
  formatCurrencyAmount,
} from "@/features/finance/controllers/paymentVoucherController";

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
  const pv = pvData?.data;

  // Print handler
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Payment-Voucher-${pv?.pv_number}`,
  });

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
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Payment Voucher Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The payment voucher you're looking for doesn't exist
        </p>
        <Button onClick={() => router.push("/dashboard/finance/payment-vouchers")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Payment Vouchers
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard/finance/payment-vouchers")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {formatPVNumber(pv.pv_number)}
            </h1>
            <p className="text-muted-foreground">Payment Voucher Details</p>
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
            onClick={() => toast.info("Download PDF coming soon")}
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Badge variant={getPaymentVoucherStatusColor(pv.status)}>
            {pv.status_display}
          </Badge>
        </div>
      </div>

      {/* Printable Content */}
      <div ref={printRef} className="print:p-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    PV Number
                  </label>
                  <p className="text-lg font-mono font-bold">{pv.pv_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Payment Date
                  </label>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(pv.payment_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Payment Method
                  </label>
                  <p>{pv.payment_method_display}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Payment Reference
                  </label>
                  <p className="font-mono text-sm">{pv.payment_reference}</p>
                </div>
                {pv.cheque_number && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Cheque Number
                    </label>
                    <p className="font-mono">{pv.cheque_number}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payee Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Payee Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Payee Name
                  </label>
                  <p className="font-semibold">{pv.payee_name}</p>
                </div>
                {pv.payee_bank && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Bank
                    </label>
                    <p>{pv.payee_bank}</p>
                  </div>
                )}
                {pv.payee_account_number && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Account Number
                    </label>
                    <p className="font-mono">{pv.payee_account_number}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Payment Description
                  </label>
                  <p className="text-sm">{pv.payment_description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Bank Account */}
            {pv.bank_account_details && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Bank Account (Source)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Bank Name
                    </label>
                    <p>{pv.bank_account_details.bank_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Account Number
                    </label>
                    <p className="font-mono">
                      {pv.bank_account_details.account_number}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Account Name
                    </label>
                    <p>{pv.bank_account_details.account_name}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Amount Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Amount Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium">Gross Amount:</span>
                  <span className="text-lg font-semibold">
                    {formatCurrencyAmount(pv.gross_amount)}
                  </span>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Deductions:
                  </p>
                  {pv.total_wht > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Withholding Tax (WHT):
                      </span>
                      <span className="text-orange-600">
                        -{formatCurrencyAmount(pv.total_wht)}
                      </span>
                    </div>
                  )}
                  {pv.total_vat > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">VAT:</span>
                      <span className="text-orange-600">
                        -{formatCurrencyAmount(pv.total_vat)}
                      </span>
                    </div>
                  )}
                  {pv.total_paye > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">PAYE:</span>
                      <span className="text-orange-600">
                        -{formatCurrencyAmount(pv.total_paye)}
                      </span>
                    </div>
                  )}
                  {pv.total_pension > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pension:</span>
                      <span className="text-orange-600">
                        -{formatCurrencyAmount(pv.total_pension)}
                      </span>
                    </div>
                  )}
                  {pv.total_nhis > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">NHIS:</span>
                      <span className="text-orange-600">
                        -{formatCurrencyAmount(pv.total_nhis)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm pt-2 border-t">
                    <span className="font-medium">Total Deductions:</span>
                    <span className="font-semibold text-orange-600">
                      -{formatCurrencyAmount(pv.total_deductions)}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center py-2 bg-green-50 dark:bg-green-900/20 rounded-lg px-3">
                  <span className="font-bold text-green-700 dark:text-green-400">
                    Net Amount Paid:
                  </span>
                  <span className="text-xl font-bold text-green-700 dark:text-green-400">
                    {formatCurrencyAmount(pv.net_amount)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Project Details */}
            {pv.project_details && (
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Project ID
                    </label>
                    <p className="font-mono">{pv.project_details.project_id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Project Name
                    </label>
                    <p>{pv.project_details.title}</p>
                  </div>
                  {pv.project_details.donor && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Donor
                      </label>
                      <p>{pv.project_details.donor}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Approvals */}
            <Card>
              <CardHeader>
                <CardTitle>Approvals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pv.prepared_by_details && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Prepared By
                    </label>
                    <p className="font-medium">{pv.prepared_by_details.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {pv.prepared_by_details.email}
                    </p>
                  </div>
                )}
                {pv.reviewed_by_details && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Reviewed By
                    </label>
                    <p className="font-medium">{pv.reviewed_by_details.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {pv.reviewed_by_details.email}
                    </p>
                  </div>
                )}
                {pv.approved_by_details && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Approved By
                    </label>
                    <p className="font-medium">{pv.approved_by_details.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {pv.approved_by_details.email}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            {pv.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{pv.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
