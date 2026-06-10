"use client";

export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { AuthoriseApproval } from "@/features/procurement/components/competitive-bid-analysis/[id]/AuthoriseApproval";
import { CBAErrorBoundary } from "@/features/procurement/components/competitive-bid-analysis/ErrorBoundary";
import { CBALoadingState } from "@/features/procurement/components/competitive-bid-analysis/LoadingStates";

export default function AuthoriseApprovalPage() {
  const params = useParams();
  const router = useRouter();
  const cbaId = params?.id as string;

  const handleApproved = () => {
    router.push(`/dashboard/procurement/competitive-bid-analysis/${cbaId}/final-approval`);
  };

  const handleRejected = () => {
    router.push(`/dashboard/procurement/competitive-bid-analysis/${cbaId}/details`);
  };

  return (
    <CBAErrorBoundary>
      <Suspense fallback={<CBALoadingState message="Loading authorise approval page..." />}>
        <AuthoriseApproval
          cbaId={cbaId}
          onApproved={handleApproved}
          onRejected={handleRejected}
        />
      </Suspense>
    </CBAErrorBoundary>
  );
}
