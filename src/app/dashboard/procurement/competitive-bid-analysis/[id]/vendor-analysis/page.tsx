"use client";

export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { Loading } from "@/components/Loading";
import dynamicImport from "next/dynamic";
import { CBAErrorBoundary } from "@/features/procurement/components/competitive-bid-analysis/ErrorBoundary";

const VendorBidAnalysis = dynamicImport(
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
    <CBAErrorBoundary>
      <Suspense fallback={<Loading />}>
        <VendorBidAnalysis />
      </Suspense>
    </CBAErrorBoundary>
  );
}