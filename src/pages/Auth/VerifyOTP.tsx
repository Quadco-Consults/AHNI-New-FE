import VerifyOTPForm from "molecules/forms/VerifyOTPForm";

export default function VerifyOTP() {
    return (
        <div className="flex flex-1 h-screen">
            <div className="flex bg-gray-50 w-full">
                <div className="w-full flex flex-1 items-center justify-center">
                    <VerifyOTPForm />
                </div>
                <div className="hidden md:flex md:flex-1 ">
                    <img
                        src="/imgs/LoginImage.png"
                        className="flex flex-1 h-screen"
                    />
                </div>
            </div>
        </div>
    );
}
