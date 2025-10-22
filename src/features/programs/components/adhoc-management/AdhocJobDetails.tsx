"use client";

import { IAdhocAdvertisement } from "@/features/programs/types/adhoc-management";
import { format, isValid } from "date-fns";

interface AdhocJobDetailsProps {
  advertisement: IAdhocAdvertisement;
}

export default function AdhocJobDetails({ advertisement }: AdhocJobDetailsProps) {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{advertisement.position_title}</h2>
        <p className="text-gray-500">{advertisement.advertisement_number}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DetailItem label="Number of Positions" value={advertisement.number_of_positions} />
        <DetailItem label="Grade Level" value={advertisement.grade_level || "Not specified"} />
        <DetailItem
          label="Start Date"
          value={advertisement.start_date && isValid(new Date(advertisement.start_date))
            ? format(new Date(advertisement.start_date), "MMM dd, yyyy")
            : "Not set"
          }
        />
        <DetailItem
          label="End Date"
          value={advertisement.end_date && isValid(new Date(advertisement.end_date))
            ? format(new Date(advertisement.end_date), "MMM dd, yyyy")
            : "Not set"
          }
        />
        <DetailItem
          label="Application Deadline"
          value={advertisement.application_deadline && isValid(new Date(advertisement.application_deadline))
            ? format(new Date(advertisement.application_deadline), "MMM dd, yyyy")
            : "Not set"
          }
        />
        <DetailItem
          label="Proposed Salary"
          value={`₦${parseFloat(advertisement.proposed_salary || '0').toLocaleString()}/month`}
        />
        <DetailItem
          label="Location"
          value={advertisement.location_name || "Not specified"}
        />
        <DetailItem label="Status" value={advertisement.status_display} />
      </div>

      {advertisement.job_description && (
        <div>
          <h3 className="font-semibold text-lg mb-2">Job Description</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{advertisement.job_description}</p>
        </div>
      )}

      {advertisement.key_responsibilities && (
        <div>
          <h3 className="font-semibold text-lg mb-2">Key Responsibilities</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{advertisement.key_responsibilities}</p>
        </div>
      )}

      {(advertisement.qualifications_required || advertisement.qualifications) && (
        <div>
          <h3 className="font-semibold text-lg mb-2">Qualifications Required</h3>
          <p className="text-gray-700 whitespace-pre-wrap">
            {advertisement.qualifications_required || advertisement.qualifications}
          </p>
        </div>
      )}

      {advertisement.additional_requirements && (
        <div>
          <h3 className="font-semibold text-lg mb-2">Additional Requirements</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{advertisement.additional_requirements}</p>
        </div>
      )}
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
