"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";

const WorkforceNeedAnalysisIndex = dynamic(
  () => import("@/features/hr/components/workforce-need-analysis/index"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function WorkforceNeedAnalysisPage() {
  return <WorkforceNeedAnalysisIndex />;
}
