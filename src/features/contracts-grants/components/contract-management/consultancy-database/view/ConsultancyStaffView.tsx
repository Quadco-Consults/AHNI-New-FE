"use client";

import { useParams, useRouter } from "next/navigation";
import Card from "@/components/Card";
import BackNavigation from "@/components/BackNavigation";
import { LoadingSpinner } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import PencilIcon from "@/components/icons/PencilIcon";
import DescriptionCard from "@/components/DescriptionCard";
import { useGetSingleConsultancyApplicant } from "@/features/contracts-grants/controllers/consultancyApplicantsController";
import { useGetConsultantPayments } from "@/features/admin/controllers/paymentRequestController";
import { format } from "date-fns";
import { DollarSign, Calendar, CheckCircle, Clock, XCircle, Plus, FileText, TrendingUp } from "lucide-react";

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

export default function ConsultancyStaffView() {
  const params = useParams();
  const router = useRouter();
  const consultantId = params?.id as string;

  // Fetch consultancy applicant data
  const { data: applicantResponse, isLoading, error } = useGetSingleConsultancyApplicant(consultantId);

  const applicant = applicantResponse?.data;

  // Fetch real payment data for this consultant
  const { data: paymentsResponse, isLoading: isLoadingPayments } = useGetConsultantPayments(consultantId, !!consultantId);

  // Extract payments and statistics from API response
  const payments = paymentsResponse?.data?.results || [];
  const paymentStats = paymentsResponse?.data?.statistics || {
    total_requested: 0,
    total_paid: 0,
    total_pending: 0,
    count: 0,
  };

  // Calculate payment totals from API data
  const totalPaid = paymentStats.total_paid;
  const totalPending = paymentStats.total_pending;
  const totalRequested = paymentStats.total_requested;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !applicant) {
    return (
      <div className="p-6">
        <BackNavigation />
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Consultant Not Found</h2>
          <p className="text-gray-600">The requested consultant could not be found.</p>
        </Card>
      </div>
    );
  }

  // Transform consultant data for display
  const consultantData = {
    name: applicant.name,
    contractor_name: applicant.contractor_name,
    email: applicant.email,
    phone_number: applicant.phone_number,
    position_under_contract: applicant.position_under_contract,
    contract_number: applicant.contract_number,
    proposed_salary: applicant.proposed_salary,
    place_of_birth: applicant.place_of_birth,
    address: applicant.address,
    citizenship: applicant.citizenship,
    start_duration_date: applicant.start_duration_date,
    end_duration_date: applicant.end_duration_date,
    status: applicant.status,
    offer_accepted: applicant.offer_accepted,
    offer_acceptance_date: applicant.offer_acceptance_date,
    type: applicant.type,
    technical_monitor_user: applicant.technical_monitor_user,
    technical_monitor_partner_name: applicant.technical_monitor_partner_name,
    technical_monitor_partner_email: applicant.technical_monitor_partner_email,
    technical_monitor_partner_phone: applicant.technical_monitor_partner_phone,
    location: applicant.location,
    project: applicant.project,
    contract_request: applicant.contract_request,
    created_datetime: applicant.created_datetime,
    updated_datetime: applicant.updated_datetime,
  };

  const getStatusBadge = (status: string, offerAccepted: boolean) => {
    if (offerAccepted) {
      return <Badge className="bg-green-500 text-white">Active</Badge>;
    }

    const statusColors: Record<string, string> = {
      'CONTRACT_ISSUED': 'bg-blue-500 text-white',
      'APPROVED': 'bg-green-500 text-white',
      'INTERVIEWED': 'bg-yellow-500 text-white',
      'SHORTLISTED': 'bg-purple-500 text-white',
      'APPLIED': 'bg-gray-500 text-white',
    };

    return (
      <Badge className={statusColors[status] || 'bg-gray-500 text-white'}>
        {status?.replace(/_/g, ' ') || 'Unknown'}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <BackNavigation />

      {/* Header */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {consultantData.name || "Unknown Consultant"}
              </h1>
              <p className="text-gray-600 mt-1">
                {consultantData.position_under_contract || "Position not specified"}
              </p>
              <div className="flex items-center gap-2 mt-2">
                {getStatusBadge(consultantData.status, consultantData.offer_accepted)}
                <Badge variant="outline">{consultantData.type}</Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/c-and-g/consultancy-database/${consultantId}/edit`)}
              className="flex items-center gap-2"
            >
              <PencilIcon />
              Edit
            </Button>
          </div>
        </div>
      </Card>

      {/* Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contract">Contract Details</TabsTrigger>
          <TabsTrigger value="education">Education & Experience</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4 text-[#DEA004]">Personal Information</h3>
              <div className="space-y-3">
                <DescriptionCard
                  title="Full Name"
                  description={consultantData.name || "Not provided"}
                />
                <DescriptionCard
                  title="Contractor Name"
                  description={consultantData.contractor_name || "Not provided"}
                />
                <DescriptionCard
                  title="Email Address"
                  description={consultantData.email || "Not provided"}
                />
                <DescriptionCard
                  title="Phone Number"
                  description={consultantData.phone_number || "Not provided"}
                />
                <DescriptionCard
                  title="Place of Birth"
                  description={consultantData.place_of_birth || "Not provided"}
                />
                <DescriptionCard
                  title="Citizenship"
                  description={consultantData.citizenship || "Not provided"}
                />
                <DescriptionCard
                  title="Address"
                  description={consultantData.address || "Not provided"}
                />
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4 text-[#DEA004]">Contract Status</h3>
              <div className="space-y-3">
                <DescriptionCard
                  title="Current Status"
                  description={getStatusBadge(consultantData.status, consultantData.offer_accepted)}
                />
                <DescriptionCard
                  title="Contract Number"
                  description={consultantData.contract_number || "Not assigned"}
                />
                <DescriptionCard
                  title="Proposed Salary"
                  description={consultantData.proposed_salary ? `₦${Number(consultantData.proposed_salary).toLocaleString()}` : "Not specified"}
                />
                <DescriptionCard
                  title="Offer Accepted"
                  description={consultantData.offer_accepted ? "Yes" : "No"}
                />
                {consultantData.offer_acceptance_date && (
                  <DescriptionCard
                    title="Acceptance Date"
                    description={format(new Date(consultantData.offer_acceptance_date), "dd MMM, yyyy")}
                  />
                )}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Contract Details Tab */}
        <TabsContent value="contract" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4 text-[#DEA004]">Contract Period</h3>
              <div className="space-y-3">
                <DescriptionCard
                  title="Position"
                  description={consultantData.position_under_contract || "Not specified"}
                />
                <DescriptionCard
                  title="Start Date"
                  description={consultantData.start_duration_date ? format(new Date(consultantData.start_duration_date), "dd MMM, yyyy") : "Not set"}
                />
                <DescriptionCard
                  title="End Date"
                  description={consultantData.end_duration_date ? format(new Date(consultantData.end_duration_date), "dd MMM, yyyy") : "Not set"}
                />
                <DescriptionCard
                  title="Contract Duration"
                  description={
                    consultantData.start_duration_date && consultantData.end_duration_date
                      ? `${Math.ceil((new Date(consultantData.end_duration_date).getTime() - new Date(consultantData.start_duration_date).getTime()) / (1000 * 60 * 60 * 24))} days`
                      : "Not calculated"
                  }
                />
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4 text-[#DEA004]">Assignment Details</h3>
              <div className="space-y-3">
                <DescriptionCard
                  title="Project"
                  description={consultantData.project || "Not assigned"}
                />
                <DescriptionCard
                  title="Location"
                  description={consultantData.location || "Not specified"}
                />
                <DescriptionCard
                  title="Contract Request"
                  description={consultantData.contract_request || "Not linked"}
                />
                <DescriptionCard
                  title="Type"
                  description={consultantData.type || "Not specified"}
                />
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Education & Experience Tab */}
        <TabsContent value="education" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4 text-[#DEA004]">Education Background</h3>
              {applicant.education && applicant.education.length > 0 ? (
                <div className="space-y-4">
                  {applicant.education.map((edu: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DescriptionCard title="Institution" description={edu.name || "Not provided"} />
                        <DescriptionCard title="Location" description={edu.location || "Not provided"} />
                        <DescriptionCard title="Degree" description={edu.degree || "Not provided"} />
                        <DescriptionCard title="Major" description={edu.major || "Not provided"} />
                        <DescriptionCard title="Date" description={edu.date || "Not provided"} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No education information provided</p>
              )}
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4 text-[#DEA004]">Employment History</h3>
              {applicant.employment_history && applicant.employment_history.length > 0 ? (
                <div className="space-y-4">
                  {applicant.employment_history.map((emp: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DescriptionCard title="Position" description={emp.position_title || "Not provided"} />
                        <DescriptionCard title="Employer" description={emp.employer_name || "Not provided"} />
                        <DescriptionCard title="Phone" description={emp.employer_telephone || "Not provided"} />
                        <DescriptionCard title="From" description={emp.from || "Not provided"} />
                        <DescriptionCard title="To" description={emp.to || "Not provided"} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No employment history provided</p>
              )}
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4 text-[#DEA004]">Special Consultant Services</h3>
              {applicant.special_consultant_services && applicant.special_consultant_services.length > 0 ? (
                <div className="space-y-4">
                  {applicant.special_consultant_services.map((service: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DescriptionCard title="Services Performed" description={service.services_performed || "Not provided"} />
                        <DescriptionCard title="Employer" description={service.employer_name || "Not provided"} />
                        <DescriptionCard title="Phone" description={service.employer_telephone || "Not provided"} />
                        <DescriptionCard title="From" description={service.from || "Not provided"} />
                        <DescriptionCard title="To" description={service.to || "Not provided"} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No special consultant services provided</p>
              )}
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4 text-[#DEA004]">Language Proficiency</h3>
              {applicant.language_proficiency && applicant.language_proficiency.length > 0 ? (
                <div className="space-y-4">
                  {applicant.language_proficiency.map((lang: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <DescriptionCard title="Language" description={lang.language || "Not provided"} />
                        <DescriptionCard title="Speaking" description={lang.proficiency_speaking || "Not provided"} />
                        <DescriptionCard title="Reading" description={lang.proficiency_reading || "Not provided"} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No language proficiency information provided</p>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* Payment History Tab */}
        <TabsContent value="payments" className="space-y-6">
          {/* Payment Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500 rounded-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-700">Total Paid</p>
                  <p className="text-2xl font-bold text-green-800">
                    ₦{totalPaid.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500 rounded-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-amber-700">Pending Payments</p>
                  <p className="text-2xl font-bold text-amber-800">
                    ₦{totalPending.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-700">Total Requested</p>
                  <p className="text-2xl font-bold text-blue-800">
                    ₦{totalRequested.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-[#DEA004]">Payment Management</h3>
                <p className="text-gray-600 text-sm">Manage consultant payment requests and track status</p>
              </div>
              <Button className="flex items-center gap-2 bg-[#DEA004] hover:bg-[#c48f04]">
                <Plus className="h-4 w-4" />
                New Payment Request
              </Button>
            </div>
          </Card>

          {/* Payment History Table */}
          <Card>
            <h3 className="text-lg font-semibold mb-4 text-[#DEA004]">Payment History</h3>
            {isLoadingPayments ? (
              <div className="text-center py-8">
                <LoadingSpinner />
                <p className="text-sm text-gray-500 mt-2">Loading payment history...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {payments.length > 0 ? (
                  payments.map((payment: any) => (
                    <div key={payment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg border ${getStatusColor(payment.status)}`}>
                            {getStatusIcon(payment.status)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Payment Request</p>
                            <p className="text-sm text-gray-500">{payment.payment_reason || "No description"}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600">Type</p>
                          <p className="font-medium">{payment.payment_type_display || payment.payment_type}</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600">Amount</p>
                          <p className="font-bold text-gray-900">₦{Number(payment.total_amount || 0).toLocaleString()}</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600">Payment Date</p>
                          <p className="font-medium">{format(new Date(payment.payment_date), "dd MMM, yyyy")}</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600">Created</p>
                          <p className="font-medium">
                            {payment.created_datetime ? format(new Date(payment.created_datetime), "dd MMM, yyyy") : "N/A"}
                          </p>
                        </div>

                        <div className="flex justify-end">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No Payment History</p>
                    <p className="text-sm mt-2">No payment requests have been made for this consultant yet.</p>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Payment Statistics */}
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
                {payments.length > 0 ? (
                  payments.slice(0, 3).map((payment: any, index: number) => (
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
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
                )}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4 text-[#DEA004]">Technical Monitor</h3>
              <div className="space-y-3">
                <DescriptionCard
                  title="Monitor User"
                  description={consultantData.technical_monitor_user || "Not assigned"}
                />
                <DescriptionCard
                  title="Partner Name"
                  description={consultantData.technical_monitor_partner_name || "Not provided"}
                />
                <DescriptionCard
                  title="Partner Email"
                  description={consultantData.technical_monitor_partner_email || "Not provided"}
                />
                <DescriptionCard
                  title="Partner Phone"
                  description={consultantData.technical_monitor_partner_phone || "Not provided"}
                />
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4 text-[#DEA004]">Record Information</h3>
              <div className="space-y-3">
                <DescriptionCard
                  title="Created"
                  description={consultantData.created_datetime ? format(new Date(consultantData.created_datetime), "dd MMM, yyyy 'at' HH:mm") : "Not available"}
                />
                <DescriptionCard
                  title="Last Updated"
                  description={consultantData.updated_datetime ? format(new Date(consultantData.updated_datetime), "dd MMM, yyyy 'at' HH:mm") : "Not available"}
                />
              </div>
            </Card>
          </div>

          {/* References */}
          {applicant.referees && applicant.referees.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold mb-4 text-[#DEA004]">References</h3>
              <div className="space-y-4">
                {applicant.referees.map((referee: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <DescriptionCard title="Name" description={referee.name || "Not provided"} />
                      <DescriptionCard title="Email" description={referee.email || "Not provided"} />
                      <DescriptionCard title="Phone" description={referee.phone_number || "Not provided"} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Documents */}
          {applicant.documents && applicant.documents.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold mb-4 text-[#DEA004]">Documents</h3>
              <div className="space-y-3">
                {applicant.documents.map((doc: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-gray-500">
                        Uploaded: {doc.created_datetime ? format(new Date(doc.created_datetime), "dd MMM, yyyy") : "Unknown"}
                      </p>
                    </div>
                    {doc.document && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={doc.document} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}