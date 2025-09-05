"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import { toast } from "sonner";
import {
  ProjectClassSchema,
  TProjectClassData,
  TProjectClassFormValues,
} from "@/features/admin/types/finance/project-class";
import {
  useAddProjectClassMutation,
  useUpdateProjectClassMutation,
} from "@/features/modules/controllers/finance/projectClassController";
import FormTextArea from "components/atoms/FormTextArea";

const AddProjectClasses = () => {
  const { dialogProps } = useAppSelector(dailogSelector);

  const data = dialogProps?.data as unknown as TProjectClassData;

  const form = useForm<TProjectClassFormValues>({
    resolver: zodResolver(ProjectClassSchema),
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
      code: data?.code ?? "",
    },
  });

  const [addProjectClass, { isLoading }] = useAddProjectClassMutation();

  const [updateProjectClass, { isLoading: isUpdateLoading }] =
    useUpdateProjectClassMutation();

  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<TProjectClassFormValues> = async (data) => {
    try {
      dialogProps?.type === "update"
        ? await updateProjectClass({
            //@ts-ignore
            id: String(dialogProps?.data?.id),
            body: data,
          })
        : await addProjectClass(data);
      toast.success("Project Class Added Succesfully");
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
            label='Title'
            name='name'
            placeholder='Enter Name'
            required
          />

          <FormTextArea
            label='Description'
            name='description'
            placeholder='Enter Description'
          />

          <FormInput
            label='Code'
            name='code'
            required
            placeholder='Enter Code'
          />

          <div className='flex justify-start gap-4'>
            <FormButton loading={isLoading || isUpdateLoading}>Save</FormButton>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

export default AddProjectClasses;
