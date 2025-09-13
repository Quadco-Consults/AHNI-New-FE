"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, differenceInDays, addDays, parseISO, isWeekend } from "date-fns";
import { 
  CalendarDays, 
  Clock, 
  AlertCircle, 
  User, 
  FileText, 
  Upload,
  X,
  Search,
  Info,
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
import { Separator } from "components/ui/separator";
import GoBack from "components/GoBack";
import BackendStatusBanner from "./BackendStatusBanner";

import { LeaveType, LeaveRequestFormData } from "../../types/leave";
import { leaveService, useLeaveTypes, useLeaveBalances } from "../../services/leaveService";

// Enhanced validation schema for admin assign leave
const assignLeaveSchema = z.object({
  employeeId: z.string().min(1, "Please select an employee"),
  leaveTypeId: z.string().min(1, "Please select a leave type"),
  fromDate: z.string().min(1, "Please select start date"),
  toDate: z.string().min(1, "Please select end date"),
  duration: z.enum(['full_day', 'half_day_morning', 'half_day_afternoon', 'custom']),
  customHours: z.number().optional(),
  reason: z.string().min(5, "Please provide a reason (minimum 5 characters)"),
  adminNotes: z.string().optional(),
  isEmergency: z.boolean(),
  emergencyContactInfo: z.string().optional(),
  handoverNotes: z.string().optional(),
  backupPersonId: z.string().optional(),
  notifyEmployee: z.boolean(),
  skipApproval: z.boolean(),
  effectiveDate: z.string().optional(),
}).refine((data) => {
  const fromDate = new Date(data.fromDate);
  const toDate = new Date(data.toDate);
  return toDate >= fromDate;
}, {
  message: "End date must be after start date",
  path: ["toDate"]
});

interface Employee {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  position: string;
  email?: string;
}

const AssignLeaveForm = () => {
  const router = useRouter();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType | null>(null);
  const [calculatedDays, setCalculatedDays] = useState(0);
  const [workingDays, setWorkingDays] = useState(0);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  
  // API hooks
  const { leaveTypes, loading: loadingTypes, error: typesError } = useLeaveTypes();
  const { balances, loading: loadingBalances, error: balancesError } = useLeaveBalances(
    selectedEmployee?.id || ''
  );
  
  // Load employees
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const response = await leaveService.getEmployees();
        if (response.success) {
          setEmployees(response.data);
          setFilteredEmployees(response.data);
        }
      } catch (error) {
        console.error('Failed to load employees:', error);
      }
    };
    loadEmployees();
  }, []);

  // Filter employees based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(emp => 
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  }, [searchQuery, employees]);

  const form = useForm<LeaveRequestFormData & {
    employeeId: string;
    adminNotes: string;
    notifyEmployee: boolean;
    skipApproval: boolean;
    effectiveDate?: string;
  }>({
    resolver: zodResolver(assignLeaveSchema),
    defaultValues: {
      duration: 'full_day',
      isEmergency: false,
      reason: '',
      adminNotes: '',
      notifyEmployee: true,
      skipApproval: false,
    }
  });

  const { watch, setValue } = form;
  const watchedValues = watch();

  // Calculate days and validate when dates or employee change
  useEffect(() => {
    const validateLeave = async () => {
      const { fromDate, toDate, duration, leaveTypeId, employeeId } = watchedValues;
      if (fromDate && toDate && leaveTypeId && employeeId) {
        try {
          const response = await leaveService.validateLeaveRequest({
            employeeId,
            leaveTypeId,
            fromDate,
            toDate,
            duration: duration || 'full_day'
          });
          
          if (response.success) {
            setCalculatedDays(response.calculatedDays.totalDays);
            setWorkingDays(response.calculatedDays.workDaysCount);
            setValidationErrors(response.errors || []);
            setValidationWarnings(response.warnings || []);
          }
        } catch (error) {
          console.error('Validation error:', error);
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
    
    const timeoutId = setTimeout(validateLeave, 500);
    return () => clearTimeout(timeoutId);
  }, [watchedValues.fromDate, watchedValues.toDate, watchedValues.duration, watchedValues.leaveTypeId, watchedValues.employeeId]);

  // Handle employee selection
  const handleEmployeeSelect = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    setSelectedEmployee(employee || null);
    setValue('employeeId', employeeId);
    setSearchQuery('');
    
    // Clear validation messages when employee changes
    setValidationErrors([]);
    setValidationWarnings([]);
  };

  // Handle leave type selection
  const handleLeaveTypeChange = (leaveTypeId: string) => {
    const leaveType = leaveTypes.find(lt => lt.id === leaveTypeId);
    setSelectedLeaveType(leaveType || null);
    
    // Set default dates based on leave type requirements
    if (leaveType?.canApplyInAdvance && leaveType.advanceNoticeDays > 0) {
      const minFromDate = format(addDays(new Date(), leaveType.advanceNoticeDays), 'yyyy-MM-dd');
      setValue('fromDate', minFromDate);
    }
    
    // Clear validation messages when leave type changes
    setValidationErrors([]);
    setValidationWarnings([]);
  };

  // Handle file uploads
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    for (const file of files) {
      try {
        await leaveService.uploadAttachment(file);
      } catch (error) {
        console.error('File upload failed:', error);
        alert(`Failed to upload ${file.name}. Please try again.`);
        return;
      }
    }
    
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Submit form
  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      if (validationErrors.length > 0 && !data.skipApproval) {
        alert('Please fix validation errors or enable "Skip Approval" to override.');
        setIsSubmitting(false);
        return;
      }
      
      const requestData = {
        employeeId: data.employeeId,
        leaveTypeId: data.leaveTypeId,
        fromDate: data.fromDate,
        toDate: data.toDate,
        duration: data.duration === 'custom' ? 'full_day' : data.duration,
        reason: data.reason,
        workCoverage: {
          backupPersonId: data.backupPersonId,
          handoverNotes: data.handoverNotes,
          clientNotificationRequired: false
        },
        isEmergency: data.isEmergency,
        adminNotes: data.adminNotes,
        skipApproval: data.skipApproval,
        notifyEmployee: data.notifyEmployee,
        attachments: attachments.map(file => ({
          fileName: file.name,
          fileUrl: '',
          fileType: file.type
        }))
      };
      
      const response = await leaveService.createLeaveRequest(requestData);
      
      if (response.success) {
        alert(`Leave assigned successfully for ${selectedEmployee?.name}!`);
        router.push('/dashboard/hr/leave-management');
      } else {
        throw new Error('Failed to assign leave');
      }
      
    } catch (error) {
      console.error('Error assigning leave:', error);
      alert(error instanceof Error ? error.message : 'Failed to assign leave. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get leave balance for selected type
  const getLeaveBalance = (leaveTypeId: string) => {
    return balances.find(balance => balance.leaveTypeId === leaveTypeId);
  };
  
  // Show loading state
  if (loadingTypes) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
        <span className="ml-2">Loading assign leave form...</span>
      </div>
    );
  }
  
  // Show error state
  if (typesError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <p className="text-red-600">Failed to load leave information</p>
          <p className="text-sm text-gray-600">{typesError}</p>
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
                    <Select 
                      value={field.value} 
                      onValueChange={handleEmployeeSelect}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an employee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {filteredEmployees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{employee.name}</span>
                                <span className="text-xs text-gray-500">({employee.employeeId})</span>
                              </div>
                              <div className="text-xs text-gray-500">
                                {employee.department} - {employee.position}
                              </div>
                            </div>
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
                      <div className="font-semibold">{selectedEmployee.name}</div>
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
                      <div className="text-gray-600">Position</div>
                      <div className="font-semibold">{selectedEmployee.position}</div>
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
                        {leaveTypes.filter(lt => lt.isActive).map((leaveType) => (
                          <SelectItem key={leaveType.id} value={leaveType.id}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: leaveType.color }}
                              />
                              <span>{leaveType.name}</span>
                              <span className="text-sm text-gray-500">({leaveType.code})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Leave Balance Display */}
              {selectedLeaveType && selectedEmployee && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Employee Leave Balance</span>
                  </div>
                  {(() => {
                    const balance = getLeaveBalance(selectedLeaveType.id);
                    if (balance) {
                      return (
                        <div className="grid grid-cols-5 gap-4 text-sm">
                          <div>
                            <div className="text-gray-600">Entitled</div>
                            <div className="font-semibold">{balance.entitled} days</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Used</div>
                            <div className="font-semibold text-red-600">{balance.used} days</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Pending</div>
                            <div className="font-semibold text-amber-600">{balance.pending} days</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Scheduled</div>
                            <div className="font-semibold text-blue-600">{balance.scheduled} days</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Available</div>
                            <div className="font-semibold text-green-600">{balance.available} days</div>
                          </div>
                        </div>
                      );
                    }
                    return <p className="text-sm text-gray-600">No balance information available</p>;
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

          {/* Work Coverage */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Work Coverage</h3>
              </div>

              <FormField
                control={form.control}
                name="backupPersonId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Backup Person (Optional)</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select backup person" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employees
                          .filter(emp => emp.id !== selectedEmployee?.id)
                          .map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            <div>
                              <div>{employee.name}</div>
                              <div className="text-sm text-gray-500">{employee.department} - {employee.position}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                <h3 className="text-lg font-semibold">Attachments</h3>
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
              disabled={isSubmitting || workingDays === 0 || !selectedEmployee}
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