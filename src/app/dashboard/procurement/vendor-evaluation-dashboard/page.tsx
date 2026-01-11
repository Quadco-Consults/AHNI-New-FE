"use client";

import VendorEvaluationDashboard from "@/features/procurement/components/vendor-performance/VendorEvaluationDashboard";
import BreadcrumbCard from "@/components/Breadcrumb";

const VendorEvaluationDashboardPage = () => {
  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Vendor Evaluation Dashboard", icon: false },
  ];

  return (
    <main className="min-h-screen space-y-8">
      <BreadcrumbCard list={breadcrumbs} />
      <VendorEvaluationDashboard />
    </main>
  );
};

export default VendorEvaluationDashboardPage;
