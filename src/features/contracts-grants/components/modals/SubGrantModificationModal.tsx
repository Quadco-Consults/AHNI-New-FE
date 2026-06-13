"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import FormTextArea from "@/components/FormTextArea";
import { CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { closeDialog, dialogSelector } from "@/store/ui";
import { toast } from "sonner";

import {
  IModificationSingleData,
  ModificationSchema,
  TModificationFormData,
} from "@/features/contracts-grants/types/modification";
import { useCreateSubGrantModification } from "@/features/contracts-grants/controllers/subGrantModificationController";

const SubGrantModificationModal = () => {
  const { dialogProps } = useAppSelector(dialogSelector);

  const result = dialogProps?.data as unknown as IModificationSingleData;
  const subGrantId = dialogProps?.subGrantId as string;

  const form = useForm<TModificationFormData>({
    resolver: zodResolver(ModificationSchema),
    defaultValues: {
      project: result?.title ?? "",
      title: "",
      amount: "",
      description: "",
      date: "",
    },
  });

  const dispatch = useAppDispatch();
  const { createModification, isLoading } = useCreateSubGrantModification(subGrantId);

  const onSubmit: SubmitHandler<TModificationFormData> = async (data) => {
    if (!subGrantId) {
      toast.error("Sub-Grant ID is required");
      return;
    }

    try {
      await createModification({
        title: data.title,
        amount: data.amount,
        description: data.description,
        date: data.date,
      } as any);

      toast.success("Sub-Grant Modified Successfully");
      dispatch(closeDialog());
      form.reset();
    } catch (error: any) {
      console.error("Modification error:", error);
      const errorMessage = error?.response?.data?.message || error?.data?.message || error?.message || "Something went wrong";
      toast.error(errorMessage);
    }
  };

  return (
    <CardContent className='w-100% flex flex-col gap-y-10 p-0'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='bg-white rounded-[2rem] flex flex-col gap-y-7 pb-[2rem]'
        >
          <FormInput
            label='Sub-Grant'
            name='project'
            placeholder='Sub-Grant'
            disabled={true}
          />

          <FormInput
            name='title'
            label='Modification Title'
            required
            placeholder='Enter modification title'
          />

          <FormInput
            name='amount'
            label='Modification Amount'
            required
            placeholder='Enter modification amount'
            type='number'
          />

          <FormTextArea
            label='Modification Description'
            name='description'
            required
            placeholder='Enter modification description'
          />

          <FormInput
            label='Modification Date'
            name='date'
            required
            placeholder='Select modification date'
            type='date'
          />

          <div className='flex justify-start gap-4'>
            <FormButton loading={isLoading} disabled={isLoading}>
              Save
            </FormButton>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

export default SubGrantModificationModal;
