"use client";

import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelectField";
import GoBack from "components/GoBack";
import { Form } from "components/ui/form";
import { SelectContent, SelectItem } from "components/ui/select";
import FormTextArea from "components/atoms/FormTextArea";
import { UploadIcon, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  useCreateLeaveRequest,
  useGetLeaveTypes,
  useGetLeaveBalances,
  useValidateLeaveRequest,
} from "@/features/hr/controllers/leaveRequestController";
import { useGetUserProfile } from "@/features/auth/controllers/userController";
import { toast } from "sonner";
import { format } from "date-fns";
import { Badge } from "components/ui/badge";
import { Card } from "components/ui/card";

interface LeaveFormData {
  leaveType: string;
  reason: string;
  fromDate: string;
  toDate: string;
  duration: "full_day" | "half_day_morning" | "half_day_afternoon";
}

const LeaveForm = () => {
  const router = useRouter();
  const [validationResult, setValidationResult] = useState<any>(null);

  // Get current user
  const { data: userProfileData, isLoading: loadingProfile } = useGetUserProfile();
  const currentEmployeeId = userProfileData?.data?.id || "";

  // Fetch leave types
  const { data: leaveTypesData, isLoading: loadingTypes } = useGetLeaveTypes();
  const leaveTypes = leaveTypesData?.data || [];

  // Fetch leave balances
  const { data: balancesData, isLoading: loadingBalances } = useGetLeaveBalances(
    currentEmployeeId,
    !!currentEmployeeId
  );
  const balances = balancesData?.data || [];

  // Mutations
  const { createLeaveRequest, isLoading: isCreating, isSuccess } = useCreateLeaveRequest();
  const { validateLeaveRequest, isLoading: isValidating } = useValidateLeaveRequest();

  const form = useForm<LeaveFormData>({
    defaultValues: {
      leaveType: "",
      reason: "",
      fromDate: "",
      toDate: "",
      duration: "full_day",
    },
  });

  const { handleSubmit, watch } = form;
  const selectedLeaveType = watch("leaveType");
  const fromDate = watch("fromDate");
  const toDate = watch("toDate");

  // Get balance for selected leave type
  const selectedBalance = balances.find((b) => b.leave_type?.id === selectedLeaveType);

  // Validate dates when they change
  useEffect(() => {
    if (selectedLeaveType && fromDate && toDate && currentEmployeeId) {
      const validateDates = async () => {
        try {
          await validateLeaveRequest({
            employeeId: currentEmployeeId,
            leaveTypeId: selectedLeaveType,
            fromDate,
            toDate,
            duration: "full_day",
          });
        } catch (error) {
          // Validation errors will be shown in the UI
        }
      };
      validateDates();
    }
  }, [selectedLeaveType, fromDate, toDate, currentEmployeeId, validateLeaveRequest]);

  const onSubmit = async (data: LeaveFormData) => {
    if (!currentEmployeeId) {
      toast.error("Unable to identify current user");
      return;
    }

    // Validate first
    try {
      const validation = await validateLeaveRequest({
        employeeId: currentEmployeeId,
        leaveTypeId: data.leaveType,
        fromDate: data.fromDate,
        toDate: data.toDate,
        duration: data.duration,
      });

      if (validation && !validation.valid) {
        toast.error("Validation failed: " + (validation.errors?.join(", ") || "Unknown error"));
        return;
      }
    } catch (error) {
      toast.error("Validation failed. Please check your inputs.");
      return;
    }

    // Create leave request
    const requestData = {
      employee: currentEmployeeId,
      leave_type: data.leaveType,
      from_date: data.fromDate,
      to_date: data.toDate,
      duration: data.duration,
      reason: data.reason,
      is_emergency: false,
    };

    try {
      await createLeaveRequest(requestData);
      toast.success("Leave request created successfully!");
      router.push("/dashboard/hr/leave-management");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create leave request");
    }
  };

  // Loading state
  if (loadingProfile || loadingTypes || loadingBalances) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
        <span className="ml-2">Loading form...</span>
      </div>
    );
  }

  return (
    <div className="">
      <GoBack />

      <div className="pt-10">
        <h3 className="text-[18px] pb-10 font-semibold">New Leave Request</h3>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            {/* Leave Type Selection */}
            <div className="grid gap-5">
              <FormSelect label="Leave Type" name="leaveType" required>
                <SelectContent>
                  {leaveTypes.map((leaveType: any) => (
                    <SelectItem key={leaveType.id} value={leaveType.id}>
                      {leaveType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </FormSelect>

              {/* Show balance for selected type */}
              {selectedBalance && (
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Available Balance</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedBalance.available || 0} days
                      </p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p>Entitled: {selectedBalance.entitled || 0}</p>
                      <p>Used: {selectedBalance.used || 0}</p>
                      <p>Pending: {selectedBalance.pending || 0}</p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Duration */}
              <FormSelect label="Duration" name="duration" required>
                <SelectContent>
                  <SelectItem value="full_day">Full Day</SelectItem>
                  <SelectItem value="half_day_morning">Half Day (Morning)</SelectItem>
                  <SelectItem value="half_day_afternoon">Half Day (Afternoon)</SelectItem>
                </SelectContent>
              </FormSelect>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-5">
                <FormInput label="From Date" name="fromDate" type="date" required />
                <FormInput label="To Date" name="toDate" type="date" required />
              </div>

              {/* Reason */}
              <FormTextArea
                label="Reason for Leave"
                name="reason"
                required
                placeholder="Please provide a detailed reason for your leave request..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <FormButton
                type="button"
                className="flex items-center justify-center gap-2 bg-alternate text-primary"
                onClick={() => router.push("/dashboard/hr/leave-management")}
              >
                Cancel
              </FormButton>
              <FormButton
                loading={isCreating || isValidating}
                disabled={isCreating || isValidating || !currentEmployeeId}
                type="submit"
                className="flex items-center justify-center gap-2"
              >
                <UploadIcon className="w-4 h-4" />
                Submit Request
              </FormButton>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LeaveForm;
