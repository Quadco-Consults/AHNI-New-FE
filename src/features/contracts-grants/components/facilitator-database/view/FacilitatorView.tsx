"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "components/ui/button";
import Card from "components/Card";
import { LoadingSpinner } from "components/Loading";
import { useGetSingleFacilitatorApplicant } from "@/features/contracts-grants/controllers/facilitatorApplicantsController";
import Link from "next/link";

export default function FacilitatorView() {
  const params = useParams();
  const router = useRouter();
  const facilitatorId = params?.id as string;

  const { data, isLoading } = useGetSingleFacilitatorApplicant(facilitatorId);
  const facilitator = data?.data;

  console.log('🔍 Facilitator View Debug:', {
    facilitatorId,
    data,
    facilitator
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!facilitator) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <div className="p-6 text-center">
            <p className="text-gray-600">Facilitator not found</p>
            <Button onClick={() => router.back()} className="mt-4">
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const displayName = facilitator.name ||
    `${facilitator.first_name || ''} ${facilitator.last_name || ''}`.trim() ||
    'N/A';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
          >
            ← Go Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Facilitator Details</h1>
            <p className="text-gray-600">View facilitator information</p>
          </div>
        </div>
        <Link href={`/dashboard/c-and-g/facilitator-database/${facilitatorId}/edit`}>
          <Button>Edit Facilitator</Button>
        </Link>
      </div>

      {/* Personal Information */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">Full Name</label>
              <p className="text-base font-medium mt-1">{displayName}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Email Address</label>
              <p className="text-base font-medium mt-1">{facilitator.email || 'N/A'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Phone Number</label>
              <p className="text-base font-medium mt-1">{facilitator.phone_number || 'N/A'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <p className="mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {facilitator.status || 'APPROVED'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Professional Information */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">Professional Information</h2>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-500">Qualifications</label>
              <p className="text-base mt-1 whitespace-pre-wrap">
                {facilitator.qualifications || 'N/A'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Experience</label>
              <p className="text-base mt-1 whitespace-pre-wrap">
                {facilitator.experience || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Facilitator Information */}
      {facilitator.facilitator_id && (
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Facilitator Assignment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Facilitator ID</label>
                <p className="text-base font-medium mt-1">{facilitator.facilitator_id}</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Timestamps */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">Record Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">Created At</label>
              <p className="text-base mt-1">
                {facilitator.created_at
                  ? new Date(facilitator.created_at).toLocaleString()
                  : 'N/A'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Last Updated</label>
              <p className="text-base mt-1">
                {facilitator.updated_at
                  ? new Date(facilitator.updated_at).toLocaleString()
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
