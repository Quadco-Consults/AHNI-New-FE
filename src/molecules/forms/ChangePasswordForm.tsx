import { useForm } from "react-hook-form";
import { Form } from "components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormInput from "atoms/FormInput";
import FormButton from "atoms/FormButton";
import { useChangePasswordMutation } from "services/authAPI";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const formSchema = z
  .object({
    old_password: z.string().trim().min(1, "Please enter a valid password"),
    new_password: z.string().trim().min(1, "Please enter a valid password"),
    confirm_new_password: z
      .string()
      .trim()
      .min(1, "Password must be at least character(s)"),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
  });

const ChangePasswordForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_new_password: "",
    },
  });

  const navigate = useNavigate();

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await changePassword(values);
      toast.success("Password changed successfully");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.data.message || "Something went wrong");
    }
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
            <FormButton loading={isLoading}>Change Password</FormButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ChangePasswordForm;
