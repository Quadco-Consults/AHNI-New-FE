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
import { useCreateModification } from "@/features/contracts-grants/controllers/grant/grant";

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
  const { modification, isLoading } = useCreateModification();

  const onSubmit: SubmitHandler<TModificationFormData> = async (data) => {
    console.log({ crakcen: data });

    try {
      await modification({
        //@ts-ignore
        id: String(dialogProps?.data?.id),
        body: {
          project: dialogProps?.data?.id,
          title: data.title,
          amount: data.amount,
          description: data.description,
          date: data.date,
        },
      })();

      toast.success("Location Added Succesfully");
      dispatch(closeDialog());
      form.reset();
    } catch (error: any) {
      toast.error(error.data.message || "Something went wrong");
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
            required
            placeholder='Enter Project'
          />

          <FormInput
            name='title'
            label='Title'
            required
            placeholder='Enter Amount'
          />

          <FormInput
            name='amount'
            label='Amount'
            required
            placeholder='Enter Amount'
            type='number'
          />

          <FormTextArea
            label='Description'
            name='description'
            required
            placeholder='Enter description'
          />

          <FormInput
            label='Date'
            name='date'
            required
            placeholder='Enter Date'
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
