"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  Upload,
  AlertCircle,
  CheckCircle,
  Users,
  DollarSign,
  Trash2,
  Info
} from "lucide-react";
import {
  useClusterMembers,
  useCreateBulkPaymentRequest
} from "@/features/consultant-portal/controllers/paymentRequestController";
import { LoadingSpinner } from "@/components/Loading";
import { toast } from "sonner";

interface SelectedMember {
  user_id: string;
  name: string;
  email: string;
  amount: number;
}

export default function BulkPaymentRequestPage() {
  const router = useRouter();
  const { data: clusterData, isLoading: clusterLoading } = useClusterMembers();
  const { mutate: createBulkRequest, isPending } = useCreateBulkPaymentRequest();

  const [paymentReason, setPaymentReason] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [document, setDocument] = useState<File | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<SelectedMember[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clusterMembers = clusterData?.data?.members || [];
  const cluster = clusterData?.data?.cluster;

  // Toggle member selection
  const toggleMember = (member: any) => {
    const isSelected = selectedMembers.some(m => m.user_id === member.user_id);

    if (isSelected) {
      setSelectedMembers(selectedMembers.filter(m => m.user_id !== member.user_id));
    } else {
      setSelectedMembers([
        ...selectedMembers,
        {
          user_id: member.user_id,
          name: member.name,
          email: member.email,
          amount: member.monthly_pay || 0,
        }
      ]);
    }
  };

  // Update amount for a selected member
  const updateMemberAmount = (user_id: string, amount: number) => {
    setSelectedMembers(
      selectedMembers.map(m =>
        m.user_id === user_id ? { ...m, amount } : m
      )
    );
  };

  // Calculate total amount
  const totalAmount = selectedMembers.reduce((sum, m) => sum + m.amount, 0);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!paymentReason.trim()) {
      newErrors.paymentReason = "Payment reason is required";
    }

    if (!paymentDate) {
      newErrors.paymentDate = "Payment date is required";
    }

    if (selectedMembers.length === 0) {
      newErrors.members = "Please select at least one team member";
    }

    // Check if all selected members have amounts
    const invalidAmounts = selectedMembers.filter(m => !m.amount || m.amount <= 0);
    if (invalidAmounts.length > 0) {
      newErrors.amounts = `Please enter valid amounts for all selected members`;
    }

    // Check for incomplete banking info
    const membersWithoutBanking = selectedMembers.filter(m => {
      const member = clusterMembers.find((cm: any) => cm.user_id === m.user_id);
      return !member?.has_complete_banking;
    });

    if (membersWithoutBanking.length > 0) {
      newErrors.banking = `Some selected members have incomplete banking information`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix all errors before submitting");
      return;
    }

    const payment_items = selectedMembers.map(m => ({
      user_id: m.user_id,
      amount: m.amount,
    }));

    createBulkRequest(
      {
        payment_reason: paymentReason,
        payment_date: paymentDate,
        payment_items,
        document,
      },
      {
        onSuccess: (data) => {
          toast.success(data.message || `Bulk payment request created for ${selectedMembers.length} consultants!`);
          router.push('/consultant-portal/payment-requests');
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message ||
                             error?.message ||
                             "Failed to create bulk payment request";
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

  if (clusterLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
        <span className="ml-2">Loading cluster members...</span>
      </div>
    );
  }

  // Check if consultant has a cluster
  if (!cluster) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Bulk Payment Request</h1>
          </div>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold">No Cluster Assigned</div>
            <div className="text-sm mt-1">
              You need to be assigned to a cluster to create bulk payment requests for your team.
              Please contact your supervisor or HR.
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Bulk Payment Request</h1>
          <p className="text-gray-600 mt-1">Request payment for multiple team members in your cluster</p>
        </div>
      </div>

      {/* Cluster Info */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-blue-800">
            <Users className="h-5 w-5" />
            <div>
              <span className="font-semibold">Your Cluster:</span> {cluster.name}
              {cluster.location && ` (${cluster.location})`}
            </div>
          </div>
          <div className="text-blue-700 text-sm mt-1">
            {clusterMembers.length} team member{clusterMembers.length !== 1 ? 's' : ''} available
          </div>
        </CardContent>
      </Card>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <div className="font-semibold mb-1">How it works</div>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>Select team members from your cluster</li>
            <li>Enter payment amounts for each member</li>
            <li>Provide payment details and optional supporting document</li>
            <li>Submit a single request for all selected members</li>
          </ul>
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Team Member Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Team Members</CardTitle>
            <CardDescription>
              Choose consultants from your cluster to include in this payment request
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {clusterMembers.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No other team members found in your cluster.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2">
                {clusterMembers.map((member: any) => {
                  const isSelected = selectedMembers.some(m => m.user_id === member.user_id);

                  return (
                    <div
                      key={member.user_id}
                      className={`border rounded-lg p-4 ${
                        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      } ${
                        !member.has_complete_banking ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleMember(member)}
                          disabled={!member.has_complete_banking}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold">{member.name}</div>
                              <div className="text-sm text-gray-600">{member.email}</div>
                            </div>
                            {!member.has_complete_banking && (
                              <span className="text-xs text-red-600 font-medium">
                                Incomplete Banking Info
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                            <div>
                              <span className="text-gray-600">Bank:</span>{' '}
                              <span className="font-medium">{member.bank_name || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Account:</span>{' '}
                              <span className="font-medium">{member.account_number || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {errors.members && (
              <p className="text-sm text-red-600">{errors.members}</p>
            )}
            {errors.banking && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.banking}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Selected Members with Amounts */}
        {selectedMembers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Payment Amounts ({selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''})
              </CardTitle>
              <CardDescription>
                Enter payment amount for each selected team member
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedMembers.map((member) => (
                <div key={member.user_id} className="flex items-center gap-4 border rounded-lg p-3">
                  <div className="flex-1">
                    <div className="font-semibold">{member.name}</div>
                    <div className="text-xs text-gray-600">{member.email}</div>
                  </div>
                  <div className="w-48">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Amount (₦)"
                      value={member.amount || ''}
                      onChange={(e) => updateMemberAmount(member.user_id, parseFloat(e.target.value) || 0)}
                      className="text-right"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedMembers(selectedMembers.filter(m => m.user_id !== member.user_id))}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              ))}

              <div className="border-t pt-3 mt-3">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span>₦{totalAmount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              {errors.amounts && (
                <p className="text-sm text-red-600">{errors.amounts}</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Payment Details */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="payment_date">Payment Date *</Label>
              <Input
                id="payment_date"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className={errors.paymentDate ? "border-red-500" : ""}
              />
              {errors.paymentDate && (
                <p className="text-sm text-red-600 mt-1">{errors.paymentDate}</p>
              )}
            </div>

            <div>
              <Label htmlFor="payment_reason">Payment Reason *</Label>
              <Textarea
                id="payment_reason"
                placeholder="e.g., Monthly consultancy fee for April 2026"
                value={paymentReason}
                onChange={(e) => setPaymentReason(e.target.value)}
                rows={3}
                className={errors.paymentReason ? "border-red-500" : ""}
              />
              {errors.paymentReason && (
                <p className="text-sm text-red-600 mt-1">{errors.paymentReason}</p>
              )}
            </div>

            <div>
              <Label htmlFor="document">Supporting Document (Optional)</Label>
              <Input
                id="document"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                className={errors.document ? "border-red-500" : ""}
              />
              {document && (
                <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  {document.name}
                </p>
              )}
              {errors.document && (
                <p className="text-sm text-red-600 mt-1">{errors.document}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Optional: Upload any supporting documents (timesheets, reports, etc.)
              </p>
            </div>
          </CardContent>
        </Card>

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
            disabled={isPending || selectedMembers.length === 0}
            className="flex-1"
          >
            {isPending ? (
              <>
                <LoadingSpinner />
                <span className="ml-2">Submitting...</span>
              </>
            ) : (
              <>Submit Payment Request for {selectedMembers.length} Member{selectedMembers.length !== 1 ? 's' : ''}</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
