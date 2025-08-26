"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const VendorPerformanceForm = dynamic(
  () =>
    import("@/features/procurement/components/vendor-performance/form/index"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function VendorPerformanceFormPage() {
  return <VendorPerformanceForm />;
}
