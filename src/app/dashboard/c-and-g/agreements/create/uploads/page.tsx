"use client";

import dynamic from "next/dynamic";

const AgreementUploads = dynamic(() => import("@/features/contracts-grants/components/contract-management/agreement/uploads"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function CreateAgreementUploadsPage() {
    return <AgreementUploads />;
}