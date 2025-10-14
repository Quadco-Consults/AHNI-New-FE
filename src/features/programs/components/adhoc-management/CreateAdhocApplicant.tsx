"use client";

import BackNavigation from "components/atoms/BackNavigation";
import Card from "components/Card";
import { useParams } from "next/navigation";
import { useGetSingleAdhocAdvertisement } from "@/features/programs/controllers/adhocAdvertisementController";
import { LoadingSpinner } from "components/Loading";
import CreateAdhocApplicantForm from "./CreateAdhocApplicantForm";

export default function CreateAdhocApplicant() {
  const params = useParams();
  const advertisementId = params?.id as string;

  // Fetch the advertisement to get details and auto-populate form
  const { data: advertisementData, isLoading } = useGetSingleAdhocAdvertisement(
    advertisementId || "",
    !!advertisementId
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="space-y-5">
      <BackNavigation extraText="Create New Applicant" />

      <Card>
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">New Applicant</h2>
            <p className="text-gray-600 mt-1">
              Fill in the applicant details below to add them to this adhoc position
            </p>
          </div>

          <CreateAdhocApplicantForm advertisementData={advertisementData?.data} />
        </div>
      </Card>
    </section>
  );
}
