"use client";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { redirect } from "next/navigation";
import Footer from "components/Footer";
import Header from "components/Header";
import Sidebar from "components/Sidebar";
import Suspense from "components/Suspense";
import { cn } from "lib/utils";
import { useState, useEffect } from "react";
import { getAccessToken } from "utils/auth";
import { PermissionGuard } from "@/components/PermissionGuard";
import { DASHBOARD_PERMISSIONS } from "@/constants/permissions";
import AccessDeniedPage from "@/components/AccessDeniedPage";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarWidth, setSidebarWidth] = useState(false);
    
    useEffect(() => {
        const token = getAccessToken();
        if (!token) {
            redirect("/auth/login");
        }
    }, []);

    return (
        <PermissionGuard
            customCheck={() => {
                // For now, allow access to authenticated users
                // You can enable strict permission checking later
                return true;
            }}
            fallback={
                <AccessDeniedPage
                    feature="Dashboard"
                    message="You don't have permission to access the dashboard. Please contact your administrator."
                    backUrl="/auth/login"
                />
            }
        >
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
        </PermissionGuard>
    );
}