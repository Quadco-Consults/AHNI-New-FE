"use client";

export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { ReviewApproval } from "@/features/procurement/components/competitive-bid-analysis/[id]/ReviewApproval";
import { CBAErrorBoundary } from "@/features/procurement/components/competitive-bid-analysis/ErrorBoundary";
import { CBALoadingState } from "@/features/procurement/components/competitive-bid-analysis/LoadingStates";

export default function ReviewApprovalPage() {
  const params = useParams();
  const router = useRouter();
  const cbaId = params?.id as string;

  const handleApproved = () => {
    router.push(`/dashboard/procurement/competitive-bid-analysis/${cbaId}/authorise-approval`);
  };

  const handleRejected = () => {
    router.push(`/dashboard/procurement/competitive-bid-analysis/${cbaId}/details`);
  };

  return (
    <CBAErrorBoundary>
      <Suspense fallback={<CBALoadingState message="Loading review approval page..." />}>
        <ReviewApproval
          cbaId={cbaId}
          onApproved={handleApproved}
          onRejected={handleRejected}
        />
      </Suspense>
    </CBAErrorBoundary>
  );
}
