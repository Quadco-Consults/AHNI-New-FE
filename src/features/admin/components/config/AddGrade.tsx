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
  GradeSchema,
  TGradeData,
  TGradeFormValues,
} from "@/features/admin/types/config/grade";

import FormTextArea from "components/atoms/FormTextArea";
import {
  useAddGradeMutation,
  useUpdateGradeMutation,
} from "@/features/modules/controllers/config/gradeController";

const Addgrade = () => {
  const { dialogProps } = useAppSelector(dailogSelector);

  const data = dialogProps?.data as unknown as TGradeData;

  const form = useForm<TGradeFormValues>({
    resolver: zodResolver(GradeSchema),
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
    },
  });

  const dispatch = useAppDispatch();

  const [addGrade, { isLoading: isAddLoading }] = useAddGradeMutation();

  const [updategrade, { isLoading: isUpdateLoading }] =
    useUpdateGradeMutation();

  const onSubmit: SubmitHandler<TGradeFormValues> = async (data) => {
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

export default Addgrade;
