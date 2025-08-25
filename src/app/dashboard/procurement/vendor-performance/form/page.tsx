"use client";

import dynamic from "next/dynamic";

const VendorPerformanceForm = dynamic(() => import("@/features/procurement/components/vendor-performance/form/index"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function VendorPerformanceFormPage() {
  return <VendorPerformanceForm />;
}