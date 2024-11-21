import { useForm } from "react-hook-form";
import { Form } from "components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormInput from "atoms/FormInput";
import FormButton from "atoms/FormButton";
import { useForgotPasswordMutation } from "services/authAPI";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import Card from "components/shared/Card";

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

    const { watch } = form;

    const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();

    const navigate = useNavigate();

    const onSubmit = async (values: z.infer<typeof emailSchema>) => {
        try {
            const response = await forgotPassword(values).unwrap();

            if (!response?.data) {
                throw new Error(response?.message || "Unexpected error");
            }

            const token = response.token;
            localStorage.setItem("authToken", JSON.stringify(token));

            toast.success(
                "We've sent the OTP to your inbox. Please check your email and enter the code to continue."
            );
            navigate(`/verify-otp?email=${watch("email")}`);
        } catch (err: any) {
            console.log(err);
            toast.error(err.message || "Something went wrong");
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <img
                    src="/imgs/logo.png"
                    className="w-[130px] mb-[3rem] mx-auto"
                />
                <Card className="max-w-[500px] flex flex-col items-center gap-y-14 mt-10 py-10">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">Forgot Password</h1>
                        <p className="text-[#8F8585] text-base font-normal">
                            Enter the email address linked to your password.
                        </p>
                    </div>
                    <div className="space-y-8 w-full">
                        <FormInput
                            label="Email"
                            required
                            type="email"
                            name="email"
                            placeholder="admin@demo.com"
                        />
                    </div>
                    <div className="w-full self-stretch">
                        <FormButton
                            loading={isLoading}
                            className="w-full rounded-full"
                            size="lg"
                        >
                            Continue
                        </FormButton>
                        <p className="text-center text-[#98A2B3] mt-2 text-[12px]">
                            Having a bit of trouble?{" "}
                            <Link to="/" className="text-primary font-semibold">
                                Contact support
                            </Link>
                        </p>
                    </div>
                </Card>
            </form>
        </Form>
    );
};

export default ForgotPasswordForm;
