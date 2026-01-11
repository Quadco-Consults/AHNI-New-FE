"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  CalendarDays,
  AlertCircle,
  User,
  FileText,
  Search,
  Shield,
  UserCheck
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FormSelect from "@/components/atoms/FormSelectField";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import GoBack from "@/components/GoBack";
import BackendStatusBanner from "./BackendStatusBanner";

import { useGetLeaveTypes } from "../../controllers/leaveRequestController";
import { useGetWorkforces } from "../../controllers/workforceController";
import { useGetEmployeeLeaveBalance } from "../../controllers/leaveBalanceController";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

// Simple validation schema
const assignLeaveSchema = z.object({
  employeeId: z.string().min(1, "Please select an employee"),
  leaveTypeId: z.string().min(1, "Please select a leave type"),
  fromDate: z.string().min(1, "Please select start date"),
  toDate: z.string().min(1, "Please select end date"),
  duration: z.enum(['full_day', 'half_day_morning', 'half_day_afternoon']),
  reason: z.string().min(5, "Please provide a reason (minimum 5 characters)"),
  adminNotes: z.string().optional(),
  isEmergency: z.boolean(),
  notifyEmployee: z.boolean(),
  skipApproval: z.boolean(),
}).refine((data) => {
  const fromDate = new Date(data.fromDate);
  const toDate = new Date(data.toDate);
  return toDate >= fromDate;
}, {
  message: "End date must be after start date",
  path: ["toDate"]
});

type FormData = z.infer<typeof assignLeaveSchema>;

interface AssignLeaveFormProps {
  onSuccess?: () => void;
}

const AssignLeaveForm = ({ onSuccess }: AssignLeaveFormProps = {}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data
  const { data: leaveTypesData, isLoading: loadingTypes, error: typesError } = useGetLeaveTypes();
  const { data: employeesData, isLoading: loadingEmployees } = useGetWorkforces({ page: 1, size: 100 });

  // Extract and clean leave types - convert everything to primitives
  const leaveTypes = React.useMemo(() => {
    const rawData = Array.isArray(leaveTypesData?.data)
      ? leaveTypesData.data
      : Array.isArray(leaveTypesData?.data?.results)
      ? leaveTypesData.data.results
      : [];

    return rawData.map((lt: any) => ({
      id: String(lt.id || ''),
      name: String(lt.name || 'Unknown')
    }));
  }, [leaveTypesData]);

  // Extract and clean employees - convert everything to primitives
  const employees = React.useMemo(() => {
    const rawData = Array.isArray(employeesData?.data)
      ? employeesData.data
      : Array.isArray(employeesData?.data?.results)
      ? employeesData.data.results
      : [];

    return rawData.map((emp: any) => {
      const fullName = emp.full_name || `${emp.legal_firstname || ''} ${emp.legal_lastname || ''}`.trim();
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      return {
        id: String(emp.id || ''),
        firstName: String(firstName),
        lastName: String(lastName),
        fullName: String(fullName || 'N/A'),
        employeeId: String(emp.serial_id_code || emp.employee_number || emp.id || ''),
        department: String(typeof emp.department === 'object' ? emp.department?.name : emp.department || 'N/A'),
        email: String(emp.email || emp.user?.email || '')
      };
    });
  }, [employeesData]);

  // Create employee options for FormSelect with search
  const employeeOptions = React.useMemo(() => {
    return employees.map((employee) => ({
      label: `${employee.firstName} ${employee.lastName} (${employee.employeeId}) - ${employee.department}`,
      value: employee.id,
    }));
  }, [employees]);

  const form = useForm<FormData>({
    resolver: zodResolver(assignLeaveSchema),
    defaultValues: {
      employeeId: '',
      leaveTypeId: '',
      fromDate: '',
      toDate: '',
      duration: 'full_day',
      reason: '',
      adminNotes: '',
      isEmergency: false,
      notifyEmployee: true,
      skipApproval: false,
    }
  });

  const selectedEmployeeId = form.watch('employeeId');
  const selectedLeaveTypeId = form.watch('leaveTypeId');
  const selectedEmployee = employees.find(e => e.id === selectedEmployeeId);

  // Fetch leave balance for selected employee
  const { data: leaveBalanceData, isLoading: loadingBalance } = useGetEmployeeLeaveBalance(
    selectedEmployeeId,
    !!selectedEmployeeId
  );

  // Extract leave balances
  const leaveBalances = React.useMemo(() => {
    const rawData = Array.isArray(leaveBalanceData?.data)
      ? leaveBalanceData.data
      : Array.isArray(leaveBalanceData?.data?.results)
      ? leaveBalanceData.data.results
      : [];
    return rawData;
  }, [leaveBalanceData]);

  // Get balance for selected leave type
  const selectedLeaveBalance = React.useMemo(() => {
    if (!selectedLeaveTypeId) return null;
    return leaveBalances.find((balance: any) => balance.leave_type?.id === selectedLeaveTypeId);
  }, [leaveBalances, selectedLeaveTypeId]);

  // Calculate number of days requested
  const fromDate = form.watch('fromDate');
  const toDate = form.watch('toDate');
  const requestedDays = React.useMemo(() => {
    if (!fromDate || !toDate) return 0;
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  }, [fromDate, toDate]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // Prepare request data for backend
      const requestData: any = {
        employee: data.employeeId,
        leave_type: data.leaveTypeId,
        from_date: data.fromDate,
        to_date: data.toDate,
        duration: data.duration,
        reason: data.reason,
        is_emergency: data.isEmergency,
      };

      console.log('Submitting leave assignment:', requestData);

      // Call the API
      const response = await AxiosWithToken.post("hr/leave-request/", requestData);

      const leaveRequestId = response.data?.data?.id;

      if (leaveRequestId) {
        // Automatically submit the leave request for approval
        try {
          await AxiosWithToken.post(`hr/leave-request/${leaveRequestId}/submit/`);
          console.log("Leave request submitted successfully");

          // If skip approval is checked, automatically approve the leave
          if (data.skipApproval) {
            try {
              await AxiosWithToken.post(`hr/leave-request/${leaveRequestId}/approve/`);
              console.log("Leave request approved successfully");
            } catch (approveError) {
              console.error("Error approving leave request:", approveError);
              toast.warning("Leave submitted but approval failed. Please approve manually.");
            }
          }
        } catch (submitError: any) {
          console.error("Error submitting leave request:", submitError);
          const submitErrorMsg = submitError?.response?.data?.message || submitError?.message;

          // Show specific error message
          if (submitErrorMsg?.includes("NoneType") || submitErrorMsg?.includes("approver") || submitErrorMsg?.includes("workflow")) {
            toast.warning(
              "Leave request created but could not be submitted automatically. " +
              "Please ensure approval workflow or approver is configured, then submit manually from the details page.",
              { duration: 6000 }
            );
          } else {
            toast.warning(`Leave created but submission failed: ${submitErrorMsg || "Unknown error"}`);
          }

          // Don't continue to approval if submission failed
          throw submitError;
        }
      }

      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ["leave-requests"] });
      await queryClient.invalidateQueries({ queryKey: ["leave-dashboard"] });
      await queryClient.invalidateQueries({ queryKey: ["leave-balances"] });

      // Small delay to ensure queries are refetched
      await new Promise(resolve => setTimeout(resolve, 500));

      // Call onSuccess callback if provided (for dialog), otherwise navigate
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/dashboard/hr/leave-management');
      }

    } catch (error: any) {
      console.error('Error assigning leave:', error);

      // If error is from submit (not create), still navigate as leave was created
      if (error?.response?.config?.url?.includes('/submit/')) {
        // Leave was created but submission failed
        await queryClient.invalidateQueries({ queryKey: ["leave-requests"] });

        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            router.push('/dashboard/hr/leave-management');
          }
        }, 2000);
        return;
      }

      // Handle validation errors from backend
      const responseData = error.response?.data;
      let errorMessage = "Failed to assign leave. Please try again.";

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
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loadingTypes || loadingEmployees) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
        <span className="ml-2">Loading form...</span>
      </div>
    );
  }

  // Error state
  if (typesError) {
    const errorMessage = typesError instanceof Error ? typesError.message : String(typesError || "Unknown error");
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <p className="text-red-600">Failed to load form data</p>
          <p className="text-sm text-gray-600">{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!onSuccess && <GoBack />}

      {!onSuccess && <BackendStatusBanner />}

      {/* Header */}
      {!onSuccess && (
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold">Assign Leave to Staff</h1>
            </div>
            <p className="text-gray-600">Create a leave request on behalf of an employee</p>
          </div>
          <Badge variant="outline" className="text-sm">
            <CalendarDays className="w-4 h-4 mr-1" />
            {format(new Date(), 'MMM dd, yyyy')}
          </Badge>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Employee Selection */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Select Employee</h3>
              </div>

              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee *</FormLabel>
                    <FormSelect
                      name="employeeId"
                      placeholder="Select an employee"
                      options={employeeOptions}
                      searchPlaceholder="Search employees by name, ID, or department..."
                      emptyMessage="No employees found matching your search."
                      required={true}
                      onValueChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Selected Employee Info */}
              {selectedEmployee && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Selected Employee</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Name</div>
                      <div className="font-semibold">{selectedEmployee.firstName} {selectedEmployee.lastName}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Employee ID</div>
                      <div className="font-semibold">{selectedEmployee.employeeId}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Department</div>
                      <div className="font-semibold">{selectedEmployee.department}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Email</div>
                      <div className="font-semibold">{selectedEmployee.email}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Leave Type Selection */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Leave Details</h3>
              </div>

              <FormField
                control={form.control}
                name="leaveTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Leave Type *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select leave type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {leaveTypes.map((leaveType) => (
                          <SelectItem key={leaveType.id} value={leaveType.id}>
                            {leaveType.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Leave Balance Display */}
              {selectedEmployeeId && selectedLeaveTypeId && (
                <div className="mt-4">
                  {loadingBalance ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mr-2" />
                      <span className="text-sm text-gray-600">Loading leave balance...</span>
                    </div>
                  ) : selectedLeaveBalance ? (
                    <div className={`border rounded-lg p-4 ${
                      selectedLeaveBalance.available < requestedDays
                        ? 'bg-red-50 border-red-200'
                        : selectedLeaveBalance.available < requestedDays + 5
                        ? 'bg-amber-50 border-amber-200'
                        : 'bg-green-50 border-green-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-3">
                        <CalendarDays className={`w-4 h-4 ${
                          selectedLeaveBalance.available < requestedDays
                            ? 'text-red-600'
                            : selectedLeaveBalance.available < requestedDays + 5
                            ? 'text-amber-600'
                            : 'text-green-600'
                        }`} />
                        <span className={`font-medium ${
                          selectedLeaveBalance.available < requestedDays
                            ? 'text-red-900'
                            : selectedLeaveBalance.available < requestedDays + 5
                            ? 'text-amber-900'
                            : 'text-green-900'
                        }`}>Leave Balance</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <div className="text-gray-600">Entitled</div>
                          <div className="font-semibold">{selectedLeaveBalance.entitled} days</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Used</div>
                          <div className="font-semibold">{selectedLeaveBalance.used} days</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Pending</div>
                          <div className="font-semibold">{selectedLeaveBalance.pending} days</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Available</div>
                          <div className="font-semibold text-lg">{selectedLeaveBalance.available} days</div>
                        </div>
                      </div>
                      {requestedDays > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Days Requested:</span>
                            <span className="font-semibold">{requestedDays} days</span>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-sm text-gray-600">Balance After:</span>
                            <span className={`font-semibold ${
                              selectedLeaveBalance.available - requestedDays < 0 ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {selectedLeaveBalance.available - requestedDays} days
                            </span>
                          </div>
                        </div>
                      )}
                      {selectedLeaveBalance.available < requestedDays && requestedDays > 0 && (
                        <div className="mt-3 pt-3 border-t border-red-200">
                          <AlertCircle className="w-4 h-4 inline text-red-600 mr-2" />
                          <span className="text-sm text-red-700 font-medium">
                            Insufficient leave balance! Employee needs {requestedDays - selectedLeaveBalance.available} more days.
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <span className="text-sm text-red-700 font-medium">
                          No leave balance found for this leave type. Please assign leave entitlement first.
                        </span>
                      </div>
                      <a
                        href="/dashboard/hr/leave-management/entitlements/assign"
                        className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                      >
                        → Assign Leave Entitlement
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Date Selection */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Duration & Dates</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fromDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="toDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration Type</FormLabel>
                    <FormControl>
                      <RadioGroup value={field.value} onValueChange={field.onChange} className="flex gap-6">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="full_day" id="full_day" />
                          <Label htmlFor="full_day">Full Day</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="half_day_morning" id="half_morning" />
                          <Label htmlFor="half_morning">Half Day (Morning)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="half_day_afternoon" id="half_afternoon" />
                          <Label htmlFor="half_afternoon">Half Day (Afternoon)</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          {/* Reason and Admin Notes */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Leave Information</h3>
              </div>

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Leave *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please provide detailed reason for the leave request..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="adminNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Notes (Internal)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Internal notes for HR/Admin use only..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="isEmergency"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Emergency Leave</FormLabel>
                        <p className="text-sm text-gray-600">
                          Check this if this is an emergency leave request
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notifyEmployee"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Notify Employee</FormLabel>
                        <p className="text-sm text-gray-600">
                          Send notification to employee about this leave assignment
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="skipApproval"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Skip Approval Process</FormLabel>
                        <p className="text-sm text-gray-600">
                          Automatically approve this leave request (Admin privilege)
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/hr/leave-management')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !selectedEmployee}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Assigning Leave...
                </>
              ) : (
                'Assign Leave'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AssignLeaveForm;
