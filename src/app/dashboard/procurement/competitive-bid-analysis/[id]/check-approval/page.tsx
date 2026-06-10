"use client";

export const dynamic = "force-dynamic";
import { Suspense } from "react";
import dynamicImport from "next/dynamic";
import { CBAErrorBoundary } from "@/features/procurement/components/competitive-bid-analysis/ErrorBoundary";
import { CBALoadingState } from "@/features/procurement/components/competitive-bid-analysis/LoadingStates";

const CheckApproval = dynamicImport(
  () =>
    import(
      "@/features/procurement/components/competitive-bid-analysis/[id]/CheckApprovalRedesigned"
    ).catch(() => ({ default: () => <div>Failed to load CBA Analysis component</div> })),
  {
    ssr: false,
    loading: () => <CBALoadingState message="Loading CBA approval page..." />,
  }
);

export default function CheckApprovalPage() {
  return (
    <CBAErrorBoundary>
      <Suspense fallback={<CBALoadingState message="Loading CBA approval page..." />}>
        <CheckApproval />
      </Suspense>
    </CBAErrorBoundary>
  );
}