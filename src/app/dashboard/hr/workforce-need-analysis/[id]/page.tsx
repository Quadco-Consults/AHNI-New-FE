"use client";

import { Loading } from "@/components/Loading";
import dynamic from "next/dynamic";
import { use } from "react";

const WorkforceNeedAnalysisViewIndex = dynamic(
  () => import("@/features/hr/components/workforce-need-analysis/view/index"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default function WorkforceNeedAnalysisViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  return <WorkforceNeedAnalysisViewIndex id={resolvedParams.id} />;
}