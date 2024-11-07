import ForgotPasswordForm from "molecules/forms/ForgotPasswordForm";

export default function ForgotPassword() {
    return (
        <div className="flex h-screen flex-1 md:ml-[5rem] lg:ml-[8rem] md:gap-[10rem] items-center bg-gray-50">
            <div className="w-[26rem] h-[26rem] rounded-full border-2 border-[#DBDFE9] items-center justify-center hidden md:flex">
                <div className="">
                    <img
                        className="w-[22rem]"
                        src="/imgs/forgotPassword.png"
                        alt=""
                    />
                </div>
            </div>
            <div className=" w-[22rem] mx-auto">
                <ForgotPasswordForm />
            </div>
        </div>
    );
}
