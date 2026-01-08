"use client";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { useRouter } from "next/navigation";
import Footer from "components/Footer";
import Header from "components/Header";
import Sidebar from "components/Sidebar";
import Suspense from "components/Suspense";
import { cn } from "lib/utils";
import { useState, useEffect } from "react";
import { useAuthInitialization } from "@/hooks/useAuthInitialization";
import { useSessionManager } from "@/hooks/useSessionManager";
import { toast } from "sonner";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarWidth, setSidebarWidth] = useState(false);
    const router = useRouter();

    // Initialize authentication state properly
    const { isInitialized, isAuthenticated } = useAuthInitialization();

    // Session manager for activity-based token refresh and idle timeout
    useSessionManager({
        enabled: isInitialized && isAuthenticated,
        idleTimeoutMs: 10 * 60 * 1000, // 10 minutes idle timeout
        refreshIntervalMs: 5 * 60 * 1000, // Refresh token every 5 minutes while active
        onSessionExpired: () => {
            toast.error("Your session has expired due to inactivity. Please log in again.");
        },
        onTokenRefreshed: () => {
            console.log("🔄 Session extended due to user activity");
        },
    });

    useEffect(() => {
        // Wait for auth initialization before checking
        if (isInitialized && !isAuthenticated) {
            console.log('🔄 No authentication detected, redirecting to login');
            router.push("/auth/login");
        }
    }, [router, isInitialized, isAuthenticated]);

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
                        {children}
                    </main>
                </Suspense>
                <Footer />
            </div>
        </div>
    );
}