"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { getAccessToken } from "utils/auth";
import Footer from "components/Footer";
import Header from "components/Header";
import Sidebar from "components/Sidebar";
import Suspense from "components/Suspense";
import { cn } from "lib/utils";
import Account from "@/features/accounts/components/account";

export default function AccountPage() {
    const [sidebarWidth, setSidebarWidth] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        if (!isRedirecting) {
            const token = getAccessToken();
            if (!token) {
                setIsRedirecting(true); // Prevent multiple redirects
                redirect("/auth/login");
            }
        }
    }, [isRedirecting]);

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
                        <Account />
                    </main>
                </Suspense>
                <Footer />
            </div>
        </div>
    );
}