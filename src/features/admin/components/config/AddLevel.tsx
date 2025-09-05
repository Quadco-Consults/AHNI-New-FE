"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import {
  LevelSchema,
  TLevelData,
  TLevelFormValues,
} from "@/features/admin/types/config/level";

import FormTextArea from "components/atoms/FormTextArea";
import {
  useAddLevelMutation,
  useUpdateLevelMutation,
} from "@/features/modules/controllers/config/levelController";

const AddLevel = () => {
  const { dialogProps } = useAppSelector(dailogSelector);

  const data = dialogProps?.data as unknown as TLevelData;

  const form = useForm<TLevelFormValues>({
    resolver: zodResolver(LevelSchema),
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
    },
  });

  const dispatch = useAppDispatch();

  const [addGrade, { isLoading: isAddLoading }] = useAddLevelMutation();

  const [updategrade, { isLoading: isUpdateLoading }] =
    useUpdateLevelMutation();

  const onSubmit: SubmitHandler<TLevelFormValues> = async (data) => {
    try {
      if (dialogProps?.type === "update") {
        await updategrade({
          // @ts-ignore
          id: String(dialogProps?.data?.id),
          body: data,
        });
      } else {
        await addGrade(data);
      }

      toast.success("Department Added Succesfully");
      dispatch(closeDialog());
      form.reset();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ?? error.message ?? "Something went wrong"
      );
    }
  };
  return (
    <Form {...form}>
      <form
        action=''
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-y-7'
      >
        <FormInput label='Name' name='name' placeholder='Enter Name' required />

        <FormTextArea
          label='Description'
          name='description'
          placeholder='Enter Description'
          required
        />

        <div className='flex justify-start gap-4'>
          <FormButton loading={isAddLoading || isUpdateLoading}>
            Save
          </FormButton>
        </div>
      </form>
    </Form>
  );
};

export default AddLevel;
