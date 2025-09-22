"use client";

import { Suspense } from "react";
import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const VendorBidAnalysis = dynamic(
  () =>
    import(
      "@/features/procurement/components/competitive-bid-analysis/[id]/VendorBidAnalysis"
    ).catch(() => ({ default: () => <div>Failed to load Vendor Bid Analysis component</div> })),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function VendorBidAnalysisPage() {
  return (
    <Suspense fallback={<Loading />}>
      <VendorBidAnalysis />
    </Suspense>
  );
}