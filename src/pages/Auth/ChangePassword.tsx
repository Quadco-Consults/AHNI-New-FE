import ChangePasswordForm from "molecules/forms/ChangePasswordForm";

const ChangePassword = () => {
  return (
    <div className="flex h-screen flex-1 md:ml-[5rem] lg:ml-[8rem] md:gap-[10rem] items-center bg-gray-50">
      <div className="w-[26rem] h-[26rem] rounded-full border-2 border-[#DBDFE9] flex items-center justify-center">
        <div className="">
          <img
            className="w-[22rem]"
            src="/src/assets/imgs/password-reset.png"
            alt=""
          />
        </div>
      </div>
      <div className=" w-[22rem]">
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default ChangePassword;
