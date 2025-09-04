"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const VendorCompany = dynamic(
  () =>
    import(
      "@/features/procurement/components/vendor-management/vendor-registration/Company"
    ),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function VendorCompanyPage() {
  return <VendorCompany />;
}