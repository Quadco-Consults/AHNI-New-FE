"use client";

import dynamic from "next/dynamic";

const AssetRequestSummary = dynamic(() => import("@/features/admin/components/asset-request/create"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function AssetRequestSummaryPage() {
  return <AssetRequestSummary />;
}