"use client";

import { useParams } from "next/navigation";
import EOIVendorSubmission from "@/features/procurement/components/vendor-management/eoi/EOIVendorSubmission";
import EoiAPI from "@/features/procurement/controllers/eoiController";
import { LoadingSpinner } from "components/Loading";
import Card from "components/Card";

export default function PublicEOIPage() {
  const { id } = useParams();
  const { data, isLoading, error } = EoiAPI.useGetEoi(id as string);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">EOI Not Found</h2>
          <p className="text-gray-600">The Expression of Interest you're looking for could not be found or may have expired.</p>
        </Card>
      </div>
    );
  }

  const eoiData = data.data;

  // Check if EOI is still open for submissions
  const isOpen = eoiData.status === "OPEN" && new Date(eoiData.closing_date) > new Date();

  if (!isOpen) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">EOI Closed</h2>
          <p className="text-gray-600">This Expression of Interest is no longer accepting submissions.</p>
          {eoiData.closing_date && (
            <p className="text-sm text-gray-500 mt-2">
              Closed on: {new Date(eoiData.closing_date).toLocaleDateString("en-US")}
            </p>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Expression of Interest</h1>
          <p className="text-gray-600">Submit your response to this EOI opportunity</p>
        </div>
        
        <EOIVendorSubmission eoiData={eoiData} />
      </div>
    </div>
  );
}