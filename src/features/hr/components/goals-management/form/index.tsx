"use client";

import React, { useMemo, useEffect } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import FormButton from "@/components/FormButton";
import AddSquareIcon from "@/components/icons/AddSquareIcon";
import FormInput from "@/components/FormInput";
import { MinusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { HrRoutes } from "constants/RouterConstants";
import { useCreateGoal, CreateGoalPayload } from "@/features/hr/controllers/goalsController";
import { useQueryClient } from "@tanstack/react-query";
import GoBack from "components/GoBack";
import FormSelect from "components/atoms/FormSelectField";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { SelectContent } from "components/ui/select";

// Schema matching backend structure: One goal with multiple narratives
export const GoalSchema = z.object({
  employee: z.string().min(1, "Employee is required"),
  title: z.string().min(1, "Goal title is required"),
  description: z.string().optional(),
  narratives: z.array(
    z.object({
      description: z.string().min(1, "Task description is required"),
      weight: z.number().min(0.01, "Weight must be greater than 0").max(100, "Weight cannot exceed 100"),
    })
  ).min(1, "At least one task is required"),
});

export type TGoalFormValues = z.infer<typeof GoalSchema>;

const CreateGoal = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentUserId, setCurrentUserId] = React.useState<string>("");
  const [isAdmin, setIsAdmin] = React.useState<boolean>(false);

  const { createGoal, isLoading: creatingGoal } = useCreateGoal();

  // Get current user ID and role
  useEffect(() => {
    try {
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;

      const userId = user?.id || user?.user_id || "";
      const userRole = user?.role || user?.user_role || user?.is_staff === false ? 'admin' : '';
      const userGroups = user?.groups || user?.user_groups || [];
      const email = user?.email || "";
      const isStaff = user?.is_staff;
      const isSuperuser = user?.is_superuser;

      setCurrentUserId(userId);

      // Check if user is admin/HR
      // If email is admin@mail.com or is_superuser is true, treat as admin
      const isAdminUser = userRole === 'admin' ||
                          userRole === 'hr' ||
                          userRole === 'Admin' ||
                          userRole === 'HR' ||
                          email === 'admin@mail.com' ||
                          isSuperuser === true ||
                          isStaff === false ||
                          (Array.isArray(userGroups) && (
                            userGroups.includes('HR') ||
                            userGroups.includes('Admin') ||
                            userGroups.includes('admin') ||
                            userGroups.includes('hr')
                          ));

      setIsAdmin(isAdminUser);

      // For regular staff, pre-select current user
      if (!isAdminUser && userId) {
        form.setValue('employee', userId);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch users for employee selection (only for admins)
  const { data: users } = useGetAllUsers({
    page: 1,
    size: 10000,
    search: "",
    enabled: isAdmin,
  });

  const userOptions = useMemo(
    () => {
      // Try different possible structures
      const userList = users?.results || users?.data?.results || users?.data || [];

      const options = userList?.map((user: any) => ({
        label: `${user.first_name} ${user.last_name}`,
        value: user.id,
      })) || [];
      return options;
    },
    [users]
  );

  const form = useForm<TGoalFormValues>({
    resolver: zodResolver(GoalSchema),
    defaultValues: {
      employee: "",
      title: "",
      description: "",
      narratives: [{ description: "", weight: 100 }],
    },
    mode: "onChange", // Enable validation on change
  });

  const { control, watch } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "narratives",
  });

  const handleAddNarrative = () => {
    append({ description: "", weight: 0 });
  };

  // Calculate total weight from narratives
  const narratives = watch("narratives");
  const totalWeight = narratives?.reduce((sum, narrative) => {
    const weight = typeof narrative.weight === 'number' ? narrative.weight : 0;
    return sum + weight;
  }, 0) || 0;

  const onSubmit: SubmitHandler<TGoalFormValues> = async (data) => {
    // Validate total weight
    if (Math.abs(totalWeight - 100) > 0.01) {
      toast.error(`Task weights must equal 100%. Currently: ${totalWeight.toFixed(2)}%`);
      return;
    }

    try {
      // Create goal with narratives
      const payload: CreateGoalPayload = {
        employee: data.employee,
        title: data.title,
        description: data.description || "",
        status: "not_started",
        narratives: data.narratives.map(n => ({
          description: n.description,
          weight: n.weight,
          completed: false,
        })),
      };

      await createGoal(payload);

      // Success - invalidate cache and redirect
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast.success("Goal created successfully");
      router.push(HrRoutes.GOALS_MANAGEMENT);
    } catch (error: any) {
      console.error("Goal creation error:", error);
      toast.error(error?.message || "Failed to create goal");
    }
  };

  return (
    <div>
      <GoBack />

      <div className="pt-10">
        <h3 className="text-[18px] pb-10">
          {isAdmin ? 'Create New Goal' : 'Create My Goal'}
        </h3>

        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                {/* Goal Information */}
                <div className="space-y-3 border-b pb-4">
                  {/* Employee selection - only show for admins */}
                  {isAdmin && (
                    <FormSelect
                      label="Employee"
                      name="employee"
                      placeholder="Select employee"
                      required
                      options={userOptions}
                    >
                      <SelectContent></SelectContent>
                    </FormSelect>
                  )}

                  {/* For staff, show a read-only message */}
                  {!isAdmin && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <span className="font-semibold">Creating goal for:</span> Your account
                      </p>
                    </div>
                  )}

                  <FormInput
                    label="Goal Title"
                    name="title"
                    type="text"
                    placeholder="e.g., Improve Customer Satisfaction"
                    required
                  />

                  <FormInput
                    label="Description"
                    name="description"
                    type="text"
                    placeholder="e.g., Focus on enhancing customer experience and satisfaction"
                  />
                </div>

                {/* Weight indicator */}
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Tasks (Narratives)</h4>
                  <div className={`text-sm font-medium ${Math.abs(totalWeight - 100) < 0.01 ? 'text-green-600' : 'text-orange-600'}`}>
                    Total: {(totalWeight || 0).toFixed(1)}% {Math.abs(totalWeight - 100) < 0.01 ? '✓' : `(${(100 - (totalWeight || 0)).toFixed(1)}% remaining)`}
                  </div>
                </div>

                {/* Narrative fields */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Task {index + 1}</span>
                        {fields.length > 1 && (
                          <FormButton
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <MinusCircle className="h-4 w-4" />
                          </FormButton>
                        )}
                      </div>

                      <FormInput
                        label="Task Description"
                        name={`narratives.${index}.description`}
                        type="text"
                        placeholder="e.g., Respond to customer inquiries within 24 hours"
                        required
                      />

                      <FormInput
                        label="Weight (%)"
                        name={`narratives.${index}.weight`}
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        placeholder="25"
                        required
                      />
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex justify-between gap-4">
                  <FormButton
                    type="button"
                    onClick={handleAddNarrative}
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled={creatingGoal}
                  >
                    <AddSquareIcon />
                    Add Task
                  </FormButton>

                  <div className="flex gap-2">
                    <FormButton
                      type="button"
                      variant="outline"
                      onClick={() => router.push(HrRoutes.GOALS_MANAGEMENT)}
                      disabled={creatingGoal}
                    >
                      Cancel
                    </FormButton>
                    <FormButton
                      type="submit"
                      disabled={creatingGoal || Math.abs(totalWeight - 100) > 0.01}
                    >
                      {creatingGoal ? "Saving..." : "Create Goal"}
                    </FormButton>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateGoal;
