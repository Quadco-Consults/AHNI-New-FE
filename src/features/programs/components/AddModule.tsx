"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import { CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { closeDialog, dialogSelector } from "@/store/ui";
import FormTextArea from "@/components/FormTextArea";
import FormMultiSelect from "@/components/FormMultiSelect";
import { useAddModule, useUpdateModule } from "@/features/modules/controllers/project/moduleController";
import { ModuleData } from "@/features/modules/types/project";
import { useGetAllBudgetLinesQuery } from "@/features/modules/controllers/finance/budgetLineController";

const ModuleSchema = z.object({
  name: z.string().min(1, "Module name is required"),
  code: z.string().optional(),
  description: z.string().optional(),
  budget_lines: z.array(z.string()).optional(),
});

type ModuleFormValues = z.infer<typeof ModuleSchema>;

const AddModule = () => {
  const { dialogProps } = useAppSelector(dialogSelector);
  const data = dialogProps?.data as unknown as ModuleData;
  const isUpdateMode = dialogProps?.type === "update";

  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(ModuleSchema),
    defaultValues: {
      name: data?.name ?? "",
      code: data?.code ?? "",
      description: data?.description ?? "",
      budget_lines: data?.budget_lines ?? [],
    },
  });

  const dispatch = useAppDispatch();
  const [addModule, { isLoading: isAdding }] = useAddModule();
  const [updateModule, { isLoading: isUpdating }] = useUpdateModule();

  const { data: budgetLinesData } = useGetAllBudgetLinesQuery({
    page: 1,
    size: 1000,
  });

  const onSubmit: SubmitHandler<ModuleFormValues> = async (formData) => {
    try {
      if (isUpdateMode && data?.id) {
        await updateModule({ id: data.id, body: formData });
        toast.success("Module updated successfully");
      } else {
        await addModule(formData);
        toast.success("Module added successfully");
      }
      dispatch(closeDialog());
      form.reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? error.message ?? "Something went wrong");
    }
  };

  return (
    <CardContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            control={form.control}
            label="Module Name"
            name="name"
            placeholder="e.g., Program management, HIV Testing Services"
          />

          <FormInput
            control={form.control}
            label="Code"
            name="code"
            placeholder="e.g., PM, HTS"
          />

          <FormTextArea
            control={form.control}
            label="Description"
            name="description"
            placeholder="Brief description of the module"
          />

          <FormMultiSelect
            label="Budget Lines"
            name="budget_lines"
            placeholder="Select Budget Lines"
            options={budgetLinesData?.data?.results?.map((budgetLine: any) => ({
              label: budgetLine.name,
              value: budgetLine.id,
            })) ?? []}
          />

          <FormButton isLoading={isAdding || isUpdating} type="submit">
            {isUpdateMode ? "Update Module" : "Add Module"}
          </FormButton>
        </form>
      </Form>
    </CardContent>
  );
};

export default AddModule;
