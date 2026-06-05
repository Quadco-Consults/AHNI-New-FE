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
import { useGetSingleAdhocApplicant } from "@/features/programs/controllers/adhocApplicantController";
import { format } from "date-fns";

export default function AdhocStaffView() {
  const params = useParams();
  const router = useRouter();
  const staffId = params?.id as string;

  // Fetch adhoc applicant data
  const { data: applicantResponse, isLoading, error } = useGetSingleAdhocApplicant(staffId, !!staffId);

  const applicant = applicantResponse?.data;

  // Transform adhoc applicant data to staff view structure
  const staffData = applicant ? {
    sur_name: applicant.sur_name,
    other_names: applicant.other_names,
    gender: applicant.gender,
    date_of_birth: applicant.date_of_birth,
    state_of_origin: applicant.state_of_origin,
    lga_of_origin: applicant.lga_of_origin,
    phone_number: applicant.phone_number,
    email_address: applicant.email_address,
    alternative_phone: applicant.alternative_phone,
    residential_address: applicant.residential_address,
    designation: applicant.advertisement?.position_title || applicant.position_under_contract,
    qualifications: applicant.qualifications,
    current_employer: applicant.current_employer,
    current_position: applicant.current_position,
    total_experience_years: applicant.total_experience_years,
    health_facility: (applicant as any).health_facility || "",
    spoke_site_name: (applicant as any).spoke_site_name || "",
    lga: (applicant as any).lga || "",
    status_of_adhoc_staff: applicant.offer_accepted ? 'Active' : applicant.status_display,
    // Application preferences
    preferred_location: applicant.preferred_location,
    preferred_health_facility: applicant.preferred_health_facility,
    willing_to_relocate: applicant.willing_to_relocate,
    // Contract related data
    contract_start_date: applicant.contract_start_date,
    contract_end_date: applicant.contract_end_date,
    offer_acceptance_date: applicant.offer_acceptance_date,
    hired_at: applicant.hired_at,
    contract_issued_at: applicant.contract_issued_at,
    applied_at: applicant.applied_at,
    updated_at: applicant.updated_at,
    // Interview data
    interview_scheduled_at: applicant.interview_scheduled_at,
    interview_conducted_at: applicant.interview_conducted_at,
    interview_score: applicant.interview_score,
    interview_type: applicant.interview_type,
    total_interviewers: applicant.total_interviewers,
    completed_evaluations: applicant.completed_evaluations,
    // Selection/Rejection
    selected_at: applicant.selected_at,
    selected_by: applicant.selected_by,
    rejected_at: applicant.rejected_at,
    rejection_reason: applicant.rejection_reason,
    // Documents
    documents: applicant.documents || [],
    // Advertisement details
    project: applicant.advertisement?.position_title,
    advertisement_number: applicant.advertisement?.advertisement_number,
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
    <div className="space-y-6">
      <BackNavigation />

      {/* Header */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {staffData?.sur_name} {staffData?.other_names}
              </h1>
              <p className="text-gray-600 mt-1">{staffData?.designation || "No designation"}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-green-500 text-white">
                  {staffData?.status_of_adhoc_staff || "Status Unknown"}
                </Badge>
                {applicant?.offer_accepted && (
                  <Badge variant="outline">Contract Accepted</Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/programs/adhoc-database/${staffId}/edit`)}
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
          <TabsTrigger value="experience">Experience & Qualifications</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="payment">Payment History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <h3 className="text-lg font-semibold mb-4 text-[#DEA004]">Personal Information</h3>
              <div className="space-y-3">
                <DescriptionCard
                  label="Full Name"
                  description={`${staffData?.sur_name || ""} ${staffData?.other_names || ""}`.trim() || "Not provided"}
                />
                <DescriptionCard
                  label="Email Address"
                  description={staffData?.email_address || "Not provided"}
                />
                <DescriptionCard
                  label="Phone Number"
                  description={staffData?.phone_number || "Not provided"}
                />
                <DescriptionCard
                  label="Alternative Phone"
                  description={staffData?.alternative_phone || "Not provided"}
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
                  label="LGA of Origin"
                  description={staffData?.lga_of_origin || "Not provided"}
                />
                <DescriptionCard
                  label="Residential Address"
                  description={staffData?.residential_address || "Not provided"}
                />
              </div>
            </Card>

            {/* Contract Status */}
            <Card>
              <h3 className="text-lg font-semibold mb-4 text-[#DEA004]">Contract Status</h3>
              <div className="space-y-3">
                <DescriptionCard
                  label="Current Status"
                  description={staffData?.status_of_adhoc_staff || "Not provided"}
                />
                <DescriptionCard
                  label="Application Number"
                  description={applicant?.application_number || "Not assigned"}
                />
                <DescriptionCard
                  label="Position"
                  description={staffData?.designation || "Not specified"}
                />
                <DescriptionCard
                  label="Offer Accepted"
                  description={applicant?.offer_accepted ? "Yes" : "No"}
                />
                {staffData?.offer_acceptance_date && (
                  <DescriptionCard
                    label="Acceptance Date"
                    description={format(new Date(staffData.offer_acceptance_date), "dd MMM, yyyy")}
                  />
                )}
                <DescriptionCard
                  label="Total Experience (Years)"
                  description={staffData?.total_experience_years?.toString() || "Not provided"}
                />
                <DescriptionCard
                  label="Qualifications"
                  description={staffData?.qualifications || "Not provided"}
                />
                <DescriptionCard
                  label="Last Updated"
                  description={staffData?.updated_at ? format(new Date(staffData.updated_at), "dd MMM, yyyy") : "Not available"}
                />
              </div>
            </Card>
          </div>

          {/* Additional Information Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Professional Background */}
            {(staffData?.current_employer || staffData?.current_position) && (
              <Card>
                <h3 className="text-lg font-semibold mb-4 text-[#DEA004]">Professional Background</h3>
                <div className="space-y-3">
                  {staffData?.current_employer && (
                    <DescriptionCard
                      label="Current Employer"
                      description={staffData.current_employer}
                    />
                  )}
                  {staffData?.current_position && (
                    <DescriptionCard
                      label="Current Position"
                      description={staffData.current_position}
                    />
                  )}
                </div>
              </Card>
            )}

            {/* Application Preferences */}
            {(staffData?.preferred_location || staffData?.preferred_health_facility || staffData?.willing_to_relocate !== undefined) && (
              <Card>
                <h3 className="text-lg font-semibold mb-4 text-[#DEA004]">Application Preferences</h3>
                <div className="space-y-3">
                  {staffData?.preferred_location && (
                    <DescriptionCard
                      label="Preferred Location"
                      description={staffData.preferred_location}
                    />
                  )}
                  {staffData?.preferred_health_facility && (
                    <DescriptionCard
                      label="Preferred Health Facility"
                      description={staffData.preferred_health_facility}
                    />
                  )}
                  {staffData?.willing_to_relocate !== undefined && (
                    <DescriptionCard
                      label="Willing to Relocate"
                      description={staffData.willing_to_relocate ? "Yes" : "No"}
                    />
                  )}
                </div>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Contract Details Tab */}
        <TabsContent value="contract" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4 text-[#DEA004]">Contract Period</h3>
              <div className="space-y-3">
                <DescriptionCard
                  label="Position"
                  description={staffData?.designation || "Not specified"}
                />
                <DescriptionCard
                  label="Start Date"
                  description={staffData?.contract_start_date ? format(new Date(staffData.contract_start_date), "dd MMM, yyyy") : "Not set"}
                />
                <DescriptionCard
                  label="End Date"
                  description={staffData?.contract_end_date ? format(new Date(staffData.contract_end_date), "dd MMM, yyyy") : "Not set"}
                />
                <DescriptionCard
                  label="Contract Duration"
                  description={
                    staffData?.contract_start_date && staffData?.contract_end_date
                      ? `${Math.ceil((new Date(staffData.contract_end_date).getTime() - new Date(staffData.contract_start_date).getTime()) / (1000 * 60 * 60 * 24))} days`
                      : "Not calculated"
                  }
                />
                {staffData?.applied_at && (
                  <DescriptionCard
                    label="Applied Date"
                    description={format(new Date(staffData.applied_at), "dd MMM, yyyy")}
                  />
                )}
                {staffData?.contract_issued_at && (
                  <DescriptionCard
                    label="Contract Issued"
                    description={format(new Date(staffData.contract_issued_at), "dd MMM, yyyy")}
                  />
                )}
                {staffData?.hired_at && (
                  <DescriptionCard
                    label="Hired Date"
                    description={format(new Date(staffData.hired_at), "dd MMM, yyyy")}
                  />
                )}
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4 text-[#DEA004]">Assignment Details</h3>
              <div className="space-y-3">
                {(staffData?.project || staffData?.designation) && (
                  <DescriptionCard
                    label="Project/Position"
                    description={staffData.project || staffData.designation}
                  />
                )}
                {staffData?.health_facility && (
                  <DescriptionCard
                    label="Health Facility"
                    description={staffData.health_facility}
                  />
                )}
                {staffData?.spoke_site_name && (
                  <DescriptionCard
                    label="Spoke Site"
                    description={staffData.spoke_site_name}
                  />
                )}
                {staffData?.lga && (
                  <DescriptionCard
                    label="LGA (Assignment Location)"
                    description={staffData.lga}
                  />
                )}
                {staffData?.state_of_origin && (
                  <DescriptionCard
                    label="State of Origin (Personal)"
                    description={staffData.state_of_origin}
                  />
                )}
                <DescriptionCard
                  label="Type"
                  description="ADHOC"
                />
              </div>
            </Card>
          </div>

          {/* Interview & Selection Information */}
          {(staffData?.interview_scheduled_at || staffData?.interview_conducted_at || staffData?.selected_at || staffData?.rejected_at) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Interview Information */}
              {(staffData?.interview_scheduled_at || staffData?.interview_conducted_at) && (
                <Card>
                  <h3 className="text-lg font-semibold mb-4 text-[#DEA004]">Interview Information</h3>
                  <div className="space-y-3">
                    {staffData?.interview_type && (
                      <DescriptionCard
                        label="Interview Type"
                        description={staffData.interview_type === 'COMMITTEE' ? 'Committee Interview' : 'Individual Interview'}
                      />
                    )}
                    {staffData?.interview_scheduled_at && (
                      <DescriptionCard
                        label="Interview Scheduled"
                        description={format(new Date(staffData.interview_scheduled_at), "PPP")}
                      />
                    )}
                    {staffData?.interview_conducted_at && (
                      <DescriptionCard
                        label="Interview Conducted"
                        description={format(new Date(staffData.interview_conducted_at), "PPP")}
                      />
                    )}
                    {staffData?.interview_score !== undefined && (
                      <DescriptionCard
                        label="Interview Score"
                        description={`${staffData.interview_score} / 50`}
                      />
                    )}
                    {staffData?.total_interviewers && (
                      <DescriptionCard
                        label="Total Interviewers"
                        description={staffData.total_interviewers.toString()}
                      />
                    )}
                    {staffData?.completed_evaluations !== undefined && (
                      <DescriptionCard
                        label="Completed Evaluations"
                        description={`${staffData.completed_evaluations} / ${staffData.total_interviewers || 0}`}
                      />
                    )}
                  </div>
                </Card>
              )}

              {/* Selection/Rejection Information */}
              {(staffData?.selected_at || staffData?.rejected_at) && (
                <Card>
                  <h3 className="text-lg font-semibold mb-4 text-[#DEA004]">
                    {staffData?.selected_at ? 'Selection Information' : 'Rejection Information'}
                  </h3>
                  <div className="space-y-3">
                    {staffData?.selected_at && (
                      <>
                        <DescriptionCard
                          label="Selected Date"
                          description={format(new Date(staffData.selected_at), "PPP")}
                        />
                        {staffData?.selected_by && (
                          <DescriptionCard
                            label="Selected By"
                            description={`${staffData.selected_by.first_name} ${staffData.selected_by.last_name}`}
                          />
                        )}
                      </>
                    )}
                    {staffData?.rejected_at && (
                      <>
                        <DescriptionCard
                          label="Rejected Date"
                          description={format(new Date(staffData.rejected_at), "PPP")}
                        />
                        {staffData?.rejection_reason && (
                          <DescriptionCard
                            label="Rejection Reason"
                            description={staffData.rejection_reason}
                          />
                        )}
                      </>
                    )}
                  </div>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        {/* Experience & Qualifications Tab */}
        <TabsContent value="experience" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Professional Information */}
            <Card>
              <h3 className="text-lg font-semibold mb-4 text-[#DEA004]">Professional Information</h3>
              <div className="space-y-3">
                {staffData?.qualifications && (
                  <DescriptionCard
                    label="Qualifications"
                    description={staffData.qualifications}
                  />
                )}
                {staffData?.total_experience_years !== undefined && (
                  <DescriptionCard
                    label="Total Experience (Years)"
                    description={staffData.total_experience_years.toString()}
                  />
                )}
                {staffData?.current_employer && (
                  <DescriptionCard
                    label="Current Employer"
                    description={staffData.current_employer}
                  />
                )}
                {staffData?.current_position && (
                  <DescriptionCard
                    label="Current Position"
                    description={staffData.current_position}
                  />
                )}
                {staffData?.designation && (
                  <DescriptionCard
                    label="Designation"
                    description={staffData.designation}
                  />
                )}
                {(!staffData?.qualifications && !staffData?.total_experience_years && !staffData?.current_employer &&
                  !staffData?.current_position && !staffData?.designation) && (
                  <p className="text-gray-500 text-sm">No professional information available</p>
                )}
              </div>
            </Card>

            {/* Supervisory & Team Information */}
            {((applicant as any)?.qmap_backstop || (applicant as any)?.programs_officer ||
              (applicant as any)?.stl || (applicant as any)?.seo) && (
              <Card>
                <h3 className="text-lg font-semibold mb-4 text-[#DEA004]">Supervisory & Team Information</h3>
                <div className="space-y-3">
                  {(applicant as any)?.qmap_backstop && (
                    <DescriptionCard
                      label="QMAP Backstop"
                      description={(applicant as any).qmap_backstop}
                    />
                  )}
                  {(applicant as any)?.programs_officer && (
                    <DescriptionCard
                      label="Programs Officer"
                      description={(applicant as any).programs_officer}
                    />
                  )}
                  {(applicant as any)?.stl && (
                    <DescriptionCard
                      label="STL"
                      description={(applicant as any).stl}
                    />
                  )}
                  {(applicant as any)?.seo && (
                    <DescriptionCard
                      label="SEO"
                      description={(applicant as any).seo}
                    />
                  )}
                </div>
              </Card>
            )}

            {/* Banking Information */}
            {((applicant as any)?.account_name || (applicant as any)?.bank_name ||
              (applicant as any)?.account_number || (applicant as any)?.sort_code ||
              (applicant as any)?.tax_identification_number) && (
              <Card>
                <h3 className="text-lg font-semibold mb-4 text-[#DEA004]">Banking Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(applicant as any)?.account_name && (
                    <DescriptionCard
                      label="Account Name"
                      description={(applicant as any).account_name}
                    />
                  )}
                  {(applicant as any)?.bank_name && (
                    <DescriptionCard
                      label="Bank Name"
                      description={(applicant as any).bank_name}
                    />
                  )}
                  {(applicant as any)?.account_number && (
                    <DescriptionCard
                      label="Account Number"
                      description={(applicant as any).account_number}
                    />
                  )}
                  {(applicant as any)?.sort_code && (
                    <DescriptionCard
                      label="Sort Code"
                      description={(applicant as any).sort_code}
                    />
                  )}
                  {(applicant as any)?.tax_identification_number && (
                    <DescriptionCard
                      label="Tax Identification Number (TIN)"
                      description={(applicant as any).tax_identification_number}
                    />
                  )}
                </div>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          {staffData?.documents && staffData.documents.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <h3 className="text-lg font-semibold mb-4 text-[#DEA004]">Uploaded Documents</h3>
                <div className="space-y-3">
                  {staffData.documents.map((doc: any, index: number) => (
                    <div key={doc.id || index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{doc.document_type || doc.file_name}</p>
                          <p className="text-sm text-gray-500">
                            Uploaded: {doc.uploaded_at ? format(new Date(doc.uploaded_at), "PPP") : "Unknown"}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(doc.file_url, '_blank')}
                        >
                          View Document
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ) : (
            <Card>
              <h3 className="text-lg font-semibold mb-4 text-[#DEA004]">Uploaded Documents</h3>
              <div className="text-center py-8 text-gray-500">
                No documents uploaded
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Payment History Tab */}
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold mb-4 text-[#DEA004]">Payment History</h3>

            {/* Payment Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-700 mb-2">Payment Information</p>
              <p className="text-gray-700">
                Payment history and contract value information will be available once the payment module is integrated.
              </p>
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
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}