"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, DollarSign, FileText, Info, Save, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import GoBack from "@/components/GoBack";
import BackendStatusBanner from "./BackendStatusBanner";

import { LeavePackage } from "../../types/leave-package";
import { useCreateLeavePackage, useUpdateLeavePackage, useGetLeavePackage } from "../../controllers/hrLeavePackageController";

// Validation schema
const leaveTypeSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100, "Name must not exceed 100 characters"),
  number_of_days: z.number().min(0, "Number of days must be at least 0").max(365, "Number of days cannot exceed 365"),
  max_leave_days: z.number().min(0, "Max leave days must be at least 0").max(365, "Max leave days cannot exceed 365"),
  value_of_a_leave_day: z.number().min(0, "Value must be at least 0"),
  carry_forward: z.boolean(),
  is_convertible: z.boolean(),
  advance_notice_days: z.number().min(0, "Advance notice days must be at least 0").max(365, "Advance notice days cannot exceed 365").optional(),
  requires_approval: z.boolean().optional(),
  max_carry_forward_days: z.number().min(0, "Max carry forward days must be at least 0").max(365, "Max carry forward days cannot exceed 365").optional(),
  allow_negative_balance: z.boolean().optional(),
  is_active: z.boolean().optional(),
}).refine((data) => data.max_leave_days <= data.number_of_days, {
  message: "Max leave days cannot exceed total number of days",
  path: ["max_leave_days"]
}).refine((data) => !data.max_carry_forward_days || data.max_carry_forward_days <= data.number_of_days, {
  message: "Max carry forward days cannot exceed total number of days",
  path: ["max_carry_forward_days"]
});

type LeaveTypeFormData = z.infer<typeof leaveTypeSchema>;

interface LeaveTypeFormProps {
  leaveTypeId?: string;
  mode: "create" | "edit";
}

const LeaveTypeForm: React.FC<LeaveTypeFormProps> = ({ leaveTypeId, mode }) => {
  const router = useRouter();
  const isEditMode = mode === "edit" && !!leaveTypeId;

  // Fetch existing leave type if editing
  const { data: leaveTypeData, isLoading: loadingLeaveType } = useGetLeavePackage(
    leaveTypeId || "",
    isEditMode
  );
  const leaveType = leaveTypeData?.data;

  // Mutations
  const { createLeavePackage, isLoading: isCreating, isSuccess: createSuccess } = useCreateLeavePackage();
  const { updateLeavePackage, isLoading: isUpdating, isSuccess: updateSuccess } = useUpdateLeavePackage(leaveTypeId || "");

  const form = useForm<LeaveTypeFormData>({
    resolver: zodResolver(leaveTypeSchema),
    defaultValues: {
      name: "",
      number_of_days: 0,
      max_leave_days: 0,
      value_of_a_leave_day: 0,
      carry_forward: false,
      is_convertible: false,
      advance_notice_days: 0,
      requires_approval: true,
      max_carry_forward_days: 0,
      allow_negative_balance: false,
      is_active: true,
    }
  });

  const { reset } = form;

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && leaveType) {
      reset({
        name: leaveType.name,
        number_of_days: leaveType.number_of_days,
        max_leave_days: leaveType.max_leave_days,
        value_of_a_leave_day: leaveType.value_of_a_leave_day,
        carry_forward: leaveType.carry_forward,
        is_convertible: leaveType.is_convertible,
        advance_notice_days: leaveType.advance_notice_days || 0,
        requires_approval: leaveType.requires_approval ?? true,
        max_carry_forward_days: leaveType.max_carry_forward_days || 0,
        allow_negative_balance: leaveType.allow_negative_balance || false,
        is_active: leaveType.is_active ?? true,
      });
    }
  }, [leaveType, isEditMode, reset]);

  // Handle success
  useEffect(() => {
    if (createSuccess || updateSuccess) {
      toast.success(
        isEditMode
          ? "Leave type updated successfully!"
          : "Leave type created successfully!"
      );
      router.push("/dashboard/hr/leave-management/leave-types");
    }
  }, [createSuccess, updateSuccess, isEditMode, router]);

  const onSubmit = async (data: LeaveTypeFormData) => {
    try {
      if (isEditMode) {
        await updateLeavePackage(data);
      } else {
        await createLeavePackage(data);
      }
    } catch (error) {
      console.error("Leave type form error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to ${isEditMode ? 'update' : 'create'} leave type`
      );
    }
  };

  // Loading state
  if (isEditMode && loadingLeaveType) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
        <span className="ml-2">Loading leave type...</span>
      </div>
    );
  }

  const isSubmitting = isCreating || isUpdating;

  return (
    <div className="space-y-6">
      <GoBack />

      {/* Backend Status Banner */}
      <BackendStatusBanner />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold">
              {isEditMode ? "Edit Leave Type" : "Create Leave Type"}
            </h1>
          </div>
          <p className="text-gray-600">
            {isEditMode
              ? "Update leave type configuration"
              : "Configure a new leave type for your organization"
            }
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Basic Information</h3>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Leave Type Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Annual Leave, Sick Leave, Maternity Leave"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A descriptive name for this leave type
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          {/* Leave Allocation */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Leave Allocation</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="number_of_days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Number of Days per Year *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="365"
                          placeholder="e.g., 21"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Total days entitled per year
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="max_leave_days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Consecutive Days *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="365"
                          placeholder="e.g., 14"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Max days allowed in a single request
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </Card>

          {/* Financial Configuration */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Financial Configuration</h3>
              </div>

              <FormField
                control={form.control}
                name="value_of_a_leave_day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value of One Leave Day *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="e.g., 100.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Monetary value for conversion or compensation purposes
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          {/* Leave Policies */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Leave Policies</h3>
              </div>

              <div className="space-y-4">
                {/* Advance Notice Days */}
                <FormField
                  control={form.control}
                  name="advance_notice_days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Advance Notice Required (Days)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="365"
                          placeholder="e.g., 7"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Number of days in advance employees must request this leave type
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Max Carry Forward Days */}
                <FormField
                  control={form.control}
                  name="max_carry_forward_days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Carry Forward Days</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="365"
                          placeholder="e.g., 5"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum number of days that can be carried forward to next year (0 = no limit)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="carry_forward"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Allow Carry Forward</FormLabel>
                        <FormDescription>
                          Allow unused leave days to carry forward to the next year
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_convertible"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Convertible to Cash</FormLabel>
                        <FormDescription>
                          Allow employees to convert unused leave days to cash
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requires_approval"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Requires Approval</FormLabel>
                        <FormDescription>
                          Leave requests of this type require manager approval
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="allow_negative_balance"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Allow Negative Balance</FormLabel>
                        <FormDescription>
                          Allow employees to take leave even if they don't have enough balance
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Active</FormLabel>
                        <FormDescription>
                          Make this leave type available for employees to request
                        </FormDescription>
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
              onClick={() => router.push("/dashboard/hr/leave-management/leave-types")}
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[150px]"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditMode ? "Update Leave Type" : "Create Leave Type"}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LeaveTypeForm;
