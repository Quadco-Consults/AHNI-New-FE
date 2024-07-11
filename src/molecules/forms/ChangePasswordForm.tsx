import { useForm } from "react-hook-form";
import { Form } from "components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormInput from "atoms/FormInput";
import FormButton from "atoms/FormButton";

const formSchema = z
  .object({
    oldPassword: z.string().trim().min(1, "Please enter a valid password"),
    newPassword: z.string().trim().min(1, "Please enter a valid password"),
    confirmPassword: z
      .string()
      .trim()
      .min(1, "Password must be at least character(s)"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
  });

const ChangePasswordForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <div>
      <Form {...form}>
        <form
          className="flex flex-col gap-y-10"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <img src="/src/assets/svgs/logo.svg" className="w-[130px]" />
          <h1 className="text-2xl font-bold">Change Password</h1>
          <div className="space-y-8">
            <FormInput
              label="Old Password"
              type="password"
              name="oldPassword"
              placeholder="************"
            />
            <div className="">
              <FormInput
                label="New Password"
                type="password"
                name="newPassword"
                placeholder="************"
              />
            </div>
            <div className="">
              <FormInput
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                placeholder="************"
              />
            </div>
          </div>
          <div className="w-[5/12]">
            <FormButton>Change Password</FormButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ChangePasswordForm;
