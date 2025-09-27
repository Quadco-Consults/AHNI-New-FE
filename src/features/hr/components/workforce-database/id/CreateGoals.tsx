"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import { toast } from "sonner";
import { z } from "zod";

import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import FormButton from "@/components/FormButton";
import AddSquareIcon from "components/icons/AddSquareIcon";
import GoalForm from "./GoalForm";
import { useCreateGoal } from "../../controllers/goalsController";

export const GoalSchema = z.object({
  title: z.string().min(1, "Goal title is required"),
  description: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  status: z.enum(["not_started", "in_progress", "completed", "on_hold", "cancelled"]).optional(),
  narratives: z.array(
    z.object({
      description: z.string().min(1, "Narrative description is required"),
      weight: z.union([z.number(), z.string()]).transform((val) => {
        if (typeof val === 'string') {
          const parsed = parseInt(val, 10);
          return isNaN(parsed) ? 0 : parsed;
        }
        return val;
      }),
      completed: z.boolean().optional(),
    })
  ).min(1, "At least one narrative is required"),
});

export type TGoalFormValues = z.infer<typeof GoalSchema>;

const CreateGoalsModal = () => {
  const { dialogProps } = useAppSelector(dailogSelector);
  const dispatch = useAppDispatch();
  const { createGoal, isLoading, isSuccess, error } = useCreateGoal();

  const urlId = typeof dialogProps?.data === "string" ? dialogProps.data : "";
  console.log({ urlId });

  const form = useForm<TGoalFormValues>({
    resolver: zodResolver(GoalSchema),
    defaultValues: {
      title: "",
      description: "",
      start_date: "",
      end_date: "",
      status: "not_started",
      narratives: [{ description: "", weight: "100" as any, completed: false }],
    },
  });

  const { control } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "narratives",
  });

  const handleAddNarrative = () =>
    append({
      description: "",
      weight: "0" as any,
      completed: false,
    });

  const onSubmit: SubmitHandler<TGoalFormValues> = async (data) => {
    console.log({ data });

    if (!urlId) {
      toast.error("Employee ID is required");
      return;
    }

    try {
      // Transform narratives to ensure weights are numbers
      const transformedNarratives = data.narratives.map(narrative => ({
        description: narrative.description,
        weight: typeof narrative.weight === 'string'
          ? parseInt(narrative.weight as any, 10)
          : narrative.weight,
        completed: narrative.completed || false,
      }));

      // Validate total weight
      const totalWeight = transformedNarratives.reduce((sum, n) => sum + n.weight, 0);
      if (totalWeight !== 100) {
        toast.error(`Narrative weights must sum to exactly 100. Current sum: ${totalWeight}`);
        return;
      }

      await createGoal({
        employee: urlId,
        title: data.title,
        description: data.description || "",
        start_date: data.start_date,
        end_date: data.end_date,
        status: data.status || "not_started",
        narratives: transformedNarratives,
      });

      toast.success("Goal created successfully");
      dispatch(closeDialog());
      form.reset();
    } catch (error: any) {
      console.error("Goal creation error:", error);
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <CardContent>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-7'
        >
          <div className=''>
            <div className='h-full overflow-y-scroll'>
              <GoalForm fields={fields} remove={remove} />
            </div>
          </div>

          <div className='flex justify-between gap-4'>
            <FormButton disabled={isLoading}>
              {isLoading ? "Creating..." : "Save"}
            </FormButton>

            <FormButton
              type='button'
              onClick={handleAddNarrative}
              variant='outline'
              className='flex items-center gap-2'
            >
              <AddSquareIcon />
              Add narrative
            </FormButton>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

export default CreateGoalsModal;
