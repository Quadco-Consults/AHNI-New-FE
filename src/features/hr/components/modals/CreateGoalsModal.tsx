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

export const GoalSchema = z.object({
  goal: z.array(
    z.object({
      goal: z.string().optional(),
      goal_group: z.string().optional(),
      weight: z.string().optional(),
    })
  ),
});

export type TGoalFormValues = z.infer<typeof GoalSchema>;

interface CreateGoalsModalProps {
  employeeId: string;
  onClose?: () => void;
}

const CreateGoalsModal = ({ employeeId, onClose }: CreateGoalsModalProps) => {
  console.log({ employeeId });

  const form = useForm<TGoalFormValues>({
    resolver: zodResolver(GoalSchema),
    defaultValues: {
      goal: [{ goal: "", goal_group: "", weight: "" }],
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
      goal_group: "",
      weight: "",
    });

  const onSubmit: SubmitHandler<TGoalFormValues> = async (data) => {
    console.log({ data });

    try {
      // TODO: Implement actual goal creation
      toast.success("Goals added successfully");
      onClose?.();
      form.reset();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

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
            <FormButton>Save</FormButton>

            <FormButton
              type="button"
              onClick={handleAddGoal}
              variant="outline"
              className="flex items-center gap-2"
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