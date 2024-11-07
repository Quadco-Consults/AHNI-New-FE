import FormButton from "atoms/FormButton";
import { toast } from "sonner";
import { OtpInput } from "reactjs-otp-input";
import { Button } from "components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VerifyOTPForm() {
    const [loading, setLoading] = useState(false);
    const [otpValue, setOtpValue] = useState("");

    const navigate = useNavigate();

    const handleChange = (otpInputValue: string) => {
        setOtpValue(otpInputValue);
    };

    const handleResendOTP = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();

        setLoading(true);
        toast.success(
            "We've resent the OTP to your inbox. Please check your email and enter the code to continue."
        );
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);
        // console.log(otpValue);
        navigate("/login", { replace: true });
    };
    return (
        <div>
            <form className="flex flex-col gap-y-6" onSubmit={onSubmit}>
                <img src="/imgs/logo.png" className="w-[130px]" />

                <h1 className="text-2xl font-bold">Verify OTP</h1>

                <div>
                    <p className="text-[#8F8585] text-base font-normal">
                        Please enter the 6-digit OTP sent to your registered{" "}
                        <br />
                        email or phone number to verify your account.
                    </p>

                    <FormButton
                        variant="link"
                        loading={loading}
                        onClick={handleResendOTP}
                        type="button"
                        className="p-0"
                    >
                        Resend OTP
                    </FormButton>
                </div>

                <div className="space-y-8">
                    <OtpInput
                        numInputs={4}
                        separator="&nbsp;-&nbsp;"
                        onChange={handleChange}
                        inputStyle={{
                            width: 50,
                            height: 50,
                        }}
                        shouldAutoFocus
                        value={otpValue}
                    />

                    <FormButton type="submit" loading={loading}>
                        Submit
                    </FormButton>
                </div>
            </form>
        </div>
    );
}
