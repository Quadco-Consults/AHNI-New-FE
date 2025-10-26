"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { VendorAuthUtils } from "@/features/vendor-portal/controllers/vendorAuthController";
import "@/features/vendor-portal/controllers/devTestingHelper";
import "@/features/vendor-portal/utils/vendorLookup";

interface VendorPortalLayoutProps {
  children: React.ReactNode;
}

export default function VendorPortalLayout({ children }: VendorPortalLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Set page title
    document.title = "AHNI Vendor Portal";

    // Check if vendor is authenticated (skip check for login page)
    if (pathname !== '/vendor-portal/login' && !VendorAuthUtils.isVendorAuthenticated()) {
      router.push('/vendor-portal/login');
    }
  }, [pathname, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Vendor Portal Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img
                className="h-8 w-auto"
                src="/assets/imgs/logo.png"
                alt="AHNI"
              />
              <span className="ml-3 text-xl font-semibold text-gray-900">
                Vendor Portal
              </span>
            </div>

            {pathname !== '/vendor-portal/login' && VendorAuthUtils.isVendorAuthenticated() && (
              <nav className="flex space-x-8">
                <a
                  href="/vendor-portal/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/vendor-portal/dashboard'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Dashboard
                </a>
                <a
                  href="/vendor-portal/rfqs"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname.startsWith('/vendor-portal/rfq')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Available RFQs
                </a>
                <a
                  href="/vendor-portal/submissions"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/vendor-portal/submissions'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  My Submissions
                </a>
                <a
                  href="/vendor-portal/orders"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname.startsWith('/vendor-portal/orders')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Purchase Orders
                </a>
                <a
                  href="/vendor-portal/grn"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname.startsWith('/vendor-portal/grn')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  GRN
                </a>
                <a
                  href="/vendor-portal/notifications"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/vendor-portal/notifications'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Notifications
                </a>
                <a
                  href="/vendor-portal/profile"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/vendor-portal/profile'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Profile
                </a>
              </nav>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            © 2025 AHNI (Access to Health and Nutrition Initiative). All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}