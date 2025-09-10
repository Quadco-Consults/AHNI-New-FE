"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const CompetitiveBidAnalysis = dynamic(
  () =>
    import("@/features/procurement/components/competitive-bid-analysis/index").catch(() => ({ 
      default: () => <div>Failed to load component</div> 
    })),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function CompetitiveBidAnalysisPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CompetitiveBidAnalysis />
    </Suspense>
  );
}