"use client";

import { Suspense } from "react";
import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const TechnicalPrequalificationSummary = dynamic(
  () =>
    import(
      "@/features/procurement/components/competitive-bid-analysis/[id]/TechnicalPrequalificationSummary"
    ).catch(() => ({ default: () => <div>Failed to load Technical Prequalification Summary component</div> })),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function TechnicalPrequalificationSummaryPage() {
  return (
    <Suspense fallback={<Loading />}>
      <TechnicalPrequalificationSummary />
    </Suspense>
  );
}