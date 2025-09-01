"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "components/FormButton";
import FormInput from "components/FormInput";
import FormTextArea from "components/FormTextArea";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import { toast } from "sonner";

import {
  IModificationSingleData,
  ModificationSchema,
  TModificationFormData,
} from "features/contracts-grants/types/modification";
import { useCreateModification } from "@/features/contracts-grants/controllers/grantController";

const AddModification = () => {
  const { dialogProps } = useAppSelector(dailogSelector);

  const result = dialogProps?.data as unknown as IModificationSingleData;
  console.log({ result });

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
  const vn = form.getValues();
  console.log({ vn });

  const dispatch = useAppDispatch();
  const { createModification, isLoading } = useCreateModification(String(dialogProps?.data?.id));

  const onSubmit: SubmitHandler<TModificationFormData> = async (data) => {
    console.log({ crakcen: data });

    try {
      // Send the modification data as expected by the API
      await createModification({
        title: data.title,
        amount: data.amount,
        description: data.description,
        date: data.date,
        project: String(dialogProps?.data?.id),
      } as any);

      toast.success("Grant Modified Successfully");
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
            label='Project'
            name='project'
            placeholder='Enter Project'
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

export default AddModification;
