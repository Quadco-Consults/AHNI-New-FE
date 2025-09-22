import { Navigate, Outlet } from "react-router-dom"; 
import Footer from "components/Footer";
import Header from "components/Header";
import Sidebar from "components/Sidebar";
import Suspense from "components/Suspense";
import { cn } from "lib/utils";

import { useState } from "react";
import { useAppSelector } from "hooks/useStore";
import { authSelector } from "store/auth/authSlice";

const ProtectedPage = () => {
    const [sidebarWidth, setSidebarWidth] = useState(false);

    const { access_token } = useAppSelector(authSelector);

    const token = access_token;

    if (!token) {
        return <Navigate href="/login" />;
    }

    return (
        <div className="flex">
            <div
                className={cn(
                    "hidden md:block",
                    sidebarWidth ? "w-[5%]" : "w-[19%]"
                )}
            >
                <Sidebar
                    setSidebarWidth={setSidebarWidth}
                    sidebarWidth={sidebarWidth}
                />
            </div>
            <div
                className={cn(
                    "w-full",
                    sidebarWidth ? "md:w-[95%]" : "md:w-[81%]"
                )}
            >
                <Header sidebarWidth={sidebarWidth} />
                <Suspense>
                    <main className="p-5 mt-20">
                        <Outlet />
                    </main>
                </Suspense>
                <Footer />
            </div>
        </div>
    );
};

export default ProtectedPage;
