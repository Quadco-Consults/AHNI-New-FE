"use client";

import { useParams, useRouter } from "next/navigation";
import Card from "components/Card";
import BackNavigation from "components/BackNavigation";
import { LoadingSpinner } from "components/Loading";
import { Button } from "components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { Badge } from "components/ui/badge";
import PencilIcon from "components/icons/PencilIcon";
import DescriptionCard from "components/DescriptionCard";
import { useGetSingleConsultancyApplicant } from "@/features/contracts-grants/controllers/consultancyApplicantsController";
import { format } from "date-fns";

export default function AdhocStaffView() {
  const params = useParams();
  const router = useRouter();
  const staffId = params?.id as string;

  // Fetch consultancy applicant data
  const { data: applicantResponse, isLoading, error } = useGetSingleConsultancyApplicant(staffId);

  const applicant = applicantResponse?.data;

  // Transform applicant data to staff view structure
  const nameParts = applicant?.name?.split(' ') || [];
  const surname = nameParts[0] || '';
  const otherNames = nameParts.slice(1).join(' ') || '';

  const qualifications = applicant?.education
    ?.map(edu => edu.degree || edu.major)
    .filter(Boolean)
    .join(', ') || '';

  const staffData = applicant ? {
    sur_name: surname,
    other_names: otherNames,
    gender: applicant.gender,
    state_of_origin: applicant.state_of_origin,
    phone_number: applicant.phone_number,
    email_address: applicant.email,
    designation: applicant.position_under_contract,
    qualifications: qualifications,
    health_facility: applicant.health_facility,
    spoke_site_name: applicant.spoke_site_name,
    lga: applicant.lga,
    status_of_adhoc_staff: applicant.offer_accepted ? 'Active' : 'Pending',
    qmap_backstop: applicant.qmap_backstop,
    programs_officer: applicant.programs_officer,
    stl: applicant.stl,
    seo: applicant.seo,
    lga2: applicant.lga2,
    cluster: applicant.cluster,
    account_name: applicant.account_name,
    bank_name: applicant.bank_name,
    account_number: applicant.account_number,
    sort_code: applicant.sort_code,
    // Contract related data
    contract_start_date: applicant.contract_start_date,
    contract_end_date: applicant.contract_end_date,
    contract_value: applicant.contract_value,
    project: applicant.project,
    offer_acceptance_date: applicant.offer_acceptance_date,
  } : null;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !staffData) {
    return (
      <div className="p-6">
        <BackNavigation />
        <Card className="mt-5 p-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-red-600 mb-2">Data Not Found</h2>
            <p className="text-gray-600">Unable to find adhoc staff details.</p>
            <Button
              onClick={() => router.back()}
              className="mt-4"
            >
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <BackNavigation />
        <Button
          onClick={() => router.push(`/dashboard/programs/adhoc-database/${staffId}/edit`)}
          className="flex items-center gap-2"
        >
          <PencilIcon />
          Edit Details
        </Button>
      </div>

      {/* Staff Header */}
      <Card className="mb-6">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {staffData?.sur_name} {staffData?.other_names}
              </h1>
              <p className="text-xl text-gray-600 mb-4">{staffData?.designation || "No designation"}</p>
              <div className="flex gap-3">
                <Badge className="bg-green-100 text-green-700 px-3 py-1">
                  {staffData?.status_of_adhoc_staff || "Status Unknown"}
                </Badge>
                {applicant?.offer_accepted && (
                  <Badge className="bg-blue-100 text-blue-700 px-3 py-1">
                    Contract Accepted
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Staff ID</p>
              <p className="text-sm font-mono text-gray-700">{staffId?.slice(0, 8)}...</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabbed Content */}
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList>
          <TabsTrigger value="personal">Personal & Professional</TabsTrigger>
          <TabsTrigger value="contract">Contract Information</TabsTrigger>
          <TabsTrigger value="payment">Payment History</TabsTrigger>
          <TabsTrigger value="projects">Project Assignments</TabsTrigger>
        </TabsList>

        {/* Personal & Professional Tab */}
        <TabsContent value="personal" className="space-y-6">
          {/* Personal Information */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
              <div className="grid grid-cols-2 gap-6">
                <DescriptionCard
                  label="Surname"
                  description={staffData?.sur_name || "Not provided"}
                />
                <DescriptionCard
                  label="Other Names"
                  description={staffData?.other_names || "Not provided"}
                />
                <DescriptionCard
                  label="Gender"
                  description={staffData?.gender || "Not provided"}
                />
                <DescriptionCard
                  label="State of Origin"
                  description={staffData?.state_of_origin || "Not provided"}
                />
                <DescriptionCard
                  label="Phone Number"
                  description={staffData?.phone_number || "Not provided"}
                />
                <DescriptionCard
                  label="Email Address"
                  description={staffData?.email_address || "Not provided"}
                />
              </div>
            </div>
          </Card>

          {/* Professional Information */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Professional Information</h2>
              <div className="grid grid-cols-2 gap-6">
                <DescriptionCard
                  label="Designation"
                  description={staffData?.designation || "Not provided"}
                />
                <DescriptionCard
                  label="Qualifications"
                  description={staffData?.qualifications || "Not provided"}
                />
                <DescriptionCard
                  label="Health Facility/Assignment Location"
                  description={staffData?.health_facility || "Not provided"}
                />
                <DescriptionCard
                  label="Spoke Site Name"
                  description={staffData?.spoke_site_name || "Not provided"}
                />
                <DescriptionCard
                  label="LGA"
                  description={staffData?.lga || "Not provided"}
                />
                <DescriptionCard
                  label="Status of Adhoc staff"
                  description={staffData?.status_of_adhoc_staff || "Not provided"}
                />
              </div>
            </div>
          </Card>

          {/* Team & Assignment Details */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Team & Assignment Details</h2>
              <div className="grid grid-cols-2 gap-6">
                <DescriptionCard
                  label="QMAP BACKSTOP"
                  description={staffData?.qmap_backstop || "Not assigned"}
                />
                <DescriptionCard
                  label="Programs Officer"
                  description={staffData?.programs_officer || "Not assigned"}
                />
                <DescriptionCard
                  label="STL"
                  description={staffData?.stl || "Not assigned"}
                />
                <DescriptionCard
                  label="SEO"
                  description={staffData?.seo || "Not assigned"}
                />
                <DescriptionCard
                  label="LGA2"
                  description={staffData?.lga2 || "Not provided"}
                />
                <DescriptionCard
                  label="Cluster"
                  description={staffData?.cluster || "Not assigned"}
                />
              </div>
            </div>
          </Card>

          {/* Financial Information */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Financial Information</h2>
              <div className="grid grid-cols-2 gap-6">
                <DescriptionCard
                  label="Account Name"
                  description={staffData?.account_name || "Not provided"}
                />
                <DescriptionCard
                  label="Bank Name"
                  description={staffData?.bank_name || "Not provided"}
                />
                <DescriptionCard
                  label="Account Number"
                  description={staffData?.account_number || "Not provided"}
                />
                <DescriptionCard
                  label="Sort Code"
                  description={staffData?.sort_code || "Not provided"}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Contract Information Tab */}
        <TabsContent value="contract" className="space-y-6">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Contract Details</h2>
              <div className="grid grid-cols-2 gap-6">
                <DescriptionCard
                  label="Contract Start Date"
                  description={
                    staffData?.contract_start_date
                      ? format(new Date(staffData.contract_start_date), "PPP")
                      : "Not specified"
                  }
                />
                <DescriptionCard
                  label="Contract End Date"
                  description={
                    staffData?.contract_end_date
                      ? format(new Date(staffData.contract_end_date), "PPP")
                      : "Not specified"
                  }
                />
                <DescriptionCard
                  label="Contract Value"
                  description={
                    staffData?.contract_value
                      ? `₦${Number(staffData.contract_value).toLocaleString()}`
                      : "Not specified"
                  }
                />
                <DescriptionCard
                  label="Acceptance Date"
                  description={
                    staffData?.offer_acceptance_date
                      ? format(new Date(staffData.offer_acceptance_date), "PPP")
                      : "Not accepted yet"
                  }
                />
                <DescriptionCard
                  label="Project"
                  description={staffData?.project || "Not assigned"}
                />
                <DescriptionCard
                  label="Contract Status"
                  description={applicant?.status || "Unknown"}
                />
              </div>

              {/* Contract Duration */}
              {staffData?.contract_start_date && staffData?.contract_end_date && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Contract Duration</h3>
                  <p className="text-sm text-blue-800">
                    {(() => {
                      const start = new Date(staffData.contract_start_date);
                      const end = new Date(staffData.contract_end_date);
                      const diffTime = Math.abs(end.getTime() - start.getTime());
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      const months = Math.floor(diffDays / 30);
                      const days = diffDays % 30;
                      return `${months} month${months !== 1 ? 's' : ''} ${days} day${days !== 1 ? 's' : ''}`;
                    })()}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Contract Terms */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Contract Terms & Conditions</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Employment Type</h3>
                  <p className="text-sm text-gray-700">Adhoc/Temporary Contract</p>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Position</h3>
                  <p className="text-sm text-gray-700">{staffData?.designation || "Not specified"}</p>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Work Location</h3>
                  <p className="text-sm text-gray-700">
                    {staffData?.health_facility || "Not specified"}
                    {staffData?.lga && ` - ${staffData.lga}`}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Payment History Tab */}
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment History</h2>

              {/* Payment Summary */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-600 mb-1">Total Paid</p>
                  <p className="text-2xl font-bold text-green-900">₦0.00</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-600 mb-1">Contract Value</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {staffData?.contract_value
                      ? `₦${Number(staffData.contract_value).toLocaleString()}`
                      : "N/A"}
                  </p>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-600 mb-1">Pending</p>
                  <p className="text-2xl font-bold text-amber-900">
                    {staffData?.contract_value
                      ? `₦${Number(staffData.contract_value).toLocaleString()}`
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* Payment Records Table */}
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        No payment records found
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Project Assignments Tab */}
        <TabsContent value="projects" className="space-y-6">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Project Assignment</h2>
              <div className="grid grid-cols-2 gap-6">
                <DescriptionCard
                  label="Project Name"
                  description={staffData?.project || "No project assigned"}
                />
                <DescriptionCard
                  label="Assignment Location"
                  description={staffData?.health_facility || "Not specified"}
                />
                <DescriptionCard
                  label="LGA"
                  description={staffData?.lga || "Not specified"}
                />
                <DescriptionCard
                  label="Cluster"
                  description={staffData?.cluster || "Not assigned"}
                />
                <DescriptionCard
                  label="Supervisor (QMAP BACKSTOP)"
                  description={staffData?.qmap_backstop || "Not assigned"}
                />
                <DescriptionCard
                  label="Programs Officer"
                  description={staffData?.programs_officer || "Not assigned"}
                />
              </div>
            </div>
          </Card>

          {/* Past Projects */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Past Project Assignments</h2>
              <div className="text-center py-8 text-gray-500">
                No past project assignments found
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}