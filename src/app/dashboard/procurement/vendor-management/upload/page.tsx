"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const VendorUpload = dynamic(
  () =>
    import(
      "@/features/procurement/components/vendor-management/vendor-registration/Upload"
    ),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function VendorUploadPage() {
  return <VendorUpload />;
}