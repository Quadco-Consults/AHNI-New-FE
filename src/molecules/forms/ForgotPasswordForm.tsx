import { useForm } from "react-hook-form";
import { Form } from "components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormInput from "atoms/FormInput";
import FormButton from "atoms/FormButton";

const emailSchema = z.object({
  email: z.string().email(),
});

const ForgotPasswordForm = () => {
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof emailSchema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-6"
      >
        <img src="/src/assets/svgs/logo.svg" className="w-[130px] mb-[3rem]" />
        <h1 className="text-2xl font-bold">Forgot Password</h1>
        <p className="text-[#8F8585] text-base font-normal">Enter your email and we'll send a link to reset your password</p>
        <div className="space-y-8 w-[90%]">
          <FormInput label="Email" required type="email" name="email" placeholder="admin@demo.com" />
        </div>
        <div className="w-[5/12]">
          <FormButton>Continue</FormButton>
        </div>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;
