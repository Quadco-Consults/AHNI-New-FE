"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Shield, Plus } from "lucide-react";
import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import { Input } from "components/ui/input";
import { Textarea } from "components/ui/textarea";
import { Checkbox } from "components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "components/ui/form";
import GoBack from "components/GoBack";
import { toast } from "sonner";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useQueryClient } from "@tanstack/react-query";
import { useGetLeaveTypes } from "../../controllers/leaveRequestController";

const policySchema = z.object({
  name: z.string().min(3, "Policy name must be at least 3 characters"),
  leaveTypeId: z.string().min(1, "Please select a leave type"),
  description: z.string().optional(),
  minNoticeDays: z.string().min(1, "Required"),
  maxConsecutiveDays: z.string().min(1, "Required"),
  requiresApproval: z.boolean(),
  requiresDocument: z.boolean(),
  allowCarryForward: z.boolean(),
  maxCarryForwardDays: z.string().optional(),
  proRateEntitlement: z.boolean(),
});

type FormData = z.infer<typeof policySchema>;

const PolicyForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch leave types
  const { data: leaveTypesData, isLoading: loadingTypes } = useGetLeaveTypes();

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

  const form = useForm<FormData>({
    resolver: zodResolver(policySchema),
    defaultValues: {
      name: '',
      leaveTypeId: '',
      description: '',
      minNoticeDays: '1',
      maxConsecutiveDays: '30',
      requiresApproval: true,
      requiresDocument: false,
      allowCarryForward: false,
      maxCarryForwardDays: '5',
      proRateEntitlement: false,
    }
  });

  const allowCarryForward = form.watch('allowCarryForward');

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const requestData = {
        name: data.name,
        leave_type: data.leaveTypeId,
        description: data.description || '',
        min_notice_days: parseInt(data.minNoticeDays),
        max_consecutive_days: parseInt(data.maxConsecutiveDays),
        requires_approval: data.requiresApproval,
        requires_document: data.requiresDocument,
        allow_carry_forward: data.allowCarryForward,
        max_carry_forward_days: data.allowCarryForward && data.maxCarryForwardDays
          ? parseInt(data.maxCarryForwardDays)
          : 0,
        pro_rate_entitlement: data.proRateEntitlement,
      };

      console.log('Creating policy:', requestData);

      await AxiosWithToken.post("hr/leave-policies/", requestData);

      await queryClient.invalidateQueries({ queryKey: ["leave-policies"] });

      toast.success("Leave policy created successfully!");

      await new Promise(resolve => setTimeout(resolve, 500));
      router.push('/dashboard/hr/leave-management/policies');

    } catch (error: any) {
      console.error('Error creating policy:', error);

      const responseData = error.response?.data;
      let errorMessage = "Failed to create policy. Please try again.";

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

  if (loadingTypes) {
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
            <Shield className="w-6 h-6" />
            Create Leave Policy
          </h1>
          <p className="text-gray-600 mt-1">
            Define rules and restrictions for leave types
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Policy Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Standard Annual Leave Policy" {...field} />
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
                            {typeof leaveType.name === 'string'
                              ? leaveType.name
                              : typeof leaveType.name === 'object' && leaveType.name?.name
                              ? leaveType.name.name
                              : leaveType.leave_type_name || 'Unknown Leave Type'}
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the policy rules and conditions..."
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

          {/* Policy Rules */}
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Policy Rules</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="minNoticeDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Notice (Days) *</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormDescription>
                        Days in advance required for leave request
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxConsecutiveDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Consecutive Days *</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormDescription>
                        Maximum days that can be taken at once
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="requiresApproval"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Requires Approval</FormLabel>
                        <FormDescription>
                          Leave requests must be approved before being granted
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requiresDocument"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Requires Supporting Document</FormLabel>
                        <FormDescription>
                          Employees must upload supporting documents
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="proRateEntitlement"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Pro-rate Entitlement</FormLabel>
                        <FormDescription>
                          Calculate leave days based on employment duration
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </Card>

          {/* Carry Forward Rules */}
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Carry Forward Rules</h3>

              <FormField
                control={form.control}
                name="allowCarryForward"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Allow Carry Forward</FormLabel>
                      <FormDescription>
                        Unused leave days can be carried to next year
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {allowCarryForward && (
                <FormField
                  control={form.control}
                  name="maxCarryForwardDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Carry Forward Days</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormDescription>
                        Maximum days that can be carried forward
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/hr/leave-management/policies')}
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
                  Create Policy
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PolicyForm;
