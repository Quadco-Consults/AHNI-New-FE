"use client";

import dynamic from "next/dynamic";

const AgreementCreate = dynamic(() => import("@/features/contracts-grants/components/contract-management/agreement/create"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function AgreementCreatePage() {
  return <AgreementCreate />;
}