import ForgotPasswordForm from "molecules/forms/ForgotPasswordForm";

const ForgotPassword = () => {
  return (
    <div className="flex h-screen justify-center md:gap-[5rem] lg:gap-[15rem] items-center bg-gray-50">
      <div className="w-[26rem] h-[26rem] rounded-full border-2 border-[#DBDFE9] flex items-center justify-center">
        <div className="">
          <div className="relative">
            <img className="w-[21rem] h-[13rem]" src="/src/assets/imgs/clock.png" alt="" />
            <img className="w-[3rem] md:w-[6rem] lg:w-[6rem] absolute top-[10rem] left-[67%]" src="/src/assets/imgs/asteric.png" alt="" />
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
