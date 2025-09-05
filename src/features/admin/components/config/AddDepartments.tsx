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
  DepartmentSchema,
  TDepartmentData,
  TDepartmentFormValues,
} from "@/features/admin/types/config/department";
import {
  useAddDepartmentMutation,
  useUpdateDepartmentMutation,
} from "@/features/modules/controllers/config/departmentController";
import FormTextArea from "components/atoms/FormTextArea";

const AddDepartments = () => {
  const { dialogProps } = useAppSelector(dailogSelector);

  const data = dialogProps?.data as unknown as TDepartmentData;

  const form = useForm<TDepartmentFormValues>({
    resolver: zodResolver(DepartmentSchema),
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
    },
  });

  const dispatch = useAppDispatch();
  const [departments, { isLoading }] = useAddDepartmentMutation();

  const [updateDepartments, { isLoading: updateDepartmentsLoading }] =
    useUpdateDepartmentMutation();

  const onSubmit: SubmitHandler<TDepartmentFormValues> = async (data) => {
    try {
      if (dialogProps?.type === "update") {
        await updateDepartments({
          //@ts-ignore
          id: String(dialogProps?.data?.id),
          body: data,
        });
      } else {
        await departments(data);
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
          <FormButton loading={isLoading || updateDepartmentsLoading}>
            Save
          </FormButton>
        </div>
      </form>
    </Form>
  );
};

export default AddDepartments;
