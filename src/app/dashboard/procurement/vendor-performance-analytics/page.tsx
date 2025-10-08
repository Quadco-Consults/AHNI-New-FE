"use client";

import VendorPerformanceAnalytics from "@/features/procurement/components/vendor-performance/VendorPerformanceAnalytics";
import BreadcrumbCard from "components/Breadcrumb";

const VendorPerformanceAnalyticsPage = () => {
  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Vendor Performance Analytics", icon: false },
  ];

  return (
    <main className="min-h-screen space-y-8">
      <BreadcrumbCard list={breadcrumbs} />
      <VendorPerformanceAnalytics />
    </main>
  );
};

export default VendorPerformanceAnalyticsPage;
