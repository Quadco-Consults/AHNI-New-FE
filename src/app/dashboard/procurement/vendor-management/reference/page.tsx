"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const VendorReference = dynamic(
  () =>
    import(
      "@/features/procurement/components/vendor-management/vendor-registration/Reference"
    ),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function VendorReferencePage() {
  return <VendorReference />;
}