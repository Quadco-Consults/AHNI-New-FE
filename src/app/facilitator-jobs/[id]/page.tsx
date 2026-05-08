"use client";

export const dynamic = "force-dynamic";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetPublicOpportunity } from "@/features/procurement/controllers/solicitationController";
import { useSubmitFacilitatorApplication } from "@/features/contracts-grants/controllers/publicApplicationController";
import BackNavigation from "@/components/atoms/BackNavigation";
import DescriptionCard from "@/components/DescriptionCard";
import FilePreview from "@/components/FilePreview";
import Card from "@/components/Card";
import { LoadingSpinner } from "@/components/Loading";
import { format, isValid } from "date-fns";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Building2,
  Briefcase,
  Mail,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/atoms/FormInput";
import FormTextArea from "@/components/atoms/FormTextArea";
import FormButton from "@/components/FormButton";
import { toast } from "sonner";

// Simplified application form schema matching admin form
const ApplicationFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  qualifications: z.string().min(1, "Qualifications are required"),
  experience: z.string().min(1, "Experience is required"),
});

type ApplicationFormData = z.infer<typeof ApplicationFormSchema>;

// DetailsTag component
const DetailsTag = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string | number;
}) => {
  return (
    <div className='flex items-center border border-[#C7CBD5] text-sm p-1 px-[.625rem] gap-x-[.25rem] rounded-full'>
      {icon}
      <p>{label}</p>
    </div>
  );
};

export default function FacilitatorJobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const { data, isLoading, error } = useGetPublicOpportunity(id as string);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <div className="p-8 text-center">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Facilitator Position Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The facilitator position you're looking for could not be found or may have expired.
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

  // Format dates
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return isValid(date) ? format(date, "MMM dd, yyyy") : "Invalid date";
  };

  // Extract location info
  const getLocationDisplay = () => {
    if (opportunity.locations && Array.isArray(opportunity.locations) && opportunity.locations.length > 0) {
      return opportunity.locations.map((loc: any) => loc.name || loc.city || "Unknown").join(", ");
    }
    if (opportunity.location) {
      return opportunity.location;
    }
    return "Remote/Flexible";
  };

  // Get duration display
  const getDurationDisplay = () => {
    if (opportunity.duration) {
      return `${opportunity.duration} months with possibility of extension`;
    }
    if (opportunity.start_date && opportunity.end_date) {
      const start = new Date(opportunity.start_date);
      const end = new Date(opportunity.end_date);
      const months = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
      return `${months} months`;
    }
    return "Duration to be discussed";
  };

  // Initialize API submission hook
  const submitApplication = useSubmitFacilitatorApplication(id as string);

  // Simplified Application Form Component matching admin form
  const ApplicationForm = () => {
    const form = useForm<ApplicationFormData>({
      resolver: zodResolver(ApplicationFormSchema),
      defaultValues: {
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        qualifications: "",
        experience: "",
      },
    });

    const onSubmit = async (data: ApplicationFormData) => {
      try {
        // Transform to match backend API expectations
        const applicationData = {
          name: `${data.last_name}, ${data.first_name}`,
          email: data.email,
          phone_number: data.phone_number,
          type: "FACILITATOR" as const,
          contractor_name: `${data.first_name} ${data.last_name}`,
          // Store qualifications and experience in appropriate fields
          education: [{
            degree: "See qualifications",
            institution: data.qualifications,
            year: new Date().getFullYear().toString(),
          }],
          employment_history: [{
            company: "See experience details",
            position: data.experience,
            start_date: new Date().toISOString().split('T')[0],
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
          <h2 className="text-2xl font-bold">Apply for Facilitator Position</h2>
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
                <FormInput label="First Name" name="first_name" required />
                <FormInput label="Last Name" name="last_name" required />
                <FormInput label="Email Address" name="email" type="email" required />
                <FormInput label="Phone Number" name="phone_number" type="tel" required />
              </div>
            </section>

            {/* Professional Information */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold">Professional Information</h3>
              <FormTextArea
                label="Qualifications"
                name="qualifications"
                required
                placeholder="List your educational qualifications, certifications, and relevant training"
                rows={4}
              />
              <FormTextArea
                label="Experience"
                name="experience"
                required
                placeholder="Describe your relevant work experience and achievements"
                rows={4}
              />
            </section>

            {/* Position Info Display */}
            <section className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-gray-700">Applying For:</h4>
              <p className="text-gray-900 font-medium">{opportunity.title || "Facilitator Position"}</p>
              {opportunity.reference_number && (
                <p className="text-sm text-gray-600">
                  Reference: {opportunity.reference_number}
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

  // Job Details Content Component
  const JobDetailsContent = () => {
    return (
      <div className='space-y-5 p-6'>
        {/* Job Title */}
        <h1 className='font-bold text-lg'>{opportunity.title || "Facilitator Position"}</h1>

        {/* Details Tags */}
        <div className='flex flex-wrap items-center justify-start gap-x-[.625rem] gap-y-[1rem] w-full'>
          <DetailsTag
            icon={<Users className="h-4 w-4" />}
            label={`${opportunity.consultants_number || opportunity.number_of_positions || 1} position${(opportunity.consultants_number || opportunity.number_of_positions || 1) > 1 ? 's' : ''}`}
          />
          <DetailsTag
            icon={<Clock className="h-4 w-4" />}
            label={getDurationDisplay()}
          />
          <DetailsTag
            icon={<Calendar className="h-4 w-4" />}
            label={formatDate(opportunity.end_date || opportunity.commencement_date || opportunity.closing_date)}
          />
          <DetailsTag
            icon={<MapPin className="h-4 w-4" />}
            label={getLocationDisplay()}
          />
          <DetailsTag
            icon={<Briefcase className="h-4 w-4" />}
            label='Facilitator'
          />
          <DetailsTag
            icon={<Building2 className="h-4 w-4" />}
            label={opportunity.department || 'Contracts & Grants'}
          />
        </div>

        {/* Background/Description */}
        <DescriptionCard
          label='Background & Job Description'
          description={
            opportunity.background ||
            opportunity.description ||
            opportunity.job_description ||
            opportunity.scope_of_work?.background ||
            "Background information will be provided during the application process."
          }
        />

        {/* Qualifications */}
        {(opportunity.qualifications_required || opportunity.requirements) && (
          <DescriptionCard
            label='Qualifications Required'
            description={opportunity.qualifications_required || opportunity.requirements}
          />
        )}

        {/* Key Responsibilities */}
        {opportunity.key_responsibilities && (
          <DescriptionCard
            label='Key Responsibilities'
            description={opportunity.key_responsibilities}
          />
        )}

        {/* Document Preview */}
        <div className='w-full'>
          {opportunity.advertisement_document && (
            <FilePreview
              file={opportunity.advertisement_document}
              name='Job Advertisement Document'
              timestamp={opportunity.created_datetime || opportunity.publication_date}
            />
          )}
        </div>

        {/* Application Section */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Mail className="h-5 w-5" />
            How to Apply
          </h3>
          <div className="text-blue-800">
            <p className="mb-2">
              To apply for this facilitator position, please fill out the application form below:
            </p>
            <div className="text-sm space-y-1">
              <p>• Complete all required sections</p>
              <p>• Upload your resume and cover letter</p>
              <p>• Only shortlisted candidates will be contacted</p>
              <p>• Application deadline: {formatDate(opportunity.closing_date || opportunity.end_date)}</p>
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
    );
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6">
        {/* Header with Back Navigation */}
        <section className='mb-6'>
          <BackNavigation />
        </section>

        {/* Main Content */}
        <section>
          <Card>
            {showApplicationForm ? (
              <ApplicationForm />
            ) : (
              <JobDetailsContent />
            )}
          </Card>
        </section>
      </div>
    </div>
  );
}