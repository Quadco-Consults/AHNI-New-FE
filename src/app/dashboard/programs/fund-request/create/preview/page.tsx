"use client";

import dynamic from "next/dynamic";

const FundRequestPreview = dynamic(() => import("@/features/programs/components/fund-request/Fund-request-preview"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function FundRequestPreviewPage() {
  return <FundRequestPreview />;
}