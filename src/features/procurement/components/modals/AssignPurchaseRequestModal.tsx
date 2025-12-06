"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import FormButton from "@/components/FormButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import {
  useUpdatePurchaseRequest,
  useGetPurchaseRequest
} from "@/features/procurement/controllers/purchaseRequestController";

interface AssignPurchaseRequestModalProps {
  id: string;
  assignedTo?: string;
  onClose?: () => void;
}

export default function AssignPurchaseRequestModal({
  id,
  assignedTo: prevAssignedTo,
  onClose
}: AssignPurchaseRequestModalProps) {
  const [assignedTo, setAssignedTo] = useState(prevAssignedTo || "");

  const { updatePurchaseRequest, isLoading: isUpdating } = useUpdatePurchaseRequest(id);
  const { data: purchaseRequestData, isLoading: isFetching } = useGetPurchaseRequest(id);
  const { data: users } = useGetAllUsers({
    page: 1,
    size: 100,
    search: "",
  });

  const isLoading = isUpdating || isFetching;

  const usersOption = users?.data?.results?.map((el: any) => ({
    value: el?.id,
    label: `${el?.first_name} ${el?.last_name}`,
  })) || [];

  const handleChangeAssignedUser = (value: string) => {
    setAssignedTo(value);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!assignedTo) {
      toast.error("Please select a user to assign");
      return;
    }

    if (!purchaseRequestData?.data) {
      toast.error("Purchase request data not loaded");
      return;
    }

    try {
      const currentPR = purchaseRequestData.data;

      // Prepare items array in the format expected by the API
      const items = currentPR.items.map((item: any) => {
        // Get FCO numbers and filter out invalid values
        let fcoNumbers: string[] = [];
        if (item.fconumber_details && Array.isArray(item.fconumber_details)) {
          fcoNumbers = item.fconumber_details
            .map((f: any) => f.id)
            .filter((id: any) => id && id !== "None" && id !== "null" && id !== "undefined");
        } else if (item.fco_number && Array.isArray(item.fco_number)) {
          fcoNumbers = item.fco_number.filter((id: any) => id && id !== "None" && id !== "null" && id !== "undefined");
        }

        const itemPayload: any = {
          // Include item's own ID so it updates instead of creating new
          ...(item.id && { id: item.id }),
          quantity: item.quantity || item.units,
          unit_cost: item.unit_cost,
          amount: item.amount || item.sub_total_amount,
          item: item.item?.id || item.item,
        };

        // Only include fco_number if we have valid values
        if (fcoNumbers.length > 0) {
          itemPayload.fco_number = fcoNumbers;
        }

        return itemPayload;
      });

      // Prepare the full update payload with only the assigned_to field changed
      const updatePayload = {
        items,
        requested_by: currentPR.requested_by?.id || currentPR.requested_by,
        requesting_department: currentPR.requesting_department_detail?.id || currentPR.requesting_department,
        location: currentPR.location_detail?.id || currentPR.deliver_to_detail?.id,
        ref_number: currentPR.ref_number,
        date_of_request: currentPR.date_of_request,
        date_required: currentPR.date_required,
        total_cost: currentPR.total_cost,
        status: currentPR.status,
        assigned_to: assignedTo, // This is the field we're updating
        ...(currentPR.reviewed_by && { reviewed_by: currentPR.reviewed_by_detail?.id || currentPR.reviewed_by }),
        ...(currentPR.authorized_by && { authorised_by: currentPR.authorized_by_detail?.id || currentPR.authorized_by }),
        ...(currentPR.approved_by && { approved_by: currentPR.approved_by_detail?.id || currentPR.approved_by }),
        ...(currentPR.request_memo && { request_memo: currentPR.request_memo }),
      };

      console.log("Assigning purchase request with payload:", updatePayload);

      await updatePurchaseRequest(updatePayload);
      toast.success("Purchase Request assigned successfully");
      onClose?.();
    } catch (error: any) {
      console.error("Assignment error:", error);
      toast.error(error?.message || "Failed to assign purchase request");
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full space-y-6">
      <h2 className="text-lg font-bold">Assign Purchase Request</h2>

      {isFetching ? (
        <div className="text-center py-4 text-gray-500">
          Loading purchase request data...
        </div>
      ) : (
        <Select
          value={assignedTo}
          defaultValue={assignedTo}
          onValueChange={handleChangeAssignedUser}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select User" />
          </SelectTrigger>

          <SelectContent className="max-h-[300px] overflow-auto">
            {usersOption?.map((user: any) => (
              <SelectItem key={user.value} value={user.value}>
                {user.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <div className="flex justify-end gap-2">
        {onClose && (
          <FormButton type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </FormButton>
        )}
        <FormButton type="submit" loading={isLoading} disabled={isFetching}>
          Assign
        </FormButton>
      </div>
    </form>
  );
}
