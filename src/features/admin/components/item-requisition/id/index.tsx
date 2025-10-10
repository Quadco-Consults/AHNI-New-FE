"use client";

import FormButton from "@/components/FormButton";
import FormTextArea from "components/atoms/FormTextArea";
import Card from "components/Card";
import DescriptionCard from "components/DescriptionCard";
import GoBack from "components/GoBack";
import { LoadingSpinner } from "components/Loading";
import { Separator } from "components/ui/separator";
import { format } from "date-fns";
import { FormProvider, useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  useGetSingleItemRequisition,
  useApproveItemRequisition,
  useRejectItemRequisition
} from "@/features/admin/controllers/itemRequisitionController";
import StockAvailabilityCheck from "@/features/admin/components/item-requisition/StockAvailabilityCheck";

export default function ItemRequisitionDetailPage() {
  const { id } = useParams();

  const { data: itemRequisition, isLoading, refetch } = useGetSingleItemRequisition(
    id || "", { enabled: !!id }
  );

  // Approval and rejection hooks
  const {
    approveItemRequisition,
    isLoading: isApproving,
    isSuccess: isApproveSuccess
  } = useApproveItemRequisition(id as string);

  const {
    rejectItemRequisition,
    isLoading: isRejecting,
    isSuccess: isRejectSuccess
  } = useRejectItemRequisition(id as string);

  // State to track if actions have been taken
  const [hasApproved, setHasApproved] = useState(false);
  const [hasRejected, setHasRejected] = useState(false);

  const requestorName = itemRequisition?.data?.created_by?.first_name
    ? `${itemRequisition.data.created_by.first_name} ${itemRequisition.data.created_by.last_name || ''}`
    : (itemRequisition?.data?.created_by?.email || 'Unknown');

  console.log({ itemRequisition });

  // Debug log to see the structure of consummables
  console.log("Consummables data:", itemRequisition?.data.consummables);

  const itemsRequested = itemRequisition?.data.consummables
    ?.map((con) => {
      // Based on actual API response, items are under 'item' property
      return con?.item?.name || con?.consummable?.name || 'Unknown Item';
    })
    .filter(Boolean) // Remove any null/undefined values
    .join(", ") || "No items specified";

  const quantityRequested = itemRequisition?.data.consummables
    ?.map((item) => item.quantity)
    .reduce((accumulator, value) => {
      return accumulator + value;
    }, 0) || 0;

  // Update state when actions succeed
  useEffect(() => {
    if (isApproveSuccess) {
      setHasApproved(true);
      refetch(); // Refetch to update the status
    }
  }, [isApproveSuccess, refetch]);

  useEffect(() => {
    if (isRejectSuccess) {
      setHasRejected(true);
      refetch(); // Refetch to update the status
    }
  }, [isRejectSuccess, refetch]);

  // Check if the item is already processed based on status (case insensitive)
  const isAlreadyApproved = itemRequisition?.data.status?.toLowerCase() === "approved";
  const isAlreadyRejected = itemRequisition?.data.status?.toLowerCase() === "rejected";
  const isAlreadyIssued = itemRequisition?.data.status?.toLowerCase() === "issued";

  // Get approval/rejection/issued details
  const getProcessingDetails = () => {
    console.log("Status check:", {
      status: itemRequisition?.data.status,
      isAlreadyApproved,
      isAlreadyRejected,
      isAlreadyIssued,
      approved_by: itemRequisition?.data.approved_by,
      rejected_by: itemRequisition?.data.rejected_by,
      issued_by: itemRequisition?.data.issued_by,
      approved_datetime: itemRequisition?.data.approved_datetime,
      rejected_datetime: itemRequisition?.data.rejected_datetime,
      issued_datetime: itemRequisition?.data.issued_datetime
    });

    if (isAlreadyIssued) {
      const issuer = itemRequisition?.data.issued_by as any;
      const issuerName = (typeof issuer === 'object' ? issuer?.full_name || issuer?.email : issuer) || "System";
      const issuerDepartment = typeof issuer === 'object' ? issuer?.department || "" : "";

      return {
        action: "Issued",
        by: issuerName,
        department: issuerDepartment,
        date: itemRequisition?.data.issued_datetime
      };
    } else if (isAlreadyApproved) {
      const approver = itemRequisition?.data.approved_by as any;
      const approverName = (typeof approver === 'object' ? approver?.full_name || approver?.email : approver) || "System";
      const approverDepartment = typeof approver === 'object' ? approver?.department || "" : "";

      return {
        action: "Approved",
        by: approverName,
        department: approverDepartment,
        date: itemRequisition?.data.approved_datetime
      };
    } else if (isAlreadyRejected) {
      const rejector = itemRequisition?.data.rejected_by as any;
      const rejectorName = (typeof rejector === 'object' ? rejector?.full_name || rejector?.email : rejector) || "System";
      const rejectorDepartment = typeof rejector === 'object' ? rejector?.department || "" : "";

      return {
        action: "Rejected",
        by: rejectorName,
        department: rejectorDepartment,
        date: itemRequisition?.data.rejected_datetime
      };
    }
    return null;
  };

  const processingDetails = getProcessingDetails();

  // Handler functions
  const handleApprove = async () => {
    if (!hasApproved && !hasRejected && !isAlreadyApproved && !isAlreadyRejected && !isAlreadyIssued) {
      await approveItemRequisition();
    }
  };

  const handleReject = async () => {
    if (!hasApproved && !hasRejected && !isAlreadyApproved && !isAlreadyRejected && !isAlreadyIssued) {
      await rejectItemRequisition();
    }
  };

  const form = useForm();
  //   return;
  return (
    <div className='space-y-6'>
      <GoBack />
      <Card className='space-y-6'>
        <h4 className='font-semibold text-lg'>Item Requisition Detail</h4>
        <Separator />

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          itemRequisition?.data && (
            <div className='grid grid-cols-2 gap-8 mt-6'>
              <DescriptionCard
                label='Requestor Name'
                description={requestorName}
              />

              <DescriptionCard
                label='Department/Unit'
                description={itemRequisition?.data.department?.name || 'N/A'}
              />

              <DescriptionCard
                label='Date Requested'
                description={format(
                  itemRequisition?.data.created_datetime,
                  "yyyy-dd-MM"
                )}
              />

              <DescriptionCard
                label='Date Treated'
                description={format(
                  itemRequisition?.data.treatment_datetime ?? new Date(),
                  "yyyy-dd-MM"
                )}
              />

              <DescriptionCard
                label='Item Requested'
                description={itemsRequested}
              />
              <DescriptionCard
                label='Quantity Requested'
                description={String(quantityRequested)}
              />
              <DescriptionCard
                label='Status'
                description={itemRequisition?.data.status}
              />

              {processingDetails ? (
                <>
                  <DescriptionCard
                    label={`${processingDetails.action} by`}
                    description={`${processingDetails.by}${processingDetails.department ? ` (${processingDetails.department})` : ''}`}
                  />
                  <DescriptionCard
                    label={`${processingDetails.action} on`}
                    description={processingDetails.date ? format(new Date(processingDetails.date), "yyyy-MM-dd HH:mm") : 'N/A'}
                  />
                </>
              ) : (
                <DescriptionCard label='Approved by' description='Pending approval' />
              )}
            </div>
          )
        )}

        {/* Stock Availability Check - Show for APPROVED status before issuing */}
        {isAlreadyApproved && !isAlreadyIssued && itemRequisition?.data?.consummables && Array.isArray(itemRequisition.data.consummables) && itemRequisition.data.consummables.length > 0 && (
          <StockAvailabilityCheck items={itemRequisition.data.consummables} />
        )}

{/* Only show action buttons if not already processed */}
        {!isAlreadyApproved && !isAlreadyRejected && !isAlreadyIssued && (
          <FormProvider {...form}>
            <form className='space-y-5'>
              <FormTextArea
                label='Comment'
                name='comment'
                placeholder='Enter Comment'
                required
              />

              <div className='flex gap-4'>
                <FormButton
                  size='lg'
                  type='button'
                  className={`bg-green-500 hover:bg-green-600 ${
                    hasApproved || hasRejected
                      ? 'opacity-50 cursor-not-allowed bg-gray-400 hover:bg-gray-400'
                      : ''
                  }`}
                  onClick={handleApprove}
                  disabled={
                    isApproving ||
                    isRejecting ||
                    hasApproved ||
                    hasRejected
                  }
                >
                  {isApproving ? 'Approving...' : 'Approve'}
                </FormButton>

                <FormButton
                  size='lg'
                  type='button'
                  className={`bg-red-500 hover:bg-red-600 ${
                    hasApproved || hasRejected
                      ? 'opacity-50 cursor-not-allowed bg-gray-400 hover:bg-gray-400'
                      : ''
                  }`}
                  onClick={handleReject}
                  disabled={
                    isApproving ||
                    isRejecting ||
                    hasApproved ||
                    hasRejected
                  }
                >
                  {isRejecting ? 'Rejecting...' : 'Reject'}
                </FormButton>
              </div>
            </form>
          </FormProvider>
        )}

        {/* Show status message if already processed */}
        {(isAlreadyApproved || isAlreadyRejected || isAlreadyIssued) && (
          <div className={`p-4 rounded-md ${
            isAlreadyIssued ? 'bg-blue-50 text-blue-800' :
            isAlreadyApproved ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            <p className='font-medium'>
              This requisition has already been {
                isAlreadyIssued ? 'issued' :
                isAlreadyApproved ? 'approved' : 'rejected'
              }.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
