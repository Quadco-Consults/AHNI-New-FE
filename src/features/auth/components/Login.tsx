import LoginForm from "./forms/LoginForm";

export default function Login() {
    return (
        <div className="flex flex-1 h-screen">
            <div className="flex bg-[#FEF2F2] w-full">
                <div className="w-full flex flex-1 items-center justify-center">
                    <LoginForm />
                </div>
                <div className="hidden md:flex md:flex-1 md:items-center md:justify-center bg-[url('/img/login.jpeg')] bg-[#161630B2] bg-blend-overlay bg-opacity-100">
                    <div className="font-bold text-xl text-white text-center">
                        Providing solutions that are essential to the <br />
                        advancement of human development in communities we{" "}
                        <br /> serve
                    </div>
                </div>
            </div>
        </div>
    );
}
