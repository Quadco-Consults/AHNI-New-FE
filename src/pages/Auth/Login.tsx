import LoginForm from "molecules/forms/LoginForm";

const Login = () => {
  return (
    <div className="flex flex-1 max-h-screen ">
      <div className="flex flex-wrap flex-1 bg-gray-50">
        <div className="flex items-center justify-center w-7/12">
          <div className="w-5/12">
            <LoginForm />
          </div>
        </div>
        <div className="flex flex-1">
          <img src="/imgs/LoginImage.png" className="flex flex-1 h-screen" />
        </div>
      </div>
    </div>
  );
};

export default Login;
