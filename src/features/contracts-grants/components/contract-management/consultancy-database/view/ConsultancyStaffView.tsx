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
import FilePreview from "@/components/FilePreview";
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

  // Extract payments and statistics from API response (double nested: data.data.results)
  const payments = paymentsResponse?.data?.data?.results || [];
  const paymentStats = paymentsResponse?.data?.data?.statistics || {
    total_requested: 0,
    total_paid: 0,
    total_pending: 0,
    count: 0,
  };

  // Calculate payment totals from API data
  const totalPaid = paymentStats.total_paid;
  const totalPending = paymentStats.total_pending;
  const totalRequested = paymentStats.total_requested;

  // Calculate total deductions across all payments
  const totalDeductions = payments.reduce((sum: number, payment: any) => {
    const paymentItems = payment.payment_items || [];
    const paymentDeductions = paymentItems.reduce((itemSum: number, item: any) =>
      itemSum + Number(item.deduction_amount || 0), 0
    );
    return sum + paymentDeductions;
  }, 0);

  // Calculate net amounts (after deductions)
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
    // Adhoc-like fields from database
    gender: (applicant as any).gender,
    state_of_origin: (applicant as any).state_of_origin,
    health_facility: (applicant as any).health_facility,
    spoke_site_name: (applicant as any).spoke_site_name,
    lga: (applicant as any).lga,
    cluster: (applicant as any).cluster,
    qmap_backstop: (applicant as any).qmap_backstop,
    programs_officer: (applicant as any).programs_officer,
    stl: (applicant as any).stl,
    seo: (applicant as any).seo,
    account_name: (applicant as any).account_name,
    bank_name: (applicant as any).bank_name,
    account_number: (applicant as any).account_number,
    sort_code: (applicant as any).sort_code,
    tax_identification_number: (applicant as any).tax_identification_number,
    qualifications: (applicant as any).qualifications,
    experience: (applicant as any).experience,
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
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contract">Contract Details</TabsTrigger>
          <TabsTrigger value="education">Education & Experience</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4 text-yellow-darker">Personal Information</h3>
              <div className="space-y-3">
                {consultantData.name && (
                  <DescriptionCard
                    label="Full Name"
                    description={consultantData.name}
                  />
                )}
                {consultantData.contractor_name && (
                  <DescriptionCard
                    label="Contractor Name"
                    description={consultantData.contractor_name}
                  />
                )}
                {consultantData.email && (
                  <DescriptionCard
                    label="Email Address"
                    description={consultantData.email}
                  />
                )}
                {consultantData.phone_number && (
                  <DescriptionCard
                    label="Phone Number"
                    description={consultantData.phone_number}
                  />
                )}
                {consultantData.place_of_birth && (
                  <DescriptionCard
                    label="Place of Birth"
                    description={consultantData.place_of_birth}
                  />
                )}
                {consultantData.citizenship && (
                  <DescriptionCard
                    label="Citizenship"
                    description={consultantData.citizenship}
                  />
                )}
                {consultantData.address && (
                  <DescriptionCard
                    label="Address"
                    description={consultantData.address}
                  />
                )}
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4 text-yellow-darker">Contract Status</h3>
              <div className="space-y-3">
                <DescriptionCard
                  label="Current Status"
                  description={getStatusBadge(consultantData.status, consultantData.offer_accepted)}
                />
                {consultantData.contract_number && (
                  <DescriptionCard
                    label="Contract Number"
                    description={consultantData.contract_number}
                  />
                )}
                {consultantData.proposed_salary && (
                  <DescriptionCard
                    label="Proposed Salary"
                    description={`₦${Number(consultantData.proposed_salary).toLocaleString()}`}
                  />
                )}
                <DescriptionCard
                  label="Offer Accepted"
                  description={consultantData.offer_accepted ? "Yes" : "No"}
                />
                {consultantData.offer_acceptance_date && (
                  <DescriptionCard
                    label="Acceptance Date"
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
              <h3 className="text-lg font-semibold mb-4 text-yellow-darker">Contract Period</h3>
              <div className="space-y-3">
                {consultantData.position_under_contract && (
                  <DescriptionCard
                    label="Position"
                    description={consultantData.position_under_contract}
                  />
                )}
                {consultantData.start_duration_date && (
                  <DescriptionCard
                    label="Start Date"
                    description={format(new Date(consultantData.start_duration_date), "dd MMM, yyyy")}
                  />
                )}
                {consultantData.end_duration_date && (
                  <DescriptionCard
                    label="End Date"
                    description={format(new Date(consultantData.end_duration_date), "dd MMM, yyyy")}
                  />
                )}
                {consultantData.start_duration_date && consultantData.end_duration_date && (
                  <DescriptionCard
                    label="Contract Duration"
                    description={`${Math.ceil((new Date(consultantData.end_duration_date).getTime() - new Date(consultantData.start_duration_date).getTime()) / (1000 * 60 * 60 * 24))} days`}
                  />
                )}
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4 text-yellow-darker">Assignment Details</h3>
              <div className="space-y-3">
                {(consultantData.project || consultantData.location || consultantData.contract_request || consultantData.type ||
                  consultantData.health_facility || consultantData.spoke_site_name || consultantData.lga || consultantData.cluster ||
                  consultantData.gender || consultantData.state_of_origin) ? (
                  <>
                    {consultantData.project && (
                      <DescriptionCard
                        label="Project"
                        description={
                          typeof consultantData.project === 'object' && consultantData.project?.name
                            ? consultantData.project.name
                            : consultantData.project
                        }
                      />
                    )}
                    {consultantData.location && (
                      <DescriptionCard
                        label="Location"
                        description={
                          typeof consultantData.location === 'object' && consultantData.location?.name
                            ? consultantData.location.name
                            : consultantData.location
                        }
                      />
                    )}
                    {consultantData.health_facility && (
                      <DescriptionCard
                        label="Health Facility"
                        description={consultantData.health_facility}
                      />
                    )}
                    {consultantData.spoke_site_name && (
                      <DescriptionCard
                        label="Spoke Site"
                        description={consultantData.spoke_site_name}
                      />
                    )}
                    {consultantData.lga && (
                      <DescriptionCard
                        label="LGA (Assignment Location)"
                        description={consultantData.lga}
                      />
                    )}
                    {consultantData.cluster && (
                      <DescriptionCard
                        label="Cluster"
                        description={consultantData.cluster}
                      />
                    )}
                    {consultantData.gender && (
                      <DescriptionCard
                        label="Gender"
                        description={consultantData.gender}
                      />
                    )}
                    {consultantData.state_of_origin && (
                      <DescriptionCard
                        label="State of Origin"
                        description={consultantData.state_of_origin}
                      />
                    )}
                    {consultantData.contract_request && (
                      <DescriptionCard
                        label="Contract Request"
                        description={
                          typeof consultantData.contract_request === 'object' && consultantData.contract_request?.id
                            ? `Request #${consultantData.contract_request.id.substring(0, 8)}`
                            : consultantData.contract_request
                        }
                      />
                    )}
                    {consultantData.type && (
                      <DescriptionCard
                        label="Type"
                        description={consultantData.type}
                      />
                    )}
                  </>
                ) : (
                  <p className="text-gray-500 text-sm">No assignment details available</p>
                )}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Education & Experience Tab */}
        <TabsContent value="education" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4 text-yellow-darker">Education Background</h3>
              {applicant.education && applicant.education.length > 0 ? (
                <div className="space-y-4">
                  {applicant.education.map((edu: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DescriptionCard label="Institution" description={edu.name || "Not provided"} />
                        <DescriptionCard label="Location" description={edu.location || "Not provided"} />
                        <DescriptionCard label="Degree" description={edu.degree || "Not provided"} />
                        <DescriptionCard label="Major" description={edu.major || "Not provided"} />
                        <DescriptionCard label="Date" description={edu.date || "Not provided"} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No education information provided</p>
              )}
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4 text-yellow-darker">Employment History</h3>
              {applicant.employment_history && applicant.employment_history.length > 0 ? (
                <div className="space-y-4">
                  {applicant.employment_history.map((emp: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DescriptionCard label="Position" description={emp.position_title || "Not provided"} />
                        <DescriptionCard label="Employer" description={emp.employer_name || "Not provided"} />
                        <DescriptionCard label="Phone" description={emp.employer_telephone || "Not provided"} />
                        <DescriptionCard label="From" description={emp.from || "Not provided"} />
                        <DescriptionCard label="To" description={emp.to || "Not provided"} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No employment history provided</p>
              )}
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4 text-yellow-darker">Special Consultant Services</h3>
              {applicant.special_consultant_services && applicant.special_consultant_services.length > 0 ? (
                <div className="space-y-4">
                  {applicant.special_consultant_services.map((service: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DescriptionCard label="Services Performed" description={service.services_performed || "Not provided"} />
                        <DescriptionCard label="Employer" description={service.employer_name || "Not provided"} />
                        <DescriptionCard label="Phone" description={service.employer_telephone || "Not provided"} />
                        <DescriptionCard label="From" description={service.from || "Not provided"} />
                        <DescriptionCard label="To" description={service.to || "Not provided"} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No special consultant services provided</p>
              )}
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4 text-yellow-darker">Language Proficiency</h3>
              {applicant.language_proficiency && applicant.language_proficiency.length > 0 ? (
                <div className="space-y-4">
                  {applicant.language_proficiency.map((lang: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <DescriptionCard label="Language" description={lang.language || "Not provided"} />
                        <DescriptionCard label="Speaking" description={lang.proficiency_speaking || "Not provided"} />
                        <DescriptionCard label="Reading" description={lang.proficiency_reading || "Not provided"} />
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
              <h3 className="text-xl font-semibold text-yellow-darker">Payment History</h3>
              <Button className="flex items-center gap-2 bg-yellow-darker hover:bg-[#c48f04]">
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
                    // Filter payment items to show ONLY this consultant's items
                    const allPaymentItems = payment.payment_items || [];
                    const paymentItems = allPaymentItems.filter((item: any) => {
                      // Check if this item belongs to the current consultant
                      const matchesConsultantId = item.consultant === consultantId ||
                                                  item.consultant?.id === consultantId;
                      const matchesLegacyId = item.consultant_legacy_id === consultantId;
                      const matchesFacilitatorId = item.facilitator === consultantId ||
                                                   item.facilitator?.id === consultantId ||
                                                   item.facilitator_legacy_id === consultantId;
                      const matchesAdhocId = item.adhoc_staff === consultantId ||
                                            item.adhoc_staff?.id === consultantId ||
                                            item.staff_legacy_id === consultantId;

                      return matchesConsultantId || matchesLegacyId || matchesFacilitatorId || matchesAdhocId;
                    });

                    // Skip this payment if no items belong to this consultant
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
                            {/* 1. Total Gross Pay */}
                            <div className="flex justify-between items-center py-2">
                              <span className="font-semibold text-gray-700">Total Gross Pay</span>
                              <span className="text-xl font-bold text-gray-900">₦{grossAmount.toLocaleString()}</span>
                            </div>

                            {totalDeductions > 0 && (
                              <>
                                <div className="border-t border-gray-300"></div>

                                {/* 2. Less 5% WHT */}
                                <div className="flex justify-between items-center py-2 px-4 bg-red-50 rounded">
                                  <span className="text-sm text-red-700">Less 5% WHT</span>
                                  <span className="font-semibold text-red-700">-₦{(grossAmount * 0.05).toLocaleString()}</span>
                                </div>

                                {/* 3. Total Net Pay after Tax */}
                                <div className="flex justify-between items-center py-2 px-4 bg-blue-50 rounded">
                                  <span className="font-medium text-blue-800">Total Net Pay after Tax</span>
                                  <span className="text-lg font-bold text-blue-900">₦{(grossAmount - (grossAmount * 0.05)).toLocaleString()}</span>
                                </div>

                                <div className="border-t border-gray-300"></div>

                                {/* 4. Stamp Duty */}
                                <div className="flex justify-between items-center py-2 px-4 bg-amber-50 rounded">
                                  <span className="text-sm text-amber-700">Stamp Duty</span>
                                  <span className="font-semibold text-amber-700">-₦{(totalDeductions - (grossAmount * 0.05)).toLocaleString()}</span>
                                </div>
                              </>
                            )}

                            <div className="border-t-2 border-gray-400 pt-3"></div>

                            {/* 5. Total Net Pay */}
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
                    <p className="text-sm mt-2">No payment requests have been made for this consultant yet.</p>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Payment Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4 text-yellow-darker">Payment Statistics</h3>
              <div className="space-y-3">
                <DescriptionCard
                  label="Average Payment Amount"
                  description={`₦${payments.length > 0 ? (totalRequested / payments.length).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : "0"}`}
                />
                <DescriptionCard
                  label="Payment Success Rate"
                  description={`${payments.length > 0 ? ((payments.filter((p: any) => p.status === "APPROVED").length / payments.length) * 100).toFixed(1) : "0"}%`}
                />
                <DescriptionCard
                  label="Total Payments Made"
                  description={`${payments.filter((p: any) => p.status === "APPROVED").length} of ${payments.length}`}
                />
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4 text-yellow-darker">Recent Activity</h3>
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
              <h3 className="text-lg font-semibold mb-4 text-yellow-darker">Technical Monitor</h3>
              <div className="space-y-3">
                <DescriptionCard
                  label="Monitor User"
                  description={consultantData.technical_monitor_user || "Not assigned"}
                />
                <DescriptionCard
                  label="Partner Name"
                  description={consultantData.technical_monitor_partner_name || "Not provided"}
                />
                <DescriptionCard
                  label="Partner Email"
                  description={consultantData.technical_monitor_partner_email || "Not provided"}
                />
                <DescriptionCard
                  label="Partner Phone"
                  description={consultantData.technical_monitor_partner_phone || "Not provided"}
                />
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4 text-yellow-darker">Record Information</h3>
              <div className="space-y-3">
                <DescriptionCard
                  label="Created"
                  description={consultantData.created_datetime ? format(new Date(consultantData.created_datetime), "dd MMM, yyyy 'at' HH:mm") : "Not available"}
                />
                <DescriptionCard
                  label="Last Updated"
                  description={consultantData.updated_datetime ? format(new Date(consultantData.updated_datetime), "dd MMM, yyyy 'at' HH:mm") : "Not available"}
                />
              </div>
            </Card>
          </div>

          {/* References */}
          {applicant.referees && applicant.referees.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold mb-4 text-yellow-darker">References</h3>
              <div className="space-y-4">
                {applicant.referees.map((referee: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <DescriptionCard label="Name" description={referee.name || "Not provided"} />
                      <DescriptionCard label="Email" description={referee.email || "Not provided"} />
                      <DescriptionCard label="Phone" description={referee.phone_number || "Not provided"} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          {applicant.documents && applicant.documents.length > 0 ? (
            <Card>
              <h3 className="text-lg font-semibold mb-4 text-yellow-darker">Uploaded Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {applicant.documents.map((doc: any, index: number) => (
                  <FilePreview
                    key={doc.id || index}
                    id={doc.id}
                    name={doc.name || doc.title}
                    documentType={doc.document_type}
                    file={doc.document || doc.file}
                    timestamp={doc.created_datetime || doc.uploaded_datetime}
                  />
                ))}
              </div>
            </Card>
          ) : (
            <Card>
              <h3 className="text-lg font-semibold mb-4 text-yellow-darker">Uploaded Documents</h3>
              <div className="text-center py-8 text-gray-500">
                No documents uploaded
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}