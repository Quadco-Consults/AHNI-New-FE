"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { useGetCompensationById, useDeleteCompensation } from "@/features/hr/controllers/compensationController";
import { Loading } from "@/components/Loading";
import ConfirmationDialog from "components/ConfirmationDialog";
import { toast } from "sonner";
import EditCompensationModal from "./components/EditCompensationModal";

const CompensationDetails: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: compensationData, isLoading, refetch } = useGetCompensationById(id);
  const { deleteCompensation, isLoading: isDeleting } = useDeleteCompensation(id);

  const handleDelete = async () => {
    try {
      await deleteCompensation();
      toast.success("Compensation deleted successfully");
      router.push("/dashboard/hr/employee-benefit/compensation");
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Failed to delete compensation");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  const compensation = compensationData?.data;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="hover:bg-gray-100"
          >
            <Icon icon="ph:arrow-left" fontSize={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Compensation Details</h1>
            <p className="text-sm text-gray-500">
              View compensation type information
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Icon icon="ph:pencil-duotone" fontSize={18} />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <Icon icon="ant-design:delete-twotone" fontSize={18} />
            Delete
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{compensation?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-medium">{compensation?.type || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Amount or Percentage</p>
              <p className="font-medium">
                {compensation?.percentage
                  ? `${compensation.percentage}%`
                  : compensation?.amount || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Period</p>
              <p className="font-medium">{compensation?.period || "N/A"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Pay Group Information */}
        <Card>
          <CardHeader>
            <CardTitle>Pay Group Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Position</p>
              <p className="font-medium">
                {compensation?.pay_group?.position?.name || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Grade</p>
              <p className="font-medium">
                {compensation?.pay_group?.grade?.name || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Level</p>
              <p className="font-medium">
                {compensation?.pay_group?.level?.name || "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Information */}
      {(compensation?.created_at || compensation?.updated_at) && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {compensation?.created_at && (
              <div>
                <p className="text-sm text-gray-500">Created At</p>
                <p className="font-medium">
                  {new Date(compensation.created_at).toLocaleString()}
                </p>
              </div>
            )}
            {compensation?.updated_at && (
              <div>
                <p className="text-sm text-gray-500">Updated At</p>
                <p className="font-medium">
                  {new Date(compensation.updated_at).toLocaleString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Modal */}
      <EditCompensationModal
        isOpen={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onSuccess={() => {
          refetch();
        }}
        compensation={compensation || null}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        title="Are you sure you want to delete this compensation?"
        loading={isDeleting}
        onCancel={() => setIsDeleteDialogOpen(false)}
        onOk={handleDelete}
      />
    </div>
  );
};

export default CompensationDetails;
