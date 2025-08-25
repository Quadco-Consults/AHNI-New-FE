"use client";

import dynamic from "next/dynamic";

const ConsultantManagementCreate = dynamic(() => import("@/features/contracts-grants/components/contract-management/consultant-management/create/Layout"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function ConsultantManagementCreatePage() {
  return <ConsultantManagementCreate />;
}