"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetPublicOpportunity } from "@/features/procurement/controllers/solicitationController";
import BackNavigation from "components/atoms/BackNavigation";
import DescriptionCard from "components/DescriptionCard";
import FilePreview from "components/FilePreview";
import Card from "components/Card";
import { LoadingSpinner } from "components/Loading";
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
import FormInput from "components/atoms/FormInput";
import FormTextArea from "components/atoms/FormTextArea";
import FormSelect from "components/atoms/FormSelect";
import FormButton from "@/components/FormButton";
import { Label } from "components/ui/label";
import { countries } from "constants/countries";
import { toast } from "sonner";
import { PlusCircle, Upload } from "lucide-react";

// Application form schema
const ApplicationFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  position_under_contract: z.string().min(1, "Position is required"),
  place_of_birth: z.string().min(1, "Place of birth is required"),
  citizenship: z.string().min(1, "Citizenship is required"),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  start_duration_date: z.string().min(1, "Start date is required"),
  end_duration_date: z.string().min(1, "End date is required"),
  education: z.array(z.object({
    name: z.string().min(1, "Institution name is required"),
    location: z.string().min(1, "Location is required"),
    major: z.string().min(1, "Major is required"),
    degree: z.string().min(1, "Degree is required"),
    date: z.string().min(1, "Date is required"),
  })).min(1, "At least one education entry is required"),
  language_proficiency: z.array(z.object({
    language: z.string().min(1, "Language is required"),
    proficiency_speaking: z.string().min(1, "Speaking proficiency is required"),
    proficiency_reading: z.string().min(1, "Reading proficiency is required"),
  })).min(1, "At least one language entry is required"),
  employment_history: z.array(z.object({
    position_title: z.string().min(1, "Position title is required"),
    employer_name: z.string().min(1, "Employer name is required"),
    employer_telephone: z.string().min(1, "Employer telephone is required"),
    from: z.string().min(1, "Start date is required"),
    to: z.string().min(1, "End date is required"),
  })).min(1, "At least one employment entry is required"),
  special_consultant_services: z.array(z.object({
    services_performed: z.string().min(1, "Services performed is required"),
    employer_name: z.string().min(1, "Employer name is required"),
    employer_telephone: z.string().min(1, "Employer telephone is required"),
    from: z.string().min(1, "Start date is required"),
    to: z.string().min(1, "End date is required"),
  })),
  referees: z.array(z.object({
    name: z.string().min(1, "Referee name is required"),
    email: z.string().email("Valid email is required"),
    phone_number: z.string().min(1, "Phone number is required"),
  })).min(1, "At least one referee is required"),
});

type ApplicationFormData = z.infer<typeof ApplicationFormSchema>;

// DetailsTag component matching staff portal design
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

export default function ConsultantJobDetailsPage() {
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
            <h2 className="text-xl font-semibold text-foreground mb-2">Consultant Job Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The consultant position you're looking for could not be found or may have expired.
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

  // Application Form Component
  const ApplicationForm = () => {
    const form = useForm<ApplicationFormData>({
      resolver: zodResolver(ApplicationFormSchema),
      defaultValues: {
        name: "",
        email: "",
        phone_number: "",
        position_under_contract: opportunity.title || "",
        place_of_birth: "",
        citizenship: "",
        date_of_birth: "",
        start_duration_date: opportunity.start_date || opportunity.commencement_date || "",
        end_duration_date: opportunity.end_date || "",
        education: [{ name: "", location: "", major: "", degree: "", date: "" }],
        language_proficiency: [{ language: "", proficiency_speaking: "", proficiency_reading: "" }],
        employment_history: [{ position_title: "", employer_name: "", employer_telephone: "", from: "", to: "" }],
        special_consultant_services: [{ services_performed: "", employer_name: "", employer_telephone: "", from: "", to: "" }],
        referees: [{ name: "", email: "", phone_number: "" }],
      },
    });

    const {
      fields: educationFields,
      append: appendEducation,
      remove: removeEducation,
    } = useFieldArray({
      name: "education",
      control: form.control,
    });

    const {
      fields: languageFields,
      append: appendLanguage,
      remove: removeLanguage,
    } = useFieldArray({
      name: "language_proficiency",
      control: form.control,
    });

    const {
      fields: employmentFields,
      append: appendEmployment,
      remove: removeEmployment,
    } = useFieldArray({
      name: "employment_history",
      control: form.control,
    });

    const {
      fields: serviceFields,
      append: appendService,
      remove: removeService,
    } = useFieldArray({
      name: "special_consultant_services",
      control: form.control,
    });

    const {
      fields: refereeFields,
      append: appendReferee,
      remove: removeReferee,
    } = useFieldArray({
      name: "referees",
      control: form.control,
    });

    const [files, setFiles] = useState<{ resume: File | null; coverLetter: File | null }>({
      resume: null,
      coverLetter: null,
    });

    const countryOptions = countries.map(({ name }) => ({
      label: name,
      value: name,
    }));

    const onSubmit = async (data: ApplicationFormData) => {
      try {
        // Here you would integrate with the API to submit the application
        console.log("Application Data:", data);
        console.log("Files:", files);

        // For now, just show success message
        toast.success("Application submitted successfully! We will review your application and contact you soon.");
        setShowApplicationForm(false);
      } catch (error) {
        toast.error("Failed to submit application. Please try again.");
      }
    };

    const handleFileChange = (type: 'resume' | 'coverLetter') => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setFiles(prev => ({
          ...prev,
          [type]: e.target.files![0]
        }));
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Full Name (Last, First, Middle)" name="name" required />
                <FormInput label="Email Address" name="email" type="email" required />
                <FormInput label="Phone Number" name="phone_number" type="tel" required />
                <FormInput label="Position Under Contract" name="position_under_contract" required />
                <FormInput label="Date of Birth" name="date_of_birth" type="date" required />
                <FormInput label="Place of Birth" name="place_of_birth" required />
                <FormSelect label="Citizenship" name="citizenship" options={countryOptions} required />
              </div>
            </section>

            {/* Duration of Assignment */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold">Duration of Assignment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Start Date" name="start_duration_date" type="date" required />
                <FormInput label="End Date" name="end_duration_date" type="date" required />
              </div>
            </section>

            {/* Education */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold">Education</h3>
              {educationFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded">
                  <FormInput label="Institution Name" name={`education.${index}.name`} required />
                  <FormInput label="Location" name={`education.${index}.location`} required />
                  <FormInput label="Major" name={`education.${index}.major`} required />
                  <FormInput label="Degree" name={`education.${index}.degree`} required />
                  <FormInput label="Date" name={`education.${index}.date`} type="date" required />
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeEducation(index)}
                      disabled={educationFields.length === 1}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => appendEducation({ name: "", location: "", major: "", degree: "", date: "" })}
                className="flex items-center gap-2"
              >
                <PlusCircle size={16} />
                Add Education
              </Button>
            </section>

            {/* Language Proficiency */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold">Language Proficiency</h3>
              {languageFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded">
                  <FormInput label="Language" name={`language_proficiency.${index}.language`} required />
                  <FormInput label="Speaking Proficiency" name={`language_proficiency.${index}.proficiency_speaking`} required />
                  <FormInput label="Reading Proficiency" name={`language_proficiency.${index}.proficiency_reading`} required />
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeLanguage(index)}
                      disabled={languageFields.length === 1}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => appendLanguage({ language: "", proficiency_speaking: "", proficiency_reading: "" })}
                className="flex items-center gap-2"
              >
                <PlusCircle size={16} />
                Add Language
              </Button>
            </section>

            {/* Employment History */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold">Employment History</h3>
              {employmentFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded">
                  <FormInput label="Position Title" name={`employment_history.${index}.position_title`} required />
                  <FormInput label="Employer Name" name={`employment_history.${index}.employer_name`} required />
                  <FormInput label="Employer Telephone" name={`employment_history.${index}.employer_telephone`} required />
                  <FormInput label="From" name={`employment_history.${index}.from`} type="date" required />
                  <FormInput label="To" name={`employment_history.${index}.to`} type="date" required />
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeEmployment(index)}
                      disabled={employmentFields.length === 1}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => appendEmployment({ position_title: "", employer_name: "", employer_telephone: "", from: "", to: "" })}
                className="flex items-center gap-2"
              >
                <PlusCircle size={16} />
                Add Employment
              </Button>
            </section>

            {/* Consultant Services */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold">Specific Consultant Services</h3>
              {serviceFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded">
                  <FormInput label="Services Performed" name={`special_consultant_services.${index}.services_performed`} required />
                  <FormInput label="Employer Name" name={`special_consultant_services.${index}.employer_name`} required />
                  <FormInput label="Employer Telephone" name={`special_consultant_services.${index}.employer_telephone`} required />
                  <FormInput label="From" name={`special_consultant_services.${index}.from`} type="date" required />
                  <FormInput label="To" name={`special_consultant_services.${index}.to`} type="date" required />
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeService(index)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => appendService({ services_performed: "", employer_name: "", employer_telephone: "", from: "", to: "" })}
                className="flex items-center gap-2"
              >
                <PlusCircle size={16} />
                Add Consultant Service
              </Button>
            </section>

            {/* Referees */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold">Referees</h3>
              {refereeFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded">
                  <FormInput label="Name" name={`referees.${index}.name`} required />
                  <FormInput label="Email" name={`referees.${index}.email`} type="email" required />
                  <FormInput label="Phone Number" name={`referees.${index}.phone_number`} type="tel" required />
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeReferee(index)}
                      disabled={refereeFields.length === 1}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => appendReferee({ name: "", email: "", phone_number: "" })}
                className="flex items-center gap-2"
              >
                <PlusCircle size={16} />
                Add Referee
              </Button>
            </section>

            {/* File Uploads */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold">Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-medium">Upload Resume *</Label>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer border border-gray-300 rounded px-4 py-2 hover:bg-gray-50">
                      <Upload size={16} className="inline mr-2" />
                      Choose File
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange('resume')}
                      />
                    </label>
                    <span className="text-sm text-gray-600">
                      {files.resume ? files.resume.name : "No file chosen"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">Upload Cover Letter *</Label>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer border border-gray-300 rounded px-4 py-2 hover:bg-gray-50">
                      <Upload size={16} className="inline mr-2" />
                      Choose File
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange('coverLetter')}
                      />
                    </label>
                    <span className="text-sm text-gray-600">
                      {files.coverLetter ? files.coverLetter.name : "No file chosen"}
                    </span>
                  </div>
                </div>
              </div>
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
              <FormButton size="lg">
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
        <h1 className='font-bold text-lg'>{opportunity.title || "Consultant Position"}</h1>

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
            label='Consultant'
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

        {/* Additional Requirements */}
        {opportunity.additional_requirements && (
          <DescriptionCard
            label='Additional Requirements'
            description={opportunity.additional_requirements}
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
              To apply for this consultant position, please send your CV and cover letter to:
            </p>
            <div className="flex items-center gap-2 font-medium mb-3">
              <Mail className="h-4 w-4" />
              consultants@ahnigeria.org
            </div>
            <div className="text-sm space-y-1">
              <p>• Submit documents as a single MS Word file</p>
              <p>• Include position title in subject line</p>
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