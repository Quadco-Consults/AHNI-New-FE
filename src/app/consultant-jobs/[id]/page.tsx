"use client";

import { useParams, useRouter } from "next/navigation";
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
              onClick={() => window.open('mailto:consultants@ahnigeria.org?subject=Application for Consultant Position', '_blank')}
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
      </Card>
    </div>
  );
}