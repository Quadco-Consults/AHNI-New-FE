"use client";

export const dynamic = "force-dynamic";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Axios from "@/constants/api_management/MyHttpHelper";
import { AxiosError } from "axios";
import BackNavigation from "@/components/BackNavigation";
import Card from "@/components/Card";
import { LoadingSpinner } from "@/components/Loading";
import { format } from "date-fns";
import {
  CalendarDays,
  Mail,
  AlertCircle,
  Upload,
  User,
  Phone,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { ApplicationFormFields } from "./ApplicationForm";

interface JobAdvertisement {
  id: string;
  title?: string;
  position?: { name: string; id: string } | string;
  contract_type?: string;
  position_type?: string;
  position_category?: string;
  project_tag?: string;
  number_of_positions?: number;
  locations?: Array<{ name: string }> | string;
  role_description?: string;
  education_requirements?: string;
  professional_certifications?: string;
  experience_years_min?: number;
  experience_requirements?: string;
  donor_experience?: string;
  technical_skills?: string;
  soft_skills?: string;
  location_context_requirement?: string;
  organization_name?: string;
  organization_background?: string;
  project_name?: string;
  project_duration?: string;
  project_location?: string;
  project_objectives?: string;
  project_scope?: string;
  donor_name?: string;
  application_deadline?: string;
  application_email?: string;
  application_method?: string;
  application_instructions?: string;
  subject_line_format?: string;
  equal_opportunity_statement?: string;
  disclaimer?: string;
  shortlist_notification?: string;
  background?: string;
  is_published?: boolean;
  status?: string;
}

// Helper function to get position name
const getPositionName = (ad: JobAdvertisement): string => {
  if (ad.title) return ad.title;
  if (ad.position) {
    if (typeof ad.position === 'object' && ad.position.name) {
      return ad.position.name;
    }
    if (typeof ad.position === 'string') return ad.position;
  }
  return "Position Not Set";
};

// Helper function to get location name
const getLocationName = (ad: JobAdvertisement): string => {
  if (ad.locations) {
    if (Array.isArray(ad.locations) && ad.locations.length > 0) {
      return ad.locations.map(loc => loc.name || 'Unknown').join(', ');
    }
    if (typeof ad.locations === 'string') return ad.locations;
  }
  return "Not specified";
};

export default function JobAdvertisementPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Applicant Information
    surname: "",
    firstName: "",
    middleName: "",
    homeAddress: "",
    phone: "",
    email: "",
    positionAppliedFor: "",
    positionLocation: "",
    currentPosition: "",
    currentEmployer: "",
    nigerianCitizen: "",
    authorizedToWork: "",
    workedForAhni: "",
    workedForAhniWhen: "",

    // Reference 1
    ref1Title: "",
    ref1Name: "",
    ref1Phone: "",
    ref1Email: "",
    ref1Position: "",
    ref1Employer: "",

    // Reference 2
    ref2Title: "",
    ref2Name: "",
    ref2Phone: "",
    ref2Email: "",
    ref2Position: "",
    ref2Employer: "",

    // Reference 3
    ref3Title: "",
    ref3Name: "",
    ref3Phone: "",
    ref3Email: "",
    ref3Position: "",
    ref3Employer: "",

    // HR Contact
    hrTitle: "",
    hrName: "",
    hrPhone: "",
    hrEmail: "",
    hrPosition: "",
    hrEmployer: "",

    // Files
    coverLetter: null as File | null,
    resume: null as File | null,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["job-advertisement-public", id],
    queryFn: async () => {
      try {
        const response = await Axios.get(`hr/jobs/advertisements/public/${id}/`);
        // The response has nested structure: response.data.data.data
        // response.data = { status: "success", message: "...", data: { status: true, message: "...", data: {...} } }
        console.log("API Response:", response.data);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("API Error:", error);
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  console.log("Query data:", data);
  console.log("Query error:", error);

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.surname || !formData.firstName || !formData.email || !formData.phone ||
        !formData.homeAddress || !formData.nigerianCitizen) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate at least one reference
    if (!formData.ref1Name || !formData.ref1Email || !formData.ref1Phone) {
      toast.error("Please provide at least one professional reference");
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();

      // Required fields matching backend API
      submitData.append("job_id", id || "");
      submitData.append("applicant_first_name", formData.firstName);
      submitData.append("applicant_last_name", formData.surname);
      submitData.append("applicant_middle_name", formData.middleName);
      submitData.append("applicant_email", formData.email);
      submitData.append("position_applied", formData.positionAppliedFor || getPositionName(ad));
      submitData.append("employment_type", "EXTERNAL");

      // Consolidate all additional information into application_notes
      const additionalInfo = {
        contact_information: {
          phone: formData.phone,
          home_address: formData.homeAddress,
        },
        position_details: {
          position_location: formData.positionLocation,
          current_position: formData.currentPosition,
          current_employer: formData.currentEmployer,
        },
        eligibility: {
          nigerian_citizen: formData.nigerianCitizen,
          authorized_to_work: formData.authorizedToWork,
          worked_for_ahni_before: formData.workedForAhni,
          worked_for_ahni_when: formData.workedForAhniWhen,
        },
        professional_references: [
          {
            referee_number: 1,
            title: formData.ref1Title,
            name: formData.ref1Name,
            phone: formData.ref1Phone,
            email: formData.ref1Email,
            position: formData.ref1Position,
            employer: formData.ref1Employer,
          },
          formData.ref2Name && {
            referee_number: 2,
            title: formData.ref2Title,
            name: formData.ref2Name,
            phone: formData.ref2Phone,
            email: formData.ref2Email,
            position: formData.ref2Position,
            employer: formData.ref2Employer,
          },
          formData.ref3Name && {
            referee_number: 3,
            title: formData.ref3Title,
            name: formData.ref3Name,
            phone: formData.ref3Phone,
            email: formData.ref3Email,
            position: formData.ref3Position,
            employer: formData.ref3Employer,
          },
        ].filter(Boolean),
        hr_contact: formData.hrName ? {
          title: formData.hrTitle,
          name: formData.hrName,
          phone: formData.hrPhone,
          email: formData.hrEmail,
          position: formData.hrPosition,
          employer: formData.hrEmployer,
        } : null,
      };

      submitData.append("application_notes", JSON.stringify(additionalInfo, null, 2));

      // Files (optional - backend doesn't require them)
      if (formData.coverLetter) {
        submitData.append("cover_letter", formData.coverLetter);
      }
      if (formData.resume) {
        submitData.append("resume", formData.resume);
      }

      const response = await Axios.post("public/hr/jobs/apply/", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === "success" || response.data.status === true) {
        toast.success("Application submitted successfully! We'll contact you soon.");
        setFormData({
          surname: "",
          firstName: "",
          middleName: "",
          homeAddress: "",
          phone: "",
          email: "",
          positionAppliedFor: "",
          positionLocation: "",
          currentPosition: "",
          currentEmployer: "",
          nigerianCitizen: "",
          authorizedToWork: "",
          workedForAhni: "",
          workedForAhniWhen: "",
          ref1Title: "",
          ref1Name: "",
          ref1Phone: "",
          ref1Email: "",
          ref1Position: "",
          ref1Employer: "",
          ref2Title: "",
          ref2Name: "",
          ref2Phone: "",
          ref2Email: "",
          ref2Position: "",
          ref2Employer: "",
          ref3Title: "",
          ref3Name: "",
          ref3Phone: "",
          ref3Email: "",
          ref3Position: "",
          ref3Employer: "",
          hrTitle: "",
          hrName: "",
          hrPhone: "",
          hrEmail: "",
          hrPosition: "",
          hrEmployer: "",
          coverLetter: null,
          resume: null,
        });
        setShowApplicationForm(false);
      } else {
        toast.error(response.data.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Application submission error:", error);
      toast.error("Failed to submit application. Please try again or email us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // The response is: { status: "success", data: { status: true, data: {...} } }
  // So we need to access: data.data.data
  if (error || !data?.data?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <div className="p-8 text-center">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold mb-2">Job Advertisement Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The job position you're looking for could not be found or may have expired.
            </p>
            <Button onClick={() => router.push('/opportunities')}>
              View All Opportunities
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const ad = data.data.data;

  // Default values
  const orgName = ad.organization_name || "Achieving Health Nigeria Initiative (AHNi)";
  const orgBackground = ad.organization_background || "Achieving Health Nigeria Initiative (AHNi) is an indigenous non-governmental organization that promotes socio-economic development by supporting a broad range of global health interventions, education, and economic initiatives in Nigeria. AHNi is an organization with robust interest in advancing the collective goals of the people and communities served. AHNi currently has its headquarters in Abuja, Nigeria.";
  const projectName = ad.project_name;
  const projectDuration = ad.project_duration;
  const projectLocation = ad.project_location;
  const projectObjectives = ad.project_objectives;
  const projectScope = ad.project_scope;
  const applicationDeadline = ad.application_deadline;
  const applicationEmail = ad.application_email || "careers@ahnigeria.org.ng";
  const equalOpportunity = ad.equal_opportunity_statement || "AHNi is an Equal Opportunity Employer.";
  const disclaimer = ad.disclaimer || "AHNi does not charge Candidates a fee for a test or interview";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logo and Back Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <BackNavigation />
          </div>
          <div className="flex items-center gap-6">
            <img
              src="/imgs/logo.png"
              alt="AHNi Logo"
              className="h-16 w-auto"
            />
            <div>
              <h1 className="font-bold text-3xl text-blue-900">JOB VACANCY</h1>
              <p className="text-sm text-gray-600">Achieving Health Nigeria Initiative</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        {/* Job Summary Banner */}
        <div className="bg-blue-600 text-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-2">{getPositionName(ad)}</h2>
          <p className="text-blue-100">
            {ad.contract_type?.replace('_', ' ') || 'Fixed Term'} • {getLocationName(ad)}
          </p>
          {applicationDeadline && (
            <p className="text-blue-100 mt-2 flex items-center gap-2">
              <CalendarDays size={16} />
              Deadline: {format(new Date(applicationDeadline), "MMMM d, yyyy")}
            </p>
          )}
        </div>

        {/* Organization Background */}
        <Card className="p-8 shadow-sm">
          <h3 className="font-bold text-xl text-blue-900 mb-4">{orgName}</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{orgBackground}</p>
        </Card>

        {/* Project Information */}
        {projectName && (
          <Card className="p-8 shadow-sm bg-blue-50 border-blue-200">
            <h3 className="font-bold text-lg text-blue-900 mb-3">Project Context</h3>
            <div className="space-y-3">
              <p className="text-gray-700 leading-relaxed">
                {orgName} is proposing to implement a {projectDuration} {projectName}
                {projectLocation && ` in ${projectLocation}`}.
                {projectObjectives && ` ${projectObjectives}`}
              </p>

              {projectScope && (
                <p className="text-gray-700 leading-relaxed whitespace-pre-line mt-3">{projectScope}</p>
              )}
            </div>
          </Card>
        )}

        {/* Position Summary Table */}
        <Card className="p-8 shadow-sm">
          <h3 className="font-bold text-lg text-blue-900 mb-4">Position Summary</h3>
          <p className="text-gray-700 mb-4">We are seeking qualified candidates for the following position:</p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse bg-white">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="text-left p-3 font-semibold">POSITION</th>
                  <th className="text-left p-3 font-semibold">CONTRACT</th>
                  <th className="text-left p-3 font-semibold">TYPE</th>
                  <th className="text-left p-3 font-semibold">CATEGORY</th>
                  <th className="text-left p-3 font-semibold">PROJECT</th>
                  <th className="text-left p-3 font-semibold">NO.</th>
                  <th className="text-left p-3 font-semibold">LOCATION(S)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-3 font-medium">{getPositionName(ad)}</td>
                  <td className="p-3">{ad.contract_type?.replace('_', ' ') || 'Fixed Term'}</td>
                  <td className="p-3">{ad.position_type || 'N/A'}</td>
                  <td className="p-3">{ad.position_category || ''}</td>
                  <td className="p-3">{ad.project_tag || ''}</td>
                  <td className="p-3">{ad.number_of_positions || 1}</td>
                  <td className="p-3">{getLocationName(ad)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Position Details */}
        <Card className="p-8 shadow-sm">
          <h3 className="font-bold text-2xl text-blue-900 mb-6 uppercase">{getPositionName(ad)}</h3>

          {/* Role Description */}
          {(ad.role_description || ad.background) && (
            <div className="mb-8">
              <h4 className="font-bold text-lg text-blue-900 mb-3">Role Description</h4>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-lg">
                {ad.role_description || ad.background}
              </div>
            </div>
          )}

          {/* Requirements */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg text-blue-900 mb-4">Minimum Recruitment Requirements:</h4>

            <ul className="list-none space-y-3">
              {ad.education_requirements && (
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span className="text-gray-700">{ad.education_requirements}</span>
                </li>
              )}

              {ad.professional_certifications && (
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span className="text-gray-700">{ad.professional_certifications}</span>
                </li>
              )}

              {ad.experience_years_min && ad.experience_years_min > 0 && (
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span className="text-gray-700">Minimum of {ad.experience_years_min} years relevant experience{ad.experience_requirements && ` ${ad.experience_requirements}`}</span>
                </li>
              )}

              {ad.donor_experience && (
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span className="text-gray-700">Demonstrated experience working on {ad.donor_experience}.</span>
                </li>
              )}

              {ad.technical_skills && (
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span className="text-gray-700">{ad.technical_skills}</span>
                </li>
              )}

              {ad.soft_skills && (
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span className="text-gray-700">{ad.soft_skills}</span>
                </li>
              )}

              {ad.location_context_requirement && (
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span className="text-gray-700">{ad.location_context_requirement}</span>
                </li>
              )}
            </ul>
          </div>
        </Card>

        {/* Application Section */}
        <Card id="apply-section" className="p-8 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
          <h3 className="font-bold text-2xl text-blue-900 mb-6">
            {showApplicationForm ? "Submit Your Application" : "How to Apply"}
          </h3>

          {!showApplicationForm ? (
            <>
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  {ad.application_instructions || "Interested and qualified Candidates should forward a suitability statement (application) and resume (CV) as a single MS Word document to:"}
                </p>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="font-bold text-blue-900 mb-2">{getPositionName(ad)}</p>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <a
                      href={`mailto:${applicationEmail}?subject=Application for ${getPositionName(ad)}`}
                      className="text-blue-600 hover:text-blue-800 font-semibold text-lg hover:underline"
                    >
                      {applicationEmail}
                    </a>
                  </div>
                </div>
              </div>

              {applicationDeadline ? (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="text-red-600" size={24} />
                    <div>
                      <p className="font-bold text-gray-900">Application Deadline</p>
                      <p className="text-red-600 font-bold text-lg">
                        {format(new Date(applicationDeadline), "EEEE, MMMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                  <p className="font-semibold text-gray-900">
                    Applications will be received and reviewed on a rolling basis
                  </p>
                </div>
              )}

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
                <p className="text-gray-700 text-sm leading-relaxed">
                  <strong>Important:</strong> {ad.subject_line_format || "Only applications sent electronically (i.e., by e-mail) with the JOB TITLE and LOCATION clearly indicated as the subject of the mail will be considered and only short-listed candidates will be contacted."}
                </p>
              </div>

              {ad.shortlist_notification && (
                <p className="text-gray-600 text-sm italic mt-4">
                  {ad.shortlist_notification}
                </p>
              )}

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-12 py-6 text-lg"
                  onClick={() => setShowApplicationForm(true)}
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Apply Online
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold px-12 py-6 text-lg"
                  onClick={() => {
                    window.location.href = `mailto:${applicationEmail}?subject=Application for ${getPositionName(ad)}`;
                  }}
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Apply via Email
                </Button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmitApplication} className="bg-white p-8 rounded-lg shadow-sm">
              {/* Comprehensive Employment Application Form */}
              <ApplicationFormFields
                formData={formData}
                setFormData={setFormData}
                positionName={getPositionName(ad)}
              />

              {/* Submit and Cancel Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-5 w-5" />
                      Submit Application
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-6 text-lg"
                  onClick={() => setShowApplicationForm(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </Card>

        {/* Footer Statements */}
        <Card className="p-8 shadow-sm bg-gray-50">
          <div className="text-center space-y-4">
            <p className="text-base font-bold text-blue-900">{equalOpportunity}</p>
            <p className="text-sm text-gray-600 italic">
              <strong>Disclaimer:</strong> {disclaimer}
            </p>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="bg-blue-900 text-white mt-12 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Achieving Health Nigeria Initiative (AHNi). All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
