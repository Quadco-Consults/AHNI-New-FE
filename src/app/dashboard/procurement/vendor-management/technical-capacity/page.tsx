"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const VendorTechnical = dynamic(
  () =>
    import(
      "@/features/procurement/components/vendor-management/vendor-registration/Technical"
    ),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function VendorTechnicalCapacityPage() {
  return <VendorTechnical />;
}
