"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  FileText,
  Download,
  Upload,
  Calendar,
  DollarSign,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  Building2
} from "lucide-react";
import { usePaymentRequestDetail, useUploadPaymentRequestDocument } from "@/features/consultant-portal/controllers/paymentRequestController";
import { LoadingSpinner } from "@/components/Loading";
import { toast } from "sonner";

export default function PaymentRequestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const paymentRequestId = params.id as string;

  const { data: paymentRequestData, isLoading, error } = usePaymentRequestDetail(paymentRequestId);
  const { mutate: uploadDocument, isPending: uploadPending } = useUploadPaymentRequestDocument();

  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const paymentRequest = paymentRequestData?.data;

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'APPROVED':
        return <Badge className="bg-green-500 text-lg px-4 py-1">Approved</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-500 text-lg px-4 py-1">Pending</Badge>;
      case 'REVIEWED':
        return <Badge className="bg-blue-500 text-lg px-4 py-1">Reviewed</Badge>;
      case 'AUTHORIZED':
        return <Badge className="bg-purple-500 text-lg px-4 py-1">Authorized</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive" className="text-lg px-4 py-1">Rejected</Badge>;
      default:
        return <Badge variant="secondary" className="text-lg px-4 py-1">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'APPROVED':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'PENDING':
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case 'REVIEWED':
      case 'AUTHORIZED':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'REJECTED':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      default:
        return <FileText className="h-6 w-6 text-gray-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      uploadDocument(
        { paymentRequestId, document: file },
        {
          onSuccess: (data) => {
            toast.success(data.message || "Document uploaded successfully!");
            setUploadFile(null);
          },
          onError: (error: any) => {
            const errorMessage = error?.response?.data?.message ||
                               error?.message ||
                               "Failed to upload document";
            toast.error(errorMessage);
          },
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
        <span className="ml-2">Loading payment request...</span>
      </div>
    );
  }

  if (error || !paymentRequest) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load payment request. It may not exist or you don't have permission to view it.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const canUploadDocument = ['PENDING', 'REVIEWED'].includes(paymentRequest.status);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Payment Request Details</h1>
          <p className="text-gray-600 mt-1">Reference: {paymentRequest.number || paymentRequest.id}</p>
        </div>
        {getStatusBadge(paymentRequest.status)}
      </div>

      {/* Status Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(paymentRequest.status)}
            Current Status: {paymentRequest.status}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                ['PENDING', 'REVIEWED', 'AUTHORIZED', 'APPROVED'].includes(paymentRequest.status)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}>
                1
              </div>
              <div>
                <div className="font-semibold">Submitted</div>
                <div className="text-sm text-gray-600">Pending Review</div>
              </div>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-4">
              <div className={`h-full ${
                ['REVIEWED', 'AUTHORIZED', 'APPROVED'].includes(paymentRequest.status)
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`} style={{ width: '0%' }} />
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                ['REVIEWED', 'AUTHORIZED', 'APPROVED'].includes(paymentRequest.status)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}>
                2
              </div>
              <div>
                <div className="font-semibold">Reviewed</div>
                <div className="text-sm text-gray-600">Under Review</div>
              </div>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-4">
              <div className={`h-full ${
                ['AUTHORIZED', 'APPROVED'].includes(paymentRequest.status)
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`} style={{ width: '0%' }} />
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                ['AUTHORIZED', 'APPROVED'].includes(paymentRequest.status)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}>
                3
              </div>
              <div>
                <div className="font-semibold">Authorized</div>
                <div className="text-sm text-gray-600">Awaiting Approval</div>
              </div>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-4">
              <div className={`h-full ${
                paymentRequest.status === 'APPROVED'
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`} style={{ width: '0%' }} />
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                paymentRequest.status === 'APPROVED'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}>
                4
              </div>
              <div>
                <div className="font-semibold">Approved</div>
                <div className="text-sm text-gray-600">Payment Processed</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-gray-600">Payment Reason</div>
              <div className="font-semibold mt-1">{paymentRequest.payment_reason}</div>
            </div>
            <Separator />
            <div>
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Payment Date
              </div>
              <div className="font-semibold mt-1">{formatDate(paymentRequest.payment_date)}</div>
            </div>
            <Separator />
            <div>
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Amount
              </div>
              <div className="text-2xl font-bold text-green-600 mt-1">
                {formatCurrency(paymentRequest.total_amount)}
              </div>
            </div>
            {paymentRequest.created_at && (
              <>
                <Separator />
                <div>
                  <div className="text-sm text-gray-600">Submitted On</div>
                  <div className="font-semibold mt-1">{formatDate(paymentRequest.created_at)}</div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Requester Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentRequest.requested_by && (
              <>
                <div>
                  <div className="text-sm text-gray-600">Name</div>
                  <div className="font-semibold mt-1">{paymentRequest.requested_by.name}</div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm text-gray-600">Email</div>
                  <div className="font-semibold mt-1">{paymentRequest.requested_by.email}</div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payment Items */}
      {paymentRequest.items && paymentRequest.items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Banking Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {paymentRequest.items.map((item) => (
              <div key={item.id} className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Payee</div>
                  <div className="font-semibold mt-1">{item.payment_to}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Amount</div>
                  <div className="font-semibold mt-1">{formatCurrency(item.amount_in_figures)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Bank</div>
                  <div className="font-semibold mt-1">{item.bank_name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Account Number</div>
                  <div className="font-semibold mt-1">{item.account_number}</div>
                </div>
                {item.tax_identification_number && (
                  <div>
                    <div className="text-sm text-gray-600">Tax ID / Sort Code</div>
                    <div className="font-semibold mt-1">{item.tax_identification_number}</div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-gray-600">Amount in Words</div>
                  <div className="font-semibold mt-1">{item.amount_in_words}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Supporting Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentRequest.document ? (
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="font-semibold">Primary Document</div>
                  <div className="text-sm text-gray-600">Submitted with payment request</div>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => window.open(paymentRequest.document!, '_blank')}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          ) : (
            <p className="text-gray-600">No documents attached</p>
          )}

          {/* Upload Additional Document */}
          {canUploadDocument && (
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Upload Additional Document</h4>
              <p className="text-sm text-gray-600 mb-4">
                You can upload additional supporting documents while your request is in PENDING or REVIEWED status.
              </p>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  id="uploadDocument"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  disabled={uploadPending}
                />
                <label htmlFor="uploadDocument">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploadPending}
                    onClick={() => document.getElementById('uploadDocument')?.click()}
                  >
                    {uploadPending ? (
                      <>
                        <LoadingSpinner className="mr-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Document
                      </>
                    )}
                  </Button>
                </label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approval Chain */}
      {paymentRequest.approvals && paymentRequest.approvals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Approval History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentRequest.approvals.map((approval, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{approval.approval_level}</div>
                      {approval.user && (
                        <div className="text-sm text-gray-600">By: {approval.user}</div>
                      )}
                      {approval.comments && (
                        <div className="text-sm mt-2">{approval.comments}</div>
                      )}
                    </div>
                    {approval.created_at && (
                      <div className="text-sm text-gray-600">
                        {formatDate(approval.created_at)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
