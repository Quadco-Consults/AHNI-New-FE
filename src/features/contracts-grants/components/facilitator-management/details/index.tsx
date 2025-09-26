"use client";

import { useParams, useRouter } from "next/navigation";
import Card from "components/Card";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { useGetSingleFacilitator } from "@/features/contracts-grants/controllers/facilitatorManagementController";
import FacilitatorApplicants from "../applicants/FacilitatorApplicants";

export default function FacilitatorDetails() {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading } = useGetSingleFacilitator(id as string);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const facilitator = data?.data;


  try {
    return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{facilitator?.title}</h1>
          <p className="text-gray-600">Facilitator Management Details</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/c-and-g/facilitator-management/${id}/applicant/create`}>
            <Button size="lg">
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Facilitator
            </Button>
          </Link>
        </div>
      </div>

      {/* Details Card */}
      <Card>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">Title</label>
              <p className="text-lg font-semibold">{facilitator?.title || 'N/A'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Grade Level</label>
              <p className="text-lg">
                {typeof facilitator?.grade_level === 'object' && facilitator?.grade_level?.name
                  ? facilitator.grade_level.name
                  : facilitator?.grade_level || 'N/A'
                }
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Duration</label>
              <p className="text-lg">{facilitator?.duration || 'N/A'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Number of Facilitators</label>
              <p className="text-lg">{facilitator?.facilitaor_number || 'N/A'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <Badge
                variant="default"
                className={cn(
                  "p-1 rounded-lg",
                  facilitator?.status === "ACTIVE" && "bg-green-200 text-green-500",
                  facilitator?.status === "INACTIVE" && "bg-red-200 text-red-500",
                  facilitator?.status === "PENDING" && "bg-yellow-200 text-yellow-500",
                  facilitator?.status === "DRAFT" && "bg-gray-200 text-gray-500"
                )}
              >
                {facilitator?.status || 'N/A'}
              </Badge>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Commencement Date</label>
              <p className="text-lg">{facilitator?.commencement_date || 'N/A'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">End Date</label>
              <p className="text-lg">{facilitator?.end_date || 'N/A'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Supervisor</label>
              <p className="text-lg">
                {typeof facilitator?.supervisor === 'object'
                  ? `${facilitator?.supervisor?.first_name || ''} ${facilitator?.supervisor?.last_name || ''}`.trim() || 'N/A'
                  : facilitator?.supervisor || 'N/A'
                }
              </p>
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="text-sm font-medium text-gray-500">Locations</label>
              <p className="text-lg">
                {(() => {
                  try {
                    if (Array.isArray(facilitator?.locations) && facilitator.locations.length > 0) {
                      return facilitator.locations
                        .map(loc => {
                          if (typeof loc === 'object' && loc?.name) {
                            return String(loc.name);
                          }
                          return typeof loc === 'string' ? loc : String(loc || '');
                        })
                        .filter(Boolean)
                        .join(', ') || 'N/A';
                    }

                    if (typeof facilitator?.locations === 'object' && facilitator?.locations?.name) {
                      return String(facilitator.locations.name);
                    }

                    if (facilitator?.locations) {
                      return String(facilitator.locations);
                    }

                    return 'N/A';
                  } catch (error) {
                    console.error('Location rendering error:', error);
                    return 'Error loading locations';
                  }
                })()}
              </p>
            </div>
          </div>

          {facilitator?.description && (
            <div className="mt-6">
              <label className="text-sm font-medium text-gray-500">Description</label>
              <p className="text-base mt-2">{facilitator.description}</p>
            </div>
          )}

          {facilitator?.background && (
            <div className="mt-6">
              <label className="text-sm font-medium text-gray-500">Background</label>
              <p className="text-base mt-2">{facilitator.background}</p>
            </div>
          )}

          {facilitator?.extra_info && (
            <div className="mt-6">
              <label className="text-sm font-medium text-gray-500">Extra Information</label>
              <p className="text-base mt-2">{facilitator.extra_info}</p>
            </div>
          )}

          {facilitator?.evaluation_comments && (
            <div className="mt-6">
              <label className="text-sm font-medium text-gray-500">Evaluation Comments</label>
              <p className="text-base mt-2">{facilitator.evaluation_comments}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Scope of Work Card */}
      {facilitator?.scope_of_work && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Scope of Work</h3>

            {facilitator.scope_of_work.description && (
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-base mt-2">{facilitator.scope_of_work.description}</p>
              </div>
            )}

            {facilitator.scope_of_work.background && (
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-500">Background</label>
                <p className="text-base mt-2">{facilitator.scope_of_work.background}</p>
              </div>
            )}

            {facilitator.scope_of_work.objectives && (
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-500">Objectives</label>
                <p className="text-base mt-2">{facilitator.scope_of_work.objectives}</p>
              </div>
            )}

            {facilitator.scope_of_work.location && (
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-500">Work Location</label>
                <p className="text-base mt-2">{facilitator.scope_of_work.location}</p>
              </div>
            )}

            {facilitator.scope_of_work.deliverables && facilitator.scope_of_work.deliverables.length > 0 && (
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-500">Deliverables</label>
                <div className="mt-2 space-y-2">
                  {facilitator.scope_of_work.deliverables.map((deliverable, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                      <span>{deliverable.deliverable}</span>
                      <span className="text-sm text-gray-600">{deliverable.number_of_days} days</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Facilitator Applicants */}
      <FacilitatorApplicants facilitatorId={id as string} />
    </section>
    );
  } catch (error) {
    console.error("Facilitator Details render error:", error);
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold text-red-600">Error loading facilitator details</h1>
        <p className="text-gray-600">Please check the console for more information.</p>
        <pre className="mt-4 p-4 bg-gray-100 rounded text-sm">
          {String(error)}
        </pre>
      </div>
    );
  }
}