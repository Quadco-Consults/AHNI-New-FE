"use client";

import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import FormButton from "@/components/FormButton";
import AddSquareIcon from "@/components/icons/AddSquareIcon";
import FormInput from "@/components/FormInput";
import { MinusCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import { useCreateGoal, CreateGoalPayload } from "@/features/hr/controllers/goalsController";
import { useQueryClient } from "@tanstack/react-query";

// Schema matching backend structure: One goal with multiple narratives
export const GoalSchema = z.object({
  title: z.string().min(1, "Goal title is required"),
  description: z.string().optional(),
  narratives: z.array(
    z.object({
      description: z.string().min(1, "Narrative description is required"),
      weight: z.number().min(0.01, "Weight must be greater than 0").max(100, "Weight cannot exceed 100"),
    })
  ).min(1, "At least one narrative is required"),
});

export type TGoalFormValues = z.infer<typeof GoalSchema>;

const CreateGoalsModal = () => {
  const { dialogProps } = useAppSelector(dailogSelector);
  const dispatch = useAppDispatch();
  const employeeId = dialogProps?.data as string;
  const queryClient = useQueryClient();

  const { createGoal, isLoading: creatingGoals } = useCreateGoal();

  const form = useForm<TGoalFormValues>({
    resolver: zodResolver(GoalSchema),
    defaultValues: {
      title: "",
      description: "",
      narratives: [{ description: "", weight: 100 }],
    },
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
  const totalWeight = narratives?.reduce((sum, narrative) => sum + (narrative.weight || 0), 0) || 0;

  const onSubmit: SubmitHandler<TGoalFormValues> = async (data) => {
    if (!employeeId) {
      toast.error("Employee ID is required");
      return;
    }

    // Validate total weight
    if (Math.abs(totalWeight - 100) > 0.01) {
      toast.error(`Narrative weights must equal 100%. Currently: ${totalWeight.toFixed(2)}%`);
      return;
    }

    try {
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

      // Success - invalidate cache and close
      queryClient.invalidateQueries({ queryKey: ["employee-goals", employeeId] });
      toast.success("Goal created successfully");
      dispatch(closeDialog());
      form.reset();
      window.dispatchEvent(new CustomEvent('goals-updated'));
    } catch (error: any) {
      console.error("Goal creation error:", error);
      toast.error(error?.message || "Failed to create goal");
    }
  };

  return (
    <CardContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* Goal Information */}
          <div className="space-y-3 border-b pb-4">
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
            <h4 className="font-semibold">Narratives (Tasks)</h4>
            <div className={`text-sm font-medium ${Math.abs(totalWeight - 100) < 0.01 ? 'text-green-600' : 'text-orange-600'}`}>
              Total: {totalWeight.toFixed(1)}% {Math.abs(totalWeight - 100) < 0.01 ? '✓' : `(${(100 - totalWeight).toFixed(1)}% remaining)`}
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
              disabled={creatingGoals}
            >
              <AddSquareIcon />
              Add Task
            </FormButton>

            <div className="flex gap-2">
              <FormButton
                type="button"
                variant="outline"
                onClick={() => dispatch(closeDialog())}
                disabled={creatingGoals}
              >
                Cancel
              </FormButton>
              <FormButton
                type="submit"
                disabled={creatingGoals || Math.abs(totalWeight - 100) > 0.01}
              >
                {creatingGoals ? "Saving..." : "Save Goal"}
              </FormButton>
            </div>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

export default CreateGoalsModal;