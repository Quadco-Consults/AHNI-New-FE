"use client";

import dynamic from "next/dynamic";

const VendorTechnical = dynamic(() => import("@/features/procurement/components/vendor-management/vendor-registration/Technical"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function VendorTechnicalCapacityPage() {
  return <VendorTechnical />;
}