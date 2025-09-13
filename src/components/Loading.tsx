import logoPng from "@/assets/svgs/logo-bg.svg";
import { Icon } from "@iconify/react";

export const Loading = () => {
    return (
        <div className="flex justify-center h-screen items-center p-8">
            <div>
                <img
                    src={logoPng?.src || logoPng}
                    alt="logo"
                    className="mx-auto animate-bounce"
                    // width={200}
                />
                <p>Loading...</p>
            </div>
        </div>
    );
};

export const LoadingSpinner = () => {
    return (
        <div className="flex justify-center items-center pt-8">
            <div>
                <Icon icon="eos-icons:bubble-loading" className="text-2xl" />
            </div>
        </div>
    );
};
