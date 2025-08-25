"use client";

import dynamic from "next/dynamic";

const WorkforceNeedAnalysisIndex = dynamic(() => import("@/features/hr/components/workforce-need-analysis/index"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function WorkforceNeedAnalysisPage() {
  return <WorkforceNeedAnalysisIndex />;
}