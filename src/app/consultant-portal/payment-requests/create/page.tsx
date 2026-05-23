"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Upload, FileText, AlertCircle, CheckCircle, Calendar, DollarSign } from "lucide-react";
import { useCreatePaymentRequest } from "@/features/consultant-portal/controllers/paymentRequestController";
import { useConsultantProfile } from "@/features/consultant-portal/controllers/consultantAuthController";
import { LoadingSpinner } from "@/components/Loading";
import { toast } from "sonner";

export default function CreatePaymentRequestPage() {
  const router = useRouter();
  const { data: profile, isLoading: profileLoading } = useConsultantProfile();
  const { mutate: createPaymentRequest, isPending } = useCreatePaymentRequest();

  const [paymentReason, setPaymentReason] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [amount, setAmount] = useState("");
  const [document, setDocument] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!paymentReason.trim()) {
      newErrors.paymentReason = "Payment reason is required";
    }

    if (!paymentDate) {
      newErrors.paymentDate = "Payment date is required";
    }

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = "Valid amount is required";
    }

    if (!document) {
      newErrors.document = "Supporting document is required (invoice, timesheet, report, etc.)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    createPaymentRequest(
      {
        payment_reason: paymentReason,
        payment_date: paymentDate,
        amount: parseFloat(amount),
        document: document!,
      },
      {
        onSuccess: (data) => {
          toast.success(data.message || "Payment request submitted successfully!");
          router.push('/consultant-portal/payment-requests');
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message ||
                             error?.message ||
                             "Failed to submit payment request";
          toast.error(errorMessage);
        },
      }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors({ ...errors, document: "File size must be less than 10MB" });
        return;
      }

      // Validate file type (common document types)
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg',
        'image/png',
        'image/jpg'
      ];

      if (!allowedTypes.includes(file.type)) {
        setErrors({ ...errors, document: "Only PDF, Word, Excel, and image files are allowed" });
        return;
      }

      setDocument(file);
      setErrors({ ...errors, document: "" });
    }
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
        <span className="ml-2">Loading profile...</span>
      </div>
    );
  }

  // Check if profile has banking information
  const hasBankingInfo = profile?.account_number && profile?.bank_name;

  // Check if contract is active
  const contractStatus = profile?.contract_status;
  const canSubmitRequest = contractStatus === 'ACTIVE' || contractStatus === 'EXPIRING_SOON';

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Submit Payment Request</h1>
          <p className="text-gray-600 mt-1">Request payment for services rendered</p>
        </div>
      </div>

      {/* Validation Alerts */}
      {!hasBankingInfo && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold">Banking Information Missing</div>
            <div className="text-sm mt-1">
              You need to update your banking information before submitting payment requests.
              Please contact HR or update your profile.
            </div>
          </AlertDescription>
        </Alert>
      )}

      {!canSubmitRequest && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold">Contract Not Active</div>
            <div className="text-sm mt-1">
              Your contract status is "{contractStatus}". Payment requests can only be submitted when your contract is active.
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Banking Information Display */}
      {hasBankingInfo && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Banking Information Verified
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-green-700 font-medium">Account Name:</span>
                <div className="text-green-900 font-semibold">{profile.account_name}</div>
              </div>
              <div>
                <span className="text-green-700 font-medium">Bank:</span>
                <div className="text-green-900 font-semibold">{profile.bank_name}</div>
              </div>
              <div>
                <span className="text-green-700 font-medium">Account Number:</span>
                <div className="text-green-900 font-semibold">{profile.account_number}</div>
              </div>
              {profile.sort_code && (
                <div>
                  <span className="text-green-700 font-medium">Sort Code:</span>
                  <div className="text-green-900 font-semibold">{profile.sort_code}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Request Form */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Request Details</CardTitle>
          <CardDescription>
            Fill in the details below to submit your payment request
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Reason */}
            <div className="space-y-2">
              <Label htmlFor="paymentReason" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Payment Reason *
              </Label>
              <Textarea
                id="paymentReason"
                placeholder="E.g., Monthly consultancy fee for January 2024, Training services provided, etc."
                value={paymentReason}
                onChange={(e) => setPaymentReason(e.target.value)}
                rows={3}
                className={errors.paymentReason ? "border-red-500" : ""}
                disabled={!hasBankingInfo || !canSubmitRequest}
              />
              {errors.paymentReason && (
                <p className="text-sm text-red-500">{errors.paymentReason}</p>
              )}
            </div>

            {/* Payment Date */}
            <div className="space-y-2">
              <Label htmlFor="paymentDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Payment Date *
              </Label>
              <Input
                id="paymentDate"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className={errors.paymentDate ? "border-red-500" : ""}
                disabled={!hasBankingInfo || !canSubmitRequest}
              />
              {errors.paymentDate && (
                <p className="text-sm text-red-500">{errors.paymentDate}</p>
              )}
              <p className="text-sm text-gray-600">
                The date when this payment should be processed
              </p>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Amount (NGN) *
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={errors.amount ? "border-red-500" : ""}
                disabled={!hasBankingInfo || !canSubmitRequest}
              />
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount}</p>
              )}
              {amount && parseFloat(amount) > 0 && (
                <p className="text-sm text-gray-600">
                  Amount: {new Intl.NumberFormat('en-NG', {
                    style: 'currency',
                    currency: 'NGN'
                  }).format(parseFloat(amount))}
                </p>
              )}
            </div>

            {/* Document Upload */}
            <div className="space-y-2">
              <Label htmlFor="document" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Supporting Document *
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Input
                  id="document"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  disabled={!hasBankingInfo || !canSubmitRequest}
                />
                <label
                  htmlFor="document"
                  className={`cursor-pointer ${!hasBankingInfo || !canSubmitRequest ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  {document ? (
                    <div>
                      <p className="text-sm font-medium text-green-600">{document.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {(document.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium">Click to upload document</p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, Word, Excel, or Image (Max 10MB)
                      </p>
                    </div>
                  )}
                </label>
              </div>
              {errors.document && (
                <p className="text-sm text-red-500">{errors.document}</p>
              )}
              <p className="text-sm text-gray-600">
                Upload invoice, timesheet, report, or any supporting document
              </p>
            </div>

            {/* Instructions */}
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                <div className="font-semibold mb-2">Important Information:</div>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>All fields marked with * are required</li>
                  <li>Payment will be processed to the banking information shown above</li>
                  <li>Supporting documents must be clear and legible</li>
                  <li>You can track the status of your request after submission</li>
                  <li>Contact HR if you need to update your banking information</li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending || !hasBankingInfo || !canSubmitRequest}
                className="flex-1"
              >
                {isPending ? (
                  <>
                    <LoadingSpinner className="mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Submit Payment Request
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
