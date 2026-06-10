"use client";

export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { FinalApproval } from "@/features/procurement/components/competitive-bid-analysis/[id]/FinalApproval";
import { CBAErrorBoundary } from "@/features/procurement/components/competitive-bid-analysis/ErrorBoundary";
import { CBALoadingState } from "@/features/procurement/components/competitive-bid-analysis/LoadingStates";

export default function FinalApprovalPage() {
  const params = useParams();
  const router = useRouter();
  const cbaId = params?.id as string;

  const handleApproved = () => {
    router.push(`/dashboard/procurement/competitive-bid-analysis/${cbaId}/details`);
  };

  const handleRejected = () => {
    router.push(`/dashboard/procurement/competitive-bid-analysis/${cbaId}/details`);
  };

  return (
    <CBAErrorBoundary>
      <Suspense fallback={<CBALoadingState message="Loading final approval page..." />}>
        <FinalApproval
          cbaId={cbaId}
          onApproved={handleApproved}
          onRejected={handleRejected}
        />
      </Suspense>
    </CBAErrorBoundary>
  );
}
