"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  InterventionAreaSchema,
  TInterventionAreaData,
  TInterventionAreaFormValues,
} from "@/features/programs/types/program/intervention-area";
import {
  useAddInterventionArea,
  useUpdateInterventionArea,
} from "@/features/modules/controllers/program/interventionAreaController";
import { useGetAllBudgetLinesQuery } from "@/features/modules/controllers/finance/budgetLineController";

const AddInterventionArea = () => {
  const { dialogProps } = useAppSelector(dialogSelector);

  const data = dialogProps?.data as unknown as TInterventionAreaData;

  const form = useForm<TInterventionAreaFormValues>({
    resolver: zodResolver(InterventionAreaSchema),
    defaultValues: {
      name: data?.name ?? "",
      code: data?.code ?? "",
      description: data?.description ?? "",
      budget_lines: data?.budget_lines ?? [],
    },
  });

  const { data: budgetLinesData } = useGetAllBudgetLinesQuery({
    page: 1,
    size: 1000,
  });

  const dispatch = useAppDispatch();
  const [interventionArea, { isLoading }] = useAddInterventionArea();
  const [updateInterventionArea, { isLoading: updateRiskLoading }] =
    useUpdateInterventionArea();

  const onSubmit: SubmitHandler<TInterventionAreaFormValues> = async (data) => {
    try {
      dialogProps?.type === "update"
        ? await updateInterventionArea({
            //@ts-ignore
            id: String(dialogProps?.data?.id),
            body: data,
          })
        : await interventionArea(data);
      toast.success("Intervention Area Added Succesfully");
      dispatch(closeDialog());
      form.reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? error.message ?? "Something went wrong");
    }
  };

  return (
    <CardContent>
      <Form {...form}>
        <form
          action=''
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-y-7'
        >
          <FormInput
            label='Name'
            name='name'
            placeholder='Enter Name'
            required
          />

          <FormInput
            label='Code'
            name='code'
            placeholder='Enter Code'
          />

          <FormTextArea
            label='Description'
            placeholder='Enter Description'
            name='description'
          />

          <FormMultiSelect
            label='Budget Lines'
            name='budget_lines'
            placeholder='Select Budget Lines'
            options={budgetLinesData?.data?.results?.map((budgetLine: any) => ({
              label: budgetLine.name,
              value: budgetLine.id,
            })) ?? []}
          />

          <div className='flex justify-start gap-4'>
            <FormButton loading={isLoading || updateRiskLoading}>
              Save
            </FormButton>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

export default AddInterventionArea;
