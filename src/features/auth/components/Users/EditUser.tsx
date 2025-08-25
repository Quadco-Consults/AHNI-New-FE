"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelect";
import { Form } from "components/ui/form";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useGetAllDepartments } from "@/features/modules/controllers/config/departmentController";
import { useGetAllPositions } from "@/features/modules/controllers/config/positionController";
import { useUpdateUser } from "../../controllers/userController";
import { toast } from "sonner";
import { closeDialog, dailogSelector } from "store/ui";
import { TUpdateUserFormValues, UpdateUserSchema } from "features/auth/types/user";
import { useGetAllRoles } from "../../controllers/roleController";
import FormMultiSelect from "components/atoms/FormMultiSelect";

const genderOptions = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Other", value: "Other" },
];

export default function EditUserModal() {
  // @ts-ignore
  const {
    dialogProps,
  }: {
    dialogProps: {
      data: {
        first_name: string;
        last_name: string;
        email: string;
        mobile_number: string;
        gender: string;
        department: { id: string };
        position: { id: string };
        roles: { id: string }[];
      };
    };
  } = useAppSelector(dailogSelector);

  const form = useForm<TUpdateUserFormValues>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      first_name: dialogProps?.data?.first_name ?? "",
      last_name: dialogProps?.data?.last_name ?? "",
      email: dialogProps?.data?.email ?? "",
      mobile_number: dialogProps?.data?.mobile_number ?? "",
      gender: dialogProps?.data?.gender ?? "",
      position: dialogProps?.data?.position?.id ?? "",
      department: dialogProps?.data?.department?.id ?? "",
      roles:
        dialogProps?.data?.roles?.map((role: { id: string }) => role?.id) ?? [],
    },
  });

  const { data: department } = useGetAllDepartments({
    page: 1,
    size: 2000000,
  });

  const { data: role } = useGetAllRoles({
    page: 1,
    size: 2000000,
  });

  const departmentOptions = useMemo(
    () =>
      department?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [department]
  );

  const roleOptions = role?.data.results.map(({ name, id }) => ({
    label: name,
    value: id,
  }));

  const { data: position } = useGetAllPositions({
    page: 1,
    size: 2000000,
  });

  const positionOptions = position?.data.results.map(({ name, id }) => ({
    label: name,
    value: id,
  }));

  const dispatch = useAppDispatch();

  const { updateUser, isLoading: isUpdateLoading } = useUpdateUser();

  const onSubmit: SubmitHandler<TUpdateUserFormValues> = async (data) => {
    await updateUser(dialogProps?.data?.id as string, data);
    dispatch(closeDialog());
  };

  return (
    <div>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-y-10'
          >
            <div className='grid grid-cols-2 gap-x-7 gap-y-7'>
              <FormInput label='First Name' name='first_name' required />
              <FormInput label='Last Name' name='last_name' required />

              <FormInput label='Email' name='email' required disabled />

              <FormInput
                label='Mobile Number'
                name='mobile_number'
                required
                type='number'
              />

              <FormSelect
                label='Gender'
                name='gender'
                placeholder='Select Gender'
                required
                options={genderOptions}
              />

              <FormSelect
                label='Department'
                name='department'
                required
                placeholder='Select Department'
                options={departmentOptions}
              />

              <FormSelect
                label='Position'
                name='position'
                required
                placeholder='Select Position'
                options={positionOptions}
              />

              <FormMultiSelect
                label='User Roles'
                name='roles'
                required
                placeholder='Select roles'
                options={roleOptions}
              />
            </div>

            <div className='flex justify-end'>
              <FormButton loading={isUpdateLoading}>Update User</FormButton>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
