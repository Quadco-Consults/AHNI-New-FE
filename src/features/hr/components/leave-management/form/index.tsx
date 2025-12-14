"use client";

import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelectField";
import { Form } from "components/ui/form";
import FormTextArea from "components/atoms/FormTextArea";
import { UploadIcon, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import {
  useGetLeaveTypes,
  useGetLeaveBalances,
  useValidateLeaveRequest,
} from "@/features/hr/controllers/leaveRequestController";
import { useGetEmployeeOnboardings } from "@/features/hr/controllers/employeeOnboardingController";
import { useGetUserProfile, useGetAllUsers } from "@/features/auth/controllers/userController";
import { getApproverOptions } from "@/utils/approvalFilters";
import { filterAhniStaffOnly } from "@/utils/userFilters";
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
  backupPersonId: string;
  handoverNotes: string;
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

  // Fetch employees for backup person selection
  const { data: employeesData, isLoading: loadingEmployees } = useGetEmployeeOnboardings({ size: 100 });

  // Get all users for approver filtering (same pattern as other working forms)
  const { data: allUsersData, isLoading: loadingApprovers } = useGetAllUsers({
    page: 1,
    size: 2000000
  });

  // Get user profile for current user ID
  const { data: userProfile } = useGetUserProfile();

  // Get user from localStorage as fallback
  const [localUser, setLocalUser] = useState<any>(null);
  useEffect(() => {
    try {
      const userString = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      setLocalUser(userString ? JSON.parse(userString) : null);
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
    }
  }, []);

  // Debug logging for employee data
  // console.log('Leave form - employeesData:', employeesData);
  const employees = Array.isArray(employeesData?.data)
    ? employeesData.data.map((emp: any) => ({
        id: emp.id,
        name: `${emp.legal_firstname || emp.first_name || ''} ${emp.legal_lastname || emp.last_name || ''}`.trim(),
        department: typeof emp.department === 'object' ? emp.department?.name || 'N/A' : emp.department || 'N/A',
        employeeId: emp.employee_id || emp.id,
        position: emp.position || emp.job_title || 'N/A'
      }))
    : Array.isArray(employeesData?.data?.results)
    ? employeesData.data.results.map((emp: any) => ({
        id: emp.id,
        name: `${emp.legal_firstname || emp.first_name || ''} ${emp.legal_lastname || emp.last_name || ''}`.trim(),
        department: typeof emp.department === 'object' ? emp.department?.name || 'N/A' : emp.department || 'N/A',
        employeeId: emp.employee_id || emp.id,
        position: emp.position || emp.job_title || 'N/A'
      }))
    : [];

  // Debug logging for mapped employees
  // console.log('Leave form - mapped employees:', employees);
  // console.log('🔍 ALT FORM DEBUGGING - Employee count:', employees.length);

  // Filter for AHNI staff only (exclude vendors, consultants, external users)
  const ahniStaffForApprovers = useMemo(
    () => filterAhniStaffOnly(allUsersData?.data?.results || []),
    [allUsersData?.data?.results]
  );

  // Get approver options using the same pattern as other working forms
  const approverOptions = useMemo(() => {
    const options = getApproverOptions(ahniStaffForApprovers);

    // Debug approver data once when data changes
    console.log('🔍 APPROVER DEBUG - Leave Management:', {
      allUsersCount: allUsersData?.data?.results?.length || 0,
      ahniStaffCount: ahniStaffForApprovers.length,
      approverOptionsCount: options.length,
      approverOptions: options,
      loadingApprovers
    });

    // TEMPORARY FIX: If no users with permissions found, show all AHNI staff
    if (options.length === 0) {
      console.warn('⚠️ No users with approve permission found. Showing all AHNI staff as fallback.');
      return ahniStaffForApprovers.map((userData) => ({
        label: userData.full_name ||
               [userData.first_name, userData.last_name]
                 .filter(name => name && name.trim())
                 .join(" ") ||
               userData.email || "User",
        value: userData.id,
      }));
    }

    return options;
  }, [ahniStaffForApprovers, loadingApprovers, allUsersData]);

  // Get employee UUID with multiple fallback methods (prioritize employee_uuid from backend fix)
  const employeeId =
    // 1. From user profile - NEW: Use employee_uuid first (backend fix)
    userProfile?.data?.employee_uuid ||
    // 2. From balances (if available)
    (balances.length > 0 ? (balances[0]?.employee?.id || balances[0]?.employee) : null) ||
    // 3. From user profile - fallback to old fields
    userProfile?.data?.employee_id ||
    userProfile?.data?.id ||
    // 4. From localStorage - fallback
    localUser?.employee_uuid ||
    localUser?.employee_id ||
    localUser?.id ||
    // 5. Empty string as last resort
    "";

  // Debug logging for employee ID - TEMPORARY for testing backend fix
  console.log('🔍 LEAVE FORM EMPLOYEE ID DEBUG:', {
    userProfile: userProfile?.data,
    employeeId,
    employee_uuid: userProfile?.data?.employee_uuid,
    employee_id: userProfile?.data?.employee_id,
    user_id: userProfile?.data?.id,
    context: 'leave_form_employee_resolution'
  });

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
      backupPersonId: "",
      handoverNotes: "",
    },
  });

  const { handleSubmit, watch, formState } = form;
  const { errors, isValid } = formState;
  const selectedLeaveType = watch("leaveType");
  const fromDate = watch("fromDate");
  const toDate = watch("toDate");

  // Debug form state and validation
  // console.log("📋 Form Debug Info:", {
  //   formState: {
  //     isValid,
  //     errors: Object.keys(errors).length > 0 ? errors : "No errors",
  //     isDirty: formState.isDirty,
  //     isSubmitting: formState.isSubmitting
  //   },
  //   formData: {
  //     leaveType: selectedLeaveType,
  //     fromDate,
  //     toDate,
  //     approverId: watch("approverId"),
  //     backupPersonId: watch("backupPersonId")
  //   }
  // });

  // Get balance for selected leave type
  const selectedBalance = balances.find((b) => b.leave_type?.id === selectedLeaveType);

  // Removed automatic validation on field change to prevent excessive API calls
  // Validation now only happens on form submit

  const onSubmitError = (errors: any) => {
    console.log("❌ Form submission blocked by validation errors:", errors);
    console.log("❌ Error details:", JSON.stringify(errors, null, 2));
    toast.error("Please fill in all required fields correctly");
  };

  const onSubmit = async (data: LeaveFormData) => {
    console.log("🚀 Form submission started with data:", data);

    // Employee ID check removed - backend auto-sets employee from authenticated user
    // if (!employeeId) {
    //   toast.error("Employee information not found. Please refresh the page and try again.");
    //   return;
    // }

    // Validation temporarily disabled for debugging - the backend will validate during submission
    // try {
    //   const validation = await validateLeaveRequest({
    //     leaveTypeId: data.leaveType,
    //     fromDate: data.fromDate,
    //     toDate: data.toDate,
    //     duration: data.duration,
    //   });

    //   if (validation && !validation.valid) {
    //     toast.error("Validation failed: " + (validation.errors?.join(", ") || "Unknown error"));
    //     return;
    //   }
    // } catch (error) {
    //   toast.error("Validation failed. Please check your inputs.");
    //   return;
    // }

    // Create leave request - employee field is auto-set by backend from authenticated user
    const requestData: any = {
      // employee: employeeId, // ❌ REMOVED - Backend auto-sets this from authenticated user
      leave_type: data.leaveType,
      from_date: data.fromDate,
      to_date: data.toDate,
      duration: data.duration,
      reason: data.reason,
      is_emergency: false,
      approver: data.approverId,
      backup_person: data.backupPersonId || null,
      handover_notes: data.handoverNotes || null,
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
        // Check for specific employee record errors
        if (responseData.employee) {
          const employeeErrors = Array.isArray(responseData.employee)
            ? responseData.employee
            : [responseData.employee];

          const hasEmployeeRecordError = employeeErrors.some((err: string) =>
            err.includes('No employee record found') ||
            err.includes('employee record') ||
            err.includes('contact HR')
          );

          if (hasEmployeeRecordError) {
            errorMessage = "You need an employee profile to apply for leave. Please contact HR to set up your employee record.";
            toast.error(errorMessage);
            return;
          }
        }

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
  if (loadingTypes || loadingBalances || loadingEmployees || loadingApprovers) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
        <span className="ml-2">Loading form...</span>
      </div>
    );
  }

  // Note: Employee ID warning removed - backend now auto-detects employee from authenticated user
  // This allows the form to load even if frontend can't detect employee ID initially
  // If there are any employee record issues, they'll be caught during form submission with proper error messages

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit, onSubmitError)} className="flex flex-col gap-6">
            {/* Current User Info */}
            {(userProfile?.data || localUser) && (
              <Card className="p-4 bg-gray-50 border-gray-200">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm text-gray-600">Applying as:</p>
                    <p className="font-semibold text-gray-900">
                      {userProfile?.data?.first_name || userProfile?.data?.legal_firstname ||
                       localUser?.first_name || localUser?.legal_firstname || 'Current User'}
                      {(userProfile?.data?.last_name || userProfile?.data?.legal_lastname ||
                        localUser?.last_name || localUser?.legal_lastname) &&
                        ` ${userProfile?.data?.last_name || userProfile?.data?.legal_lastname ||
                             localUser?.last_name || localUser?.legal_lastname}`}
                    </p>
                    {(userProfile?.data?.email || localUser?.email) && (
                      <p className="text-xs text-gray-500">
                        {userProfile?.data?.email || localUser?.email}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Leave Type Selection */}
            <div className="grid gap-5">
              <FormSelect
                label="Leave Type"
                name="leaveType"
                required
                options={leaveTypes.map((leaveType: any) => ({
                  label: typeof leaveType.name === 'string'
                    ? leaveType.name
                    : typeof leaveType.name === 'object' && leaveType.name?.name
                    ? leaveType.name.name
                    : leaveType.leave_type_name || 'Unknown Leave Type',
                  value: leaveType.id
                }))}
                placeholder="Select leave type..."
              />

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
              <FormSelect
                label="Duration"
                name="duration"
                required
                options={[
                  { label: "Full Day", value: "full_day" },
                  { label: "Half Day (Morning)", value: "half_day_morning" },
                  { label: "Half Day (Afternoon)", value: "half_day_afternoon" }
                ]}
                placeholder="Select duration..."
              />

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
              <FormSelect
                label="Leave Approver"
                name="approverId"
                required
                options={approverOptions}
                placeholder="Select an approver..."
              />

              {/* Backup Person Selection */}
              <FormSelect
                label="Backup Person (Who will cover your duties)"
                name="backupPersonId"
                required
                options={employees.map((employee: any) => ({
                  label: `${employee.name} - ${employee.department}`,
                  value: employee.id
                }))}
                placeholder="Select a backup person..."
              />

              {/* Handover Notes */}
              <FormTextArea
                label="Handover Notes"
                name="handoverNotes"
                required
                placeholder="Please provide details about ongoing tasks, deadlines, and instructions for your backup person..."
              />
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
                onClick={() => {/* Submit button clicked */}}
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
