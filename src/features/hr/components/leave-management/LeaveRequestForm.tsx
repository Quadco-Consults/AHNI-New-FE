"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, differenceInDays, addDays, parseISO, isSameDay, isWeekend } from "date-fns";
import { 
  CalendarDays, 
  Clock, 
  AlertCircle, 
  User, 
  FileText, 
  Upload,
  X,
  Plus,
  Info
} from "lucide-react";

import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import { Badge } from "components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import FormSelect from "components/atoms/FormSelectField";
import { Textarea } from "components/ui/textarea";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { RadioGroup, RadioGroupItem } from "components/ui/radio-group";
import { Checkbox } from "components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form";
import { Separator } from "components/ui/separator";
import GoBack from "components/GoBack";
import BackendStatusBanner from "./BackendStatusBanner";

import { LeaveType, LeaveRequestFormData } from "../../types/leave";
import { leaveService, useLeaveTypes as useLeaveTypesService, useLeaveBalances as useLeaveBalancesService } from "../../services/leaveService";
import {
  useCreateLeaveRequest,
  useValidateLeaveRequest,
  useGetLeaveTypes,
  useGetLeaveBalances
} from "../../controllers/leaveRequestController";
import { useGetEmployeeOnboardings } from "../../controllers/employeeOnboardingController";
import { useGetUserProfile } from "@/features/auth/controllers/userController";
import { toast } from "sonner";

// Validation Schema
const leaveRequestSchema = z.object({
  leaveTypeId: z.string().min(1, "Please select a leave type"),
  fromDate: z.string().min(1, "Please select start date"),
  toDate: z.string().min(1, "Please select end date"),
  duration: z.enum(['full_day', 'half_day_morning', 'half_day_afternoon', 'custom']),
  customHours: z.number().optional(),
  reason: z.string().min(5, "Please provide a reason (minimum 5 characters)"),
  isEmergency: z.boolean(),
  emergencyContactInfo: z.string().optional(),
  handoverNotes: z.string().optional(),
  backupPersonId: z.string().optional(),
  approverId: z.string().min(1, "Please select an approver"),
}).refine((data) => {
  const fromDate = new Date(data.fromDate);
  const toDate = new Date(data.toDate);
  return toDate >= fromDate;
}, {
  message: "End date must be after start date",
  path: ["toDate"]
});


const EnhancedLeaveRequestForm = () => {
  const router = useRouter();
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType | null>(null);
  const [calculatedDays, setCalculatedDays] = useState(0);
  const [workingDays, setWorkingDays] = useState(0);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);

  // Get current user from auth
  const { data: userProfileData } = useGetUserProfile();
  const currentEmployeeId = userProfileData?.data?.id || "";

  // API hooks from controller (backend gets employee from request.user.employee)
  const { data: leaveTypesData, isLoading: loadingTypes, error: typesError } = useGetLeaveTypes();
  const { data: balancesData, isLoading: loadingBalances, error: balancesError } = useGetLeaveBalances();
  const { data: employeesData, isLoading: loadingEmployees } = useGetEmployeeOnboardings({ size: 100 });
  const { createLeaveRequest, isLoading: isCreating } = useCreateLeaveRequest();
  const { validateLeaveRequest, data: validationData, isLoading: isValidating } = useValidateLeaveRequest();

  // Extract data from API responses
  const leaveTypes = Array.isArray(leaveTypesData?.data)
    ? leaveTypesData.data
    : Array.isArray(leaveTypesData?.data?.results)
    ? leaveTypesData.data.results
    : [];

  // Debug: Log leave types to see structure
  console.log('Leave types:', leaveTypes);
  if (leaveTypes.length > 0) {
    console.log('First leave type:', JSON.stringify(leaveTypes[0], null, 2));
  }

  const balances = Array.isArray(balancesData?.data)
    ? balancesData.data
    : Array.isArray(balancesData?.data?.results)
    ? balancesData.data.results
    : [];

  console.log('Balances:', balances);
  if (balances.length > 0) {
    console.log('First balance:', JSON.stringify(balances[0], null, 2));
  }

  // Extract employees from API response
  const employees = Array.isArray(employeesData?.data)
    ? employeesData.data.map((emp: any) => ({
        id: emp.id,
        name: `${emp.first_name} ${emp.last_name}`,
        department: emp.department || 'N/A',
        employeeId: emp.employee_id || emp.id,
        position: emp.position || emp.job_title || 'N/A'
      }))
    : Array.isArray(employeesData?.data?.results)
    ? employeesData.data.results.map((emp: any) => ({
        id: emp.id,
        name: `${emp.first_name} ${emp.last_name}`,
        department: emp.department || 'N/A',
        employeeId: emp.employee_id || emp.id,
        position: emp.position || emp.job_title || 'N/A'
      }))
    : [];

  // Show all employees for now (remove filtering until we can validate with real data)
  console.log('🔍 DEBUGGING APPROVERS - All employees:', employees);
  console.log('🔍 DEBUGGING APPROVERS - Employee count:', employees.length);

  // Create employee options for FormSelect with search (all employees for now)
  const employeeOptions = employees.map((employee) => ({
    label: `${employee.name} (${employee.department} - ${employee.position})`,
    value: employee.id,
  }));

  console.log('🔍 DEBUGGING APPROVERS - Employee options:', employeeOptions);

  // TODO: Re-implement filtering once we can verify with authenticated user data
  // For now, allow any employee to be selected as approver
  // The backend should handle validation of whether the selected approver is valid

  console.log('Employees:', employees);
  if (employees.length > 0) {
    console.log('First employee:', JSON.stringify(employees[0], null, 2));
  }

  const form = useForm<LeaveRequestFormData>({
    resolver: zodResolver(leaveRequestSchema),
    defaultValues: {
      duration: 'full_day',
      isEmergency: false,
      reason: '',
    }
  });

  const { watch, setValue } = form;
  const watchedValues = watch();

  // Calculate days and validate when dates change
  useEffect(() => {
    const validateLeave = async () => {
      const { fromDate, toDate, duration, leaveTypeId } = watchedValues;
      if (fromDate && toDate && leaveTypeId) {
        try {
          // Use controller hook - backend gets employee from request.user.employee
          const result = await validateLeaveRequest({
            leaveTypeId,
            fromDate,
            toDate,
            duration: duration || 'full_day'
          });

          if (result?.success) {
            setCalculatedDays(result.calculatedDays.totalDays);
            setWorkingDays(result.calculatedDays.workDaysCount);
            setValidationErrors(result.errors || []);
            setValidationWarnings(result.warnings || []);
          }
        } catch (error) {
          console.error('Validation error:', error);
          toast.error('Failed to validate leave request. Using fallback calculation.');
          // Fallback to client-side calculation
          const start = parseISO(fromDate);
          const end = parseISO(toDate);
          const totalDays = differenceInDays(end, start) + 1;
          
          let workDays = 0;
          for (let i = 0; i < totalDays; i++) {
            const currentDate = addDays(start, i);
            if (!isWeekend(currentDate)) {
              workDays += duration === 'full_day' ? 1 : 0.5;
            }
          }
          
          setCalculatedDays(totalDays);
          setWorkingDays(workDays);
        }
      }
    };
    
    const timeoutId = setTimeout(validateLeave, 500); // Debounce validation
    return () => clearTimeout(timeoutId);
  }, [watchedValues.fromDate, watchedValues.toDate, watchedValues.duration, watchedValues.leaveTypeId, currentEmployeeId]);

  // Handle leave type selection
  const handleLeaveTypeChange = (leaveTypeId: string) => {
    const leaveType = leaveTypes.find(lt => lt.id === leaveTypeId);
    setSelectedLeaveType(leaveType || null);

    // Clear validation messages when leave type changes
    setValidationErrors([]);
    setValidationWarnings([]);
  };

  // Handle file uploads
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Upload files to backend immediately
    for (const file of files) {
      try {
        // You might want to show upload progress here
        await leaveService.uploadAttachment(file);
      } catch (error) {
        console.error('File upload failed:', error);
        toast.error(`Failed to upload ${file.name}. Please try again.`);
        return;
      }
    }
    
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Submit form
  const onSubmit = async (data: LeaveRequestFormData) => {
    setIsSubmitting(true);

    try {
      // Final validation check
      if (validationErrors.length > 0) {
        toast.error('Please fix validation errors before submitting');
        setIsSubmitting(false);
        return;
      }

      // Prepare request data - backend uses snake_case and gets employee from request.user.employee
      const requestData = {
        leave_type: data.leaveTypeId,
        from_date: data.fromDate,
        to_date: data.toDate,
        duration: data.duration === 'custom' ? 'full_day' : data.duration,
        reason: data.reason,
        is_emergency: data.isEmergency || false,
        approver: data.approverId,
        ...(data.backupPersonId && { backup_person: data.backupPersonId }),
        ...(data.handoverNotes && { handover_notes: data.handoverNotes })
      };

      await createLeaveRequest(requestData);
      toast.success('Leave request submitted successfully!');
      router.push('/dashboard/hr/leave-management');
      
    } catch (error) {
      console.error('Error submitting leave request:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit leave request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get leave balance for selected type
  const getLeaveBalance = (leaveTypeId: string) => {
    return balances.find(balance => balance.leaveTypeId === leaveTypeId);
  };
  
  // Show loading state
  if (loadingTypes || loadingBalances) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
        <span className="ml-2">Loading leave form...</span>
      </div>
    );
  }
  
  // Show error state
  if (typesError || balancesError) {
    const errorMessage = typesError instanceof Error
      ? typesError.message
      : balancesError instanceof Error
      ? balancesError.message
      : String(typesError || balancesError || "Unknown error");

    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
          <p className="text-destructive">Failed to load leave information</p>
          <p className="text-body-sm text-gray-text">{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GoBack />
      
      {/* Backend Status Banner */}
      <BackendStatusBanner />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-1">Apply for Leave</h1>
          <p className="text-gray-text">Submit a new leave request</p>
        </div>
        <Badge variant="outline" className="text-sm">
          <CalendarDays className="w-4 h-4 mr-1" />
          {format(new Date(), 'MMM dd, yyyy')}
        </Badge>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Leave Type Selection */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <h3 className="text-heading-3">Leave Details</h3>
              </div>

              <FormField
                control={form.control}
                name="leaveTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Leave Type *</FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleLeaveTypeChange(value);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select leave type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {leaveTypes.filter(lt => lt.is_active !== false).map((leaveType) => {
                          const displayName = typeof leaveType.name === 'string'
                            ? leaveType.name
                            : typeof leaveType.name === 'object' && leaveType.name?.name
                            ? leaveType.name.name
                            : typeof leaveType.leave_type_name === 'string'
                            ? leaveType.leave_type_name
                            : 'Unknown';

                          return (
                            <SelectItem key={leaveType.id} value={leaveType.id}>
                              <div className="flex items-center gap-2">
                                <span>{displayName}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Leave Balance Display */}
              {selectedLeaveType && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Leave Balance</span>
                  </div>
                  {(() => {
                    const balance = getLeaveBalance(selectedLeaveType.id);
                    if (balance) {
                      // Ensure values are numbers, not objects
                      const entitled = typeof balance.entitled === 'number' ? balance.entitled : 0;
                      const used = typeof balance.used === 'number' ? balance.used : 0;
                      const pending = typeof balance.pending === 'number' ? balance.pending : 0;
                      const scheduled = typeof balance.scheduled === 'number' ? balance.scheduled : 0;
                      const available = typeof balance.available === 'number' ? balance.available : 0;

                      return (
                        <div className="grid grid-cols-5 gap-4 text-body-sm">
                          <div>
                            <div className="text-gray-text">Entitled</div>
                            <div className="font-semibold">{entitled} days</div>
                          </div>
                          <div>
                            <div className="text-gray-text">Used</div>
                            <div className="font-semibold text-destructive">{used} days</div>
                          </div>
                          <div>
                            <div className="text-gray-text">Pending</div>
                            <div className="font-semibold text-amber-600">{pending} days</div>
                          </div>
                          <div>
                            <div className="text-gray-text">Scheduled</div>
                            <div className="font-semibold text-blue-600">{scheduled} days</div>
                          </div>
                          <div>
                            <div className="text-gray-text">Available</div>
                            <div className="font-semibold text-green-600">{available} days</div>
                          </div>
                        </div>
                      );
                    }
                    return <p className="text-body-sm text-gray-text">No balance information available</p>;
                  })()}
                </div>
              )}
            </div>
          </Card>

          {/* Date Selection */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5" />
                <h3 className="text-heading-3">Duration & Dates</h3>
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

              {/* Days Summary */}
              {calculatedDays > 0 && (
                <div className="bg-gray-50 border rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Total Days</div>
                      <div className="font-semibold">{calculatedDays} days</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Working Days</div>
                      <div className="font-semibold">{workingDays} days</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Weekends</div>
                      <div className="font-semibold">{calculatedDays - Math.ceil(workingDays)} days</div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Validation Messages */}
              {(validationErrors.length > 0 || validationWarnings.length > 0) && (
                <div className="space-y-2">
                  {validationErrors.map((error, index) => (
                    <div key={index} className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-800">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                      </div>
                    </div>
                  ))}
                  {validationWarnings.map((warning, index) => (
                    <div key={index} className="bg-amber-50 border border-amber-200 rounded p-3 text-sm text-amber-800">
                      <div className="flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        <span>{warning}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Reason and Details */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <h3 className="text-heading-3">Additional Information</h3>
              </div>

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Leave *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please provide detailed reason for your leave request..."
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
                      <FormLabel>
                        Emergency Leave
                      </FormLabel>
                      <p className="text-sm text-gray-600">
                        Check this if this is an emergency leave request
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              {watchedValues.isEmergency && (
                <FormField
                  control={form.control}
                  name="emergencyContactInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Information</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Contact number where you can be reached"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </Card>

          {/* Work Coverage */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <h3 className="text-heading-3">Work Coverage</h3>
              </div>

              <FormField
                control={form.control}
                name="backupPersonId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Backup Person (Optional)</FormLabel>
                    <FormSelect
                      name="backupPersonId"
                      placeholder="Select backup person"
                      options={employeeOptions}
                      searchPlaceholder="Search employees by name, department, or position..."
                      emptyMessage="No employees found matching your search."
                      onValueChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="approverId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Leave Approver *</FormLabel>
                    <FormSelect
                      name="approverId"
                      placeholder="Select who will approve this leave request"
                      options={employeeOptions}
                      searchPlaceholder="Search approvers by name, department, or position..."
                      emptyMessage="No approvers found matching your search."
                      required={true}
                      onValueChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="handoverNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Handover Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide instructions for pending work, important contacts, or tasks that need attention..."
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          {/* Attachments */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                <h3 className="text-heading-3">Attachments</h3>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload supporting documents (medical certificates, etc.)
                  </p>
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    Choose Files
                  </Button>
                </div>
              </div>

              {/* Attachment List */}
              {attachments.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Attached Files:</p>
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded p-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
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
              disabled={isSubmitting || workingDays === 0 || validationErrors.length > 0}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EnhancedLeaveRequestForm;