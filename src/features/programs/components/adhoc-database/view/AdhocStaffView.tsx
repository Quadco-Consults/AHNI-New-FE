"use client";

import { useParams, useRouter } from "next/navigation";
import Card from "components/Card";
import BackNavigation from "components/BackNavigation";
import { LoadingSpinner } from "components/Loading";
import { Button } from "components/ui/button";
import PencilIcon from "components/icons/PencilIcon";
import DescriptionCard from "components/DescriptionCard";

// Mock hook for now - replace with actual API call
const useGetSingleAdhocStaff = (id: string) => {
  // This would be replaced with actual API call
  return {
    data: null,
    isLoading: false,
    error: null
  };
};

export default function AdhocStaffView() {
  const params = useParams();
  const router = useRouter();
  const staffId = params?.id as string;

  const { data: staffData, isLoading, error } = useGetSingleAdhocStaff(staffId);

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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <BackNavigation />
        <Button
          onClick={() => router.push(`/dashboard/programs/adhoc-database/${staffId}/edit`)}
          className="flex items-center gap-2"
        >
          <PencilIcon />
          Edit Details
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Personal Information */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <DescriptionCard
                label="Surname"
                description={staffData?.sur_name || "Not provided"}
              />
              <DescriptionCard
                label="Other Names"
                description={staffData?.other_names || "Not provided"}
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
                label="Phone Number"
                description={staffData?.phone_number || "Not provided"}
              />
              <DescriptionCard
                label="Email Address"
                description={staffData?.email_address || "Not provided"}
              />
            </div>
          </div>
        </Card>

        {/* Professional Information */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Professional Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <DescriptionCard
                label="Designation"
                description={staffData?.designation || "Not provided"}
              />
              <DescriptionCard
                label="Qualifications"
                description={staffData?.qualifications || "Not provided"}
              />
              <DescriptionCard
                label="Health Facility/Assignment Location"
                description={staffData?.health_facility || "Not provided"}
              />
              <DescriptionCard
                label="Spoke Site Name"
                description={staffData?.spoke_site_name || "Not provided"}
              />
              <DescriptionCard
                label="LGA"
                description={staffData?.lga || "Not provided"}
              />
              <DescriptionCard
                label="Status of Adhoc staff"
                description={staffData?.status_of_adhoc_staff || "Not provided"}
              />
            </div>
          </div>
        </Card>

        {/* Team & Assignment Details */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Team & Assignment Details</h2>
            <div className="grid grid-cols-2 gap-6">
              <DescriptionCard
                label="QMAP BACKSTOP"
                description={staffData?.qmap_backstop || "Not assigned"}
              />
              <DescriptionCard
                label="Programs Officer"
                description={staffData?.programs_officer || "Not assigned"}
              />
              <DescriptionCard
                label="STL"
                description={staffData?.stl || "Not assigned"}
              />
              <DescriptionCard
                label="SEO"
                description={staffData?.seo || "Not assigned"}
              />
              <DescriptionCard
                label="LGA2"
                description={staffData?.lga2 || "Not provided"}
              />
              <DescriptionCard
                label="Cluster"
                description={staffData?.cluster || "Not assigned"}
              />
            </div>
          </div>
        </Card>

        {/* Financial Information */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Financial Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <DescriptionCard
                label="Account Name"
                description={staffData?.account_name || "Not provided"}
              />
              <DescriptionCard
                label="Bank Name"
                description={staffData?.bank_name || "Not provided"}
              />
              <DescriptionCard
                label="Account Number"
                description={staffData?.account_number || "Not provided"}
              />
              <DescriptionCard
                label="Sort Code"
                description={staffData?.sort_code || "Not provided"}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}