"use client";

export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { CommitteeConsensus } from "@/features/procurement/components/competitive-bid-analysis/[id]/CommitteeConsensus";
import { CBAErrorBoundary } from "@/features/procurement/components/competitive-bid-analysis/ErrorBoundary";
import { CBALoadingState } from "@/features/procurement/components/competitive-bid-analysis/LoadingStates";

export default function CommitteeConsensusPage() {
  const params = useParams();
  const router = useRouter();
  const cbaId = params?.id as string;

  const handleProgressToReview = () => {
    router.push(`/dashboard/procurement/competitive-bid-analysis/${cbaId}/review-approval`);
  };

  return (
    <CBAErrorBoundary>
      <Suspense fallback={<CBALoadingState message="Loading committee consensus..." />}>
        <CommitteeConsensus
          cbaId={cbaId}
          onProgressToReview={handleProgressToReview}
        />
      </Suspense>
    </CBAErrorBoundary>
  );
}
