import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import { Form } from "components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";

import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAppDispatch } from "hooks/useStore";
import { setAuth } from "store/auth/authSlice";
import { toast } from "sonner";
import { Checkbox } from "components/ui/checkbox";
import Card from "components/shared/Card";
import { LoginSchema, TLoginFormValues } from "definations/auth/auth";
import { useLoginMutation } from "services/auth/auth";

const LoginForm = () => {
    const form = useForm<TLoginFormValues>({
        resolver: zodResolver(LoginSchema),
    });

    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const [login, { isLoading }] = useLoginMutation();

    const { handleSubmit } = form;

    const onSubmit: SubmitHandler<TLoginFormValues> = async (data) => {
        try {
            const resp = await login(data).unwrap();
            if (resp) {
                dispatch(setAuth(resp.data));
                navigate("/", { replace: true });
                toast.success(resp.message);
            }
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };
    return (
        <div className="">
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <img src="/imgs/logo.png" className="w-[130px] mx-auto" />
                    <Card className="max-w-[500px] flex flex-col items-center gap-y-14 mt-10 py-10">
                        <div>
                            <h1 className="text-2xl font-bold text-center">
                                Login
                            </h1>
                            <p className="text-center text-[#667185] mt-1">
                                Enter your credentials to access your account
                            </p>
                        </div>
                        <div className="space-y-8 self-stretch">
                            <FormInput
                                label="Email Address"
                                placeholder="Enter email"
                                required
                                type="email"
                                name="email"
                                className="border-primary"
                            />
                            <div>
                                <div className="flex flex-col gap-1">
                                    <FormInput
                                        label="Password"
                                        placeholder="Enter password"
                                        required
                                        type="password"
                                        name="password"
                                        className="border-primary"
                                    />
                                </div>

                                <div className="mt-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Checkbox className="border-gray-500" />
                                        <label
                                            htmlFor=""
                                            className="font-semibold"
                                        >
                                            Remember me
                                        </label>
                                    </div>
                                    <Link to="/forgot-password">
                                        <p className="font-medium text-primary">
                                            Forgot Password ?
                                        </p>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="w-full self-stretch">
                            <FormButton
                                loading={isLoading}
                                className="w-full rounded-full"
                                size="lg"
                            >
                                Login
                            </FormButton>
                        </div>
                    </Card>
                </form>
            </Form>
        </div>
    );
};

export default LoginForm;
