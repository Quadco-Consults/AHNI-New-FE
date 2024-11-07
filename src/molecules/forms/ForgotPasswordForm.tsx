import { useForm } from "react-hook-form";
import { Form } from "components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormInput from "atoms/FormInput";
import FormButton from "atoms/FormButton";
import { useForgotPasswordMutation } from "services/authAPI";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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

    const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();

    const navigate = useNavigate();

    const onSubmit = async (values: z.infer<typeof emailSchema>) => {
        try {
            await forgotPassword(values).unwrap();
            toast.success(
                "We've sent the OTP to your inbox. Please check your email and enter the code to continue."
            );
            navigate("/verify-otp");
        } catch (err: any) {
            toast.error(err.data.message || "Something went wrong");
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-y-6"
            >
                <img src="/imgs/logo.png" className="w-[130px] mb-[3rem]" />
                <h1 className="text-2xl font-bold">Forgot Password</h1>
                <p className="text-[#8F8585] text-base font-normal">
                    Enter your email and well send a link to reset your password
                </p>
                <div className="space-y-8 w-[90%]">
                    <FormInput
                        label="Email"
                        required
                        type="email"
                        name="email"
                        placeholder="admin@demo.com"
                    />
                </div>
                <div className="w-[5/12]">
                    <FormButton loading={isLoading}>Continue</FormButton>
                </div>
            </form>
        </Form>
    );
};

export default ForgotPasswordForm;
