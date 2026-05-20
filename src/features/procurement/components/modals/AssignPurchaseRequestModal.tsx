"use client";

import React, { FormEvent, useState, useEffect } from "react";
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
import { useAppDispatch } from "@/hooks/useStore";
import { closeDialog } from "@/store/ui";

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
  const dispatch = useAppDispatch();
  const [assignedTo, setAssignedTo] = useState(prevAssignedTo || "");

  // Disable default success toast since we show a custom one
  const { updatePurchaseRequest, isLoading: isUpdating, isSuccess } = useUpdatePurchaseRequest(id, false);
  const { data: purchaseRequestData, isLoading: isFetching, refetch } = useGetPurchaseRequest(id);

  // Close modal when assignment succeeds
  useEffect(() => {
    if (isSuccess) {
      // Small delay to ensure the query cache is updated
      const timer = setTimeout(() => {
        dispatch(closeDialog());
        onClose?.();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, dispatch, onClose]);
  // Fetch all users and filter for procurement department on frontend
  const { data: allUsers, isLoading: isLoadingUsers, error: usersError } = useGetAllUsers({
    page: 1,
    size: 10000, // Get all users
    search: "",
  });

  // Filter users for procurement department or procurement-related roles
  const procurementUsers = React.useMemo(() => {
    const results = allUsers?.data?.results || [];
    return results.filter((user: any) => {
      // Check if user is from procurement department
      const isProcurementDept =
        user.department?.name?.toLowerCase().includes('procurement') ||
        user.employee?.department?.name?.toLowerCase().includes('procurement') ||
        user.email?.toLowerCase().includes('procurement');

      // Or if user is admin/staff (they have access to all)
      const isAdminStaff = user.is_superuser || user.is_staff;

      return isProcurementDept || isAdminStaff;
    });
  }, [allUsers]);

  // Debug logging
  console.log("🔍 All Users Data:", allUsers);
  console.log("📊 Filtered Procurement Users:", procurementUsers.length);
  console.log("📊 Users structure:", {
    hasData: !!allUsers,
    hasDataProp: !!allUsers?.data,
    hasResults: !!allUsers?.data?.results,
    totalUsers: allUsers?.data?.results?.length || 0,
    procurementUsers: procurementUsers.length,
    error: usersError
  });

  const isLoading = isUpdating || isFetching || isLoadingUsers;

  const usersOption = procurementUsers?.map((el: any) => ({
    value: el?.id,
    label: `${el?.first_name} ${el?.last_name} ${el.department?.name ? `(${el.department.name})` : ''}`,
  })) || [];

  console.log("👥 Users options:", usersOption);

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

      // Modal will close automatically via useEffect when isSuccess becomes true
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
      ) : isLoadingUsers ? (
        <div className="text-center py-4 text-gray-500">
          Loading procurement officers...
        </div>
      ) : usersError ? (
        <div className="text-center py-4 text-red-500">
          Error loading users: {(usersError as Error)?.message}
        </div>
      ) : usersOption.length === 0 ? (
        <div className="space-y-2">
          <div className="text-center py-4 text-amber-600 bg-amber-50 rounded border border-amber-200">
            No procurement officers found in the system
          </div>
          <div className="text-xs text-gray-500">
            Debug info: {allUsers?.data?.results?.length || 0} total users, {procurementUsers.length} procurement users
          </div>
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
        <FormButton
          type="button"
          variant="outline"
          onClick={() => {
            dispatch(closeDialog());
            onClose?.();
          }}
          disabled={isLoading}
        >
          Cancel
        </FormButton>
        <FormButton type="submit" loading={isLoading} disabled={isFetching}>
          Assign
        </FormButton>
      </div>
    </form>
  );
}
