"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { VendorAuthUtils } from "@/features/vendor-portal/controllers/vendorAuthController";

export default function VendorPortalHomePage() {
  const router = useRouter();

  useEffect(() => {
    // If vendor is authenticated, redirect to dashboard
    if (VendorAuthUtils.isVendorAuthenticated()) {
      router.push('/vendor-portal/dashboard');
    } else {
      // If not authenticated, redirect to login
      router.push('/vendor-portal/login');
    }
  }, [router]);

  // Show a loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to Vendor Portal...</p>
      </div>
    </div>
  );
}