import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import { Form } from "components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";

import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema } from "definations/auth";
import { z } from "zod";
import { useLoginMutation } from "services/authAPI";
import { useAppDispatch } from "hooks/useStore";
import { setAuth } from "store/auth/authSlice";
import { toast } from "sonner";

const LoginForm = () => {
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
    });

    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const [login, { isLoading }] = useLoginMutation();

    const { handleSubmit } = form;

    const onSubmit: SubmitHandler<z.infer<typeof loginSchema>> = async (
        data
    ) => {
        try {
            const resp = await login(data).unwrap();
            if (resp) {
                dispatch(setAuth(resp.data));
                navigate("/", { replace: true });
                toast.success(resp.message);
            }
        } catch (error) {
            toast.error("Something went wrong pls, try again");
        }
    };
    return (
        <div>
            <Form {...form}>
                <form
                    className="flex flex-col gap-y-14"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <img src="/imgs/logo.png" className="w-[130px]" />
                    <h1 className="text-2xl font-bold">Sign In</h1>
                    <div className="space-y-8">
                        <FormInput
                            label="Company email"
                            required
                            type="email"
                            name="email"
                        />
                        <div>
                            <FormInput
                                label="Password"
                                required
                                type="password"
                                name="password"
                            />
                            <Link to="/forgot-password">
                                <p className="mt-1 font-semibold text-primary">
                                    Forgot Password ?
                                </p>
                            </Link>
                        </div>
                    </div>
                    <div className="w-[5/12]">
                        <FormButton loading={isLoading}>Sign In</FormButton>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default LoginForm;
