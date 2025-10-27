"use client";

import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelectField";
import { Form } from "components/ui/form";
import { SelectContent, SelectItem } from "components/ui/select";
import FormTextArea from "components/atoms/FormTextArea";
import { UploadIcon, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import {
  useGetLeaveTypes,
  useGetLeaveBalances,
  useValidateLeaveRequest,
} from "@/features/hr/controllers/leaveRequestController";
import { useGetEmployeeOnboardings } from "@/features/hr/controllers/employeeOnboardingController";
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
  approverId: string;
}

interface LeaveFormProps {
  onSuccess?: () => void;
}

const LeaveForm = ({ onSuccess }: LeaveFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [validationResult, setValidationResult] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch leave types
  const { data: leaveTypesData, isLoading: loadingTypes } = useGetLeaveTypes();
  const leaveTypes = Array.isArray(leaveTypesData?.data)
    ? leaveTypesData.data
    : Array.isArray(leaveTypesData?.data?.results)
    ? leaveTypesData.data.results
    : [];

  // Fetch leave balances (backend gets employee from request.user.employee)
  const { data: balancesData, isLoading: loadingBalances } = useGetLeaveBalances();
  const balances = Array.isArray(balancesData?.data)
    ? balancesData.data
    : Array.isArray(balancesData?.data?.results)
    ? balancesData.data.results
    : [];

  // Fetch employees for approver selection
  const { data: employeesData, isLoading: loadingEmployees } = useGetEmployeeOnboardings({ size: 100 });
  const employees = Array.isArray(employeesData?.data)
    ? employeesData.data.map((emp: any) => ({
        id: emp.id,
        name: `${emp.first_name} ${emp.last_name}`,
        department: typeof emp.department === 'object' ? emp.department?.name || 'N/A' : emp.department || 'N/A',
        employeeId: emp.employee_id || emp.id,
        position: emp.position || emp.job_title || 'N/A'
      }))
    : Array.isArray(employeesData?.data?.results)
    ? employeesData.data.results.map((emp: any) => ({
        id: emp.id,
        name: `${emp.first_name} ${emp.last_name}`,
        department: typeof emp.department === 'object' ? emp.department?.name || 'N/A' : emp.department || 'N/A',
        employeeId: emp.employee_id || emp.id,
        position: emp.position || emp.job_title || 'N/A'
      }))
    : [];

  // Get employee ID from the first balance record
  const employeeId = balances.length > 0 ? balances[0]?.employee?.id || balances[0]?.employee : "";

  // Mutations
  const { validateLeaveRequest, isLoading: isValidating } = useValidateLeaveRequest();

  const form = useForm<LeaveFormData>({
    defaultValues: {
      leaveType: "",
      reason: "",
      fromDate: "",
      toDate: "",
      duration: "full_day",
      approverId: "",
    },
  });

  const { handleSubmit, watch } = form;
  const selectedLeaveType = watch("leaveType");
  const fromDate = watch("fromDate");
  const toDate = watch("toDate");

  // Get balance for selected leave type
  const selectedBalance = balances.find((b) => b.leave_type?.id === selectedLeaveType);

  // Removed automatic validation on field change to prevent excessive API calls
  // Validation now only happens on form submit

  const onSubmit = async (data: LeaveFormData) => {
    // Validate first
    try {
      const validation = await validateLeaveRequest({
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

    // Create leave request - only send fields the backend expects
    const requestData: any = {
      employee: employeeId,
      leave_type: data.leaveType,
      from_date: data.fromDate,
      to_date: data.toDate,
      duration: data.duration,
      reason: data.reason,
      is_emergency: false,
      approver: data.approverId,
    };

    console.log("Submitting leave request with data:", requestData);

    try {
      setIsCreating(true);
      const response = await AxiosWithToken.post("hr/leave-request/", requestData);

      const leaveRequestId = response.data?.data?.id;

      if (leaveRequestId) {
        // Automatically submit the leave request for approval
        try {
          await AxiosWithToken.post(`hr/leave-request/${leaveRequestId}/submit/`);
          console.log("Leave request submitted successfully");
        } catch (submitError) {
          console.error("Error submitting leave request:", submitError);
          // Continue even if submission fails - the leave is created
        }
      }

      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ["leave-requests"] });
      await queryClient.invalidateQueries({ queryKey: ["leave-dashboard"] });
      await queryClient.invalidateQueries({ queryKey: ["leave-balances"] });

      toast.success("Leave request submitted successfully!");

      // Small delay to ensure queries are refetched before closing dialog
      await new Promise(resolve => setTimeout(resolve, 500));

      // Call onSuccess callback if provided (for dialog), otherwise navigate
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard/hr/leave-management");
      }
    } catch (error: any) {
      console.error("Leave request error:", error);

      // Handle validation errors from backend
      const responseData = error.response?.data;
      let errorMessage = "Failed to create leave request";

      if (responseData) {
        // Check for field-level validation errors
        if (typeof responseData === 'object' && !responseData.message) {
          const fieldErrors: string[] = [];
          Object.entries(responseData).forEach(([field, errors]) => {
            if (Array.isArray(errors)) {
              fieldErrors.push(...errors);
            } else if (typeof errors === 'string') {
              fieldErrors.push(errors);
            }
          });
          if (fieldErrors.length > 0) {
            errorMessage = fieldErrors.join('\n');
          }
        } else if (responseData.message) {
          errorMessage = responseData.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  // Loading state
  if (loadingTypes || loadingBalances || loadingEmployees) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
        <span className="ml-2">Loading form...</span>
      </div>
    );
  }

  return (
    <div className="">
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

              {/* Approver Selection */}
              <FormSelect label="Leave Approver" name="approverId" required>
                <SelectContent>
                  {employees.map((employee: any) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name} - {employee.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </FormSelect>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              {onSuccess && (
                <FormButton
                  type="button"
                  variant="outline"
                  className="flex items-center justify-center gap-2"
                  onClick={onSuccess}
                >
                  Cancel
                </FormButton>
              )}
              {!onSuccess && (
                <FormButton
                  type="button"
                  variant="outline"
                  className="flex items-center justify-center gap-2"
                  onClick={() => router.push("/dashboard/hr/leave-management")}
                >
                  Cancel
                </FormButton>
              )}
              <FormButton
                loading={isCreating || isValidating}
                disabled={isCreating || isValidating}
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
  );
};

export default LeaveForm;
