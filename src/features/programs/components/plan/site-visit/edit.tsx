"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useGetSingleSiteVisit } from "../../../controllers/siteVisitController";
import { LoadingSpinner } from "@/components/Loading";

interface SiteVisitEditProps {
  siteVisitId: string;
}

export default function SiteVisitEdit({ siteVisitId }: SiteVisitEditProps) {
  const router = useRouter();
  const { data: siteVisit, isLoading, error } = useGetSingleSiteVisit(siteVisitId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>Error loading site visit</p>
        <p className="text-sm mt-1">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Site Visit</h1>
          <p className="text-gray-600">
            {siteVisit?.data?.title || "Site Visit"}
          </p>
        </div>
      </div>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Form</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              Edit functionality is being implemented. For now, you can view the details and go back.
            </p>

            {siteVisit?.data && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Current Details:</h3>
                <ul className="space-y-1 text-sm">
                  <li><strong>Title:</strong> {siteVisit.data.title}</li>
                  <li><strong>Status:</strong> {siteVisit.data.status}</li>
                  <li><strong>Type:</strong> {siteVisit.data.visit_type}</li>
                  <li><strong>Start Date:</strong> {new Date(siteVisit.data.start_date).toLocaleDateString()}</li>
                  <li><strong>End Date:</strong> {new Date(siteVisit.data.end_date).toLocaleDateString()}</li>
                </ul>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button disabled>
                Save Changes (Coming Soon)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}