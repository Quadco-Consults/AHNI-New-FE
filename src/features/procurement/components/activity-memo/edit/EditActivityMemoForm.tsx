"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetActivityMemo, useUpdateActivityMemo } from "@/features/procurement/controllers/activityMemoController";
import { toast } from "sonner";
import Card from "@/components/Card";
import { AlertCircle, Loader2 } from 'lucide-react';
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import CreateActivityMemoForm from "../create/CreateActivityMemoForm";

const EditActivityMemoForm = () => {
  const params = useParams();
  const router = useRouter();
  const memoId = params?.id as string;

  const { data: memoData, isLoading, error } = useGetActivityMemo(memoId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 size={16} />
          <p className="text-gray-600">Loading activity memo...</p>
        </div>
      </div>
    );
  }

  if (error || !memoData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <div className="p-6 text-center">
            <AlertCircle size={16} />
            <h3 className="text-lg font-semibold mb-2">Error Loading Activity Memo</h3>
            <p className="text-gray-600 mb-4">{error?.message || "Activity memo not found"}</p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </Card>
      </div>
    );
  }

  // Check if editing is allowed
  const status = memoData.status || 'DRAFT';
  const canEdit = status === 'DRAFT' || status === 'SUBMITTED';

  if (!canEdit) {
    return (
      <div className="p-6">
        <Card>
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle size={16} />
                <div>
                  <h4 className="font-semibold text-red-800 mb-1">Cannot Edit Activity Memo</h4>
                  <p className="text-sm text-red-700">
                    This activity memo has status <strong>{status}</strong> and cannot be edited.
                  </p>
                  <p className="text-sm text-red-700 mt-2">
                    Only memos with <strong>DRAFT</strong> or <strong>SUBMITTED</strong> status can be edited.
                  </p>
                  <p className="text-sm text-red-700 mt-2">
                    <strong>Current Data:</strong>
                  </p>
                  <ul className="text-sm text-red-700 mt-1 space-y-1">
                    <li>• Subject: {memoData.subject}</li>
                    <li>• Status: {status}</li>
                    <li>• Ref Number: {memoData.ref_number || 'N/A'}</li>
                    <li>• Requested Date: {memoData.requested_date}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => router.push(`/dashboard/procurement/activity-memo/${memoId}`)}
                variant="outline"
              >
                <Eye size={16} />
                View Details
              </Button>
              <Button
                onClick={() => router.back()}
                variant="outline"
              >
                Go Back
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // If editable, render the form with existing data
  return <CreateActivityMemoForm editMode={true} existingData={memoData} memoId={memoId} />;
};

export default EditActivityMemoForm;
