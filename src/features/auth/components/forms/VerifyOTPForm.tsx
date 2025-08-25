import FormButton from "components/FormButton";
import { toast } from "sonner";
import { OtpInput } from "reactjs-otp-input";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Card from "components/Card";
import useQuery from "hooks/useQuery";

export default function VerifyOTPForm() {
    const [countTimer, setCountTimer] = useState(60);

    const query = useQuery();

    const [loading, setLoading] = useState(false);
    const [otpValue, setOtpValue] = useState("");

    const router = useRouter();

    const handleChange = (otpInputValue: string) => {
        setOtpValue(otpInputValue);
    };

    useEffect(() => {
        if (countTimer > 0) {
            const timerID = setInterval(() => {
                setCountTimer((prevCountTimer) => prevCountTimer - 1);
            }, 1000);

            return () => clearInterval(timerID);
        }
    }, [countTimer]);

    const handleResendOTP = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();

        setLoading(true);
        setCountTimer(60);
        toast.success(
            "We've resent the OTP to your inbox. Please check your email and enter the code to continue."
        );
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const email = query.get("email");

        try {
            localStorage.setItem("authToken", JSON.stringify(otpValue));
            router.push(`/auth/change-password?email=${email}`);
        } catch (error: any) {
            toast.error(
                error.data.non_field_errors[0] || "Something went wrong"
            );
        }
    };
    return (
        <div>
            <form className="flex flex-col gap-y-6" onSubmit={onSubmit}>
                <img src="/imgs/logo.png" className="w-[130px] mx-auto" />
                <Card className="max-w-[500px] flex flex-col items-center gap-y-14 mt-10 py-10">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">Enter OTP</h1>
                        <p className="text-[#8F8585] text-base font-normal">
                            Enter the 6 digit code sent to you email address
                        </p>
                    </div>

                    <div className="space-y-8">
                        <OtpInput
                            numInputs={6}
                            separator="&nbsp;&nbsp;&nbsp;"
                            onChange={handleChange}
                            inputStyle={{
                                width: 50,
                                height: 50,
                                backgroundColor: "#FEE4E2",
                                borderTopColor: "#F97066",
                            }}
                            shouldAutoFocus
                            value={otpValue}
                        />
                    </div>

                    <div className="flex flex-col items-center">
                        <p className="text-[10px] text-[#828282]">
                            OTP will expire in
                        </p>
                        <span className="text-[12px] text-[#828282] font-semibold ">
                            00:{countTimer < 10 && "0"}
                            {countTimer}
                        </span>

                        {countTimer === 0 && (
                            <FormButton
                                variant="ghost"
                                loading={loading}
                                onClick={handleResendOTP}
                                type="button"
                                className="text-primary hover:text-primary"
                            >
                                Resend OTP
                            </FormButton>
                        )}
                    </div>

                    <div className="w-full self-stretch">
                        <FormButton
                            type="submit"
                            className="w-full rounded-full"
                            size="lg"
                        >
                            Confirm
                        </FormButton>

                        <p className="text-center text-[#98A2B3] mt-2 text-[12px]">
                            Having a bit of trouble?{" "}
                            <Link href="/auth/login" className="text-primary font-semibold">
                                Contact support
                            </Link>
                        </p>
                    </div>
                </Card>
            </form>
        </div>
    );
}