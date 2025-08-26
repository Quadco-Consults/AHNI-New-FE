"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const CreateVendor = dynamic(
  () =>
    import(
      "@/features/procurement/components/vendor-management/vendor-registration/VendorRegistationLayout"
    ),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function CreateVendorPage() {
  return <CreateVendor />;
}
