"use client";

export const dynamic = "force-dynamic";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetPublicOpportunity } from "@/features/procurement/controllers/solicitationController";
import { useSubmitAdhocApplication } from "@/features/contracts-grants/controllers/publicApplicationController";
import BackNavigation from "@/components/atoms/BackNavigation";
import Card from "@/components/Card";
import { LoadingSpinner } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, isValid } from "date-fns";
import FormInput from "@/components/atoms/FormInput";
import FormTextArea from "@/components/atoms/FormTextArea";
import FormSelect from "@/components/atoms/FormSelect";
import FormButton from "@/components/FormButton";
import { nigeriaStates } from "@/constants/nigeria-states";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Building2,
  Zap,
  Mail,
  AlertCircle,
  DollarSign
} from "lucide-react";

// Simplified application form schema
const ApplicationFormSchema = z.object({
  surname: z.string().min(1, "Surname is required"),
  other_names: z.string().min(1, "Other names are required"),
  email: z.string().email("Valid email is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], { required_error: "Gender is required" }),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  state_of_origin: z.string().min(1, "State of origin is required"),
  qualification: z.string().min(1, "Qualification is required"),
  years_of_experience: z.number().min(0, "Years of experience must be 0 or greater"),
});

type ApplicationFormData = z.infer<typeof ApplicationFormSchema>;

// DetailItem component matching staff portal design
function DetailItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground">{value}</p>
    </div>
  );
}

export default function AdhocJobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const { data, isLoading, error } = useGetPublicOpportunity(id as string);
  const submitApplication = useSubmitAdhocApplication(id as string);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <div className="p-8 text-center">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Adhoc Job Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The adhoc position you're looking for could not be found or may have expired.
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
    return "To be determined";
  };

  // Calculate duration
  const getDuration = () => {
    if (opportunity.duration_months) {
      return `${opportunity.duration_months} months`;
    }
    if (opportunity.start_date && opportunity.end_date) {
      const start = new Date(opportunity.start_date);
      const end = new Date(opportunity.end_date);
      if (isValid(start) && isValid(end)) {
        const months = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
        return `${months} months`;
      }
    }
    return "Duration to be discussed";
  };

  // Gender options
  const genderOptions = [
    { label: "Male", value: "MALE" },
    { label: "Female", value: "FEMALE" },
    { label: "Other", value: "OTHER" },
  ];

  // State options
  const stateOptions = nigeriaStates.map((state) => ({
    label: state,
    value: state,
  }));

  // Application Form Component
  const ApplicationForm = () => {
    const form = useForm<ApplicationFormData>({
      resolver: zodResolver(ApplicationFormSchema),
      defaultValues: {
        surname: "",
        other_names: "",
        email: "",
        phone_number: "",
        gender: "MALE",
        date_of_birth: "",
        state_of_origin: "",
        qualification: "",
        years_of_experience: 0,
      },
    });

    const onSubmit = async (data: ApplicationFormData) => {
      try {
        // Transform to match backend API expectations
        const applicationData = {
          name: `${data.surname}, ${data.other_names}`,
          email: data.email,
          phone_number: data.phone_number,
          type: "ADHOC" as const,
          contractor_name: `${data.other_names} ${data.surname}`,
          place_of_birth: data.state_of_origin,
          // Store qualifications in education field
          education: [{
            degree: data.qualification,
            institution: "See application details",
            year: new Date().getFullYear().toString(),
          }],
        };

        const response = await submitApplication.mutateAsync(applicationData);

        if (response.status) {
          toast.success(response.message || "Application submitted successfully!");
          setShowApplicationForm(false);
        }
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ||
          "Failed to submit application. Please try again."
        );
        console.error("Application submission error:", error);
      }
    };

    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-2xl font-bold">Apply for Adhoc Position</h2>
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
                <FormInput label="Surname" name="surname" required />
                <FormInput label="Other Names" name="other_names" required />
                <FormInput label="Email Address" name="email" type="email" required />
                <FormInput label="Phone Number" name="phone_number" type="tel" required />
                <FormSelect label="Gender" name="gender" required options={genderOptions} />
                <FormInput label="Date of Birth" name="date_of_birth" type="date" required />
                <FormSelect label="State of Origin" name="state_of_origin" required options={stateOptions} />
              </div>
            </section>

            {/* Professional Information */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold">Professional Information</h3>
              <FormTextArea
                label="Qualifications"
                name="qualification"
                required
                placeholder="List your educational qualifications and certifications"
                rows={4}
              />
              <FormInput
                label="Years of Experience"
                name="years_of_experience"
                type="number"
                required
                placeholder="0"
              />
            </section>

            {/* Position Info Display */}
            <section className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-gray-700">Applying For:</h4>
              <p className="text-gray-900 font-medium">{opportunity.title || opportunity.position_title || "Adhoc Position"}</p>
              {opportunity.advertisement_number && (
                <p className="text-sm text-gray-600">
                  Reference: {opportunity.advertisement_number}
                </p>
              )}
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
          {/* Job Title and ID */}
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-foreground">
              {opportunity.title || opportunity.position_title || "Adhoc Position"}
            </h1>
            <div className="flex items-center gap-3">
              <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                <Zap className="h-3 w-3 mr-1" />
                Adhoc Position
              </Badge>
              {opportunity.advertisement_number && (
                <p className="text-muted-foreground text-sm">
                  Ref: {opportunity.advertisement_number}
                </p>
              )}
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailItem
              label="Number of Positions"
              value={opportunity.number_of_positions || opportunity.consultants_number || 1}
            />
            <DetailItem
              label="Grade Level"
              value={opportunity.grade_level || "Not specified"}
            />
            <DetailItem
              label="Start Date"
              value={formatDate(opportunity.start_date || opportunity.commencement_date)}
            />
            <DetailItem
              label="End Date"
              value={formatDate(opportunity.end_date || opportunity.closing_date)}
            />
            <DetailItem
              label="Application Deadline"
              value={formatDate(opportunity.application_deadline || opportunity.closing_date)}
            />
            <DetailItem
              label="Duration"
              value={getDuration()}
            />
            <DetailItem
              label="Proposed Salary"
              value={opportunity.proposed_salary ? `₦${parseFloat(opportunity.proposed_salary).toLocaleString()}/month` : "To be discussed"}
            />
            <DetailItem
              label="Location"
              value={getLocationDisplay()}
            />
            <DetailItem
              label="Status"
              value={opportunity.status_display || opportunity.status || "Active"}
            />
            <DetailItem
              label="Department"
              value={opportunity.department || "Programs"}
            />
          </div>

          {/* Job Description */}
          {(opportunity.job_description || opportunity.description || opportunity.background) && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Job Description</h3>
              <div className="prose max-w-none">
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {opportunity.job_description || opportunity.description || opportunity.background}
                </p>
              </div>
            </div>
          )}

          {/* Key Responsibilities */}
          {opportunity.key_responsibilities && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Key Responsibilities</h3>
              <div className="prose max-w-none">
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {opportunity.key_responsibilities}
                </p>
              </div>
            </div>
          )}

          {/* Qualifications Required */}
          {(opportunity.qualifications_required || opportunity.qualifications || opportunity.requirements) && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Qualifications Required</h3>
              <div className="prose max-w-none">
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {opportunity.qualifications_required || opportunity.qualifications || opportunity.requirements}
                </p>
              </div>
            </div>
          )}

          {/* Additional Requirements */}
          {opportunity.additional_requirements && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Additional Requirements</h3>
              <div className="prose max-w-none">
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {opportunity.additional_requirements}
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
                To apply for this adhoc position, please fill out the application form below:
              </p>
              <div className="text-sm space-y-1">
                <p>• Complete all required sections</p>
                <p>• Provide accurate contact information</p>
                <p>• Only shortlisted candidates will be contacted</p>
                <p>• Application deadline: {formatDate(opportunity.application_deadline || opportunity.closing_date)}</p>
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
              <Zap className="h-4 w-4" />
              View All Opportunities
            </Button>
          </div>
        </div>
        )}
      </Card>
    </div>
  );
}