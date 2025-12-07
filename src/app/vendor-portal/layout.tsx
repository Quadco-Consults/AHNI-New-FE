"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { VendorAuthUtils } from "@/features/vendor-portal/controllers/vendorAuthController";
import { LoadingSpinner } from "components/Loading";
import VendorSidebar from "@/components/VendorSidebar";
import VendorHeader from "@/components/VendorHeader";
import Footer from "@/components/Footer";
import { cn } from "lib/utils";

import "@/features/vendor-portal/controllers/devTestingHelper";
import "@/features/vendor-portal/utils/vendorLookup";

interface VendorPortalLayoutProps {
  children: React.ReactNode;
}

export default function VendorPortalLayout({ children }: VendorPortalLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarWidth, setSidebarWidth] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    // Set page title
    document.title = "AHNI Vendor Portal";

    // Skip auth check for login page
    if (pathname === "/vendor-portal/login") {
      setIsAuthLoading(false);
      return;
    }

    // Check if vendor is authenticated
    const checkAuth = () => {
      if (!VendorAuthUtils.isVendorAuthenticated()) {
        router.push("/vendor-portal/login");
      } else {
        setIsAuthLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

  // Don't render auth protection for login page
  if (pathname === "/vendor-portal/login") {
    return <>{children}</>;
  }

  // Show loading while checking authentication
  if (isAuthLoading || !VendorAuthUtils.isVendorAuthenticated()) {
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
      <div
        className={cn(
          "hidden lg:block transition-all duration-300",
          sidebarWidth ? "w-16" : "w-64"
        )}
      >
        <VendorSidebar
          setSidebarWidth={setSidebarWidth}
          sidebarWidth={sidebarWidth}
        />
      </div>

      {/* Main Content */}
      <div className={cn(
        "flex-1 transition-all duration-300",
        sidebarWidth ? "lg:ml-0" : "lg:ml-0"
      )}>
        {/* Header */}
        <VendorHeader sidebarWidth={sidebarWidth} />

        {/* Page Content */}
        <main className="pt-16">
          <div className="p-6">
            {children}
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Mobile sidebar overlay */}
      <div className="lg:hidden">
        {/* Add mobile sidebar implementation if needed */}
      </div>
    </div>
  );
}