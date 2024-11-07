import ChangePasswordForm from "molecules/forms/ChangePasswordForm";

export default function ChangePassword() {
    return (
        <div className="flex h-screen flex-1 md:ml-[5rem] lg:ml-[8rem] md:gap-[10rem] items-center bg-gray-50">
            <div className="w-[26rem] h-[26rem] rounded-full border-2 border-[#DBDFE9] hidden md:flex items-center justify-center">
                <div className="">
                    <img
                        className="w-[22rem]"
                        src="/imgs/changePassword.png"
                        alt=""
                    />
                </div>
            </div>
            <div className=" w-[22rem] mx-auto">
                <ChangePasswordForm />
            </div>
        </div>
    );
}
