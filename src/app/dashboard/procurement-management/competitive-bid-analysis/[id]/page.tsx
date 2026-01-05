"use client";

export const dynamic = "force-dynamic";
import { Loading } from "@/components/Loading";
import dynamicImport from "next/dynamic";
import { Suspense } from "react";

const CompetitiveBidAnalysisDetails = dynamicImport(
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