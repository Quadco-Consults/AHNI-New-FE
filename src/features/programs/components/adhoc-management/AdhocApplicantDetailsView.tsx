"use client";

import { IAdhocApplicant } from "@/features/programs/types/adhoc-management";
import { format, isValid } from "date-fns";
import InterviewScoresSection from "./InterviewScoresSection";

interface AdhocApplicantDetailsViewProps extends IAdhocApplicant {
  id: string;
}

export default function AdhocApplicantDetailsView(props: AdhocApplicantDetailsViewProps) {
  const {
    id,
    application_number,
    sur_name,
    other_names,
    gender,
    date_of_birth,
    state_of_origin,
    lga_of_origin,
    phone_number,
    email_address,
    alternative_phone,
    residential_address,
    qualifications,
    total_experience_years,
    current_employer,
    current_position,
    preferred_location,
    preferred_health_facility,
    willing_to_relocate,
    status_display,
    status,
    applied_at,
    advertisement,
    documents,
  } = props;

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold">
          {sur_name} {other_names}
        </h2>
        <p className="text-gray-500 text-sm mt-1">Application: {application_number}</p>
        <div className="flex items-center gap-4 mt-3">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {status_display}
          </span>
          {applied_at && (
            <span className="text-sm text-gray-500">
              Applied: {isValid(new Date(applied_at)) ? format(new Date(applied_at), "MMM dd, yyyy") : "N/A"}
            </span>
          )}
        </div>
      </div>

      {/* Position Applied For */}
      {advertisement && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">Position Applied For</h3>
          <p className="text-gray-700">{typeof advertisement === 'object' ? advertisement.position_title : 'N/A'}</p>
          {typeof advertisement === 'object' && advertisement.advertisement_number && (
            <p className="text-sm text-gray-500 mt-1">Ref: {advertisement.advertisement_number}</p>
          )}
        </div>
      )}

      {/* Interview Scores - Only show for interviewed/selected/hired applicants */}
      {(status === "INTERVIEWED" || status === "SELECTED" || status === "HIRED" || status === "SHORTLISTED") && (
        <InterviewScoresSection applicantId={id} />
      )}

      {/* Personal Information */}
      <div>
        <h3 className="font-semibold text-lg mb-4 border-b pb-2">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailItem label="Surname" value={sur_name} />
          <DetailItem label="Other Names" value={other_names} />
          <DetailItem label="Gender" value={gender} />
          <DetailItem
            label="Date of Birth"
            value={date_of_birth && isValid(new Date(date_of_birth))
              ? format(new Date(date_of_birth), "MMM dd, yyyy")
              : "Not provided"
            }
          />
          <DetailItem label="State of Origin" value={state_of_origin} />
          <DetailItem label="LGA of Origin" value={lga_of_origin || "Not provided"} />
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="font-semibold text-lg mb-4 border-b pb-2">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailItem label="Email Address" value={email_address} />
          <DetailItem label="Phone Number" value={phone_number} />
          <DetailItem label="Alternative Phone" value={alternative_phone || "Not provided"} />
          <DetailItem label="Residential Address" value={residential_address || "Not provided"} className="md:col-span-2" />
        </div>
      </div>

      {/* Professional Information */}
      <div>
        <h3 className="font-semibold text-lg mb-4 border-b pb-2">Professional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailItem label="Years of Experience" value={`${total_experience_years} years`} />
          <DetailItem label="Current Employer" value={current_employer || "Not provided"} />
          <DetailItem label="Current Position" value={current_position || "Not provided"} />
          <DetailItem label="Qualifications" value={qualifications} className="md:col-span-2" />
        </div>
      </div>

      {/* Assignment Preferences */}
      <div>
        <h3 className="font-semibold text-lg mb-4 border-b pb-2">Assignment Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailItem label="Preferred Location" value={preferred_location || "Not specified"} />
          <DetailItem label="Preferred Health Facility" value={preferred_health_facility || "Not specified"} />
          <DetailItem
            label="Willing to Relocate"
            value={willing_to_relocate ? "Yes" : "No"}
          />
        </div>
      </div>

      {/* Documents */}
      {documents && documents.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-4 border-b pb-2">Documents</h3>
          <div className="space-y-2">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{doc.document_type}</p>
                  <p className="text-sm text-gray-500">{doc.file_name}</p>
                  <p className="text-xs text-gray-400">
                    Uploaded: {isValid(new Date(doc.uploaded_at)) ? format(new Date(doc.uploaded_at), "MMM dd, yyyy") : "N/A"}
                  </p>
                </div>
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  View
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string | number;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  );
}
