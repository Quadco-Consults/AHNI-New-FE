import { useForm } from "react-hook-form";
import { Form } from "components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormInput from "atoms/FormInput";
import FormButton from "atoms/FormButton";
import { useChangePasswordMutation } from "services/authAPI";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Card from "components/shared/Card";
import PasswordHint from "components/features/PasswordHint";

const formSchema = z
    .object({
        new_password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .trim()
            .regex(
                /[@$!%*?&]/,
                "Password must contain at least one special character"
            )
            .regex(
                /[A-Z]/,
                "Password must contain at least one uppercase character"
            )
            .regex(/[0-9]/, "Password must contain at least one number"),
        confirm_new_password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .trim()
            .regex(
                /[@$!%*?&]/,
                "Password must contain at least one special character"
            )
            .regex(
                /[A-Z]/,
                "Password must contain at least one uppercase character"
            )
            .regex(/[0-9]/, "Password must contain at least one number"),
    })
    .refine((data) => data.new_password === data.confirm_new_password, {
        message: "Passwords don't match",
        path: ["confirm_new_password"], // path of error
    });

const ChangePasswordForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
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
                    className="flex flex-col gap-y-5"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <img
                        src="/src/assets/svgs/logo.svg"
                        className="w-[130px] mx-auto"
                    />

                    <Card className="max-w-[500px] flex flex-col items-center gap-y-8 py-10">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold">
                                Set New Password
                            </h1>

                            <p className="text-[#8F8585] text-base font-normal">
                                {/* Create new password{" "} */}
                                Create a new password to login your account with
                            </p>
                        </div>
                        <div className="space-y-8 self-stretch">
                            <div className="">
                                <FormInput
                                    label="New Password"
                                    type="password"
                                    name="new_password"
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div className="">
                                <FormInput
                                    label="Confirm password"
                                    type="password"
                                    name="confirm_new_password"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>

                        <PasswordHint password={form.watch("new_password")} />

                        <div className="w-full self-stretch">
                            <FormButton
                                loading={isLoading}
                                className="w-full rounded-full"
                                size="lg"
                                type="submit"
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
