"use client";

export const dynamic = "force-dynamic";
import AnalysisResultsView from "@/features/procurement/components/competitive-bid-analysis/[id]/AnalysisResultsView";
import { CBAErrorBoundary } from "@/features/procurement/components/competitive-bid-analysis/ErrorBoundary";

const AnalysisResultsPage = () => {
  return (
    <CBAErrorBoundary>
      <AnalysisResultsView />
    </CBAErrorBoundary>
  );
};

export default AnalysisResultsPage;