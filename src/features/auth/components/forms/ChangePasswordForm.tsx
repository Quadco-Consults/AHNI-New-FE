"use client";

import { useForm } from "react-hook-form";
import { Form } from "components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
import FormInput from "components/FormInput";
import FormButton from "components/FormButton";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Card from "components/Card";
import PasswordHint from "../PasswordHint";
import useQuery from "hooks/useQuery";
import {
  ChangePasswordSchema,
  TChangePasswordFormValues,
} from "features/auth/types/auth";
import { useChangePassword } from "../../controllers/authController";

const ChangePasswordForm = () => {
  const form = useForm<TChangePasswordFormValues>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      new_password: "",
      confirm_password: "",
    },
  });

  const query = useQuery();

  const router = useRouter();

  const { changePassword, isLoading } = useChangePassword();

  const onSubmit = async ({
    new_password,
    confirm_password,
  }: TChangePasswordFormValues) => {
    const email = query.get("email");
    const token = JSON.parse(localStorage.getItem("authToken") || "{}");

    const payload = {
      email,
      otp: token,
      new_password,
      confirm_password,
    };

    await changePassword(payload);
    localStorage.removeItem("authToken");
    router.push("/auth/login");
  };

  return (
    <div>
      <Form {...form}>
        <form
          className='flex flex-col gap-y-5'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <img src='/src/assets/svgs/logo.svg' className='w-[130px] mx-auto' />

          <Card className='max-w-[500px] flex flex-col items-center gap-y-8 py-10'>
            <div className='text-center'>
              <h1 className='text-2xl font-bold'>Set New Password</h1>

              <p className='text-[#8F8585] text-base font-normal'>
                {/* Create new password{" "} */}
                Create a new password to login your account with
              </p>
            </div>
            <div className='space-y-8 self-stretch'>
              <div className=''>
                <FormInput
                  label='New Password'
                  type='password'
                  name='new_password'
                  placeholder='Enter new password'
                />
              </div>
              <div className=''>
                <FormInput
                  label='Confirm password'
                  type='password'
                  name='confirm_password'
                  placeholder='Confirm new password'
                />
              </div>
            </div>

            <PasswordHint password={form.watch("new_password")} />

            <div className='w-full self-stretch'>
              <FormButton
                loading={isLoading}
                className='w-full rounded-full'
                size='lg'
                type='submit'
              >
                Update Password
              </FormButton>
            </div>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default ChangePasswordForm;