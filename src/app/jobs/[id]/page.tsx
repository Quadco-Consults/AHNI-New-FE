"use client";

export const dynamic = "force-dynamic";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetPublicOpportunity } from "@/features/procurement/controllers/solicitationController";
import { useSubmitJobApplication } from "@/features/hr/controllers/publicJobApplicationController";
import BackNavigation from "@/components/BackNavigation";
import Card from "@/components/Card";
import { LoadingSpinner } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, isValid } from "date-fns";
import FormInput from "@/components/FormInput";
import FormTextArea from "@/components/FormTextArea";
import FormButton from "@/components/FormButton";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Building2,
  Briefcase,
  Mail,
  AlertCircle,
  Upload
} from "lucide-react";

// Application form schema
const ApplicationFormSchema = z.object({
  applicant_first_name: z.string().min(1, "First name is required"),
  applicant_last_name: z.string().min(1, "Last name is required"),
  applicant_middle_name: z.string().optional(),
  applicant_email: z.string().email("Valid email is required"),
  position_applied: z.string().min(1, "Position is required"),
  application_notes: z.string().optional(),
});

type ApplicationFormData = z.infer<typeof ApplicationFormSchema>;

// DetailItem component
function DetailItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground">{value}</p>
    </div>
  );
}

export default function HRJobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const { data, isLoading, error } = useGetPublicOpportunity(id as string);
  const submitApplication = useSubmitJobApplication();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <div className="p-8 text-center">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Job Not Found</h2>
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

  const opportunity = data.data;

  // Format date function
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return isValid(date) ? format(date, "MMM dd, yyyy") : "Invalid date";
  };

  // Get location display
  const getLocationDisplay = () => {
    if (opportunity.locations && Array.isArray(opportunity.locations) && opportunity.locations.length > 0) {
      return opportunity.locations.map((loc: any) => loc.name || loc.city || "Unknown").join(", ");
    }
    if (opportunity.location || opportunity.location_name) {
      return opportunity.location || opportunity.location_name;
    }
    return "Multiple locations";
  };

  // Application Form Component
  const ApplicationForm = () => {
    const form = useForm<ApplicationFormData>({
      resolver: zodResolver(ApplicationFormSchema),
      defaultValues: {
        applicant_first_name: "",
        applicant_last_name: "",
        applicant_middle_name: "",
        applicant_email: "",
        position_applied: opportunity.title || opportunity.position_title || "",
        application_notes: "",
      },
    });

    const [files, setFiles] = useState<{ resume: File | null; coverLetter: File | null }>({
      resume: null,
      coverLetter: null,
    });

    const handleFileChange = (type: 'resume' | 'coverLetter') => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setFiles(prev => ({
          ...prev,
          [type]: e.target.files![0]
        }));
      }
    };

    const onSubmit = async (data: ApplicationFormData) => {
      try {
        const applicationData = {
          job_id: id as string,
          applicant_first_name: data.applicant_first_name,
          applicant_last_name: data.applicant_last_name,
          applicant_middle_name: data.applicant_middle_name,
          applicant_email: data.applicant_email,
          position_applied: data.position_applied,
          application_notes: data.application_notes,
          employment_type: "EXTERNAL" as const,
          cover_letter: files.coverLetter || undefined,
          resume: files.resume || undefined,
        };

        const response = await submitApplication.mutateAsync(applicationData);

        if (response.message) {
          toast.success(response.message);
          setShowApplicationForm(false);
        }
      } catch (error: any) {
        toast.error(
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Failed to submit application. Please try again."
        );
        console.error("Application submission error:", error);
      }
    };

    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-2xl font-bold">Apply for Position</h2>
          <Button
            variant="outline"
            onClick={() => setShowApplicationForm(false)}
          >
            Back to Job Details
          </Button>
        </div>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="First Name" name="applicant_first_name" required />
                <FormInput label="Last Name" name="applicant_last_name" required />
                <FormInput label="Middle Name" name="applicant_middle_name" placeholder="Optional" />
                <FormInput label="Email Address" name="applicant_email" type="email" required />
              </div>
            </section>

            {/* Position Information */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold">Position Information</h3>
              <FormInput label="Position Applied For" name="position_applied" required />
              <FormTextArea
                label="Additional Notes"
                name="application_notes"
                placeholder="Tell us why you're interested in this position (optional)"
                rows={4}
              />
            </section>

            {/* File Uploads */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold">Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-medium">Upload Resume/CV</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="cursor-pointer flex items-center gap-2"
                      onClick={() => {
                        const input = document.querySelector('input[data-file-type="resume"]') as HTMLInputElement;
                        input?.click();
                      }}
                    >
                      <Upload className="h-4 w-4" />
                      Choose File
                    </Button>
                    <input
                      type="file"
                      className="hidden"
                      data-file-type="resume"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange('resume')}
                    />
                    <span className="text-sm text-gray-600">
                      {files.resume ? files.resume.name : "No file chosen"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Accepted formats: PDF, DOC, DOCX</p>
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">Upload Cover Letter</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="cursor-pointer flex items-center gap-2"
                      onClick={() => {
                        const input = document.querySelector('input[data-file-type="coverLetter"]') as HTMLInputElement;
                        input?.click();
                      }}
                    >
                      <Upload className="h-4 w-4" />
                      Choose File
                    </Button>
                    <input
                      type="file"
                      className="hidden"
                      data-file-type="coverLetter"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange('coverLetter')}
                    />
                    <span className="text-sm text-gray-600">
                      {files.coverLetter ? files.coverLetter.name : "No file chosen"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Accepted formats: PDF, DOC, DOCX</p>
                </div>
              </div>
            </section>

            {/* Position Info Display */}
            <section className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-gray-700">Position Summary:</h4>
              <p className="text-gray-900 font-medium">{opportunity.title || opportunity.position_title || "Job Position"}</p>
              {opportunity.reference_number && (
                <p className="text-sm text-gray-600">
                  Reference: {opportunity.reference_number}
                </p>
              )}
              <p className="text-sm text-gray-600">
                Location: {getLocationDisplay()}
              </p>
            </section>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowApplicationForm(false)}
              >
                Cancel
              </Button>
              <FormButton size="lg" loading={submitApplication.isPending}>
                Submit Application
              </FormButton>
            </div>
          </form>
        </FormProvider>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Header with Back Navigation */}
      <section className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-5'>
          <BackNavigation />
        </div>
      </section>

      {/* Main Content Card */}
      <Card>
        {showApplicationForm ? (
          <ApplicationForm />
        ) : (
          <div className="space-y-6 p-6">
            {/* Job Title */}
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-foreground">
                {opportunity.title || opportunity.position_title || "Job Position"}
              </h1>
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  <Briefcase className="h-3 w-3 mr-1" />
                  Full Time
                </Badge>
                {opportunity.reference_number && (
                  <p className="text-muted-foreground text-sm">
                    Ref: {opportunity.reference_number}
                  </p>
                )}
              </div>
            </div>

            {/* Key Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailItem
                label="Number of Positions"
                value={opportunity.number_of_positions || 1}
              />
              <DetailItem
                label="Grade Level"
                value={opportunity.grade_level || opportunity.grade || "Not specified"}
              />
              <DetailItem
                label="Commencement Date"
                value={formatDate(opportunity.commencement_date || opportunity.start_date)}
              />
              <DetailItem
                label="Duration"
                value={opportunity.duration || "Permanent"}
              />
              <DetailItem
                label="Location"
                value={getLocationDisplay()}
              />
              <DetailItem
                label="Supervisor"
                value={opportunity.supervisor || "To be assigned"}
              />
            </div>

            {/* Background */}
            {opportunity.background && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Background</h3>
                <div className="prose max-w-none">
                  <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {opportunity.background}
                  </p>
                </div>
              </div>
            )}

            {/* Job Description */}
            {opportunity.description && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Job Description</h3>
                <div className="prose max-w-none">
                  <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {opportunity.description}
                  </p>
                </div>
              </div>
            )}

            {/* Additional Information */}
            {opportunity.any_other_info && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Additional Information</h3>
                <div className="prose max-w-none">
                  <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {opportunity.any_other_info}
                  </p>
                </div>
              </div>
            )}

            {/* Application Section */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Mail className="h-5 w-5" />
                How to Apply
              </h3>
              <div className="text-blue-800">
                <p className="mb-2">
                  To apply for this position, please fill out the application form below:
                </p>
                <div className="text-sm space-y-1">
                  <p>• Complete all required sections</p>
                  <p>• Upload your resume and cover letter</p>
                  <p>• Only shortlisted candidates will be contacted</p>
                  <p>• Commencement date: {formatDate(opportunity.commencement_date || opportunity.start_date)}</p>
                  <p className="font-medium">• AHNI does not charge candidates any fees</p>
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-xs text-yellow-800">
                  <strong>Important:</strong> AHNI has Zero Tolerance to Sexual Abuse and is committed to safeguarding and child protection.
                  We are an equal opportunity employer.
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              <Button
                onClick={() => setShowApplicationForm(true)}
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Apply Now
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/opportunities')}
                className="flex items-center gap-2"
              >
                <Briefcase className="h-4 w-4" />
                View All Opportunities
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
