"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ClipboardList, Plus, Trash2, MoveUp, MoveDown } from "lucide-react";
import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import { Input } from "components/ui/input";
import { Textarea } from "components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "components/ui/form";
import GoBack from "components/GoBack";
import { toast } from "sonner";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useQueryClient } from "@tanstack/react-query";
import { useGetLeaveTypes } from "../../controllers/leaveRequestController";
import { useGetWorkforces } from "../../controllers/workforceController";

const approverSchema = z.object({
  approverId: z.string().min(1, "Please select an approver"),
  userId: z.string().optional(),  // Store user ID for backend
  level: z.number(),
});

const workflowSchema = z.object({
  name: z.string().min(3, "Workflow name must be at least 3 characters"),
  leaveTypeId: z.string().min(1, "Please select a leave type"),
  description: z.string().optional(),
  approvers: z.array(approverSchema).min(1, "At least one approver is required"),
});

type FormData = z.infer<typeof workflowSchema>;

const WorkflowForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch leave types and employees
  const { data: leaveTypesData, isLoading: loadingTypes } = useGetLeaveTypes();
  const { data: employeesData, isLoading: loadingEmployees } = useGetWorkforces({ page: 1, size: 1000 });

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

  const employees = React.useMemo(() => {
    const rawData = Array.isArray(employeesData?.data)
      ? employeesData.data
      : Array.isArray(employeesData?.data?.results)
      ? employeesData.data.results
      : [];

    const mappedEmployees = rawData.map((emp: any) => {
      const fullName = emp.full_name || `${emp.legal_firstname || ''} ${emp.legal_lastname || ''}`.trim();
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Extract user ID - handle different response structures
      let userId = '';
      if (typeof emp.user === 'object' && emp.user?.id) {
        userId = emp.user.id;
      } else if (typeof emp.user === 'string') {
        userId = emp.user;
      }

      return {
        id: String(emp.id || ''),
        userId: String(userId),  // Extract user ID for workflow approver
        firstName: String(firstName),
        lastName: String(lastName),
        fullName: String(fullName || 'N/A'),
        employeeNumber: String(emp.serial_id_code || emp.employee_number || 'N/A'),
        email: String(emp.email || emp.user?.email || 'N/A'),
        department: String(typeof emp.department === 'object' ? emp.department?.name : emp.department || 'N/A'),
      };
    });

    // Debug log first 2 employees to see structure
    if (mappedEmployees.length > 0) {
      console.log('=== EMPLOYEE DATA SAMPLE ===');
      console.log('First employee:', mappedEmployees[0]);
      console.log('Raw first employee:', rawData[0]);
      console.log('===========================');
    }

    return mappedEmployees;
  }, [employeesData]);

  const form = useForm<FormData>({
    resolver: zodResolver(workflowSchema),
    defaultValues: {
      name: '',
      leaveTypeId: '',
      description: '',
      approvers: [{ approverId: '', level: 1 }],
    }
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "approvers",
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // Validate that all approvers have user IDs
      const invalidApprovers = data.approvers.filter(a => !a.userId && !a.approverId);
      if (invalidApprovers.length > 0) {
        toast.error("Some approvers don't have valid user IDs. Please select employees that have user accounts.");
        return;
      }

      const requestData = {
        name: data.name,
        leave_type: data.leaveTypeId,
        description: data.description || '',
        approvers: data.approvers.map((approver, index) => ({
          approver: approver.userId || approver.approverId,  // Send user ID (backend validates against User table)
          level: index + 1,
        })),
      };

      console.log('=== WORKFLOW CREATION DEBUG ===');
      console.log('Form data:', data);
      console.log('Approvers data:', data.approvers);
      console.log('Request payload:', JSON.stringify(requestData, null, 2));
      console.log('==============================');

      const response = await AxiosWithToken.post("hr/approval-workflows/", requestData);

      console.log('Workflow created successfully:', response.data);

      await queryClient.invalidateQueries({ queryKey: ["approval-workflows"] });

      toast.success("Approval workflow created successfully!");

      await new Promise(resolve => setTimeout(resolve, 500));
      router.push('/dashboard/hr/leave-management/workflows');

    } catch (error: any) {
      console.error('Error creating workflow:', error);

      const responseData = error.response?.data;
      let errorMessage = "Failed to create workflow. Please try again.";

      if (responseData) {
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

  if (loadingTypes || loadingEmployees) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
        <span className="ml-2">Loading form...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GoBack />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardList className="w-6 h-6" />
            Create Approval Workflow
          </h1>
          <p className="text-gray-600 mt-1">
            Define multi-level approval process for leave requests
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Workflow Information</h3>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workflow Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Standard Annual Leave Approval" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="leaveTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Leave Type *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a leave type" />
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
                    <FormDescription>
                      This workflow will apply to the selected leave type
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the approval workflow..."
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

          {/* Approval Levels */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Approval Levels</h3>
                  <p className="text-sm text-gray-600">
                    Add approvers in the order they should approve leave requests
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ approverId: '', level: fields.length + 1 })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Level
                </Button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <Card key={field.id} className="p-4 bg-gray-50">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col gap-2 pt-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => index > 0 && move(index, index - 1)}
                          disabled={index === 0}
                          className="h-8 w-8 p-0"
                        >
                          <MoveUp className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => index < fields.length - 1 && move(index, index + 1)}
                          disabled={index === fields.length - 1}
                          className="h-8 w-8 p-0"
                        >
                          <MoveDown className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                            {index + 1}
                          </div>
                          <span className="font-medium">Level {index + 1}</span>
                        </div>

                        <FormField
                          control={form.control}
                          name={`approvers.${index}.approverId`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Approver *</FormLabel>
                              <Select
                                value={field.value}
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  // Also set the userId when employee is selected
                                  const selectedEmployee = employees.find(emp => emp.id === value);
                                  if (selectedEmployee?.userId) {
                                    form.setValue(`approvers.${index}.userId`, selectedEmployee.userId);
                                  }
                                }}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select an approver" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="max-h-[200px] overflow-y-auto">
                                  {employees.length === 0 ? (
                                    <div className="p-4 text-center text-sm text-gray-500">
                                      No employees found
                                    </div>
                                  ) : (
                                    employees.map((employee) => (
                                      <SelectItem key={employee.id} value={employee.id}>
                                        {employee.employeeNumber} - {employee.fullName} ({employee.department})
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                        className="mt-8"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {fields.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No approval levels defined. Click "Add Level" to add an approver.
                </div>
              )}
            </div>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/hr/leave-management/workflows')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Workflow
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default WorkflowForm;
