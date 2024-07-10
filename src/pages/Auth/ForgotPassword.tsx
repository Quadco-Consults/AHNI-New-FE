import ForgotPasswordForm from "molecules/forms/ForgotPasswordForm";

const ForgotPassword = () => {
  return (
    <div className="flex h-screen justify-center md:gap-[5rem] lg:gap-[15rem] items-center bg-gray-50">
      <div className="w-[26rem] h-[26rem] rounded-full border-2 border-[#DBDFE9] flex items-center justify-center">
        <div className="">
          <div className="relative">
            <img className="" src="/imgs/forgotPassword.png" alt="" />
          </div>
        </div>
      </div>
      <div className="">
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPassword;
