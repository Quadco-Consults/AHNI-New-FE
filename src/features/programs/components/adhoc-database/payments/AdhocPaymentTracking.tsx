"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Card from "components/Card";
import BackNavigation from "components/BackNavigation";
import { Button } from "components/ui/button";
import { useGetSingleConsultancyApplicant } from "@/features/contracts-grants/controllers/consultancyApplicantsController";
import { DollarSign, Calendar, CheckCircle, Clock, XCircle, Plus, FileText, TrendingUp } from "lucide-react";
import { LoadingSpinner } from "components/Loading";

// Mock payment data - Replace with actual API call
const mockPayments = [
  {
    id: "1",
    payment_request_id: "PR-2025-001",
    amount: "150000",
    currency: "NGN",
    period: "January 2025",
    request_date: "2025-01-05",
    status: "PAID",
    payment_date: "2025-01-15",
    description: "Monthly stipend for January",
  },
  {
    id: "2",
    payment_request_id: "PR-2025-002",
    amount: "150000",
    currency: "NGN",
    period: "February 2025",
    request_date: "2025-02-05",
    status: "APPROVED",
    payment_date: null,
    description: "Monthly stipend for February",
  },
  {
    id: "3",
    payment_request_id: "PR-2025-003",
    amount: "150000",
    currency: "NGN",
    period: "March 2025",
    request_date: "2025-03-05",
    status: "PENDING",
    payment_date: null,
    description: "Monthly stipend for March",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "PAID":
      return "bg-green-100 text-green-800 border-green-200";
    case "APPROVED":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "PENDING":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "REJECTED":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "PAID":
      return <CheckCircle className="h-5 w-5" />;
    case "APPROVED":
      return <TrendingUp className="h-5 w-5" />;
    case "PENDING":
      return <Clock className="h-5 w-5" />;
    case "REJECTED":
      return <XCircle className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};

export default function AdhocPaymentTracking() {
  const params = useParams();
  const router = useRouter();
  const staffId = params?.id as string;

  // Fetch adhoc staff data
  const { data: applicantResponse, isLoading } = useGetSingleConsultancyApplicant(staffId);
  const applicant = applicantResponse?.data;

  // Mock payments - Replace with actual API call
  const payments = mockPayments;

  // Calculate totals
  const totalPaid = payments
    .filter(p => p.status === "PAID")
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const totalPending = payments
    .filter(p => p.status !== "PAID")
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <BackNavigation />

      <div className="mt-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Payment Tracking</h1>
            <p className="text-gray-600 mt-1">
              Manage payment requests and track payment status for {applicant?.name}
            </p>
          </div>
          <Button className="flex items-center gap-2 bg-[#DEA004] hover:bg-[#c48f04]">
            <Plus className="h-4 w-4" />
            New Payment Request
          </Button>
        </div>

        {/* Staff Info Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Staff Name</p>
              <p className="font-semibold text-gray-900">{applicant?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Position</p>
              <p className="font-semibold text-gray-900">{applicant?.position_under_contract}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Contract Period</p>
              <p className="font-semibold text-gray-900">
                {applicant?.start_duration_date} to {applicant?.end_duration_date}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-semibold text-green-600">Active</p>
            </div>
          </div>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
            <div className="flex items-center gap-4">
              <div className="bg-green-500 text-white p-3 rounded-lg">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-green-700 font-medium">Total Paid</p>
                <p className="text-2xl font-bold text-green-900">
                  NGN {totalPaid.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {payments.filter(p => p.status === "PAID").length} payments completed
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
            <div className="flex items-center gap-4">
              <div className="bg-amber-500 text-white p-3 rounded-lg">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-amber-700 font-medium">Pending/Approved</p>
                <p className="text-2xl font-bold text-amber-900">
                  NGN {totalPending.toLocaleString()}
                </p>
                <p className="text-xs text-amber-600 mt-1">
                  {payments.filter(p => p.status !== "PAID").length} requests in process
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 text-white p-3 rounded-lg">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">Total Requests</p>
                <p className="text-2xl font-bold text-blue-900">
                  NGN {(totalPaid + totalPending).toLocaleString()}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {payments.length} payment requests
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Payment History */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Payment History</h2>

            <div className="space-y-3">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="border-2 rounded-lg p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`p-2 rounded-lg border-2 ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {payment.period}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Request ID</p>
                            <p className="font-medium text-gray-900">{payment.payment_request_id}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Amount</p>
                            <p className="font-medium text-gray-900">
                              {payment.currency} {parseFloat(payment.amount).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Request Date</p>
                            <p className="font-medium text-gray-900">
                              {new Date(payment.request_date).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">
                              {payment.status === "PAID" ? "Payment Date" : "Status"}
                            </p>
                            <p className="font-medium text-gray-900">
                              {payment.payment_date
                                ? new Date(payment.payment_date).toLocaleDateString()
                                : "Awaiting payment"}
                            </p>
                          </div>
                        </div>

                        {payment.description && (
                          <p className="text-sm text-gray-600 mt-2">
                            {payment.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {payments.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <DollarSign className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Payment Requests</h3>
                <p className="text-gray-600 mb-4">
                  No payment requests have been created for this adhoc staff yet.
                </p>
                <Button className="bg-[#DEA004] hover:bg-[#c48f04]">
                  Create First Payment Request
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
