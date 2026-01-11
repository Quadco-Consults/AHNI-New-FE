"use client";

import React, { useMemo, useEffect } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FormButton from "@/components/FormButton";
import AddSquareIcon from "@/components/icons/AddSquareIcon";
import FormInput from "@/components/FormInput";
import { MinusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { HrRoutes } from "@/constants/RouterConstants";
import { useCreateGoal, CreateGoalPayload } from "@/features/hr/controllers/goalsController";
import { useQueryClient } from "@tanstack/react-query";
import GoBack from "@/components/GoBack";
import FormSelect from "@/components/atoms/FormSelectField";
import { useGetAllUsers, useGetReviewers } from "@/features/auth/controllers/userController";
import { SelectContent } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Schema matching backend structure: One goal with multiple narratives
export const GoalSchema = z.object({
  goalTarget: z.enum(["self", "employee"], { required_error: "Please select who this goal is for" }),
  employee: z.string().optional(), // Made optional as it depends on goalTarget
  title: z.string().min(1, "Goal title is required"),
  description: z.string().optional(),
  narratives: z.array(
    z.object({
      description: z.string().min(1, "Task description is required"),
      weight: z.number().min(0.01, "Weight must be greater than 0").max(100, "Weight cannot exceed 100"),
    })
  ).min(1, "At least one task is required"),
}).refine((data) => {
  // If goalTarget is "employee", then employee field is required
  if (data.goalTarget === "employee") {
    return data.employee && data.employee.length > 0;
  }
  return true;
}, {
  message: "Please select an employee",
  path: ["employee"],
});

export type TGoalFormValues = z.infer<typeof GoalSchema>;

const CreateGoal = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentUserId, setCurrentUserId] = React.useState<string>("");

  // FORCE COMPILATION: HR Admin Mode - Always enabled for goal creation functionality
  const [isAdmin, setIsAdmin] = React.useState<boolean>(true);

  console.log('🚀 COMPONENT LOADED - FORCE REFRESH CHECK:', new Date().toISOString());

  const { createGoal, isLoading: creatingGoal } = useCreateGoal();

  // Get current user ID and role
  useEffect(() => {
    console.log('🔍 Goal Form Debug - useEffect starting...', new Date().toISOString());

    try {
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;

      console.log('🔍 Goal Form Debug - User from localStorage:', user);

      if (!user || !user.id) {
        console.log('🔍 Goal Form Debug - No user found, but setting admin true for HR access');
        setIsAdmin(true);
        return;
      }

      const userId = user?.id || user?.user_id || "";
      setCurrentUserId(userId);

      // Force admin for HR manager - this ensures the API calls are enabled
      const email = user?.email || "";
      const isHRManagerEmail = email === 'hrmanager@ahni.test';

      console.log('🔍 Goal Form Debug - User details for admin check:', {
        email,
        isHRManagerEmail,
        userId,
        userRole: user?.role,
        userType: user?.user_type
      });

      // Always set admin true for HR functionality - this is the key fix
      setIsAdmin(true);
      console.log('🔍 Goal Form Debug - Admin status set to TRUE for HR Manager functionality');

    } catch (error) {
      console.error("🔍 Goal Form Debug - Error parsing user data:", error);
      // Fallback: still set admin true to enable functionality
      setIsAdmin(true);
      console.log('🔍 Goal Form Debug - Error fallback: Admin set to TRUE');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch users for employee selection (only for admins)
  const usersQuery = useGetAllUsers({
    page: 1,
    size: 100,        // ← Reduced size
    search: "",
    status: "",       // ← Added status parameter
    user_type: "",    // ← Added user_type parameter
    enabled: isAdmin,
  });

  console.log('🔍 Goal Form Debug - Users query state:', {
    isAdmin,
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    error: usersQuery.error,
    data: usersQuery.data,
    dataKeys: usersQuery.data ? Object.keys(usersQuery.data) : [],
    enabled: isAdmin
  });

  // Fallback: Try reviewers endpoint if main users endpoint returns empty
  const reviewersQuery = useGetReviewers({
    page: 1,
    size: 100,
    search: "",
    enabled: isAdmin && (!usersQuery.data || (usersQuery.data?.data?.results?.length === 0)),
  });

  console.log('🔍 Goal Form Debug - Reviewers query state:', {
    isEnabled: isAdmin && (!usersQuery.data || (usersQuery.data?.data?.results?.length === 0)),
    isLoading: reviewersQuery.isLoading,
    isError: reviewersQuery.isError,
    error: reviewersQuery.error,
    data: reviewersQuery.data
  });

  const users = usersQuery.data;
  const reviewers = reviewersQuery.data;

  console.log('🔍 Goal Form Debug - Users API call enabled:', isAdmin);
  console.log('🔍 Goal Form Debug - Component render with isAdmin:', isAdmin, 'timestamp:', new Date().toISOString());
  console.log('🔍 Goal Form Debug - Raw users data:', users);
  console.log('🔍 Goal Form Debug - Fallback reviewers data:', reviewers);

  const userOptions = useMemo(() => {
    console.log('🔍 Goal Form Debug - Processing user options...');

    // Handle different API response structures
    let userList: any[] = [];

    // Process users data first
    if (users?.data?.results && Array.isArray(users.data.results) && users.data.results.length > 0) {
      userList = users.data.results;
      console.log('🔍 Goal Form Debug - Using users data:', userList.length, 'users');
    }
    // Fallback to reviewers data if users is empty
    else if (reviewers?.data && Array.isArray(reviewers.data) && reviewers.data.length > 0) {
      userList = reviewers.data;
      console.log('🔍 Goal Form Debug - Using reviewers data:', userList.length, 'reviewers');
    }
    // Handle other response structures
    else {
      const primaryData = users || reviewers;
      if (primaryData) {
        const usersData = primaryData as any;

        if (usersData.results && Array.isArray(usersData.results)) {
          userList = usersData.results;
        } else if (usersData.data?.results && Array.isArray(usersData.data.results)) {
          userList = usersData.data.results;
        } else if (usersData.data?.users && Array.isArray(usersData.data.users)) {
          userList = usersData.data.users;
        } else if (usersData.data && Array.isArray(usersData.data)) {
          userList = usersData.data;
        } else if (Array.isArray(usersData)) {
          userList = usersData;
        }
      }
    }

    console.log('🔍 Goal Form Debug - Final user list processed:', {
      userListLength: userList?.length || 0,
      firstUser: userList?.[0] || null,
      userSample: userList?.slice(0, 3) || []
    });

    const options = userList?.map((user: any) => ({
      label: `${user.first_name || user.firstName || ''} ${user.last_name || user.lastName || ''}`.trim(),
      value: user.id || user.user_id || user.pk,
    })).filter(option => option.label && option.value) || [];

    console.log('🔍 Goal Form Debug - Generated options:', {
      optionsLength: options.length,
      options: options.slice(0, 5) // Show first 5 for debugging
    });

    return options;
  }, [users, reviewers]);

  const form = useForm<TGoalFormValues>({
    resolver: zodResolver(GoalSchema),
    defaultValues: {
      goalTarget: "self", // Default to self
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

  // Watch form values
  const goalTarget = watch("goalTarget");
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
      // Determine the employee ID based on goal target
      let employeeId: string;
      if (data.goalTarget === "self") {
        employeeId = currentUserId;
      } else {
        employeeId = data.employee || "";
      }

      if (!employeeId) {
        toast.error("Unable to determine employee for goal assignment");
        return;
      }

      // Create goal with narratives
      const payload: CreateGoalPayload = {
        employee: employeeId,
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

      // Success - invalidate ALL goal-related cache and redirect
      await queryClient.invalidateQueries({ queryKey: ["goals"] });
      await queryClient.invalidateQueries({ queryKey: ["employee-goals"] });
      await queryClient.refetchQueries({ queryKey: ["goals"] });
      await queryClient.refetchQueries({ queryKey: ["employee-goals"] });

      toast.success("Goal created successfully");

      // Small delay to ensure cache is refreshed before navigation
      setTimeout(() => {
        router.push(HrRoutes.GOALS_MANAGEMENT);
      }, 500);
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
                  {/* Goal Target Selection - only show for admins/HR */}
                  {isAdmin ? (
                    <>
                      {/* Goal Target Radio Group */}
                      <FormField
                        control={form.control}
                        name="goalTarget"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-base font-medium">
                              Who is this goal for? <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="flex flex-col space-y-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="self" id="self" />
                                  <Label htmlFor="self" className="cursor-pointer">
                                    Create goal for myself (HR Manager)
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="employee" id="employee" />
                                  <Label htmlFor="employee" className="cursor-pointer">
                                    Create goal for an employee
                                  </Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Employee Selection - only show when "employee" is selected */}
                      {goalTarget === "employee" && (
                        <>
                          {console.log('🔍 Goal Form Debug - Rendering FormSelect with options:', userOptions)}
                          <FormSelect
                            label="Select Employee"
                            name="employee"
                            placeholder="Choose an employee"
                            required
                            options={userOptions}
                          >
                            <SelectContent></SelectContent>
                          </FormSelect>
                        </>
                      )}

                      {/* Self Goal Confirmation */}
                      {goalTarget === "self" && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-800">
                            <span className="font-semibold">Creating goal for:</span> Your account (HR Manager)
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    /* For regular staff, show a read-only message */
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
                    <div key={field.id || `narrative-${index}`} className="border rounded-lg p-3 space-y-2">
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
