"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Users, Calendar, FileText, Plus } from "lucide-react";
import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import { Input } from "components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "components/ui/form";
import GoBack from "components/GoBack";
import FormButton from "@/components/FormButton";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useGetWorkforces } from "../../controllers/workforceController";
import { useGetLeaveTypes } from "../../controllers/leaveRequestController";
import { useAssignLeaveBalance } from "../../controllers/leaveBalanceController";

// Validation Schema
const assignEntitlementSchema = z.object({
  employee: z.string().min(1, "Please select an employee"),
  leave_type: z.string().min(1, "Please select a leave type"),
  year: z.string().min(1, "Please enter the year"),
  entitled: z.string().min(1, "Please enter entitled days"),
});

type AssignEntitlementFormData = z.infer<typeof assignEntitlementSchema>;

const AssignEntitlementForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentYear = new Date().getFullYear();

  // Fetch employees from workforce
  const { data: employeesData, isLoading: loadingEmployees } = useGetWorkforces({ page: 1, size: 100 });
  const employees = React.useMemo(() => {
    const rawData = Array.isArray(employeesData?.data)
      ? employeesData.data
      : Array.isArray(employeesData?.data?.results)
      ? employeesData.data.results
      : [];

    return rawData.map((emp: any) => {
      const fullName = emp.full_name || `${emp.legal_firstname || ''} ${emp.legal_lastname || ''}`.trim();
      return {
        id: emp.id,
        fullName: fullName || 'N/A',
        employeeNumber: emp.serial_id_code || emp.employee_number || 'N/A',
        email: emp.email || emp.user?.email || 'N/A',
        department: typeof emp.department === 'object' ? emp.department?.name : emp.department || 'N/A',
      };
    });
  }, [employeesData]);

  // Fetch leave types
  const { data: leaveTypesData, isLoading: loadingTypes } = useGetLeaveTypes();
  const leaveTypes = Array.isArray(leaveTypesData?.data)
    ? leaveTypesData.data
    : Array.isArray(leaveTypesData?.data?.results)
    ? leaveTypesData.data.results
    : [];

  // Assign mutation
  const { assignLeaveBalance, isLoading: isAssigning, isSuccess } = useAssignLeaveBalance();

  const form = useForm<AssignEntitlementFormData>({
    resolver: zodResolver(assignEntitlementSchema),
    defaultValues: {
      employee: "",
      leave_type: "",
      year: currentYear.toString(),
      entitled: "",
    },
  });

  const onSubmit = async (data: AssignEntitlementFormData) => {
    try {
      await assignLeaveBalance({
        employee: data.employee,
        leave_type: data.leave_type,
        year: parseInt(data.year),
        entitled: parseFloat(data.entitled),
      });

      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ["all-leave-balances"] });
      await queryClient.invalidateQueries({ queryKey: ["employee-leave-balance"] });

      toast.success("Leave entitlement assigned successfully!");
      router.push("/dashboard/hr/leave-management/entitlements");
    } catch (error: any) {
      console.error("Assignment error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to assign entitlement";
      toast.error(errorMessage);
    }
  };

  if (loadingEmployees || loadingTypes) {
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

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Plus className="w-6 h-6" />
            Assign Leave Entitlement
          </h1>
          <p className="text-gray-600 mt-1">
            Assign leave balance to an employee for a specific leave type
          </p>
        </div>
      </div>

      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Employee Selection */}
            <FormField
              control={form.control}
              name="employee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[300px]">
                      {employees.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500">
                          No employees found
                        </div>
                      ) : (
                        employees.map((emp: any) => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.employeeNumber} - {emp.fullName} ({emp.department})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the employee to assign leave entitlement
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Leave Type Selection */}
            <FormField
              control={form.control}
              name="leave_type"
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
                      {leaveTypes.map((type: any) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the type of leave to assign
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Year */}
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="2024" {...field} />
                    </FormControl>
                    <FormDescription>
                      Year for this entitlement
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Entitled Days */}
              <FormField
                control={form.control}
                name="entitled"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entitled Days *</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.5" placeholder="21" {...field} />
                    </FormControl>
                    <FormDescription>
                      Number of days entitled
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/hr/leave-management/entitlements")}
              >
                Cancel
              </Button>
              <FormButton
                loading={isAssigning}
                disabled={isAssigning}
                type="submit"
              >
                <Plus className="w-4 h-4 mr-2" />
                Assign Entitlement
              </FormButton>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AssignEntitlementForm;
