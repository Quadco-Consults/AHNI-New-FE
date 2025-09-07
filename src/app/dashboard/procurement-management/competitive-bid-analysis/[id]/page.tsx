"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const CompetitiveBidAnalysisDetails = dynamic(
  () =>
    import("@/features/procurement/components/competitive-bid-analysis/[id]/index").catch(() => ({ 
      default: () => <div>Failed to load component</div> 
    })),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function CompetitiveBidAnalysisDetailsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CompetitiveBidAnalysisDetails />
    </Suspense>
  );
}