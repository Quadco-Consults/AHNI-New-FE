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

import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import { Badge } from "components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import { Textarea } from "components/ui/textarea";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { RadioGroup, RadioGroupItem } from "components/ui/radio-group";
import { Checkbox } from "components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form";
import GoBack from "components/GoBack";
import BackendStatusBanner from "./BackendStatusBanner";

import { useGetLeaveTypes } from "../../controllers/leaveRequestController";
import { useGetEmployeeOnboardings } from "../../controllers/employeeOnboardingController";
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data
  const { data: leaveTypesData, isLoading: loadingTypes, error: typesError } = useGetLeaveTypes();
  const { data: employeesData, isLoading: loadingEmployees } = useGetEmployeeOnboardings({ size: 100 });

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

    return rawData.map((emp: any) => ({
      id: String(emp.id || ''),
      firstName: String(emp.first_name || ''),
      lastName: String(emp.last_name || ''),
      employeeId: String(emp.employee_id || emp.id || ''),
      department: String(emp.department || 'N/A'),
      email: String(emp.email || '')
    }));
  }, [employeesData]);

  // Filter employees based on search
  const filteredEmployees = React.useMemo(() => {
    if (!searchQuery.trim()) return employees;

    const query = searchQuery.toLowerCase();
    return employees.filter(emp =>
      emp.firstName.toLowerCase().includes(query) ||
      emp.lastName.toLowerCase().includes(query) ||
      emp.employeeId.toLowerCase().includes(query) ||
      emp.department.toLowerCase().includes(query) ||
      emp.email.toLowerCase().includes(query)
    );
  }, [employees, searchQuery]);

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
  const selectedEmployee = employees.find(e => e.id === selectedEmployeeId);

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
        } catch (submitError) {
          console.error("Error submitting leave request:", submitError);
          // Continue even if submission fails - the leave is created
        }
      }

      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ["leave-requests"] });
      await queryClient.invalidateQueries({ queryKey: ["leave-dashboard"] });
      await queryClient.invalidateQueries({ queryKey: ["leave-balances"] });

      toast.success(`Leave assigned and submitted successfully for ${selectedEmployee?.firstName} ${selectedEmployee?.lastName}!`);

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

              {/* Employee Search */}
              <div className="space-y-2">
                <Label>Search Employee</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name, ID, or department..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an employee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {filteredEmployees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.firstName} {employee.lastName} ({employee.employeeId}) - {employee.department}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
