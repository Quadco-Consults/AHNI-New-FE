"use client";

import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import FormButton from "@/components/FormButton";
import AddSquareIcon from "@/components/icons/AddSquareIcon";
import GoalForm from "@/features/hr/components/workforce-database/id/GoalForm";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import { useCreateMultipleGoals, CreateGoalPayload } from "@/features/hr/controllers/goalsController";
import { goalsStorage } from "@/features/hr/utils/goalsStorage";

export const GoalSchema = z.object({
  goal: z.array(
    z.object({
      goal: z.string().optional(),
      competency: z.string().optional(),
      weight: z.string().optional(),
    })
  ),
});

export type TGoalFormValues = z.infer<typeof GoalSchema>;

const CreateGoalsModal = () => {
  const { dialogProps } = useAppSelector(dailogSelector);
  const dispatch = useAppDispatch();
  const employeeId = dialogProps?.data as string;

  const { createMultipleGoals, isLoading: creatingGoals, isSuccess, error: createError } = useCreateMultipleGoals();

  console.log({ employeeId });

  const form = useForm<TGoalFormValues>({
    resolver: zodResolver(GoalSchema),
    defaultValues: {
      goal: [{ goal: "", competency: "", weight: "" }],
    },
  });

  const { control } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "goal",
  });

  const handleAddGoal = () =>
    append({
      goal: "",
      competency: "",
      weight: "",
    });

  const onSubmit: SubmitHandler<TGoalFormValues> = async (data) => {
    console.log({ data });

    if (!employeeId) {
      toast.error("Employee ID is required");
      return;
    }

    try {
      // Transform form data to API payload matching backend schema
      const goalsPayload: CreateGoalPayload[] = data.goal
        .filter(goal => goal.goal?.trim()) // Only include goals with content
        .map(goal => ({
          employee: employeeId,
          title: goal.goal || "",
          description: goal.competency || "",
          status: "pending",
          narratives: [{
            description: goal.goal || "",
            weight: parseFloat(goal.weight || "100"),
            completed: false
          }]
        }));

      if (goalsPayload.length === 0) {
        toast.error("Please add at least one goal");
        return;
      }

      console.log("Goals to create:", goalsPayload);

      // Try API first
      try {
        await createMultipleGoals(goalsPayload);
        // API success will be handled by the success handler below
      } catch (apiError: any) {
        console.log("API failed, falling back to local storage:", apiError);

        // Fallback to local storage - convert back to old format for storage compatibility
        const legacyGoalsPayload = goalsPayload.map(goal => ({
          goal: goal.title,
          competency: goal.description,
          weight: goal.narratives[0]?.weight.toString() || "100",
          employee_id: goal.employee,
        }));
        const savedGoals = goalsStorage.addGoals(employeeId, legacyGoalsPayload);

        if (savedGoals.length > 0) {
          toast.success("Goals added successfully (saved locally)");

          // Trigger custom event to notify other components
          window.dispatchEvent(new CustomEvent('goals-updated'));

          dispatch(closeDialog());
          form.reset();
        } else {
          toast.error("Failed to save goals");
        }
      }
    } catch (error: any) {
      console.error("Goal creation error:", error);
      toast.error("Something went wrong");
    }
  };

  // Handle API success
  if (isSuccess) {
    toast.success("Goals added successfully");
    dispatch(closeDialog());
    form.reset();
    // Trigger custom event to notify other components
    window.dispatchEvent(new CustomEvent('goals-updated'));
  }

  // Handle API error (this will be caught by the try-catch above)

  return (
    <CardContent>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-7"
        >
          <div className="">
            <div className="h-full overflow-y-scroll">
              <GoalForm fields={fields} remove={remove} />
            </div>
          </div>

          <div className="flex justify-between gap-4">
            <FormButton disabled={creatingGoals}>
              {creatingGoals ? "Saving..." : "Save"}
            </FormButton>

            <FormButton
              type="button"
              onClick={handleAddGoal}
              variant="outline"
              className="flex items-center gap-2"
              disabled={creatingGoals}
            >
              <AddSquareIcon />
              Add goal
            </FormButton>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

export default CreateGoalsModal;