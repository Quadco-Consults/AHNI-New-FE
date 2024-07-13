import { zodResolver } from "@hookform/resolvers/zod";
import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import Card from "components/shared/Card";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { TCreateUser, userSchema } from "definations/users";

import { SubmitHandler, useForm } from "react-hook-form";
import { useCreateUserMutation } from "services/users";
import { toast } from "sonner";

const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

const CreateUsers = () => {
  const form = useForm<TCreateUser>({
    resolver: zodResolver(userSchema),
  });
  const [createUser, { isLoading }] = useCreateUserMutation();

  const onSubmit: SubmitHandler<TCreateUser> = async (data) => {
    try {
      await createUser(data).unwrap();
      toast.success("User Created Succesfully");
      form.reset();
    } catch (error: any) {
      toast.error(error.data.message || "Something went wrong");
    }
  };
  return (
    <div>
      <div>
        <BackNavigation extraText="Add Users" />
      </div>
      <div>
        <Card>
          <CardContent className="p-6">
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
                <div className="grid grid-cols-2 gap-x-7">
                  <FormInput
                    label="Password"
                    name="password"
                    required
                    type="password"
                  />
                  <FormInput
                    label="Confirm Password"
                    name="confirm_password"
                    required
                    type="password"
                  />
                </div>
                <div className="flex justify-end">
                  <FormButton loading={isLoading}>Create</FormButton>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateUsers;
