"use client";

import { useParams, useRouter } from "next/navigation";
import Card from "@/components/Card";
import BackNavigation from "@/components/BackNavigation";
import { LoadingSpinner } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import DescriptionCard from "@/components/DescriptionCard";
import { useGetSingleFacilitatorApplicant } from "@/features/contracts-grants/controllers/facilitatorApplicantsController";
import { useGetConsultantPayments } from "@/features/admin/controllers/paymentRequestController";
import { useGetAllDeliverables } from "@/features/contracts-grants/controllers/deliverableController";
import DataTable from "@/components/Table/DataTable";
import { deliverableColumns } from "../../table-columns/deliverables/deliverables";
import { format } from "date-fns";
import { DollarSign, Calendar, CheckCircle, Clock, XCircle, Plus, FileText, TrendingUp, Mail, Phone, User, Award, Briefcase, AlertCircle } from "lucide-react";

const getStatusColor = (status: string) => {
  switch (status) {
    case "PAID":
      return "bg-green-100 text-green-800 border-green-200";
    case "APPROVED":
      return "bg-green-100 text-green-800 border-green-200";
    case "SELECTED":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "APPLIED":
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
    case "APPROVED":
      return <CheckCircle className="h-5 w-5" />;
    case "SELECTED":
    case "APPLIED":
    case "PENDING":
      return <Clock className="h-5 w-5" />;
    case "REJECTED":
      return <XCircle className="h-5 w-5" />;
    default:
      return <User className="h-5 w-5" />;
  }
};

export default function FacilitatorStaffView() {
  const params = useParams();
  const router = useRouter();
  const facilitatorId = params?.id as string;

  // Fetch facilitator applicant data
  const { data: applicantResponse, isLoading, error } = useGetSingleFacilitatorApplicant(facilitatorId);

  const facilitator = applicantResponse?.data;

  // Fetch payment data for this facilitator (using same hook as consultants)
  const { data: paymentsResponse, isLoading: isLoadingPayments } = useGetConsultantPayments(facilitatorId, !!facilitatorId);

  // Fetch deliverables for this facilitator
  const { data: deliverablesResponse, isFetching: isLoadingDeliverables } = useGetAllDeliverables({
    consultant: facilitatorId,
    enabled: !!facilitatorId,
  });

  // Extract payments and statistics from API response
  const payments = paymentsResponse?.data?.data?.results || [];

  // Extract deliverables data
  const deliverables = deliverablesResponse?.data?.results || [];
  const deliverableStats = deliverablesResponse?.data?.statistics || {
    total: 0,
    pending: 0,
    completed: 0,
    overdue: 0,
    pending_reviews: 0,
  };
  const paymentStats = paymentsResponse?.data?.data?.statistics || {
    total_requested: 0,
    total_paid: 0,
    total_pending: 0,
    count: 0,
  };

  // Calculate payment totals
  const totalPaid = paymentStats.total_paid;
  const totalPending = paymentStats.total_pending;
  const totalRequested = paymentStats.total_requested;

  // Calculate total deductions
  const totalDeductions = payments.reduce((sum: number, payment: any) => {
    const paymentItems = payment.payment_items || [];
    const paymentDeductions = paymentItems.reduce((itemSum: number, item: any) =>
      itemSum + Number(item.deduction_amount || 0), 0
    );
    return sum + paymentDeductions;
  }, 0);

  // Calculate gross and net amounts
  const totalGrossAmount = payments.reduce((sum: number, payment: any) => {
    const paymentItems = payment.payment_items || [];
    return sum + paymentItems.reduce((itemSum: number, item: any) =>
      itemSum + Number(item.amount_in_figures || 0), 0
    );
  }, 0);
  const totalNetAmount = totalGrossAmount - totalDeductions;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !facilitator) {
    return (
      <div className="p-6">
        <BackNavigation />
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Facilitator Not Found</h2>
          <p className="text-gray-600">The requested facilitator could not be found.</p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BackNavigation />

      {/* Header */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {facilitator.name?.charAt(0).toUpperCase() || 'F'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{facilitator.name || "Unknown Facilitator"}</h1>
              <p className="text-gray-600 mt-1">Facilitator</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant="outline"
                  className={`flex items-center gap-1 ${getStatusColor(facilitator.status)}`}
                >
                  {getStatusIcon(facilitator.status)}
                  {facilitator.status?.replace(/_/g, ' ') || 'Unknown'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="qualifications">Qualifications & Experience</TabsTrigger>
          <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4 text-[#DEA004]">Personal Information</h3>
              <div className="space-y-3">
                <DescriptionCard
                  title="Full Name"
                  description={facilitator.name || "Not provided"}
                />
                <DescriptionCard
                  title="Email Address"
                  description={facilitator.email || "Not provided"}
                />
                <DescriptionCard
                  title="Phone Number"
                  description={facilitator.phone_number || "Not provided"}
                />
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4 text-[#DEA004]">Status Information</h3>
              <div className="space-y-3">
                <DescriptionCard
                  title="Current Status"
                  description={
                    <Badge
                      variant="outline"
                      className={`${getStatusColor(facilitator.status)}`}
                    >
                      {facilitator.status?.replace(/_/g, ' ') || 'Unknown'}
                    </Badge>
                  }
                />
                {facilitator.created_at && (
                  <DescriptionCard
                    title="Date Added"
                    description={format(new Date(facilitator.created_at), "dd MMM, yyyy")}
                  />
                )}
                {facilitator.updated_at && (
                  <DescriptionCard
                    title="Last Updated"
                    description={format(new Date(facilitator.updated_at), "dd MMM, yyyy")}
                  />
                )}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Qualifications & Experience Tab */}
        <TabsContent value="qualifications" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4 text-[#DEA004] flex items-center gap-2">
                <Award className="h-5 w-5" />
                Qualifications
              </h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {facilitator.qualifications || 'No qualifications provided'}
                </p>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4 text-[#DEA004] flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Experience
              </h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {facilitator.experience || 'No experience provided'}
                </p>
              </div>
            </Card>

            {/* Documents */}
            {facilitator.cv_url && (
              <Card>
                <h3 className="text-lg font-semibold mb-4 text-[#DEA004]">Documents</h3>
                <div className="flex items-center gap-3">
                  <Button asChild variant="outline">
                    <a href={facilitator.cv_url} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4 mr-2" />
                      View CV/Resume
                    </a>
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Deliverables Tab */}
        <TabsContent value="deliverables" className="space-y-6">
          {/* Deliverables Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">Total Deliverables</p>
                  <h3 className="text-2xl font-bold mt-1 text-blue-800">{deliverableStats.total}</h3>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-700">Pending</p>
                  <h3 className="text-2xl font-bold mt-1 text-amber-800">
                    {deliverableStats.pending}
                  </h3>
                </div>
                <Clock className="h-8 w-8 text-amber-600" />
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700">Completed</p>
                  <h3 className="text-2xl font-bold mt-1 text-green-800">
                    {deliverableStats.completed}
                  </h3>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-700">Overdue</p>
                  <h3 className="text-2xl font-bold mt-1 text-red-800">
                    {deliverableStats.overdue}
                  </h3>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700">Pending Reviews</p>
                  <h3 className="text-2xl font-bold mt-1 text-purple-800">
                    {deliverableStats.pending_reviews}
                  </h3>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </Card>
          </div>

          {/* Deliverables Table */}
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-[#DEA004]">All Deliverables</h3>
            </div>
            {isLoadingDeliverables ? (
              <div className="text-center py-8">
                <LoadingSpinner />
                <p className="text-sm text-gray-500 mt-2">Loading deliverables...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {deliverables.length > 0 ? (
                  <DataTable
                    columns={deliverableColumns as any}
                    data={deliverables}
                    isLoading={isLoadingDeliverables}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No Deliverables</p>
                    <p className="text-sm mt-2">No deliverables have been assigned to this facilitator yet.</p>
                  </div>
                )}
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Payment History Tab */}
        <TabsContent value="payments" className="space-y-6">
          {/* Payment Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-700">Gross Amount</p>
                  <p className="text-2xl font-bold text-blue-800">
                    ₦{totalGrossAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-500 rounded-lg">
                  <XCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-red-700">Total Deductions</p>
                  <p className="text-2xl font-bold text-red-800">
                    ₦{totalDeductions.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500 rounded-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-700">Net Payable</p>
                  <p className="text-2xl font-bold text-green-800">
                    ₦{totalNetAmount.toLocaleString()}
                  </p>
                  {totalDeductions > 0 && (
                    <p className="text-xs text-green-600 mt-1">After deductions</p>
                  )}
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-amber-700">Payments Count</p>
                  <p className="text-2xl font-bold text-amber-800">
                    {payments.length}
                  </p>
                  <p className="text-xs text-amber-600 mt-1">Total requests</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Payment History Table */}
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-[#DEA004]">Payment History</h3>
              <Button className="flex items-center gap-2 bg-[#DEA004] hover:bg-[#c48f04]">
                <Plus className="h-4 w-4" />
                New Payment
              </Button>
            </div>
            {isLoadingPayments ? (
              <div className="text-center py-8">
                <LoadingSpinner />
                <p className="text-sm text-gray-500 mt-2">Loading payment history...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {payments.length > 0 ? (
                  payments.map((payment: any) => {
                    // Filter payment items for this facilitator
                    const allPaymentItems = payment.payment_items || [];
                    const paymentItems = allPaymentItems.filter((item: any) => {
                      const matchesFacilitatorId = item.facilitator === facilitatorId ||
                                                   item.facilitator?.id === facilitatorId ||
                                                   item.facilitator_legacy_id === facilitatorId;
                      return matchesFacilitatorId;
                    });

                    // Skip if no items for this facilitator
                    if (paymentItems.length === 0) return null;

                    const grossAmount = paymentItems.reduce((sum: number, item: any) =>
                      sum + Number(item.amount_in_figures || 0), 0
                    );
                    const totalDeductions = paymentItems.reduce((sum: number, item: any) =>
                      sum + Number(item.deduction_amount || 0), 0
                    );
                    const netAmount = grossAmount - totalDeductions;

                    return (
                      <div key={payment.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-3 rounded-lg border ${getStatusColor(payment.status)}`}>
                                {getStatusIcon(payment.status)}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{payment.payment_type_display || payment.payment_type}</h4>
                                <p className="text-sm text-gray-600">{format(new Date(payment.payment_date), "dd MMM, yyyy")}</p>
                              </div>
                            </div>
                            <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(payment.status)}`}>
                              {payment.status}
                            </span>
                          </div>
                        </div>

                        {/* Payment Breakdown */}
                        <div className="p-4">
                          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 space-y-3">
                            {/* Total Gross Pay */}
                            <div className="flex justify-between items-center py-2">
                              <span className="font-semibold text-gray-700">Total Gross Pay</span>
                              <span className="text-xl font-bold text-gray-900">₦{grossAmount.toLocaleString()}</span>
                            </div>

                            {totalDeductions > 0 && (
                              <>
                                <div className="border-t border-gray-300"></div>

                                {/* Less 5% WHT */}
                                <div className="flex justify-between items-center py-2 px-4 bg-red-50 rounded">
                                  <span className="text-sm text-red-700">Less 5% WHT</span>
                                  <span className="font-semibold text-red-700">-₦{(grossAmount * 0.05).toLocaleString()}</span>
                                </div>

                                {/* Total Net Pay after Tax */}
                                <div className="flex justify-between items-center py-2 px-4 bg-blue-50 rounded">
                                  <span className="font-medium text-blue-800">Total Net Pay after Tax</span>
                                  <span className="text-lg font-bold text-blue-900">₦{(grossAmount - (grossAmount * 0.05)).toLocaleString()}</span>
                                </div>

                                <div className="border-t border-gray-300"></div>

                                {/* Stamp Duty */}
                                <div className="flex justify-between items-center py-2 px-4 bg-amber-50 rounded">
                                  <span className="text-sm text-amber-700">Stamp Duty</span>
                                  <span className="font-semibold text-amber-700">-₦{(totalDeductions - (grossAmount * 0.05)).toLocaleString()}</span>
                                </div>
                              </>
                            )}

                            <div className="border-t-2 border-gray-400 pt-3"></div>

                            {/* Total Net Pay */}
                            <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border-2 border-green-500">
                              <span className="font-bold text-green-900 text-lg">Total Net Pay</span>
                              <span className="text-2xl font-bold text-green-700">₦{netAmount.toLocaleString()}</span>
                            </div>

                            {/* Deduction Summary */}
                            {totalDeductions > 0 && (
                              <div className="text-xs text-gray-600 text-center pt-2">
                                Total Deductions: ₦{totalDeductions.toLocaleString()} ({totalDeductions > 0 && grossAmount > 0 ? ((totalDeductions / grossAmount) * 100).toFixed(2) : '0'}% of Gross)
                              </div>
                            )}
                          </div>

                          {/* Payment Details */}
                          {paymentItems.length > 0 && paymentItems.map((item: any, index: number) => {
                            const itemGross = Number(item.amount_in_figures || 0);
                            const itemDeduction = Number(item.deduction_amount || 0);
                            const itemNet = itemGross - itemDeduction;

                            return (
                              <div key={index} className="bg-gray-50 rounded-lg p-4 mt-3">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <p className="font-medium text-gray-900">{item.payment_to}</p>
                                    <p className="text-sm text-gray-600 mt-1">{item.bank_name}</p>
                                    <p className="text-xs text-gray-500">{item.account_number}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-lg font-bold text-green-700">₦{itemNet.toLocaleString()}</p>
                                    {itemDeduction > 0 && (
                                      <p className="text-xs text-gray-500 mt-1">
                                        ₦{itemGross.toLocaleString()} - ₦{itemDeduction.toLocaleString()}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                {payment.payment_reason && (
                                  <p className="text-sm text-gray-600 italic border-t pt-2 border-gray-200">
                                    {payment.payment_reason}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }).filter(Boolean)
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No Payment History</p>
                    <p className="text-sm mt-2">No payment requests have been made for this facilitator yet.</p>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Payment Statistics */}
          {payments.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-lg font-semibold mb-4 text-[#DEA004]">Payment Statistics</h3>
                <div className="space-y-3">
                  <DescriptionCard
                    title="Average Payment Amount"
                    description={`₦${payments.length > 0 ? (totalRequested / payments.length).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : "0"}`}
                  />
                  <DescriptionCard
                    title="Payment Success Rate"
                    description={`${payments.length > 0 ? ((payments.filter((p: any) => p.status === "APPROVED").length / payments.length) * 100).toFixed(1) : "0"}%`}
                  />
                  <DescriptionCard
                    title="Total Payments Made"
                    description={`${payments.filter((p: any) => p.status === "APPROVED").length} of ${payments.length}`}
                  />
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold mb-4 text-[#DEA004]">Recent Activity</h3>
                <div className="space-y-3">
                  {payments.slice(0, 3).map((payment: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <div className={`p-1 rounded ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Payment Request</p>
                        <p className="text-xs text-gray-500">
                          {payment.created_datetime
                            ? `Created on ${format(new Date(payment.created_datetime), "dd MMM")}`
                            : "Date unknown"}
                        </p>
                      </div>
                      <span className="text-sm font-bold">₦{Number(payment.total_amount || 0).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
