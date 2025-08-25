"use client";

import dynamic from "next/dynamic";

const CreateVendor = dynamic(() => import("@/features/procurement/components/vendor-management/vendor-registration/VendorRegistationLayout"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function CreateVendorPage() {
  return <CreateVendor />;
}