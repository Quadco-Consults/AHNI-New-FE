"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ConsultantAuthUtils } from "@/features/consultant-portal/controllers/consultantAuthController";
import { LoadingSpinner } from "@/components/Loading";
import Footer from "@/components/Footer";
import ConsultantSidebar from "@/features/consultant-portal/components/ConsultantSidebar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ConsultantPortalLayoutProps {
  children: React.ReactNode;
}

export default function ConsultantPortalLayout({ children }: ConsultantPortalLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Set page title
    document.title = "AHNI Consultant Portal";

    // CRITICAL: Ensure we're on a consultant portal route
    // This prevents consultants from accessing staff routes
    if (typeof window !== 'undefined' && !pathname?.startsWith('/consultant-portal')) {
      console.error('🚫 CRITICAL: Attempted to access non-consultant route from consultant portal!');
      console.log('🚀 Force redirecting to consultant portal login');
      window.location.href = "/consultant-portal/login";
      return;
    }

    // Skip auth check for login page
    if (pathname === "/consultant-portal/login") {
      setIsAuthLoading(false);
      return;
    }

    // Check if consultant is authenticated with a small delay to allow token storage after login
    const checkAuth = () => {
      setTimeout(() => {
        if (!ConsultantAuthUtils.isConsultantAuthenticated()) {
          console.log('🔒 Layout: No consultant token found, redirecting to login');
          router.push("/consultant-portal/login");
        } else {
          console.log('✅ Layout: Consultant authenticated, allowing access');
          setIsAuthLoading(false);
        }
      }, 150); // Small delay to allow login success callback to store token
    };

    checkAuth();
  }, [router, pathname]);

  // Don't render auth protection for login page
  if (pathname === "/consultant-portal/login") {
    return <>{children}</>;
  }

  // Show loading while checking authentication
  if (isAuthLoading || !ConsultantAuthUtils.isConsultantAuthenticated()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <ConsultantSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 transition-all duration-300",
          sidebarCollapsed ? "ml-20" : "ml-64"
        )}
      >
        {/* Page Content */}
        <main className="pt-6">
          <div className="p-6">
            {children}
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
