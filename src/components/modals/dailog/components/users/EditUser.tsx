import { zodResolver } from "@hookform/resolvers/zod";

import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import { Form } from "components/ui/form";
import { TCreateUser, userSchema } from "definations/users";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { useEffect, useState } from "react";

import { SubmitHandler, useForm } from "react-hook-form";
import { useUpdateUserMutation } from "services/users";
import { toast } from "sonner";
import { closeDialog, dailogSelector } from "store/ui";

const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

const EditUser = () => {
  const form = useForm<TCreateUser>({
    resolver: zodResolver(userSchema),
  });

  const dispatch = useAppDispatch();

  const [id, setId] = useState("");

  const { dialogProps } = useAppSelector(dailogSelector);

  useEffect(() => {
    if (dialogProps?.data) {
      const data = JSON.parse(dialogProps.data as string);
      form.reset(data);
      setId(data.id);
    }
  }, [dialogProps?.data, form]);

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const onSubmit: SubmitHandler<TCreateUser> = async (data) => {
    try {
      await updateUser({
        id,
        body: data,
      }).unwrap();
      toast.success("User Updated Succesfully");
      dispatch(closeDialog());
    } catch (error: any) {
      toast.error(error.data.message || "Something went wrong");
    }
  };
  return (
    <div>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-10"
          >
            <div className="grid grid-cols-2 gap-x-7">
              <FormInput label="First Name" name="first_name" required />
              <FormInput label="Last Name" name="last_name" required />
            </div>
            <div className="grid grid-cols-2 gap-x-7">
              <FormInput label="Email" name="email" required />
              <FormInput
                label="Contact"
                name="phone_number"
                required
                type="number"
              />
            </div>
            <div className="grid grid-cols-2 gap-x-7">
              <FormSelect
                label="Gender"
                name="gender"
                required
                options={genderOptions}
              />
              <FormInput label="Designation" name="designation" required />
            </div>
            <div className="flex justify-end">
              <FormButton loading={isLoading}>Update</FormButton>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditUser;
