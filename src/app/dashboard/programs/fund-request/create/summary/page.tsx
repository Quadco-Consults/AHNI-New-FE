"use client";

import dynamic from "next/dynamic";

const FundRequestSummary = dynamic(() => import("@/features/programs/components/fund-request/create/summary"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function FundRequestSummaryPage() {
  return <FundRequestSummary />;
}