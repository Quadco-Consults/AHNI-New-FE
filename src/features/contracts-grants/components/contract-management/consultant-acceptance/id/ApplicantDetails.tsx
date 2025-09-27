import { IConsultancyStaffSingleData } from "@/features/contracts-grants/types/contract-management/consultancy-management/consultancy-application";

interface ApplicantDetailsProps extends IConsultancyStaffSingleData {}

export default function ApplicantDetails(applicant: ApplicantDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="mt-1 text-sm text-gray-900">{applicant.name || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900">{applicant.email || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <p className="mt-1 text-sm text-gray-900">{applicant.phone_number || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Citizenship</label>
              <p className="mt-1 text-sm text-gray-900">{applicant.citizenship || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Place of Birth</label>
              <p className="mt-1 text-sm text-gray-900">{applicant.place_of_birth || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Contract Information</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Contract Number</label>
              <p className="mt-1 text-sm text-gray-900 font-mono">{applicant.contract_number || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Position Under Contract</label>
              <p className="mt-1 text-sm text-gray-900">{applicant.position_under_contract || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Proposed Salary</label>
              <p className="mt-1 text-sm text-gray-900">{applicant.proposed_salary ? `$${parseFloat(applicant.proposed_salary).toLocaleString()}` : 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contractor Name</label>
              <p className="mt-1 text-sm text-gray-900">{applicant.contractor_name || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Duration */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Contract Duration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <p className="mt-1 text-sm text-gray-900">
              {applicant.start_duration_date ? new Date(applicant.start_duration_date).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <p className="mt-1 text-sm text-gray-900">
              {applicant.end_duration_date ? new Date(applicant.end_duration_date).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Education */}
      {applicant.education && applicant.education.length > 0 && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Education</h3>
          <div className="space-y-3">
            {applicant.education.map((edu, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Institution</label>
                    <p className="mt-1 text-sm text-gray-900">{edu.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <p className="mt-1 text-sm text-gray-900">{edu.location}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Degree</label>
                    <p className="mt-1 text-sm text-gray-900">{edu.degree}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Major</label>
                    <p className="mt-1 text-sm text-gray-900">{edu.major}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <p className="mt-1 text-sm text-gray-900">{edu.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Language Proficiency */}
      {applicant.language_proficiency && applicant.language_proficiency.length > 0 && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Language Proficiency</h3>
          <div className="space-y-3">
            {applicant.language_proficiency.map((lang, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Language</label>
                    <p className="mt-1 text-sm text-gray-900">{lang.language}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Speaking</label>
                    <p className="mt-1 text-sm text-gray-900">{lang.proficiency_speaking}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Reading</label>
                    <p className="mt-1 text-sm text-gray-900">{lang.proficiency_reading}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Employment History */}
      {applicant.employment_history && applicant.employment_history.length > 0 && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Employment History</h3>
          <div className="space-y-3">
            {applicant.employment_history.map((emp, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Position</label>
                    <p className="mt-1 text-sm text-gray-900">{emp.position_title}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Employer</label>
                    <p className="mt-1 text-sm text-gray-900">{emp.employer_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{emp.employer_telephone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Duration</label>
                    <p className="mt-1 text-sm text-gray-900">{emp.from} - {emp.to}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Referees */}
      {applicant.referees && applicant.referees.length > 0 && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Referees</h3>
          <div className="space-y-3">
            {applicant.referees.map((referee, index) => (
              <div key={referee.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-sm text-gray-900">{referee.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{referee.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{referee.phone_number}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}