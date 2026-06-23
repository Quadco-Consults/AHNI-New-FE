"use client";

import BackNavigation from "@/components/BackNavigation";
import Card from "@/components/Card";
import { useParams } from "next/navigation";
import { useGetSingleAdhocAdvertisement } from "@/features/programs/controllers/adhocAdvertisementController";
import { LoadingSpinner } from "@/components/Loading";
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

  const advertisement = advertisementData?.data;
  const isAcceptingApplications = advertisement?.status === "PUBLISHED";
  const isPastDeadline = advertisement?.closing_date
    ? new Date(advertisement.closing_date) < new Date()
    : false;

  return (
    <section className="space-y-5">
      <BackNavigation extraText="Create New Applicant" />

      {!isAcceptingApplications || isPastDeadline ? (
        <Card>
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-900 mb-2">
                    This Advertisement is Not Accepting Applications
                  </h3>
                  <p className="text-red-700 mb-4">
                    {!isAcceptingApplications && `Status: ${advertisement?.status || 'Unknown'}`}
                    {isPastDeadline && ' - Application deadline has passed'}
                  </p>
                  <div className="bg-white p-4 rounded border border-red-100">
                    <h4 className="font-semibold text-gray-900 mb-2">Advertisement Details:</h4>
                    <p className="text-gray-700"><strong>Position:</strong> {advertisement?.position_title}</p>
                    <p className="text-gray-700"><strong>Advertisement #:</strong> {advertisement?.advertisement_number}</p>
                    {advertisement?.closing_date && (
                      <p className="text-gray-700"><strong>Closing Date:</strong> {new Date(advertisement.closing_date).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">New Applicant</h2>
              <p className="text-gray-600 mt-1">
                Fill in the applicant details below to add them to this adhoc position
              </p>
            </div>

            <CreateAdhocApplicantForm advertisementData={advertisement} />
          </div>
        </Card>
      )}
    </section>
  );
}
