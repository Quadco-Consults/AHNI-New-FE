"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { getAccessToken } from "utils/auth";
import Footer from "components/Footer";
import Header from "components/Header";
import Sidebar from "components/Sidebar";
import Suspense from "components/Suspense";
import { cn } from "lib/utils";
import Notifications from "@/features/notifications/components/notifications";

export default function NotificationsPage() {
    const [sidebarWidth, setSidebarWidth] = useState(false);
    
    useEffect(() => {
        const token = getAccessToken();
        if (!token) {
            redirect("/auth/login");
        }
    }, []);

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
                        <Notifications />
                    </main>
                </Suspense>
                <Footer />
            </div>
        </div>
    );
}