"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import { CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";

import FormTextArea from "@/components/FormTextArea";
import {
  InterventionAreaSchema,
  TInterventionAreaData,
  TInterventionAreaFormValues,
} from "@/features/programs/types/program/intervention-area";
import {
  useAddInterventionArea,
  useUpdateInterventionArea,
} from "@/features/modules/controllers/program/interventionAreaController";

const AddInterventionArea = () => {
  const { dialogProps } = useAppSelector(dailogSelector);

  const data = dialogProps?.data as unknown as TInterventionAreaData;

  const form = useForm<TInterventionAreaFormValues>({
    resolver: zodResolver(InterventionAreaSchema),
    defaultValues: {
      code: data?.code ?? "",
      description: data?.description ?? "",
    },
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
            label='Code'
            name='code'
            placeholder='Enter Code'
            required
          />

          <FormTextArea
            label='Description'
            placeholder='Enter Description'
            name='description'
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
