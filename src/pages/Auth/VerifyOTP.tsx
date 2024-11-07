import VerifyOTPForm from "molecules/forms/VerifyOTPForm";

export default function VerifyOTP() {
    return (
        <div className="flex h-screen justify-center items-center bg-gray-50">
            <div className="flex-1 h-full flex items-center justify-center">
                <VerifyOTPForm />
            </div>

            <div className="flex flex-1">
                <img
                    src="/imgs/LoginImage.png"
                    className="flex flex-1 h-screen"
                />
            </div>
        </div>
    );
}
