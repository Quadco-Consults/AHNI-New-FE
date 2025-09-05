"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import { CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import { toast } from "sonner";
import {
  PrequalificationCriteriaSchema,
  TPrequalificationCriteriaData,
  TPrequalificationCriteriaFormValues,
} from "@/features/procurement/types/procurement/prequalification-criteria";
import {
  useAddPrequalificationCriteria,
  useUpdatePrequalificationCriteria,
} from "@/features/modules/controllers/procurement/prequalificationCriteriaController";
import FormTextArea from "@/components/FormTextArea";

const AddPrequalificationCriteria = () => {
  const { dialogProps } = useAppSelector(dailogSelector);

  const data = dialogProps?.data as unknown as TPrequalificationCriteriaData;

  const form = useForm<TPrequalificationCriteriaFormValues>({
    resolver: zodResolver(PrequalificationCriteriaSchema),
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
      category: data?.category ?? "",
    },
  });

  const [prequalificationCriteria, { isLoading }] =
    useAddPrequalificationCriteria();
  const [
    updatePrequalificationCriteria,
    { isLoading: updatePrequalificationCriteriaLoading },
  ] = useUpdatePrequalificationCriteria();

  const dispatch = useAppDispatch();
  const onSubmit: SubmitHandler<TPrequalificationCriteriaFormValues> = async (
    data
  ) => {
    try {
      dialogProps?.type === "update"
        ? await updatePrequalificationCriteria({
            //@ts-ignore
            id: String(dialogProps?.data?.id),
            body: data,
          })
        : await prequalificationCriteria(data);
      toast.success("Pre-qualification Criteria Added Succesfully");
      dispatch(closeDialog());
      form.reset();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ?? error.message ?? "Something went wrong"
      );
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

          <FormTextArea
            label='Description'
            placeholder='Enter Description'
            name='description'
            required
          />

          <FormInput
            label='Category'
            name='category'
            placeholder='Enter Category'
            required
          />

          <div className='flex justify-start gap-5'>
            <FormButton
              loading={isLoading || updatePrequalificationCriteriaLoading}
            >
              Save
            </FormButton>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

export default AddPrequalificationCriteria;
